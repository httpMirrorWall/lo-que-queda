# Lo que queda

**Vaca Muerta: petróleo, gas y la evolución de su explotación.**

Una visualización interactiva sobre lo extraído, lo que implicó y las estimaciones del petróleo que aún podría recuperarse.

Visualización interactiva sobre Vaca Muerta para el concurso **Contar con Datos 2026** (Universidad de San Andrés): qué dio la formación (petróleo, gas, dinero) y qué costó (agua, sismos), año por año desde 2010.

## Ver la página

Abrir `web/index.html` con doble clic (no necesita servidor), o servirla localmente:

```
python -m http.server 8765 --directory web
```

y entrar a http://localhost:8765. Para publicarla con GitHub Pages, apuntar Pages a la carpeta `web/` (o copiar su contenido a `docs/` o a la rama `gh-pages`).

## Estructura

```
web/                 Página final (HTML, CSS, JS y datos ya preparados en web/datos/)
scripts/             Procesamiento en Python
datos/procesados/    Salidas de los scripts
docs/                Auditoría de datos, metodología, registro de uso de IA, tooltips
```

## Datos

El repositorio incluye solo los datos procesados (`datos/procesados/` y `web/datos/`), suficientes para que la página funcione tal cual, por ejemplo en GitHub Pages. Todas las fuentes, con sus links, están en la sección «Fuentes» de este archivo, en la pestaña «Metodología y fuentes» de la página y en `docs/metodologia_procesamiento.md`.

### Datos crudos

Los datos originales **no están en el repositorio** (no existe `datos/raw/`). Para reproducir el procesamiento hay que descargarlos de los enlaces de la sección [Fuentes](#fuentes) y guardarlos en `datos/raw/<fuente>/` con los nombres que esperan los scripts:

| Carpeta | Archivo | Lo lee |
|---|---|---|
| `datos/raw/capitulo_iv/` | `produccin-de-pozos-de-gas-y-petrleo-no-convencional.csv` | `procesar.py`, `indicadores_petroleo.py`, `calcular_intro.py` |
| `datos/raw/capitulo_iv/` | `serie-histrica-de-produccin-de-petrleo-por-cuenca-y-sub-tipo-de-recurso-captulo-iv-.csv` | `procesar.py` |
| `datos/raw/capitulo_iv/` | serie histórica de gas (un CSV cuyo nombre coincide con `serie-hist*gas*.csv`) | `calcular_intro.py` |
| `datos/raw/fractura/` | `datos-de-fractura-de-pozos-de-hidrocarburos-adjunto-iv-actualizacin-diaria.csv` | `procesar.py`, `auditoria.py` |
| `datos/raw/regalias/crudo/` | `Informe Regalias CRUDO.xlsx` | `procesar.py`, `auditoria.py` |
| `datos/raw/regalias/gas/` | `Informe Regalias GAS.xlsx` | `procesar.py`, `auditoria.py` |
| `datos/raw/regalias/gasolina/` | `Informe Regalias GASOLINA-CONDENSADO.xlsx` | `auditoria.py` |
| `datos/raw/regalias/glp/` | `Informe Regalias GLP.xlsx` | `auditoria.py` |
| `datos/raw/tipo_cambio/` | `tc_bcra_a3500_mayorista_diario.csv` | `procesar.py` |
| `datos/raw/reservas/` | `reservas al 31-12-2025.xlsx` | `procesar.py`, `indicadores_petroleo.py`, `auditoria.py` |
| `datos/raw/cuencas/` | `exploracin-hidrocarburos-cuencas-sedimentarias-shp.shp` (con sus archivos `.dbf`, `.shx`, `.prj`) | `procesar.py`, `auditoria.py` |
| `datos/raw/sismos/inpres/` | un archivo `*.html` con la búsqueda del INPRES guardada a mano | `procesar_sismos.py` |
| `datos/raw/sismos/` | carpeta del catálogo de Schultz et al. (2024) descomprimida, con `data/CAT.mat` en algún nivel de su interior; opcionalmente `VM-ID-earthquake.zip` | `procesar_sismos.py`, `zenodo_anual.py` |
| `datos/raw/sismos/usgs/` | `query.csv` (USGS ComCat, descarga manual) | `procesar_sismos.py` |

Los nombres con letras faltantes (`produccin`, `petrleo`, `actualizacin`, `exploracin`) son los que dejó la descarga original; hay que respetarlos tal cual. `consultar_usgs.py` escribe además en `datos/raw/sismos/usgs/` los CSV que baja de la API del USGS.

### Reproducir los datos

1. Instalar las dependencias: `pip install -r requirements.txt`.
2. Descargar las fuentes de la sección [Fuentes](#fuentes) y guardarlas en `datos/raw/<fuente>/` con los nombres de la tabla anterior.
3. Correr los scripts de `scripts/` (`procesar.py`, `procesar_sismos.py`, etc.): leen `datos/raw/` sin modificarlo y escriben en `datos/procesados/` y en `docs/`.

## Fuentes

- Secretaría de Energía, datos.gob.ar:
  - [Producción de petróleo y gas por pozo, Capítulo IV](https://datos.gob.ar/dataset/energia-produccion-petroleo-gas-por-pozo-capitulo-iv)
  - [Datos de fractura de pozos (Adjunto IV)](https://datos.gob.ar/dataset/datos-de-fractura-de-pozos-adjunto-iv)
  - [Reservas de petróleo y gas](https://datos.gob.ar/dataset/reservas-de-petroleo-y-gas)
  - [Regalías de petróleo crudo, gas natural, GLP, gasolina y condensado](https://datos.gob.ar/dataset/regalias-de-petroleo-crudo-gas-natural-glp-gasolina-y-condensado)
  - [Cuencas sedimentarias](https://datos.gob.ar/dataset/exploracion-hidrocarburos-cuencas-sedimentarias)
- BCRA: [tipo de cambio mayorista de referencia (Com. A 3500)](https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/5).
- Sismos: [INPRES, buscador de sismos](http://contenidos.inpres.gob.ar/buscar_sismo); Schultz et al. (2024), Zenodo, [doi:10.5281/zenodo.14065345](https://doi.org/10.5281/zenodo.14065345); [USGS ComCat](https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=2000-01-01&minmagnitude=4&minlatitude=-39.5&maxlatitude=-36.5&minlongitude=-70.5&maxlongitude=-67.5&orderby=time).
- Mapa base: Esri World Dark Gray Base (Esri, HERE, Garmin, © OpenStreetMap contributors y la comunidad de usuarios GIS).

La lista completa, con las demás referencias, está en la pestaña «Metodología y fuentes» de la página.

## Autora

MirrorWall
