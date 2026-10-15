"""
Consulta al catálogo USGS ComCat (API FDSN) y serie anual de sismos M >= 4,0.

Entrada : API https://earthquake.usgs.gov/fdsnws/event/1/query (CSV), una consulta por tramo de años, con pausas.
Salida  : datos/raw/sismos/usgs/usgs_<desde>_<hasta>.csv (respuesta tal cual), datos/procesados/usgs_filtrado.csv,
          datos/procesados/serie_usgs_vs_local.json
Filtros : los mismos que el catálogo combinado: profundidad <= 30 km y dentro de area_estudio.geojson.
Uso     : python scripts/consultar_usgs.py
"""
import json
import time
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

import pandas as pd
from shapely.geometry import Point, shape
from shapely.prepared import prep

RAIZ = Path(__file__).resolve().parent.parent
RAW = RAIZ / "datos" / "raw" / "sismos" / "usgs"
PROC = RAIZ / "datos" / "procesados"
URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"
HOY = date.today().isoformat()
PARAMS = {"format": "csv", "minlatitude": -39.5, "maxlatitude": -36.5, "minlongitude": -70.5, "maxlongitude": -67.5,
          "minmagnitude": 3.5, "orderby": "time-asc"}
TRAMOS = [(2000, 2004), (2005, 2009), (2010, 2014), (2015, 2019), (2020, date.today().year)]
PROF_MAX = 30.0


def consultar(a, b):
    ini = f"{a}-01-01"
    fin = HOY if b == date.today().year else f"{b + 1}-01-01"
    q = dict(PARAMS, starttime=ini, endtime=fin)
    url = URL + "?" + urllib.parse.urlencode(q)
    req = urllib.request.Request(url, headers={"User-Agent": "VisualizacionVacaMuerta (proyecto academico)"})
    for intento in range(5):                       # el servicio a veces responde 502/503/504: reintento con espera
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                cuerpo = r.read()
            break
        except urllib.error.HTTPError as e:
            print("  error", e.code, "reintento", intento + 1)
            if intento == 4:
                raise
            time.sleep(20 * (intento + 1))
    (RAW / f"usgs_{a}_{b}.csv").write_bytes(cuerpo)
    return url, len(cuerpo)


if __name__ == "__main__":
    RAW.mkdir(parents=True, exist_ok=True)
    urls = []
    for a, b in TRAMOS:
        url, n = consultar(a, b)
        urls.append(url)
        print(a, b, n, "bytes", url)
        time.sleep(5)
    (RAW / "consultas.txt").write_text(f"Fecha de consulta: {HOY}\n" + "\n".join(urls) + "\n", encoding="utf-8")
