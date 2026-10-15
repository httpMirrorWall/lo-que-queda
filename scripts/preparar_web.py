"""
Copia los datos procesados a web/datos/ envueltos en archivos .js (window.DATOS_*),
para que web/index.html funcione con doble clic, sin servidor (el navegador no deja
leer archivos .json locales con fetch desde file://).

Uso:  python scripts/preparar_web.py      (correr de nuevo si cambian datos/procesados/)
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "datos" / "procesados"
DESTINO = RAIZ / "web" / "datos"

ARCHIVOS = {
    "pozos_vm.json": ("pozos.js", "DATOS_POZOS"),
    "serie_anual_vm.json": ("serie.js", "DATOS_SERIE"),
    "cuenca_neuquina.geojson": ("cuenca.js", "DATOS_CUENCA"),
    "hitos.json": ("hitos.js", "DATOS_HITOS"),
    "sismos.json": ("sismos.js", "DATOS_SISMOS"),
    "area_estudio.geojson": ("area.js", "DATOS_AREA"),
    "contexto_intro.json": ("contexto.js", "DATOS_CONTEXTO"),
}

DESTINO.mkdir(parents=True, exist_ok=True)
for origen, (destino, variable) in ARCHIVOS.items():
    datos = json.loads((ORIGEN / origen).read_text(encoding="utf-8"))
    texto = f"window.{variable}=" + json.dumps(datos, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DESTINO / destino).write_text(texto, encoding="utf-8")
    print(f"{destino}: {len(texto) / 1024:.0f} KB")
