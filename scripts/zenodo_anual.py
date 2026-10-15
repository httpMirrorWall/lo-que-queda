"""
Conteo anual de sismos de Zenodo (Schultz et al., 2024; catálogo CAT.mat) con los MISMOS filtros que scripts/procesar_sismos.py
(magnitud >= 2,5, profundidad <= 30 km, dentro del área de estudio) y lo agrega a datos/procesados/sismos.json -> meta.contexto.zenodo_por_anio.
Solo contexto para el (i) de los años 2014-2018: no se dibuja ni se suma al INPRES. No modifica ningún otro campo.

Uso:  python scripts/zenodo_anual.py [ruta/a/CAT.mat]
      (si no se pasa, usa el CAT.mat dentro de datos/raw/sismos/ ya extraído; si no existe, lo extrae del zip a una carpeta temporal)
"""
import json
import sys
import tempfile
import zipfile
from pathlib import Path

import pandas as pd
import scipy.io as sio
from matio import load_from_mat
from shapely.geometry import Point, shape
from shapely.prepared import prep

RAIZ = Path(__file__).resolve().parent.parent
ZIP = RAIZ / "datos" / "raw" / "sismos" / "VM-ID-earthquake.zip"
AREA = RAIZ / "datos" / "procesados" / "area_estudio.geojson"
SALIDA = RAIZ / "datos" / "procesados" / "sismos.json"
MAG_PANEL, PROF_MAX, EPS = 2.5, 30.0, 1e-9

if len(sys.argv) > 1:
    MAT = Path(sys.argv[1])
else:
    cand = list((RAIZ / "datos" / "raw" / "sismos").rglob("data/CAT.mat"))
    if cand:
        MAT = cand[0]
    else:
        tmp = Path(tempfile.mkdtemp(prefix="zenodo_"))
        with zipfile.ZipFile(ZIP) as z:
            z.extract(next(n for n in z.namelist() if n.endswith("data/CAT.mat")), tmp)
        MAT = next(tmp.rglob("data/CAT.mat"))

num = sio.loadmat(MAT)
fz = load_from_mat(str(MAT))
zen = pd.DataFrame({"t": pd.to_datetime(fz["EQtime"].ravel()), "lat": num["EQlat"].ravel(), "lon": num["EQlon"].ravel(),
                    "mag": num["EQmag"].ravel(), "prof": num["EQdep"].ravel()}).drop_duplicates().reset_index(drop=True)
area_p = prep(shape(json.loads(AREA.read_text(encoding="utf-8"))["features"][0]["geometry"]))
en_area = pd.Series([area_p.contains(Point(x, y)) for x, y in zip(zen.lon, zen.lat)], index=zen.index)
fin = zen[(zen.mag >= MAG_PANEL - EPS) & (zen.prof <= PROF_MAX) & en_area]
por_anio = {str(a): int((fin.t.dt.year == a).sum()) for a in range(2014, 2019)}
print("Catálogo Zenodo:", zen.t.min(), "a", zen.t.max(), "| eventos totales:", len(zen), "| tras filtros:", len(fin))
print("Por año (M >= 2,5, profundidad <= 30 km, en el área):", por_anio)
print("Todos los años del catálogo tras filtros:", {int(a): int(n) for a, n in fin.groupby(fin.t.dt.year).size().items()})

s = json.loads(SALIDA.read_text(encoding="utf-8"))
assert s["meta"]["contexto"]["zenodo_m25"] == por_anio["2017"], "el conteo de 2017 no coincide con el ya publicado"
s["meta"]["contexto"]["zenodo_por_anio"] = por_anio
SALIDA.write_text(json.dumps(s, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("sismos.json actualizado (meta.contexto.zenodo_por_anio)")
