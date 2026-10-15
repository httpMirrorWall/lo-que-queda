"""
Indicadores del encabezado «Lo confirmado» y «Lo que podría haber» (petróleo).

Recalcula SOLO estos dos indicadores y los escribe en datos/procesados/serie_anual_vm.json
(campos pct_extraido_reservas, pct_extraido_iapg y meta.indicadores_petroleo).
Lo llama scripts/procesar.py al final; también se puede correr solo:

    python scripts/indicadores_petroleo.py      (después: python scripts/preparar_web.py)

Criterio (auditoría del 14/10/2026, docs/auditoria_indicadores_petroleo.md):
  * Cada cociente usa numerador y denominador del MISMO alcance y la MISMA fecha de referencia.
  * «Lo confirmado»: reservas comprobadas NO CONVENCIONAL de la cuenca Neuquina (hoja «fin de vida util»)
    al 31/12/2025  <->  producción NO CONVENCIONAL de la cuenca Neuquina (todas las formaciones) del CSV
    por pozo de Capítulo IV.
  * «Lo que podría haber»: recursos remanentes técnicamente recuperables de petróleo de la Fm. Vaca Muerta
    (IAPG, al 31/12/2024)  <->  producción de pozos con formacion = 'vaca muerta'.
    Se usa el total del propio IAPG (RRP = extraído 558 + remanente 30.170 = 30.728 MMBO): no se reconstruye
    nada sumando el acumulado propio a fines de 2025 (eso contaba dos veces la producción de 2025).
  * Horizonte del año t del dial (dinámico): H(t) = R(t) / P(t), extrapolación a ritmo constante,
    no un pronóstico ni una fecha de agotamiento.
      R(t) = volumen de referencia que queda en t; P(t) = producción del año t, en la misma unidad.
      - Reservas (m3):    R(t) = (acumulado NC a fin de 2025 + reservas al 31/12/2025) - acumulado NC hasta t
                          => R(2025) = reservas comprobadas.
      - IAPG (millones de bbl): R(t) = 30.728 - [558 + (acumulado VM Cap. IV hasta t - acumulado VM Cap. IV hasta 2024)]
                          = remanente IAPG + producción Cap. IV entre t y 2024 (o menos la producción posterior a 2024)
                          => R(2024) = 30.170 (cifra del IAPG); R(2025) = 30.170 - 183 = 29.987 (aproximación propia).
        Lo extraído hasta la fecha del IAPG se toma del IAPG (558) y solo los flujos anuales de Capítulo IV,
        para no arrastrar la diferencia de nivel de 3,5 % entre las dos fuentes al remanente.
      - 2026 (parcial): R descuenta lo extraído hasta agosto de 2026; P = producción de 2025 (no se anualiza).
      - P(t) cero o faltante: horizonte no calculable (None).
"""
import json
import sys
from pathlib import Path

import openpyxl
import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent
F_NOCONV = RAIZ / "datos" / "raw" / "capitulo_iv" / "produccin-de-pozos-de-gas-y-petrleo-no-convencional.csv"
F_RESERVAS = RAIZ / "datos" / "raw" / "reservas" / "reservas al 31-12-2025.xlsx"
F_SERIE = RAIZ / "datos" / "procesados" / "serie_anual_vm.json"

BBL_POR_M3 = 6.2898                 # 1 m3 = 6,2898 barriles (mismo factor que el resto del proyecto)
ANIO_REF_RESERVAS = 2025            # reservas al 31/12/2025
HOJA_RESERVAS = "fin de vida util"  # la misma base que usa el IAPG para sus «Reservas FVU»
RESERVAS_ESPERADAS_MM3 = 414491.8   # control: miles de m3

# IAPG (julio de 2026), «Estimación de los Recursos Remanentes Técnicamente Recuperables de Petróleo
# de la Fm. Vaca Muerta», resumen ejecutivo (p. 4): valores al 31/12/2024, en millones de barriles (MMBO).
IAPG_ANIO_REF = 2024
IAPG_RTRP_MMBO = {"p90": 18_062, "media": 30_170, "p10": 45_050}   # remanentes (incluyen reservas FVU)
IAPG_EXTRAIDO_MMBO = 558                                          # extraído al 31/12/2024 (dato SEN)
IAPG_RRP_MMBO = {k: v + IAPG_EXTRAIDO_MMBO for k, v in IAPG_RTRP_MMBO.items()}  # 18.620 / 30.728 / 45.608
EIA_2013_MMBO = 16_220              # cifra citada en el comunicado (el informe EIA dice 16,2 mil millones)


def reservas_mm3():
    wb = openpyxl.load_workbook(F_RESERVAS, read_only=True, data_only=True)
    rows = list(wb[HOJA_RESERVAS].iter_rows(values_only=True))
    j = 13  # columna N
    assert "31/12/2025" in str(rows[0][5]), "fecha de las reservas cambió"
    assert rows[2][j] == "NO CONVENCIONAL" and rows[3][j] == "RESERVAS" and rows[4][j] == "COMPROBADAS" and rows[5][j] == "PET", "estructura cambió"
    assert str(rows[6][j]).strip() == "(Mm3)", "unidad de reservas cambió"
    tot = sum(float(r[j] or 0) for r in rows[7:]
              if r[0] is not None and str(r[0]).strip().upper() != "TOTAL" and str(r[1]).strip().upper() == "NEUQUINA")
    assert abs(tot - RESERVAS_ESPERADAS_MM3) < 0.5, f"reservas = {tot}"
    return tot


def produccion_anual():
    """Producción anual de petróleo (m3) del CSV por pozo no convencional: VM y todo el NC de la cuenca Neuquina."""
    df = pd.read_csv(F_NOCONV, usecols=["anio", "mes", "prod_pet", "formacion", "cuenca"], low_memory=False)
    df = df[df.cuenca.astype(str).str.upper().str.strip() == "NEUQUINA"].copy()
    df["p"] = df.prod_pet.clip(lower=0)      # mismo criterio que procesar.py: negativos -> 0
    ult = int((df.anio * 100 + df.mes).max())
    vm = df[df.formacion.astype(str).str.lower().str.strip() == "vaca muerta"].groupby("anio").p.sum()
    nc = df.groupby("anio").p.sum()
    return pd.DataFrame({"vm": vm, "nc": nc}).fillna(0).sort_index(), ult


def calcular():
    prod, ult = produccion_anual()
    prod["vm_acum"] = prod.vm.cumsum()
    prod["nc_acum"] = prod.nc.cumsum()
    res_m3 = reservas_mm3() * 1000                                     # miles de m3 -> m3

    # «Lo confirmado» (alcance: NC cuenca Neuquina; fecha: 31/12/2025)
    inv_res_m3 = prod.at[ANIO_REF_RESERVAS, "nc_acum"] + res_m3       # extraído + reservas comprobadas
    p_nc_ref = prod.at[ANIO_REF_RESERVAS, "nc"]
    h_res = res_m3 / p_nc_ref

    # «Lo que podría haber» (alcance: Fm. Vaca Muerta; fecha: 31/12/2024)
    inv_iapg_m3 = IAPG_RRP_MMBO["media"] * 1e6 / BBL_POR_M3
    p_vm_ref_bbl = prod.at[ANIO_REF_RESERVAS, "vm"] * BBL_POR_M3
    # remanente a fin de 2025 = remanente IAPG al 31/12/2024 - producción VM de 2025 (Capítulo IV)
    rem25 = {k: v * 1e6 - p_vm_ref_bbl for k, v in IAPG_RTRP_MMBO.items()}
    h_iapg = {k: v / p_vm_ref_bbl for k, v in rem25.items()}
    acum_vm_iapg_bbl = prod.at[IAPG_ANIO_REF, "vm_acum"] * BBL_POR_M3

    prod["pct_res"] = prod.nc_acum / inv_res_m3 * 100
    prod["pct_iapg"] = prod.vm_acum / inv_iapg_m3 * 100

    # horizonte dinámico H(t) = R(t) / P(t), sin redondeos intermedios
    q_vm_ref_bbl = prod.at[IAPG_ANIO_REF, "vm_acum"] * BBL_POR_M3
    prod["res_restante_m3"] = inv_res_m3 - prod.nc_acum
    for k, v in IAPG_RTRP_MMBO.items():
        prod[f"iapg_restante_bbl_{k}"] = v * 1e6 - (prod.vm_acum * BBL_POR_M3 - q_vm_ref_bbl)
    meta = {
        "nota": "Cada % se calcula con numerador y denominador del mismo alcance y un total de referencia fijo. El horizonte de cada año del dial es H(t) = R(t) / P(t): extrapolación a ritmo constante, no un pronóstico de producción ni una fecha de agotamiento. En 2026 (parcial), P = producción de 2025.",
        "ultimo_periodo_datos": f"{ult // 100}-{ult % 100:02d}",
        "factor_bbl_por_m3": BBL_POR_M3,
        "reservas": {
            "alcance": "petróleo no convencional de la cuenca Neuquina (todas las formaciones; Vaca Muerta = 99,3 % de la producción NC de la cuenca en 2025)",
            "fecha_referencia": "2025-12-31",
            "reservas_comprobadas_m3": round(res_m3),
            "reservas_comprobadas_bbl": round(res_m3 * BBL_POR_M3),
            "acumulado_nc_neuquina_2025_m3": round(prod.at[ANIO_REF_RESERVAS, "nc_acum"]),
            "inventario_referencia_m3": round(inv_res_m3),
            "produccion_nc_neuquina_2025_m3": round(p_nc_ref),
            "horizonte_anios": round(h_res, 1),
            "horizonte_formula": "H(t) = (inventario de referencia - acumulado NC hasta t) / producción NC del año t; en 2025 = reservas / producción 2025; en 2026, P = producción 2025",
            "pct_formula": "acumulado NC Neuquina desde 2006 hasta el año del dial / (acumulado NC Neuquina a fin de 2025 + reservas comprobadas al 31/12/2025)",
        },
        "iapg": {
            "alcance": "petróleo de la Formación Vaca Muerta (IAPG); producción: pozos con formacion = 'vaca muerta'",
            "fecha_referencia": "2024-12-31",
            "remanente_mmbo": IAPG_RTRP_MMBO,
            "extraido_iapg_mmbo": IAPG_EXTRAIDO_MMBO,
            "total_iapg_mmbo": IAPG_RRP_MMBO,
            "acumulado_vm_2024_capiv_mmbo": round(acum_vm_iapg_bbl / 1e6, 1),
            "dif_extraido_capiv_vs_iapg_pct": round((acum_vm_iapg_bbl / 1e6 - IAPG_EXTRAIDO_MMBO) / IAPG_EXTRAIDO_MMBO * 100, 1),
            "produccion_vm_2025_mmbo": round(p_vm_ref_bbl / 1e6, 2),
            "remanente_fin_2025_mmbo": {k: round(v / 1e6) for k, v in rem25.items()},
            "inventario_referencia_m3": round(inv_iapg_m3),
            "horizonte_anios": {k: round(v, 1) for k, v in h_iapg.items()},
            "horizonte_formula": "H(t) = [30.728 - (558 + acumulado VM Cap. IV hasta t - acumulado VM Cap. IV hasta 2024)] / producción VM del año t (millones de bbl); en 2025 = (30.170 - 183) / 183; en 2026, P = producción 2025. Remanente de fin de 2025 = aproximación propia",
            "pct_formula": "acumulado VM desde 2006 hasta el año del dial / total IAPG (558 extraído + 30.170 remanente = 30.728 millones de barriles)",
            "eia_2013_mmbo": EIA_2013_MMBO,
            "variacion_vs_eia_pct": {"remanente_30170": round((IAPG_RTRP_MMBO["media"] / EIA_2013_MMBO - 1) * 100, 1),
                                     "total_30728": round((IAPG_RRP_MMBO["media"] / EIA_2013_MMBO - 1) * 100, 1)},
        },
    }
    return prod, meta


def horizontes(prod, a, parcial):
    """H(t) = R(t) / P(t) para el año a. Si el año es parcial, P = producción del año completo anterior."""
    anio_ritmo = a - 1 if parcial else a
    p_nc = float(prod.at[anio_ritmo, "nc"]) if anio_ritmo in prod.index else None
    p_vm_bbl = float(prod.at[anio_ritmo, "vm"]) * BBL_POR_M3 if anio_ritmo in prod.index else None
    r_res = float(prod.at[a, "res_restante_m3"])
    r_iapg = {k: float(prod.at[a, f"iapg_restante_bbl_{k}"]) for k in IAPG_RTRP_MMBO}
    ok_nc = bool(p_nc) and p_nc > 0
    ok_vm = bool(p_vm_bbl) and p_vm_bbl > 0
    res = {"restante_m3": round(r_res), "produccion_m3": round(p_nc) if p_nc is not None else None, "anio_ritmo": anio_ritmo,
           "anios": round(r_res / p_nc, 2) if ok_nc else None}
    iapg = {"restante_mmbo": {k: round(v / 1e6, 2) for k, v in r_iapg.items()},
            "produccion_mmbo": round(p_vm_bbl / 1e6, 6) if p_vm_bbl is not None else None, "anio_ritmo": anio_ritmo,
            "anios": {k: round(v / p_vm_bbl, 2) for k, v in r_iapg.items()} if ok_vm else None}
    if parcial:
        nota = f"{a} es parcial: R descuenta lo extraído hasta el último mes con datos; P = producción de {anio_ritmo}"
        res["nota"] = iapg["nota"] = nota
    return res, iapg


def main():
    prod, meta = calcular()
    serie = json.loads(F_SERIE.read_text(encoding="utf-8"))
    for f in serie["anios"]:
        a = f["anio"]
        f["petroleo_nc_neuquina_m3"] = int(round(prod.at[a, "nc"]))
        f["petroleo_nc_neuquina_acumulado_m3"] = int(round(prod.at[a, "nc_acum"]))
        assert f["petroleo_acumulado_m3"] == int(round(prod.at[a, "vm_acum"])), f"acumulado VM {a} no coincide con procesar.py"
        f["pct_extraido_reservas"] = round(float(prod.at[a, "pct_res"]), 4)   # 4 decimales: evita redondear dos veces en la web
        f["pct_extraido_iapg"] = round(float(prod.at[a, "pct_iapg"]), 4)
        for k in ("anios_restantes_reservas", "anios_restantes_iapg", "anios_restantes_eia"):
            f.pop(k, None)   # reemplazados por horizonte_reservas / horizonte_iapg
        f["horizonte_reservas"], f["horizonte_iapg"] = horizontes(prod, a, bool(f.get("parcial")))
    d = serie["meta"].setdefault("denominadores", {})
    d["reservas"] = {"m3": meta["reservas"]["inventario_referencia_m3"],
                     "composicion": "acumulado NC cuenca Neuquina a 31/12/2025 + reservas comprobadas NC Neuquina al 31/12/2025 (hoja 'fin de vida util')"}
    d["iapg"] = {"m3": meta["iapg"]["inventario_referencia_m3"], "bbl": IAPG_RRP_MMBO["media"] * 1e6,
                 "composicion": "total del IAPG al 31/12/2024: 558 MMBO extraídos + 30.170 MMBO remanentes (Pmean)"}
    d["eia"] = {**d.get("eia", {}), "advertencia": "No comparable con el IAPG: estimación 2013, recurso 'unproved' con riesgo; no se muestra."}
    serie["meta"]["parcial"] = serie["meta"].get("parcial", "").replace("; años restantes de 2026 vacíos.", ".")
    serie["meta"]["indicadores_petroleo"] = meta
    F_SERIE.write_text(json.dumps(serie, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(meta, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
