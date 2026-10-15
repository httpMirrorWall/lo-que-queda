"""
Sismos: serie del INPRES desde 2019 (fuente única de la capa), con Zenodo (control y contexto) y USGS (contexto).

Entrada : datos/raw/sismos/inpres/*.html   (búsqueda del INPRES guardada a mano; NO se consulta el sitio)
          datos/raw/sismos/extraido/.../data/CAT.mat   (Schultz et al., 2024; Zenodo 10.5281/zenodo.14065345)
          datos/raw/sismos/usgs/query.csv  (USGS ComCat, descarga manual)
          datos/procesados/area_estudio.geojson  (NO se modifica)
Salida  : datos/procesados/sismos.json, datos/procesados/catalogo_sismos.csv, docs/auditoria_sismos.md

Capa y panel: SOLO INPRES, 2019-01-01 en adelante; filtros iguales para todos los eventos (magnitud >= 2,0 para el mapa,
profundidad <= 30 km, dentro del área de estudio); número del panel con magnitud >= 2,5.
Zenodo: control (conteos anuales 2021 a marzo de 2024) y contexto de 2017. USGS: contexto en el (i). Ninguno se dibuja ni se suma.

Uso:  python scripts/procesar_sismos.py
"""
import glob
import json
import re
from pathlib import Path

import pandas as pd
import scipy.io as sio
from matio import load_from_mat
from shapely.geometry import Point, shape
from shapely.prepared import prep

RAIZ = Path(__file__).resolve().parent.parent
HTML = Path(glob.glob(str(RAIZ / "datos" / "raw" / "sismos" / "inpres" / "*.html"))[0])
MAT = next((RAIZ / "datos" / "raw" / "sismos").rglob("data/CAT.mat"))
USGS = RAIZ / "datos" / "raw" / "sismos" / "usgs" / "query.csv"
AREA = RAIZ / "datos" / "procesados" / "area_estudio.geojson"
SALIDA = RAIZ / "datos" / "procesados" / "sismos.json"
CSV = RAIZ / "datos" / "procesados" / "catalogo_sismos.csv"
INFORME = RAIZ / "docs" / "auditoria_sismos.md"

FECHA_CONSULTA = "2026-10-08"
CRITERIOS = ("fechas 01/01/2000 a 08/10/2026; cuadrante lat −36,5 a −39,5 y long −70,5 a −67,5; "
             "provincia: todas; magnitud 0 a 9; intensidad: valor por defecto (no filtró)")
URL_USGS = ("https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=2000-01-01&minmagnitude=4"
            "&minlatitude=-39.5&maxlatitude=-36.5&minlongitude=-70.5&maxlongitude=-67.5&orderby=time")
DESDE = pd.Timestamp("2019-01-01")
HASTA = pd.Timestamp("2026-08-31 23:59:59")   # corte común a todos los datos del proyecto: 31/08/2026
MAG_MAPA, MAG_PANEL, PROF_MAX = 2.0, 2.5, 30.0
EPS = 1e-9

# ----------------------------------------------------------------------------- lectura
t = HTML.read_bytes().decode("utf-8")
declarado = int(re.search(r"<h3>\s*(\d+)\s*s", t).group(1))
k = t.find("const contenido = ") + len("const contenido = ")
texto, _ = json.JSONDecoder().raw_decode(t, k)
filas = [l.split(";") for l in texto.split("\n") if l.strip()][1:]
assert all(len(f) == 8 for f in filas)
df = pd.DataFrame(filas, columns=["nro", "fecha", "lat", "lon", "mag", "prof", "region", "intensidad"])
ins = pd.DataFrame({"t": pd.to_datetime(df.fecha, format="ISO8601"), "lat": df.lat.astype(float), "lon": df.lon.astype(float),
                    "prof": df.prof.astype(float), "mag": df.mag.astype(float)})
assert len(ins) == declarado
ins = ins.sort_values("t").reset_index(drop=True)
n_inpres_bruto = len(ins)
despues_corte = ins[ins.t > HASTA]            # eventos posteriores al 31/08/2026: fuera de la capa y de los conteos
ins = ins[ins.t <= HASTA].reset_index(drop=True)

num = sio.loadmat(MAT)
fz = load_from_mat(str(MAT))
zen = pd.DataFrame({"t": pd.to_datetime(fz["EQtime"].ravel()), "lat": num["EQlat"].ravel(), "lon": num["EQlon"].ravel(),
                    "mag": num["EQmag"].ravel(), "prof": num["EQdep"].ravel()})
n_zen_bruto = len(zen)
zen = zen.drop_duplicates().reset_index(drop=True)          # 1 copia exacta

area = shape(json.loads(AREA.read_text(encoding="utf-8"))["features"][0]["geometry"])
area_p = prep(area)


def en_area(d):
    return pd.Series([area_p.contains(Point(x, y)) for x, y in zip(d.lon, d.lat)], index=d.index, dtype=bool)


def filtros(d, mag_min):
    """Magnitud, profundidad y área, en ese orden. Devuelve (final, excluidos por magnitud, por profundidad, por área, conteos independientes)."""
    ok_mag = d.mag >= mag_min - EPS
    ok_prof = d.prof <= PROF_MAX
    ok_area = en_area(d)
    indep = {"magnitud": int((~ok_mag).sum()), "profundidad": int((~ok_prof).sum()), "area": int((~ok_area).sum())}
    return d[ok_mag & ok_prof & ok_area], d[~ok_mag], d[ok_mag & ~ok_prof], d[ok_mag & ok_prof & ~ok_area], indep


# ----------------------------------------------------------------------------- capa principal: INPRES desde 2019
n_inpres_total = len(ins)
antes_2019 = ins[ins.t < DESDE]
base = ins[ins.t >= DESDE].reset_index(drop=True)
final, ex_mag, ex_prof, ex_area, indep = filtros(base, MAG_MAPA)
final = final.copy()
final["anio"] = final.t.dt.year
final["m25"] = final.mag >= MAG_PANEL - EPS
ultimo_ins = ins.t.max()
anio_parcial = int(ultimo_ins.year)
anios = list(range(2019, anio_parcial + 1))
anual = {str(a): {"m20": int((final.anio == a).sum()), "m25": int(final[final.anio == a].m25.sum())} for a in anios}
ult_m25 = final[final.m25].t.max()

# ----------------------------------------------------------------------------- Zenodo: contexto 2017 y control 2021 - marzo 2024
zen25 = filtros(zen, MAG_PANEL)[0]
ins25 = filtros(ins, MAG_PANEL)[0]
ctx2017 = {"zenodo": int((zen25.t.dt.year == 2017).sum()), "inpres": int((ins25.t.dt.year == 2017).sum())}
FIN_CTRL = pd.Timestamp("2024-04-01")           # control hasta marzo de 2024 inclusive
control = {}
for a in range(2021, 2025):
    ci = ins25[(ins25.t.dt.year == a) & (ins25.t < FIN_CTRL)]
    cz = zen25[(zen25.t.dt.year == a) & (zen25.t < FIN_CTRL)]
    control[str(a)] = {"inpres": len(ci), "zenodo": len(cz), "dif": abs(len(ci) - len(cz))}
control_max = max(v["dif"] for v in control.values())

# ----------------------------------------------------------------------------- USGS: solo contexto
us = pd.read_csv(USGS)
us["t"] = pd.to_datetime(us.time).dt.tz_localize(None)
us = us.rename(columns={"latitude": "lat", "longitude": "lon", "depth": "prof"})
us_n = len(us)
us["en_area"] = en_area(us)
us["prof_ok"] = us.prof <= PROF_MAX
us["pasa"] = us.en_area & us.prof_ok
us_ok = us[us.pasa].sort_values("t")
us_2000_2014 = int((us_ok.t.dt.year <= 2014).sum())
us_desde_2015 = int((us_ok.t.dt.year >= 2015).sum())

# ----------------------------------------------------------------------------- salidas
out = final.copy()
out["fecha"] = out.t.dt.strftime("%Y-%m-%d")
out["hora"] = out.t.dt.strftime("%H:%M:%S")
out[["fecha", "hora", "lat", "lon", "prof", "mag"]].rename(columns={"prof": "profundidad_km", "mag": "magnitud"}).to_csv(CSV, index=False, encoding="utf-8")

salida = {
    "meta": {
        "descripcion": "Sismos registrados por el INPRES desde 2019 en el área de estudio (pozos VM + 20 km): magnitud >= 2,0 y profundidad <= 30 km. "
                       "Datos agrupados por año; sin afirmar causa.",
        "fuente": "INPRES, buscador de sismos: http://contenidos.inpres.gob.ar/buscar_sismo",
        "criterios_busqueda": CRITERIOS,
        "fecha_consulta": FECHA_CONSULTA,
        "desde": "2019-01-01",
        "ultimo_evento": ult_m25.strftime("%Y-%m-%d"),          # último evento del panel (M >= 2,5)
        "ultimo_evento_mapa": final.t.max().strftime("%Y-%m-%d"),
        "datos_hasta": ultimo_ins.strftime("%Y-%m-%d"),
        "anio_inicio": 2019, "anio_parcial": anio_parcial,
        "mag_panel": MAG_PANEL, "mag_mapa": MAG_MAPA, "prof_max_km": PROF_MAX,
        "corte": "2026-08-31", "posteriores_al_corte": len(despues_corte),
        "filtros": {"inpres_bruto": n_inpres_bruto, "inpres_total": n_inpres_total, "antes_2019": len(antes_2019), "desde_2019": len(base),
                    "excluidos_magnitud": len(ex_mag), "excluidos_profundidad": len(ex_prof), "excluidos_area": len(ex_area),
                    "independientes": indep, "final": len(final), "final_m25": int(final.m25.sum())},
        "contexto": {
            "anio": 2017, "zenodo_m25": ctx2017["zenodo"], "inpres_m25": ctx2017["inpres"],
            "usgs": {"total": us_n, "quedan": int(len(us_ok)), "entre_2000_2014": us_2000_2014, "desde_2015": us_desde_2015},
        },
        "control_zenodo": {"desde": "2021", "hasta": "2024-03", "dif_max": control_max, "por_anio": control},
        "unidades": {"prof": "km", "mag": "magnitud INPRES", "fecha": "hora local de Argentina (UTC−3), ISO 8601"},
    },
    "anual": anual,
    "eventos": [{"f": r.t.strftime("%Y-%m-%dT%H:%M:%S"), "lat": round(float(r.lat), 4), "lon": round(float(r.lon), 4),
                 "m": round(float(r.mag), 2), "p": round(float(r.prof), 1)} for r in final.itertuples()],
}
SALIDA.write_text(json.dumps(salida, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

# ----------------------------------------------------------------------------- informe
filas_anio = "".join(f"| {a} | {anual[str(a)]['m20']} | {anual[str(a)]['m25']} |\n" for a in anios)
filas_us = "".join(f"| {r.t:%Y-%m-%d} | {r.mag:.1f} | {r.prof:.1f} | {r.lat:.3f}, {r.lon:.3f} | {r.place} | {'sí' if r.en_area else 'no'} | {'sí' if r.prof_ok else 'no'} | {'**queda**' if r.pasa else 'se excluye'} |\n"
                   for r in us.sort_values("t").itertuples())
filas_ctrl = "".join(f"| {a}{' (ene–mar)' if a == '2024' else ''} | {v['inpres']} | {v['zenodo']} | {v['dif']} |\n" for a, v in control.items())
md = f"""# Auditoría del catálogo de sismos (INPRES desde 2019)

Generado por `scripts/procesar_sismos.py`. Fuente única de la capa y el panel: INPRES, 01/01/2019 en adelante. Zenodo es solo control y contexto; el USGS, solo contexto. Ninguno se dibuja ni se suma. No hay deduplicación entre catálogos.

## 0. Archivos de partida

- **INPRES:** `{HTML.relative_to(RAIZ).as_posix()}`. Consulta del {FECHA_CONSULTA}, descarga manual. Criterios: {CRITERIOS}. {n_inpres_bruto} eventos (igual al total que declara la página). **Corte al 31/08/2026**, igual que el resto de los datos: se excluyen {len(despues_corte)} eventos posteriores; quedan {n_inpres_total}, del {ins.t.min():%d/%m/%Y} al {ins.t.max():%d/%m/%Y}. Los {len(antes_2019)} anteriores a 2019 quedan fuera de la capa.
- **Zenodo:** `{MAT.relative_to(RAIZ).as_posix()}` ({n_zen_bruto} eventos; 1 copia exacta quitada → {len(zen)}), del {zen.t.min():%d/%m/%Y} al {zen.t.max():%d/%m/%Y}.
- **USGS:** `{USGS.relative_to(RAIZ).as_posix()}`, {us_n} eventos de magnitud ≥ 4 desde 2000 (consulta equivalente a {URL_USGS}).

## 1. Filtros sobre el INPRES (iguales para todos los eventos)

Orden: fecha ≥ 2019-01-01, magnitud ≥ {MAG_MAPA:.1f}, profundidad ≤ {PROF_MAX:.0f} km, área de estudio (`area_estudio.geojson`, sin modificar). Cada fila cuenta lo que no excluyó la anterior; entre paréntesis, lo que excluiría el filtro por sí solo sobre los {len(base)} eventos desde 2019.

| Paso | Eventos |
|---|---|
| INPRES bruto (consulta del 8/10/2026) | {n_inpres_bruto} |
| Excluidos por el corte (posteriores al 31/08/2026) | {len(despues_corte)} |
| INPRES hasta el 31/08/2026 | {n_inpres_total} |
| Excluidos por fecha (antes de 2019) | {len(antes_2019)} |
| Desde 2019 | {len(base)} |
| Excluidos por magnitud < {MAG_MAPA:.1f} | {len(ex_mag)} ({indep['magnitud']}) |
| Excluidos por profundidad > {PROF_MAX:.0f} km | {len(ex_prof)} ({indep['profundidad']}) |
| Excluidos por estar fuera del área | {len(ex_area)} ({indep['area']}) |
| **Quedan (mapa, M ≥ 2,0)** | **{len(final)}** |
| **Del panel (M ≥ 2,5)** | **{int(final.m25.sum())}** |

## 2. Conteo por año

| Año | M ≥ 2,0 (mapa) | M ≥ 2,5 (panel) |
|---|---|---|
{filas_anio}| **Total** | **{len(final)}** | **{int(final.m25.sum())}** |

{anio_parcial} es parcial: datos del INPRES hasta el {ultimo_ins:%d/%m/%Y}; último evento del panel (M ≥ 2,5): {ult_m25:%d/%m/%Y}; último del mapa: {final.t.max():%d/%m/%Y}.

## 3. USGS (solo contexto)

Mismos filtros de área y profundidad (≤ 30 km). De {us_n} eventos quedan **{len(us_ok)}**.

| Fecha (UTC) | M | Prof. (km) | Lat, lon | Ubicación (USGS) | En el área | Prof. ≤ 30 km | Resultado |
|---|---|---|---|---|---|---|---|
{filas_us}
Entre 2000 y 2014 quedan **{us_2000_2014}**; desde 2015, **{us_desde_2015}**.

## 4. Zenodo (control y contexto)

- **Control:** conteos anuales con M ≥ 2,5 (mismos filtros de profundidad y área) entre INPRES y Zenodo de 2021 a marzo de 2024. Diferencia máxima: **{control_max}**.

| Año | INPRES | Zenodo | Diferencia |
|---|---|---|---|
{filas_ctrl}
- **Contexto 2017 (M ≥ 2,5, mismos filtros):** Zenodo {ctx2017['zenodo']}, INPRES {ctx2017['inpres']}. Redes distintas: no comparables con la serie desde 2019.
"""
INFORME.write_text(md, encoding="utf-8")
print(md)
