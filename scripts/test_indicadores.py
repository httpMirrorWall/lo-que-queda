"""
Pruebas de consistencia de «Lo confirmado» y «Lo que podría haber».

Uso:  python scripts/test_indicadores.py
Lee datos/procesados/serie_anual_vm.json, web/datos/serie.js, web/textos.js y web/app.js.
Termina con «OK: n pruebas» o con la lista de fallas.
"""
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
BBL = 6.2898
fallas, n = [], 0


def ok(cond, msg):
    global n
    n += 1
    if not cond:
        fallas.append(msg)


def cerca(a, b, tol):
    return abs(a - b) <= tol


serie = json.loads((RAIZ / "datos" / "procesados" / "serie_anual_vm.json").read_text(encoding="utf-8"))
js = (RAIZ / "web" / "datos" / "serie.js").read_text(encoding="utf-8")
textos = (RAIZ / "web" / "textos.js").read_text(encoding="utf-8")
app = (RAIZ / "web" / "app.js").read_text(encoding="utf-8")
A = serie["anios"]
M = serie["meta"]["indicadores_petroleo"]
R, I = M["reservas"], M["iapg"]
fila = {f["anio"]: f for f in A}

# 1. la web usa los mismos datos que datos/procesados
web = json.loads(js[js.index("=") + 1: js.rstrip().rindex(";")])
ok(web == serie, "web/datos/serie.js no coincide con serie_anual_vm.json: correr scripts/preparar_web.py")

# 2. unidades y constantes
ok(cerca(R["reservas_comprobadas_m3"], 414_491_800, 1_000), "reservas: 414.491,8 miles de m3 x 1.000")
ok(cerca(R["reservas_comprobadas_bbl"], R["reservas_comprobadas_m3"] * BBL, 10), "reservas: conversión m3 -> bbl")
ok(I["total_iapg_mmbo"]["media"] == I["remanente_mmbo"]["media"] + I["extraido_iapg_mmbo"] == 30_728, "IAPG: 30.170 + 558 = 30.728")
ok(all(I["total_iapg_mmbo"][k] == I["remanente_mmbo"][k] + 558 for k in ("p90", "media", "p10")), "IAPG: P90/P10 + 558")
ok(cerca(I["inventario_referencia_m3"] * BBL, 30_728e6, 1e3), "IAPG: total en m3 x 6,2898 = 30.728 millones de bbl")
ok(R["fecha_referencia"] == "2025-12-31" and I["fecha_referencia"] == "2024-12-31", "fechas de referencia")

# 3. acumulados: suma de los años, crecientes, sin doble conteo
for clave_a, clave_p in (("petroleo_acumulado_m3", "petroleo_m3"), ("petroleo_nc_neuquina_acumulado_m3", "petroleo_nc_neuquina_m3")):
    for a in sorted(fila)[1:]:
        ok(cerca(fila[a][clave_a] - fila[a - 1][clave_a], fila[a][clave_p], 2), f"{clave_a} {a} = anterior + producción del año")
for f in A:
    ok(f["petroleo_nc_neuquina_m3"] >= f["petroleo_m3"], f"{f['anio']}: NC cuenca >= VM")
ok(R["acumulado_nc_neuquina_2025_m3"] == fila[2025]["petroleo_nc_neuquina_acumulado_m3"], "acumulado NC 2025 del denominador")
ok(cerca(R["inventario_referencia_m3"], R["acumulado_nc_neuquina_2025_m3"] + R["reservas_comprobadas_m3"], 2), "inventario reservas = acumulado 2025 + reservas")

# 4. porcentajes: misma escala, crecientes, recalculables
prev = {"pct_extraido_reservas": -1, "pct_extraido_iapg": -1}
for f in A:
    pr = f["petroleo_nc_neuquina_acumulado_m3"] / R["inventario_referencia_m3"] * 100
    pi = f["petroleo_acumulado_m3"] / I["inventario_referencia_m3"] * 100
    ok(cerca(f["pct_extraido_reservas"], pr, 0.0001), f"{f['anio']}: % reservas recalculado")
    ok(cerca(f["pct_extraido_iapg"], pi, 0.0001), f"{f['anio']}: % IAPG recalculado")
    for k in prev:
        ok(0 <= f[k] <= 100 and f[k] >= prev[k], f"{f['anio']}: {k} entre 0 y 100 y no decreciente")
        prev[k] = f[k]
    ok(not any(k.startswith("anios_restantes") for k in f), f"{f['anio']}: no debe haber años restantes por año")

# 5. horizontes de referencia 2025 (meta)
p25_nc, p25_vm_bbl = fila[2025]["petroleo_nc_neuquina_m3"], fila[2025]["petroleo_m3"] * BBL
ok(cerca(R["horizonte_anios"], R["reservas_comprobadas_m3"] / p25_nc, 0.06), "horizonte reservas = reservas / producción NC 2025")
for k in ("p90", "media", "p10"):
    ok(cerca(I["horizonte_anios"][k], (I["remanente_mmbo"][k] * 1e6 - p25_vm_bbl) / p25_vm_bbl, 0.06), f"horizonte IAPG {k}")
ok(I["horizonte_anios"]["p90"] < I["horizonte_anios"]["media"] < I["horizonte_anios"]["p10"], "orden P90 < media < P10")

# 6. 2026 parcial
ok(fila[2026]["parcial"] and fila[2026]["ultimo_mes"] == 8, "2026 marcado como parcial hasta agosto")
ok(not fila[2025]["parcial"], "2025 completo")

# 7. la interfaz y los textos dicen lo mismo que los datos
ok("anios_restantes" not in app, "app.js no debe leer anios_restantes_*")
ok("horizonte_reservas" in app and "horizonte_iapg" in app, "app.js lee los horizontes de cada año (horizonte_reservas / horizonte_iapg)")
ok('anios: "≈ {n} años si se mantuviera el ritmo de {año}"' in textos, "cabecera.anios con {n} y {año}, presentado como extrapolación")
fmt = lambda x, d=1: f"{x:,.{d}f}".replace(",", "X").replace(".", ",").replace("X", ".")
esperados = {
    "% reservas 2025": fmt(fila[2025]["pct_extraido_reservas"]) + " %",
    "% IAPG 2025": fmt(fila[2025]["pct_extraido_iapg"]) + " %",
    "acumulado NC 2025": fmt(R["acumulado_nc_neuquina_2025_m3"] / 1e6),
    "inventario reservas": fmt(R["inventario_referencia_m3"] / 1e6),
    "reservas": fmt(R["reservas_comprobadas_m3"] / 1e6),
    "producción NC 2025": fmt(p25_nc / 1e6),
    "horizonte reservas": "≈ " + str(round(R["horizonte_anios"])) + " años",
    "horizonte IAPG": "≈ " + str(round(I["horizonte_anios"]["media"])) + " años",
    "horizonte P90": "≈ " + str(round(I["horizonte_anios"]["p90"])),
    "horizonte P10": "≈ " + str(round(I["horizonte_anios"]["p10"])),
    "total IAPG": "30.728",
    "fecha IAPG": "31/12/2024",
    "dif extraído IAPG": fmt(abs(I["dif_extraido_capiv_vs_iapg_pct"])) + " %",
    "acumulado VM 2025 (Mbbl)": fmt(fila[2025]["petroleo_acumulado_m3"] * BBL / 1e6) + " ÷ 30.728",
    "producción VM 2025 (Mbbl)": str(round(p25_vm_bbl / 1e6)),
}
for k, v in esperados.items():
    ok(v in textos, f"textos.js debería mencionar {k}: «{v}»")
for viejo in ("fecha de referencia de los remanentes no está informada", "Falta confirmar la fecha de referencia",
              "sus años restantes se calculan con el ritmo de 2025", "IAPG (2026)\" }"):
    ok(viejo not in textos, f"texto desactualizado en textos.js: «{viejo}»")
ok(not re.search(r"30\.170[^.]{0,80}89 ?%", textos), "no atribuir +89 % a los 30.170 (es +86 %)")


# 8. revisión del 14/10/2026 (segunda ronda)
acum25_bbl = fila[2025]["petroleo_acumulado_m3"] * BBL / 1e6
ok(cerca(acum25_bbl, 721.8, 0.05), "numerador IAPG 2025 = 721,8 millones de bbl (Capítulo IV, fuente única)")
ok(cerca(fila[2025]["pct_extraido_iapg"], acum25_bbl / 30_728 * 100, 0.0001), "% IAPG 2025 = 721,8 / 30.728 x 100")
ok(fmt(fila[2025]["pct_extraido_iapg"]) == fmt(acum25_bbl / 30_728 * 100) == "2,3", "redondeo de la interfaz (1 decimal) igual al del valor exacto")
ok(fmt(fila[2025]["pct_extraido_reservas"]) == fmt(fila[2025]["petroleo_nc_neuquina_acumulado_m3"] / R["inventario_referencia_m3"] * 100), "redondeo % reservas")
ok(I["remanente_fin_2025_mmbo"]["media"] == 29_987 and round(I["produccion_vm_2025_mmbo"]) == 183, "horizonte IAPG usa 30.170 - 183 = 29.987 y 183 de referencia")
ok(cerca(I["inventario_referencia_m3"] * BBL / 1e6, 30_728, 0.001), "el horizonte no alteró el total fijo del % (30.728)")
for f in A:
    ok(cerca(f["pct_extraido_iapg"], f["petroleo_acumulado_m3"] * BBL / 1e6 / 30_728 * 100, 0.0001), f"{f['anio']}: % IAPG con total fijo 30.728")
for frase in ("es una aproximación propia", "la estimación baja y la alta del IAPG",
              "es la clasificación de ese estudio", "cuenca Neuquina al 31/12/2025", "Vaca Muerta al 31/12/2024",
              'fuente: "Sec. de Energía, 2025"', 'fuente: "IAPG, 2024"', "721,8 ÷ 30.728 = 2,35 %"):
    ok(frase in textos, f"textos.js debería decir «{frase}»")
ok(textos.count("no es un pronóstico de producción ni una fecha de agotamiento") >= 3, "aclaración «no es un pronóstico de producción ni una fecha de agotamiento» en n1 y límites")
ok(textos.count("sus porcentajes no se comparan entre sí") >= 2, "las dos tarjetas advierten la diferencia de alcance")
ok("P90–P10" not in textos and "intervalo de confianza" not in textos, "el rango no se presenta como P90–P10 ni como intervalo de confianza")

# 9. horizonte dinámico H(t) = R(t) / P(t) (tercera ronda)
inv_res = R["inventario_referencia_m3"]
q24_bbl = fila[2024]["petroleo_acumulado_m3"] * BBL
prev_h = None
for f in A:
    a, hr, hi = f["anio"], f["horizonte_reservas"], f["horizonte_iapg"]
    ritmo = a - 1 if f["parcial"] else a
    ok(hr["anio_ritmo"] == ritmo and hi["anio_ritmo"] == ritmo, f"{a}: año del ritmo ({ritmo})")
    # unidades: reservas todo en m3; IAPG todo en millones de bbl
    ok(hr["produccion_m3"] == fila[ritmo]["petroleo_nc_neuquina_m3"], f"{a}: P reservas = producción NC (m3) de {ritmo}")
    ok(cerca(hi["produccion_mmbo"], fila[ritmo]["petroleo_m3"] * BBL / 1e6, 0.001), f"{a}: P IAPG = producción VM de {ritmo} en millones de bbl")
    ok(cerca(hr["restante_m3"], inv_res - f["petroleo_nc_neuquina_acumulado_m3"], 2), f"{a}: R reservas = inventario - acumulado NC")
    for k, v in I["remanente_mmbo"].items():
        esperado = (v * 1e6 - (f["petroleo_acumulado_m3"] * BBL - q24_bbl)) / 1e6
        ok(cerca(hi["restante_mmbo"][k], esperado, 0.01), f"{a}: R IAPG {k} = remanente IAPG - producción Cap. IV posterior a 2024")
        ok(cerca(hi["anios"][k], esperado * 1e6 / (hi["produccion_mmbo"] * 1e6), max(0.01, 1e-4 * hi["anios"][k])), f"{a}: H IAPG {k} = R / P")
    ok(cerca(hr["anios"], (inv_res - f["petroleo_nc_neuquina_acumulado_m3"]) / fila[ritmo]["petroleo_nc_neuquina_m3"], max(0.01, 1e-4 * hr["anios"])), f"{a}: H reservas = R / P")
    ok(hi["anios"]["p90"] < hi["anios"]["media"] < hi["anios"]["p10"], f"{a}: estimación baja < media < alta")
    if prev_h is not None:
        ok(hr["anios"] < prev_h, f"{a}: el horizonte cambia con el dial (baja al acelerarse la producción)")
    prev_h = hr["anios"]
# años de referencia y valores comprobados a mano
ok(cerca(fila[2025]["horizonte_reservas"]["restante_m3"], R["reservas_comprobadas_m3"], 2), "2025: R reservas = reservas comprobadas al 31/12/2025")
ok(fila[2024]["horizonte_iapg"]["restante_mmbo"]["media"] == 30_170, "2024: R IAPG = 30.170 (cifra del IAPG)")
ok(round(fila[2025]["horizonte_iapg"]["restante_mmbo"]["media"]) == 29_987, "2025: R IAPG = 29.987 (aproximación propia)")
manual = {2010: (8117.9, 418287.4), 2020: (73.3, 738.4), 2025: (14.1, 163.8), 2026: (13.3, 163.0)}
for a, (h_r, h_i) in manual.items():
    ok(cerca(fila[a]["horizonte_reservas"]["anios"], h_r, 0.06), f"{a}: H reservas ≈ {h_r} (cálculo manual)")
    ok(cerca(fila[a]["horizonte_iapg"]["anios"]["media"], h_i, 0.06), f"{a}: H IAPG ≈ {h_i} (cálculo manual)")
ok(cerca(fila[2025]["horizonte_iapg"]["anios"]["media"], I["horizonte_anios"]["media"], 0.06), "2025: horizonte dinámico = horizonte de referencia")
# 2026: R descuenta enero-agosto; P = 2025
ok(cerca(fila[2026]["horizonte_reservas"]["restante_m3"], R["reservas_comprobadas_m3"] - fila[2026]["petroleo_nc_neuquina_m3"], 2), "2026: R = reservas - extraído ene-ago 2026")
ok("nota" in fila[2026]["horizonte_reservas"] and "nota" not in fila[2025]["horizonte_reservas"], "2026 lleva nota de año parcial")
# los % no cambiaron por el horizonte
ok(cerca(fila[2025]["pct_extraido_reservas"], 22.3361, 0.001) and cerca(fila[2025]["pct_extraido_iapg"], 2.3491, 0.001), "% históricos intactos (22,34 y 2,35)")
# casos borde: producción cero, faltante y año parcial (función del script, con datos sintéticos)
sys.path.insert(0, str(RAIZ / "scripts"))
import pandas as pd
import indicadores_petroleo as ip
pr = pd.DataFrame({"nc": [0.0, 10.0, 4.0], "vm": [0.0, 8.0, 3.0]}, index=[2010, 2011, 2012])
pr["nc_acum"], pr["vm_acum"] = pr.nc.cumsum(), pr.vm.cumsum()
pr["res_restante_m3"] = 100 - pr.nc_acum
for k, v in ip.IAPG_RTRP_MMBO.items():
    pr[f"iapg_restante_bbl_{k}"] = v * 1e6 - pr.vm_acum * ip.BBL_POR_M3
h0r, h0i = ip.horizontes(pr, 2010, False)
ok(h0r["anios"] is None and h0i["anios"] is None, "producción cero: no se divide (None)")
h1r, _ = ip.horizontes(pr, 2011, False)
ok(cerca(h1r["anios"], 90 / 10, 1e-9), "caso sintético: (100 - 10) / 10 = 9")
h2r, _ = ip.horizontes(pr, 2012, True)
ok(h2r["anio_ritmo"] == 2011 and cerca(h2r["anios"], 86 / 10, 1e-9), "año parcial: R descuenta lo parcial, P = año anterior")
pr2 = pr.drop(index=2011)
h3r, h3i = ip.horizontes(pr2, 2012, True)
ok(h3r["anios"] is None and h3i["anios"] is None, "producción faltante: no calculable")
# textos de la interfaz
for frase in ("aniosParcial:", "aniosMas:", "aniosTope: 1000", "aniosNo:", "no calculable",
              "Los años restantes se calculan dividiendo el volumen de referencia que se estima pendiente por la producción anual del año seleccionado.",
              "El remanente de fines de 2025 es una aproximación propia: se resta la producción de 2025 a los recursos remanentes estimados por el IAPG al 31/12/2024. No es una nueva estimación del IAPG.",
              "extrapolación a ritmo constante", "valor sin redondear a años enteros"):
    ok(frase in textos, f"textos.js debería decir «{frase}»")
ok("horizontes en años del encabezado son fijos" not in textos and "es el mismo para todos los años del dial" not in textos, "no quedan textos del horizonte fijo")
ok("textoHorizonte" in app and "C.aniosTope" in app, "app.js abrevia solo al mostrar, con el tope de textos.js")

if fallas:
    print(f"FALLAS ({len(fallas)} de {n}):")
    for f in fallas:
        print(" -", f)
    sys.exit(1)
print(f"OK: {n} pruebas")
