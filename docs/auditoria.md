# Auditoría de datos — Vaca Muerta (Contar con Datos 2026)

- **Fecha de la auditoría:** 2026-10-06 (cierre del concurso: 2026-10-15)
- **Alcance:** solo lectura. No se transformó, limpió ni modificó ningún dato. No hay datasets procesados, gráficos ni código de visualización.
- **Cómo repetirla:** `python scripts/auditoria.py` regenera `docs/auditoria_detalle.md` (secciones por archivo + tablas de evidencia). Este informe es una foto del 2026-10-06: si se vuelve a correr con datos nuevos, las cifras escritas a mano en las secciones 1, 3, 4, 5 y 6 hay que revisarlas.
- **Convención:** ⚠️ = problema; ❓ = duda que no puedo resolver con los archivos y tiene que decidir o confirmar la autora; "inferido" = deducido de los datos, no figura en ningún metadato.

---

## 1. Qué hice al organizar las carpetas

1. **Descomprimí los 7 ZIP** (cuencas, regalías ×4, reservas, shapefile de pozos). Dejé cada ZIP original **al lado** de su contenido extraído, sin borrarlo.
2. **Moví** los archivos (no los copié ni los toqué) a esta estructura:

```
datos/
  raw/
    capitulo_iv/        5 CSV (producción no convencional, padrón, producción por yacimiento, series de gas y petróleo)
      shapefile_pozos/  shapefile de pozos (.shp .dbf .shx .prj .cpg) + su ZIP
    fractura/           1 CSV (Adjunto IV)
    regalias/
      crudo/  gas/  gasolina/  glp/     un .xlsx (+ su ZIP) por producto
    reservas/           1 .xlsx (+ su ZIP)
    cuencas/            shapefile de cuencas sedimentarias (+ su ZIP)
  procesados/           vacía
scripts/                auditoria.py
docs/                   auditoria.md, auditoria_detalle.md, registro_ia.md
```

3. **Originales intactos:** solo se movieron y descomprimieron. Ningún archivo se editó ni se borró.
4. **Duplicados / versiones / archivos no reconocidos:**
   - No hay dos archivos con el mismo contenido ni versiones repetidas de un mismo dataset.
   - Los 7 ZIP quedan **duplicados a propósito** (el ZIP y el contenido extraído). Si querés ahorrar espacio podés borrar los ZIP más adelante; yo no lo hice.
   - Todos los nombres de archivo perdieron las tildes y la ñ al descargarse (`produccin`, `padrn`, `petrleo`, `captulo`, `exploracin`). No afecta el contenido, pero conviene renombrar cuando se arme el pipeline (decisión tuya).
   - Quedó una carpeta **vacía** `data/raw/` (la carpeta original de descargas, que en OneDrive figura como "enlace"). Intenté borrarla y el sistema me bloqueó el borrado; está vacía y la podés eliminar a mano desde el Explorador. Lo mismo con `scripts/__pycache__/` (caché de Python generada al correr los scripts).
   - No hay nada que no reconozca: los 13 archivos descargados corresponden a los datasets que mencionaste.
5. **Entorno:** instalé en tu Python 3.12 las librerías `duckdb`, `geopandas` (con `pyogrio`, `shapely`, `pyproj`), `openpyxl` y `chardet`. DuckDB lee los CSV pesados sin cargarlos en memoria; los Excel se leen con openpyxl (DuckDB no lee .xlsx sin descargar una extensión).

### Inventario

| # | Carpeta / archivo | Tamaño | Contenido |
|---|---|---|---|
| 1 | `capitulo_iv/produccin-de-pozos-de-gas-y-petrleo-no-convencional.csv` | 140,3 MB | producción mensual por pozo, solo recurso NO CONVENCIONAL (426.145 filas) |
| 2 | `capitulo_iv/padrn-de-pozos-de-captulo-iv-con-fecha-de-primera-produccin.csv` | 1,1 MB | idpozo + año/mes de primera producción (86.197 pozos) |
| 3 | `capitulo_iv/produccin-de-petrleo-y-gas-captulo-iv-por-yacimiento-y-antigedad-de-pozo-productivo.csv` | 71,5 MB | producción mensual agregada por empresa/yacimiento/formación (496.795 filas) |
| 4 | `capitulo_iv/serie-histrica-de-produccin-de-gas-natural-…-captulo-iv-.csv` | 31 KB | serie mensual 2006-01 → 2026-08 por cuenca + shale/tight |
| 5 | `capitulo_iv/serie-histrica-de-produccin-de-petrleo-…-captulo-iv-.csv` | 32 KB | ídem para petróleo |
| 6 | `capitulo_iv/shapefile_pozos/shapefile-de-pozos-shp.shp` | 41 MB (dbf 38 MB) | 85.797 pozos (puntos) |
| 7 | `fractura/datos-de-fractura-…-adjunto-iv-actualizacin-diaria.csv` | 1,2 MB | 4.922 registros de fractura, 4.678 pozos |
| 8–11 | `regalias/{crudo,gas,gasolina,glp}/Informe Regalias *.xlsx` | 0,6–1,4 MB | regalías mensuales por provincia (3 hojas c/u) |
| 12 | `reservas/reservas al 31-12-2025.xlsx` | 0,3 MB | reservas y recursos por yacimiento (2 hojas) |
| 13 | `cuencas/exploracin-hidrocarburos-cuencas-sedimentarias-shp.shp` | 0,4 MB | 24 polígonos de cuencas |

---

## 2. Auditoría por archivo

> Generada por `scripts/auditoria.py` (misma información que `docs/auditoria_detalle.md`, sin las tablas de evidencia de la sección 3). Notas para leer las tablas:
> - **% faltante** cuenta nulos y, en texto, cadenas vacías.
> - En los rangos numéricos de `coordenadax`/`coordenaday` aparecen "negativos = todas las filas": es normal (hemisferio sur / oeste), no es un error.
> - Las "variantes" son valores que difieren solo en mayúsculas, tildes o espacios.
> - Los 5 CSV de Capítulo IV y el de fractura vienen en **UTF-8 con BOM**: DuckDB lo maneja solo; pandas necesita `encoding="utf-8-sig"`.

### PARTE A — Capítulo IV (CSV)

#### Producción de pozos de gas y petróleo NO CONVENCIONAL
- **Archivo:** `datos/raw/capitulo_iv/produccin-de-pozos-de-gas-y-petrleo-no-convencional.csv`
- **Tamaño:** 140.29 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos:  ³ÁÂÃÍÑáéíñó﻿; ⚠️ 203 secuencias tipo mojibake (Ã, Â, �), ej. ['EstudioÂ', 'InactivoÂ', 'ReparaciÃ³n', 'SituaciÃ³n']
- **Filas:** 426,145
- **Columnas:** 40

##### Columnas
| columna | tipo | % faltante | ejemplos |
|---|---|---|---|
| idempresa | VARCHAR | 0.00 | YSUR; OGDV; MAD |
| anio | BIGINT | 0.00 | 2008; 2006; 2011 |
| mes | BIGINT | 0.00 | 10; 2; 5 |
| idpozo | BIGINT | 0.00 | 163512; 137073; 157405 |
| prod_pet | DOUBLE | 0.00 | 2512.15; 1829.59; 2633.9 |
| prod_gas | DOUBLE | 0.00 | 0.0; 2128.46; 14.8 |
| prod_agua | DOUBLE | 0.00 | 152.96; 3.29; 153.29 |
| iny_agua | DOUBLE | 0.00 | 13889.19; 32058.03; 46703.81 |
| iny_gas | DOUBLE | 0.00 | 1159.0; 259.85; 179.44 |
| iny_co2 | DOUBLE | 0.00 | 0.0 |
| iny_otro | DOUBLE | 0.00 | 0.0 |
| tef | DOUBLE | 0.00 | 28.46; 29.67; 28.83 |
| vida_util | DOUBLE | 97.87 | 7482.0; 1734.0; 2800.0 |
| tipoextraccion | VARCHAR | 0.15 | Otros Tipos de Extracción; Plunger Lift; Jet Pump |
| tipoestado | VARCHAR | 0.15 | Parado Transitoriamente; En Reserva de Gas; En Inyección Efectiva |
| tipopozo | VARCHAR | 0.15 | Gasífero; Acuífero; Inyección de Agua |
| observaciones | VARCHAR | 94.29 | Otra Situacion Activo; Cargado automáticamente como [Sin movimientos]; PLU.Nq.Ce.x-1485 |
| fechaingreso | TIMESTAMP | 0.00 | 2016-07-11 16:20:34.949973; 2013-10-03 12:25:12.398212; 2019-08-12 10:43:48.457147 |
| rectificado | BOOLEAN | 0.00 | False; True |
| habilitado | BOOLEAN | 0.00 | True |
| idusuario | BIGINT | 0.00 | 485; 313; 476 |
| empresa | VARCHAR | 0.00 | QUINTANA E&P ARGENTINA S.R.L.; OILSTONE ENERGIA S.A.; KILWER S.A. |
| sigla | VARCHAR | 0.00 | YPF.Nq.RDM-34; YPF.Nq.LLL-1402(h); YPF.Nq.LACh-102(h) |
| formprod | VARCHAR | 0.00 | QTUC; YACO; CSEC |
| profundidad | DOUBLE | 0.00 | 3211.0; 1765.0; 3060.0 |
| formacion | VARCHAR | 0.00 | vaca muerta; quintuco; chachao |
| idareapermisoconcesion | VARCHAR | 0.00 | LCAM; AGA; AGUH |
| areapermisoconcesion | VARCHAR | 0.00 | LA RIBERA BLOQUE II  ; CERRO MANRIQUE; CENTENARIO CENTRO |
| idareayacimiento | VARCHAR | 0.00 | LAS1; BDTO; ECOO |
| areayacimiento | VARCHAR | 0.00 | NARAMBUENA; LAS TACANAS II; LA ANGOSTURA SUR II |
| cuenca | VARCHAR | 0.00 | NEUQUINA; GOLFO SAN JORGE; AUSTRAL |
| provincia | VARCHAR | 0.00 | Neuquén; Santa Cruz; Salta |
| coordenadax | DOUBLE | 0.00 | -68.59608374; -68.71735917; -69.36339182 |
| coordenaday | DOUBLE | 0.00 | -38.57178629; -38.57178697; -38.29843189 |
| tipo_de_recurso | VARCHAR | 0.00 | NO CONVENCIONAL |
| proyecto | VARCHAR | 0.00 | GAS PLUS; Sin Proyecto |
| clasificacion | VARCHAR | 0.22 | EXPLORACION; SERVICIO; EXPLOTACION |
| subclasificacion | VARCHAR | 0.22 | ESTUDIO; EXTENSION; DESARROLLO |
| sub_tipo_recurso | VARCHAR | 0.11 | TIGHT; SHALE |
| fecha_data | DATE | 0.00 | 2023-01-31; 2026-02-28; 2023-04-30 |

##### Calidad
- Filas duplicadas exactas (todas las columnas iguales): **0**

**Rangos numéricos** (negativos / ceros):
| columna | mín | máx | negativos | ceros |
|---|---|---|---|---|
| anio | 2006.0 | 2026.0 | 0 | 0 |
| mes | 1.0 | 12.0 | 0 | 0 |
| idpozo | 3640.0 | 167559.0 | 0 | 0 |
| prod_pet | -0.001 | 26593.261 | 1 | 149687 |
| prod_gas | -12.267 | 40086.8 | 2 | 87628 |
| prod_agua | 0.0 | 34792.95 | 0 | 127774 |
| iny_agua | 0.0 | 70278.85 | 0 | 425504 |
| iny_gas | 0.0 | 3569000.0 | 0 | 425545 |
| iny_co2 | 0.0 | 0.0 | 0 | 426145 |
| iny_otro | 0.0 | 0.0 | 0 | 426145 |
| tef | 0.0 | 79.34 | 0 | 82759 |
| vida_util | 0.0 | 11415.21 | 0 | 8515 |
| idusuario | 3.0 | 498.0 | 0 | 0 |
| profundidad | 0.0 | 378939.0 | 0 | 5903 |
| coordenadax | -71.99831 | -38.59007 | 426145 | 0 |
| coordenaday | -69.41577 | -24.11656 | 426145 | 0 |
- Fecha `fechaingreso` (TIMESTAMP): primera **2006-11-13 13:57:53.058895**, última **2026-09-21 09:20:54.496062**, no parseables: 0
- Fecha `fecha_data` (DATE): primera **2006-01-31**, última **2026-08-31**, no parseables: 0
- Cobertura `anio`/`mes`: **200601** → **202608** (AAAAMM); meses fuera de 1-12: 0; años fuera de 1900-2026: 0

**Columnas de texto** (distintos / variantes por mayúsculas, tildes o espacios):
| columna | valores distintos | con espacios extra | grupos con variantes |
|---|---|---|---|
| idempresa | 55 | 0 | 0 |
| tipoextraccion | 11 | 0 | 0 |
| tipoestado | 16 | 0 | 0 |
| tipopozo | 7 | 0 | 0 |
| observaciones | 220 | 22 | 16 |
| empresa | 55 | 2 | 0 |
| sigla | 4941 | 32 | 0 |
| formprod | 29 | 0 | 0 |
| formacion | 29 | 0 | 0 |
| idareapermisoconcesion | 117 | 0 | 0 |
| areapermisoconcesion | 117 | 11 | 0 |
| idareayacimiento | 157 | 0 | 0 |
| areayacimiento | 156 | 1 | 0 |
| cuenca | 4 | 0 | 0 |
| provincia | 6 | 0 | 0 |
| tipo_de_recurso | 1 | 0 | 0 |
| proyecto | 2 | 0 | 0 |
| clasificacion | 3 | 0 | 0 |
| subclasificacion | 8 | 0 | 0 |
| sub_tipo_recurso | 2 | 0 | 0 |

Ejemplos de variantes (mismo valor escrito distinto):
  - `observaciones`: 'En Ensayo Prolongado' | 'En ensayo prolongado' | 'En ensayo Prolongado'
  - `observaciones`: 'Pozo en estado inactivo, pendiente el desarrollo de infraestructura de captación de la producción de gas, desde el 5/5/2015' | 'Pozo en estado inactivo, pendiente el desarrollo de infraestructura de captación de la producción de gas, desde el 5/5/2015 '
  - `observaciones`: 'en espera de equipo de Testing' | 'En espera de equipo de Testing'
  - `observaciones`: 'Ensayo Prolongado.' | 'Ensayo prolongado.'
  - `observaciones`: 'Espera ensayo prolongado' | 'Espera Ensayo Prolongado' | 'Espera ensayo Prolongado'
  - `observaciones`: 'Actualmente el pozo produce en ensayo prolongado con permiso de venteo hasta Febrero 2018.' | 'Actualmente el pozo produce en ensayo prolongado con permiso de venteo hasta Febrero 2018. '

#### Padrón de pozos Capítulo IV (fecha de primera producción)
- **Archivo:** `datos/raw/capitulo_iv/padrn-de-pozos-de-captulo-iv-con-fecha-de-primera-produccin.csv`
- **Tamaño:** 1.12 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos: ﻿; sin mojibake detectado
- **Filas:** 86,197
- **Columnas:** 3

##### Columnas
| columna | tipo | % faltante | ejemplos |
|---|---|---|---|
| idpozo | BIGINT | 0.00 | 238; 244; 298 |
| anio | BIGINT | 0.00 | 2009; 2016; 2012 |
| mes | BIGINT | 0.00 | 11; 9; 5 |

##### Calidad
- Filas duplicadas exactas (todas las columnas iguales): **0**

**Rangos numéricos** (negativos / ceros):
| columna | mín | máx | negativos | ceros |
|---|---|---|---|---|
| idpozo | 212 | 167415 | 0 | 0 |
| anio | 2006 | 2026 | 0 | 0 |
| mes | 1 | 11 | 0 | 0 |
- Cobertura `anio`/`mes`: **200601** → **202607** (AAAAMM); meses fuera de 1-12: 0; años fuera de 1900-2026: 0

**Columnas de texto** (distintos / variantes por mayúsculas, tildes o espacios):
_(vacío)_

#### Producción de petróleo y gas por yacimiento y antigüedad de pozo productivo
- **Archivo:** `datos/raw/capitulo_iv/produccin-de-petrleo-y-gas-captulo-iv-por-yacimiento-y-antigedad-de-pozo-productivo.csv`
- **Tamaño:** 71.54 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos: ÁÍÑÜéíñó﻿; sin mojibake detectado
- **Filas:** 496,795
- **Columnas:** 21

##### Columnas
| columna | tipo | % faltante | ejemplos |
|---|---|---|---|
| idempresa | VARCHAR | 0.00 | ANAR; PCR; MAD |
| anio | BIGINT | 0.00 | 2016; 2011; 2021 |
| mes | BIGINT | 0.00 | 11; 5; 9 |
| suma_prod_pet | BIGINT | 0.00 | 11; 2680; 0 |
| suma_prod_gas | BIGINT | 0.00 | 269; 759; 5299 |
| suma_prod_agua | BIGINT | 0.00 | 30; 205; 177 |
| suma_iny_agua | BIGINT | 0.00 | 0; 329233; 1162 |
| suma_iny_gas | BIGINT | 0.00 | 0; 864; 1684798 |
| suma_iny_co2 | BIGINT | 0.00 | 521; 0 |
| suma_iny_otro | BIGINT | 0.00 | 11826; 34769; 3140 |
| empresa | VARCHAR | 0.00 | PRESIDENT PETROLEUM S.A.; PETROLERA EL TREBOL S.A.; Petrolera Aconcagua Energia S.A. |
| formacion | VARCHAR | 0.21 | cacheuta; huamampampa; chachao |
| idareapermisoconcesion | VARCHAR | 0.00 | CFO; Z018; CON |
| areapermisoconcesion | VARCHAR | 0.00 | LOS CHORRILLOS; LOS MONOS; PAMPA VERDUN |
| idareayacimiento | VARCHAR | 0.00 | Z204; PUCO; MDT |
| areayacimiento | VARCHAR | 0.00 | LOMA NEGRA NI; ARROYO GAMMA; SECCION TREINTA |
| cuenca | VARCHAR | 0.00 | CUYANA; NOROESTE; AUSTRAL |
| provincia | VARCHAR | 0.00 | Chubut; Formosa; Mendoza |
| tipo_de_recurso | VARCHAR | 0.00 | CONVENCIONAL; NO CONVENCIONAL; SIN RESERVORIO |
| anio_primera_prod | BIGINT | 0.00 | 2011; 2007; 2016 |
| mes_primera_prod | BIGINT | 0.00 | 2; 11; 9 |

##### Calidad
- Filas duplicadas exactas (todas las columnas iguales): **0**

**Rangos numéricos** (negativos / ceros):
| columna | mín | máx | negativos | ceros |
|---|---|---|---|---|
| anio | 2010 | 2026 | 0 | 0 |
| mes | 1 | 12 | 0 | 0 |
| suma_prod_pet | 0 | 217225 | 0 | 33620 |
| suma_prod_gas | -1 | 486569 | 1 | 69231 |
| suma_prod_agua | -4 | 1284652 | 2 | 27297 |
| suma_iny_agua | -2438 | 1503595 | 2 | 392962 |
| suma_iny_gas | 0 | 14712949 | 0 | 495603 |
| suma_iny_co2 | 0 | 521 | 0 | 496794 |
| suma_iny_otro | 0 | 69260 | 0 | 496598 |
| anio_primera_prod | 2006 | 2026 | 0 | 0 |
| mes_primera_prod | 1 | 11 | 0 | 0 |
- Cobertura `anio`/`mes`: **201001** → **202601** (AAAAMM); meses fuera de 1-12: 0; años fuera de 1900-2026: 0

**Columnas de texto** (distintos / variantes por mayúsculas, tildes o espacios):
| columna | valores distintos | con espacios extra | grupos con variantes |
|---|---|---|---|
| idempresa | 112 | 0 | 0 |
| empresa | 112 | 5 | 0 |
| formacion | 71 | 1 | 0 |
| idareapermisoconcesion | 347 | 0 | 0 |
| areapermisoconcesion | 344 | 14 | 0 |
| idareayacimiento | 802 | 0 | 0 |
| areayacimiento | 741 | 6 | 2 |
| cuenca | 6 | 0 | 0 |
| provincia | 11 | 0 | 0 |
| tipo_de_recurso | 4 | 0 | 0 |

Ejemplos de variantes (mismo valor escrito distinto):
  - `areayacimiento`: 'CAÑADA DURA ' | 'CAÑADA DURA'
  - `areayacimiento`: 'LOMA DE KAUFFMAN' | 'LOMA DE KAUFFMAN '

#### Serie histórica de gas natural por cuenca y subtipo de recurso
- **Archivo:** `datos/raw/capitulo_iv/serie-histrica-de-produccin-de-gas-natural-por-cuenca-y-sub-tipo-de-recurso-captulo-iv-.csv`
- **Tamaño:** 0.03 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos: ﻿; sin mojibake detectado
- **Filas:** 248
- **Columnas:** 11

##### Columnas
| columna | tipo | % faltante | ejemplos |
|---|---|---|---|
| indice_tiempo | VARCHAR | 0.00 | 2006-03; 2007-02; 2007-03 |
| produccion_gas_natural_cuenca_austral | DOUBLE | 0.00 | 813831.9893; 807442.925; 785769.9373 |
| produccion_gas_natural_cuenca_gsj | DOUBLE | 0.00 | 429856.2152; 420742.0685; 412363.9964 |
| produccion_gas_natural_cuenca_neuquina | DOUBLE | 0.00 | 2395268.9412; 2545313.2836; 2487339.0196 |
| produccion_gas_natural_cuenca_noroeste | DOUBLE | 0.00 | 570671.5738; 562752.1099; 629452.6656 |
| produccion_gas_natural_cuenca_cuyana | DOUBLE | 0.00 | 5201.6404; 5026.618; 5563.537 |
| produccion_gas_natural_total | DOUBLE | 0.00 | 4409523.4514; 4166797.0929; 4166262.2301 |
| produccion_gas_natural_total_diario | DOUBLE | 0.00 | 146.9841; 138.3036; 136.2286 |
| produccion_shale_gas | DOUBLE | 0.00 | 16.384; 198.264; 130.084 |
| produccion_tight_gas | DOUBLE | 0.00 | 38219.9388; 34925.74344; 59405.3895 |
| participacion_no_convencional | DOUBLE | 0.00 | 0.8274; 0.886; 0.8945 |

##### Calidad
- Filas duplicadas exactas (todas las columnas iguales): **0**

**Rangos numéricos** (negativos / ceros):
| columna | mín | máx | negativos | ceros |
|---|---|---|---|---|
| produccion_gas_natural_cuenca_austral | 652088.5484 | 1087216.7938 | 0 | 0 |
| produccion_gas_natural_cuenca_gsj | 240576.4276 | 504606.6308 | 0 | 0 |
| produccion_gas_natural_cuenca_neuquina | 1730463.2752 | 3787555.7177 | 0 | 0 |
| produccion_gas_natural_cuenca_noroeste | 76188.6012 | 629452.6656 | 0 | 0 |
| produccion_gas_natural_cuenca_cuyana | 2480.4438 | 5563.537 | 0 | 0 |
| produccion_gas_natural_total | 3191664.5172 | 4983612.8306 | 0 | 0 |
| produccion_gas_natural_total_diario | 108.5347 | 160.7617 | 0 | 0 |
| produccion_shale_gas | 5.676 | 2991644.75805907 | 0 | 0 |
| produccion_tight_gas | 29757.28007 | 902289.5028234104 | 0 | 0 |
| participacion_no_convencional | 0.698 | 70.9784 | 0 | 0 |

**Columnas de texto** (distintos / variantes por mayúsculas, tildes o espacios):
| columna | valores distintos | con espacios extra | grupos con variantes |
|---|---|---|---|
| indice_tiempo | 248 | 0 | 0 |

#### Serie histórica de petróleo por cuenca y subtipo de recurso
- **Archivo:** `datos/raw/capitulo_iv/serie-histrica-de-produccin-de-petrleo-por-cuenca-y-sub-tipo-de-recurso-captulo-iv-.csv`
- **Tamaño:** 0.03 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos: ﻿; sin mojibake detectado
- **Filas:** 248
- **Columnas:** 12

##### Columnas
| columna | tipo | % faltante | ejemplos |
|---|---|---|---|
| indice_tiempo | VARCHAR | 0.00 | 2006-03; 2007-02; 2007-03 |
| cuenca_austral | DOUBLE | 0.00 | 185061.0096; 161945.6398; 150735.0074 |
| cuenca_gsj | DOUBLE | 0.00 | 1410710.8268; 1283887.9776; 807000.7992 |
| cuenca_neuquina | DOUBLE | 0.00 | 1316865.0828; 1355029.5592; 1222595.8101 |
| cuenca_noroeste | DOUBLE | 0.00 | 68268.1376; 73693.4754; 73654.2094 |
| cuenca_cuyana | DOUBLE | 0.00 | 190836.942; 172212.3309; 159938.1101 |
| total | DOUBLE | 0.00 | 3019656.7274; 3272967.6832; 3027580.0886 |
| total_diario | DOUBLE | 0.00 | 104771.008; 101614.0867; 97310.0798 |
| shale | DOUBLE | 0.00 | 295.488; 344.621; 309.35 |
| tight | DOUBLE | 0.00 | 1172.3442; 1142.9851; 908.9389 |
| part_no_conv | DOUBLE | 0.00 | 0.0338; 0.1704; 0.1434 |
| kbbl_diario | DOUBLE | 0.00 | 619.1815; 646.8681; 651.5765 |

##### Calidad
- Filas duplicadas exactas (todas las columnas iguales): **0**

**Rangos numéricos** (negativos / ceros):
| columna | mín | máx | negativos | ceros |
|---|---|---|---|---|
| cuenca_austral | 37072.6806 | 187191.2244 | 0 | 0 |
| cuenca_gsj | 769057.615 | 1461170.3218 | 0 | 0 |
| cuenca_neuquina | 890740.6379 | 3689119.6057 | 0 | 0 |
| cuenca_noroeste | 11505.2862 | 78304.7729 | 0 | 0 |
| cuenca_cuyana | 60262.0219 | 190836.942 | 0 | 0 |
| total | 2187848.4298 | 4574551.3699 | 0 | 0 |
| total_diario | 72657.1346 | 147566.1732 | 0 | 0 |
| shale | 117.403 | 3309792.6353 | 0 | 0 |
| tight | 662.4024 | 46317.7649 | 0 | 0 |
| part_no_conv | 0.0314 | 72.8245 | 0 | 0 |
| kbbl_diario | 456.9996 | 928.1633 | 0 | 0 |

**Columnas de texto** (distintos / variantes por mayúsculas, tildes o espacios):
| columna | valores distintos | con espacios extra | grupos con variantes |
|---|---|---|---|
| indice_tiempo | 248 | 0 | 0 |

### PARTE B — Fractura (Adjunto IV)

#### Datos de fractura de pozos (Adjunto IV)
- **Archivo:** `datos/raw/fractura/datos-de-fractura-de-pozos-de-hidrocarburos-adjunto-iv-actualizacin-diaria.csv`
- **Tamaño:** 1.18 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos: ÁÍÑéíñó﻿; sin mojibake detectado
- **Filas:** 4,922
- **Columnas:** 30

##### Columnas
| columna | tipo | % faltante | ejemplos |
|---|---|---|---|
| id_base_fractura_adjiv | BIGINT | 0.00 | 31; 52; 55 |
| idpozo | BIGINT | 0.00 | 160331; 159836; 154745 |
| sigla | VARCHAR | 0.00 | YPF.Nq.AdlA-1006(h); YPF.Nq.EOr-105(h); YPF.Nq.EOr-11 |
| cuenca | VARCHAR | 0.00 | AUSTRAL; NEUQUINA; GOLFO SAN JORGE |
| areapermisoconcesion | VARCHAR | 0.00 | LA RIBERA BLOQUE I ; SIERRAS BLANCAS; LA ANGOSTURA SUR II |
| yacimiento | VARCHAR | 0.00 | SIERRAS BLANCAS; LAGUNA DE LOS CAPONES NORTE; LA ANGOSTURA SUR II |
| formacion_productiva | VARCHAR | 0.00 | vaca muerta; magallanes; mina el carmen |
| tipo_reservorio | VARCHAR | 0.71 | CONVENCIONAL; NO CONVENCIONAL; NO DISCRIMINADO |
| subtipo_reservorio | VARCHAR | 19.77 | SHALE; TIGHT |
| longitud_rama_horizontal_m | DOUBLE | 0.00 | 0.0; 1973.5; 998.45 |
| cantidad_fracturas | BIGINT | 0.00 | 15; 31; 26 |
| tipo_terminacion | VARCHAR | 0.00 | Jetteo; Camisas y punzados; Punzado |
| arena_bombeada_nacional_tn | DOUBLE | 0.00 | 0.0; 3903.705; 5077.35 |
| arena_bombeada_importada_tn | DOUBLE | 0.00 | 0.0; 1037.385; 2221.515 |
| agua_inyectada_m3 | DOUBLE | 0.00 | 26244.0; 27100.0; 29603.6 |
| co2_inyectado_m3 | DOUBLE | 0.00 | 0.0; 287.0; 342.0 |
| presion_maxima_psi | DOUBLE | 0.00 | 15000.0; 11400.0; 11250.0 |
| potencia_equipos_fractura_hp | DOUBLE | 1.04 | 10251.0; 30000.0; 20000.0 |
| fecha_inicio_fractura | DATE | 0.00 | 2017-09-25; 2015-10-17; 2016-01-29 |
| fecha_fin_fractura | DATE | 0.00 | 2017-10-10; 2018-08-18; 2016-01-25 |
| fecha_data | TIMESTAMP | 0.00 | 2019-07-04 11:36:20.975875; 2019-07-04 11:37:59.307158; 2019-07-16 17:37:52.507905 |
| anio_if | BIGINT | 0.00 | 2016; 2009; 2012 |
| mes_if | BIGINT | 0.00 | 11; 9; 5 |
| anio_ff | BIGINT | 0.00 | 2016; 2009; 2012 |
| mes_ff | BIGINT | 0.00 | 11; 5; 9 |
| anio_carga | BIGINT | 0.00 | 2020; 2023; 2021 |
| mes_carga | BIGINT | 0.00 | 11; 9; 5 |
| empresa_informante | VARCHAR | 0.00 | PLUSPETROL S.A.; CHEVRON ARGENTINA S.R.L.; VISTA OIL & GAS ARGENTINA SAU |
| mes | BIGINT | 0.00 | 11; 9; 5 |
| anio | BIGINT | 0.00 | 2016; 2009; 2012 |

##### Calidad
- Filas duplicadas exactas (todas las columnas iguales): **0**

**Rangos numéricos** (negativos / ceros):
| columna | mín | máx | negativos | ceros |
|---|---|---|---|---|
| id_base_fractura_adjiv | 30.0 | 5709.0 | 0 | 0 |
| idpozo | 458.0 | 167526.0 | 0 | 0 |
| longitud_rama_horizontal_m | 0.0 | 5114.11 | 0 | 2054 |
| cantidad_fracturas | 1.0 | 105.0 | 0 | 0 |
| arena_bombeada_nacional_tn | 0.0 | 20834.0 | 0 | 1565 |
| arena_bombeada_importada_tn | 0.0 | 80652.0 | 0 | 2380 |
| agua_inyectada_m3 | 0.0 | 537184.6 | 0 | 305 |
| co2_inyectado_m3 | 0.0 | 560.0 | 0 | 4763 |
| presion_maxima_psi | 0.0 | 209640.559333927 | 0 | 78 |
| potencia_equipos_fractura_hp | 0.0 | 232159.2892 | 0 | 154 |
| anio_if | 2006.0 | 2026.0 | 0 | 0 |
| mes_if | 1.0 | 12.0 | 0 | 0 |
| anio_ff | 2006.0 | 2026.0 | 0 | 0 |
| mes_ff | 1.0 | 12.0 | 0 | 0 |
| anio_carga | 2019.0 | 2026.0 | 0 | 0 |
| mes_carga | 1.0 | 12.0 | 0 | 0 |
| mes | 1.0 | 12.0 | 0 | 0 |
| anio | 2006.0 | 2026.0 | 0 | 0 |
- Fecha `fecha_inicio_fractura` (DATE): primera **2006-05-19**, última **2026-12-05**, no parseables: 0
- Fecha `fecha_fin_fractura` (DATE): primera **2006-05-24**, última **2026-07-24**, no parseables: 0
- Fecha `fecha_data` (TIMESTAMP): primera **2019-06-14 17:13:03.682790**, última **2026-10-02 09:19:13.284190**, no parseables: 0
- Cobertura `anio`/`mes`: **200605** → **202612** (AAAAMM); meses fuera de 1-12: 0; años fuera de 1900-2026: 0

**Columnas de texto** (distintos / variantes por mayúsculas, tildes o espacios):
| columna | valores distintos | con espacios extra | grupos con variantes |
|---|---|---|---|
| sigla | 4636 | 34 | 0 |
| cuenca | 3 | 0 | 0 |
| areapermisoconcesion | 106 | 8 | 0 |
| yacimiento | 141 | 2 | 0 |
| formacion_productiva | 28 | 0 | 0 |
| tipo_reservorio | 3 | 0 | 0 |
| subtipo_reservorio | 2 | 0 | 0 |
| tipo_terminacion | 5 | 0 | 0 |
| empresa_informante | 23 | 0 | 0 |

### PARTE C — Shapefiles

#### Shapefile de pozos
- **Archivo:** `datos/raw/capitulo_iv/shapefile_pozos/shapefile-de-pozos-shp.shp`
- **Componentes:** .cpg (0 KB), .dbf (38291 KB), .prj (0 KB), .shp (2346 KB), .shx (670 KB)
- **Encoding declarado (.cpg):** UTF-8
- **Elementos:** 85,797
- **CRS:** EPSG:4326 — WGS 84
- **Tipos de geometría:** {'Point': 85797}
- **Geometrías vacías/nulas:** 0; inválidas: 0
- **Extensión (minx, miny, maxx, maxy):** [-72.1059, -69.4158, -38.5901, -22.0026]

##### Columnas de atributos
| columna | tipo | % faltante | ejemplos |
|---|---|---|---|
| SIGLA | str | 0.00 | CH.CH.EaLE.x-1; CH.CH.EaLE.x-2; CH.CH.EaLE-3 |
| IDENTIFICA | int64 | 0.00 | 212; 213; 214 |
| EMPRESA | str | 1.19 | COLHUE HUAPI S.A.; INTEROIL ARGENTINA S A; PETROMINERA CHUBUT S.E. |
| AREA | str | 0.00 | ESTANCIA LA ESCONDIDA (ECH); REVERTIDAS - CHUBUT (RECH); CAÑADON RAMIREZ (CÑR) |
| YACIMIENTO | str | 0.00 | ESTANCIA LA ESCONDIDA (ELA); PUESTO VERA (PUV); CAÑADON RAMIREZ REVERTIDO (CRRE) |
| FORMACION | str | 3.28 | comodoro rivadavia; formación improductiva; bajo barreal |
| CUENCA | str | 0.00 | GOLFO SAN JORGE; NOROESTE; NEUQUINA |
| PROVINCIA | str | 0.00 | Chubut; Salta; Mendoza |
| COTA | str | 0.00 | 255 m; 251 m; 256.15 m |
| PROFUNDIDA | str | 0.00 | 1702 m; 1350 m; 1351 m |
| CLASIFICAC | str | 0.00 | EXPLORACION; EXPLOTACION; SERVICIO |
| SUBCLASIFI | str | 0.00 | EXPLORACION; DESARROLLO; AVANZADA |
| TIPO_RECUR | str | 0.00 | CONVENCIONAL; No informado; SIN RESERVORIO |
| SUB_TIPO_R | str | 0.00 | No informado; SHALE; TIGHT |
| GASPLUS | str | 0.00 | no; si |
| TIPO_POZO | str | 0.00 | Petrolífero; Inyección de Agua; Acuífero |
| TIPO_EXTRA | str | 0.00 | Bombeo Mecánico; Sin Sistema de Extracción; Cavidad Progresiva |
| TIPO_ESTAD | str | 0.00 | Extracción Efectiva; En Inyección Efectiva; Abandonado |
| FECHA_INIC | datetime64[ms] | 39.63 | 1996-10-30; 1996-10-14; 1997-01-30 |
| FECHA_FIN_ | datetime64[ms] | 39.80 | 1996-11-13; 1997-02-07; 1997-01-20 |
| ASFECHA_IN | datetime64[ms] | 42.53 | 1996-11-17; 1996-12-09; 1997-03-02 |
| FECHA_F_01 | datetime64[ms] | 42.52 | 1996-12-07; 1996-12-17; 1997-03-10 |

##### Calidad
- Filas de atributos duplicadas: 0

#### Cuencas sedimentarias (exploración de hidrocarburos)
- **Archivo:** `datos/raw/cuencas/exploracin-hidrocarburos-cuencas-sedimentarias-shp.shp`
- **Componentes:** .dbf (7 KB), .prj (0 KB), .shp (419 KB), .shx (0 KB)
- **Encoding declarado (.cpg):** no hay .cpg
- ⚠️ Lectura por defecto: 3 valores de texto con caracteres rotos (ej. ['CAÃ\x91ADON ASFALTO', 'PENINSULA VALDÃ\x89S', 'Ã\x91IRIHUAU']); el .dbf declara cp1252 pero el contenido es UTF-8. Leyendo con `encoding='utf-8'` se ve bien.
- **Elementos:** 24
- **CRS:** EPSG:4326 — WGS 84
- **Tipos de geometría:** {'Polygon': 22, 'MultiPolygon': 2}
- **Geometrías vacías/nulas:** 0; inválidas: 0
- **Extensión (minx, miny, maxx, maxy):** [-73.1184, -54.4103, -46.8924, -21.8189]

##### Columnas de atributos
| columna | tipo | % faltante | ejemplos |
|---|---|---|---|
| CUENCA | str | 0.00 | CAÑADON ASFALTO; MERCEDES; BOLSONES INTERMONTANOS |
| TIPO | str | 0.00 | No Productiva; Productiva |
| UBICACION | str | 0.00 | ONSHORE; OFFSHORE; ONSHORE&OFFSHORE |
| GEOJSON | str | 0.00 | {"type":"MultiPolygon","coordinates":[[[[-66.7925635651499,-; {"type":"MultiPolygon","coordinates":[[[[-65.846387795375,-3; {"type":"MultiPolygon","coordinates":[[[[-65.8490508666824,- |

##### Calidad
- Filas de atributos duplicadas: 0

### PARTE D — Regalías (Excel)

#### Regalías — CRUDO
- **Archivo:** `datos/raw/regalias/crudo/Informe Regalias CRUDO.xlsx`
- **Tamaño:** 1.20 MB; formato Excel (.xlsx)
- **Hojas:** ['Tabla precios', 'Tabla producción', 'Tabla regalías', 'detalle de tipos de crudo']

##### Hoja `Tabla precios`
- Unidad en celda de la tabla dinámica: **Suma de USD/m3**
- Nota en la hoja: _Nota: La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 13; filas de datos (año-mes): 432; columnas: ['AÑO', 'MES', 'CHUBUT', 'ESTADO NACIONAL', 'FORMOSA', 'JUJUY', 'LA PAMPA', 'MENDOZA', 'NEUQUEN', 'RIO NEGRO', 'SALTA', 'SANTA CRUZ', 'TIERRA DEL FUEGO', 'TOTAL PROVINCIA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1993-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- (precios: no se verifica suma de columnas, no es aditivo; `TOTAL` es un promedio)
- Meses con total = 0 *dentro* del rango con datos: 0

##### Hoja `Tabla producción`
- Unidad en celda de la tabla dinámica: **Suma de m3**
- Nota en la hoja: _Nota: La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 11; filas de datos (año-mes): 432; columnas: ['AÑO', 'MES', 'CHUBUT', 'ESTADO NACIONAL', 'FORMOSA', 'JUJUY', 'LA PAMPA', 'MENDOZA', 'NEUQUEN', 'RIO NEGRO', 'SALTA', 'SANTA CRUZ', 'TIERRA DEL FUEGO', 'TOTAL PROVINCIA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1991-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- Consistencia: suma de columnas vs `TOTAL PROVINCIA` — filas con diferencia > 1%: 7
  - 1991-12: suma columnas = 2,364,555.7, `TOTAL PROVINCIA` = 1,919,991.0
  - 1994-07: suma columnas = 3,165,366.6, `TOTAL PROVINCIA` = 3,202,021.6
  - 1994-08: suma columnas = 3,218,192.4, `TOTAL PROVINCIA` = 3,260,785.4
  - 1994-09: suma columnas = 3,081,392.0, `TOTAL PROVINCIA` = 3,123,288.0
  - 1994-10: suma columnas = 3,278,038.0, `TOTAL PROVINCIA` = 3,325,850.0
  - 1994-11: suma columnas = 3,211,233.4, `TOTAL PROVINCIA` = 3,266,822.4
  - 1994-12: suma columnas = 3,379,813.6, `TOTAL PROVINCIA` = 3,439,911.6
- Meses con total = 0 *dentro* del rango con datos: 0

##### Hoja `Tabla regalías`
- Unidad en celda de la tabla dinámica: **Suma de USD**
- Nota en la hoja: _Nota: La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 10; filas de datos (año-mes): 432; columnas: ['AÑO', 'MES', 'CHUBUT', 'ESTADO NACIONAL', 'FORMOSA', 'JUJUY', 'LA PAMPA', 'MENDOZA', 'NEUQUEN', 'RIO NEGRO', 'SALTA', 'SANTA CRUZ', 'TIERRA DEL FUEGO', 'TOTAL PROVINCIA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1991-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- Consistencia: suma de columnas vs `TOTAL PROVINCIA` — filas con diferencia > 1%: 6
  - 1994-07: suma columnas = 36,141,042.6, `TOTAL PROVINCIA` = 36,585,125.6
  - 1994-08: suma columnas = 34,235,234.4, `TOTAL PROVINCIA` = 34,782,739.4
  - 1994-09: suma columnas = 31,325,396.0, `TOTAL PROVINCIA` = 31,863,743.0
  - 1994-10: suma columnas = 33,570,892.0, `TOTAL PROVINCIA` = 34,123,177.0
  - 1994-11: suma columnas = 33,651,598.4, `TOTAL PROVINCIA` = 34,319,128.4
  - 1994-12: suma columnas = 33,188,107.0, `TOTAL PROVINCIA` = 33,951,809.0
- Meses con total = 0 *dentro* del rango con datos: 0

##### Hoja `detalle de tipos de crudo`
- INFORME MENSUAL DE REGALIAS HIDROCARBURIFERAS
- Detalle de Tipos de Crudo
- TIPO DE CRUDO | CUENCA | PROVINCIA
- MAGALLANES | CUENCA AUSTRAL OFF-SHORE | SANTA CRUZ
- HIDRA (1) | CUENCA AUSTRAL OFF-SHORE | TIERRA DEL FUEGO + ESTADO NACIONAL
- SAN SEBASTIÁN | CUENCA AUSTRAL ON-SHORE | TIERRA DEL FUEGO
- MARÍA INÉS | CUENCA AUSTRAL ON-SHORE | SANTA CRUZ
- CAÑADÓN SECO | CUENCA GOLFO SAN JORGE | SANTA CRUZ
- ESCALANTE | CUENCA GOLFO SAN JORGE | CHUBUT
- MEDANITO | CUENCA NEUQUINA | LA PAMPA +  MENDOZA + NEUQUÉN + RÍO NEGRO
- MENDOZA NORTE | CUENCA CUYANA | MENDOZA
- NOROESTE | CUENCA NOROESTE | FORMOSA + JUJUY + SALTA
- (1) A partir de enero 2019, anteriormente se tomaba CUENCA AUSTRAL + PROVINCIA TIERRA DEL FUEGO

#### Regalías — GAS
- **Archivo:** `datos/raw/regalias/gas/Informe Regalias GAS.xlsx`
- **Tamaño:** 1.40 MB; formato Excel (.xlsx)
- **Hojas:** ['Tabla precios', 'Tabla producción', 'Tabla regalías']

##### Hoja `Tabla precios`
- Unidad en celda de la tabla dinámica: **Suma de ARS/Mm3**
- Nota en la hoja: _Nota: Se utiliza el tipo de cambio divisa vendedor del BNA vigente el día hábil anterior al de la liquidación (según Res. SE N° 188/93)_
- Nota en la hoja: _La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 13; filas de datos (año-mes): 408; columnas: ['AÑO', 'MES', 'CHUBUT', 'ESTADO NACIONAL', 'JUJUY', 'LA PAMPA', 'MENDOZA', 'NEUQUEN', 'RIO NEGRO', 'SALTA', 'SANTA CRUZ', 'TIERRA DEL FUEGO', 'TOTAL PROVINCIA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1993-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- (precios: no se verifica suma de columnas, no es aditivo; `TOTAL` es un promedio)
- Meses con total = 0 *dentro* del rango con datos: 0

##### Hoja `Tabla producción`
- Unidad en celda de la tabla dinámica: **Suma de Mm3**
- Nota en la hoja: _Nota: La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 11; filas de datos (año-mes): 408; columnas: ['AÑO', 'MES', 'CHUBUT', 'ESTADO NACIONAL', 'JUJUY', 'LA PAMPA', 'MENDOZA', 'NEUQUEN', 'RIO NEGRO', 'SALTA', 'SANTA CRUZ', 'TIERRA DEL FUEGO', 'TOTAL PROVINCIA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1993-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- Consistencia: suma de columnas vs `TOTAL PROVINCIA` — filas con diferencia > 1%: 0
- Meses con total = 0 *dentro* del rango con datos: 0

##### Hoja `Tabla regalías`
- Unidad en celda de la tabla dinámica: **Suma de ARS**
- Nota en la hoja: _Nota: Se utiliza el tipo de cambio divisa vendedor del BNA vigente el día hábil anterior al de la liquidación (según Res. SE N° 188/93)_
- Nota en la hoja: _La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 12; filas de datos (año-mes): 408; columnas: ['AÑO', 'MES', 'CHUBUT', 'ESTADO NACIONAL', 'JUJUY', 'LA PAMPA', 'MENDOZA', 'NEUQUEN', 'RIO NEGRO', 'SALTA', 'SANTA CRUZ', 'TIERRA DEL FUEGO', 'TOTAL PROVINCIA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1993-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- Consistencia: suma de columnas vs `TOTAL PROVINCIA` — filas con diferencia > 1%: 0
- Meses con total = 0 *dentro* del rango con datos: 0

#### Regalías — GASOLINA
- **Archivo:** `datos/raw/regalias/gasolina/Informe Regalias GASOLINA-CONDENSADO.xlsx`
- **Tamaño:** 0.62 MB; formato Excel (.xlsx)
- **Hojas:** ['Tabla precios', 'Tabla producción', 'Tabla regalías']

##### Hoja `Tabla precios`
- Unidad en celda de la tabla dinámica: **Suma de USD/m3**
- Nota en la hoja: _Nota: La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 12; filas de datos (año-mes): 336; columnas: ['AÑO', 'MES', 'CHUBUT', 'ESTADO NACIONAL', 'MENDOZA', 'NEUQUEN', 'RIO NEGRO', 'SALTA', 'SANTA CRUZ', 'TIERRA DEL FUEGO', 'TOTAL PROVINCIA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1999-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- (precios: no se verifica suma de columnas, no es aditivo; `TOTAL` es un promedio)
- Meses con total = 0 *dentro* del rango con datos: 0

##### Hoja `Tabla producción`
- Unidad en celda de la tabla dinámica: **Suma de m3**
- Nota en la hoja: _Nota: La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 11; filas de datos (año-mes): 336; columnas: ['AÑO', 'MES', 'CHUBUT', 'ESTADO NACIONAL', 'MENDOZA', 'NEUQUEN', 'RIO NEGRO', 'SALTA', 'SANTA CRUZ', 'TIERRA DEL FUEGO', 'TOTAL PROVINCIA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1999-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- Consistencia: suma de columnas vs `TOTAL PROVINCIA` — filas con diferencia > 1%: 0
- Meses con total = 0 *dentro* del rango con datos: 0

##### Hoja `Tabla regalías`
- Unidad en celda de la tabla dinámica: **Suma de USD**
- Nota en la hoja: _Nota: La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 11; filas de datos (año-mes): 336; columnas: ['AÑO', 'MES', 'CHUBUT', 'ESTADO NACIONAL', 'MENDOZA', 'NEUQUEN', 'RIO NEGRO', 'SALTA', 'SANTA CRUZ', 'TIERRA DEL FUEGO', 'TOTAL PROVINCIA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1999-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- Consistencia: suma de columnas vs `TOTAL PROVINCIA` — filas con diferencia > 1%: 8
  - 2026-01: suma columnas = 8,510,987.1, `TOTAL PROVINCIA` = 8,643,741.5
  - 2026-02: suma columnas = 7,979,396.6, `TOTAL PROVINCIA` = 8,187,633.0
  - 2026-03: suma columnas = 11,090,921.4, `TOTAL PROVINCIA` = 11,335,192.7
  - 2026-04: suma columnas = 13,488,497.8, `TOTAL PROVINCIA` = 13,702,862.7
  - 2026-05: suma columnas = 13,610,475.9, `TOTAL PROVINCIA` = 13,933,610.9
  - 2026-06: suma columnas = 11,500,028.5, `TOTAL PROVINCIA` = 11,867,211.1
  - 2026-07: suma columnas = 12,501,935.2, `TOTAL PROVINCIA` = 12,725,128.8
  - 2026-08: suma columnas = 6,506,477.4, `TOTAL PROVINCIA` = 6,915,376.6
- Meses con total = 0 *dentro* del rango con datos: 0

#### Regalías — GLP
- **Archivo:** `datos/raw/regalias/glp/Informe Regalias GLP.xlsx`
- **Tamaño:** 0.71 MB; formato Excel (.xlsx)
- **Hojas:** ['Tabla precios', 'Tabla producción', 'Tabla regalias']

##### Hoja `Tabla precios`
- Unidad en celda de la tabla dinámica: **Suma de ARS/Mm3**
- Nota en la hoja: _Nota: Se utiliza el tipo de cambio divisa vendedor del BNA vigente el día hábil anterior al de la liquidación (según Res. SE N° 188/93)_
- Nota en la hoja: _La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 13; filas de datos (año-mes): 336; columnas: ['AÑO', 'MES', 'ESTADO NACIONAL', 'MENDOZA', 'NEUQUEN', 'RIO NEGRO', 'SALTA', 'SANTA CRUZ', 'TIERRA DEL FUEGO', 'TOTAL PROVINCIA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1999-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- (precios: no se verifica suma de columnas, no es aditivo; `TOTAL` es un promedio)
- Meses con total = 0 *dentro* del rango con datos: 0

##### Hoja `Tabla producción`
- Unidad en celda de la tabla dinámica: **Suma de Mm3**
- Nota en la hoja: _Nota: La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 11; filas de datos (año-mes): 336; columnas: ['AÑO', 'MES', 'ESTADO NACIONAL', 'MENDOZA', 'NEUQUEN', 'RIO NEGRO', 'SALTA', 'SANTA CRUZ', 'TIERRA DEL FUEGO', 'TOTAL PROVINCIA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1999-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- Consistencia: suma de columnas vs `TOTAL PROVINCIA` — filas con diferencia > 1%: 0
- Meses con total = 0 *dentro* del rango con datos: 0

##### Hoja `Tabla regalias`
- Unidad en celda de la tabla dinámica: **Suma de ARS**
- Nota en la hoja: _Nota: Se utiliza el tipo de cambio divisa vendedor del BNA vigente el día hábil anterior al de la liquidación (según Res. SE N° 188/93)_
- Nota en la hoja: _La información correspondiente a los últimos dos períodos es provisoria_
- Fila de encabezado: 12; filas de datos (año-mes): 336; columnas: ['AÑO', 'MES', 'CUENCA AUSTRAL OFF-SHORE', 'CUENCA AUSTRAL ON-SHORE', 'CUENCA CUYANA', 'CUENCA NEUQUINA', 'CUENCA NOROESTE', 'TOTAL CUENCA']
- Valores no numéricos en columnas de datos: 0; vacíos: 0
- Valores negativos: 0
- Primer período con total > 0: **1999-01**; último período con total > 0: **2026-08**
- Último período listado en la hoja: 2026-12 (los meses posteriores al último con datos vienen en 0)
- **Últimos dos períodos con datos (los marcados como provisorios):** 2026-07, 2026-08
- Consistencia: suma de columnas vs `TOTAL CUENCA` — filas con diferencia > 1%: 0
- Meses con total = 0 *dentro* del rango con datos: 0

### PARTE E — Reservas (Excel)

#### Reservas al 31/12/2025
- **Archivo:** `datos/raw/reservas/reservas al 31-12-2025.xlsx`
- **Tamaño:** 0.29 MB; formato Excel (.xlsx)
- **Hojas:** ['fin de concesión', 'fin de vida util']

##### Hoja `fin de concesión` — «RESERVAS Y RECURSOS  AL 31/12/2025 - HASTA EL FIN DE LA CONCESIÓN»
- Filas de datos: 1170 (más 1 fila 'TOTAL' al final de la hoja, que se excluye de los cálculos para no duplicar); columnas: 29
- Suma de filas vs fila TOTAL: columnas con diferencia > 1: 0 de 24
- Unidades (fila 7 de la hoja): petróleo `(Mm3)`, gas `(MMm3)`
- Estructura de columnas numéricas (bloque|tipo|categoría|PET/GAS): CONVENCIONAL|RESERVAS|COMPROBADAS|PET; CONVENCIONAL|RESERVAS|COMPROBADAS|GAS; CONVENCIONAL|RESERVAS|PROBABLES|PET; CONVENCIONAL|RESERVAS|PROBABLES|GAS; CONVENCIONAL|RESERVAS|POSIBLES|PET; CONVENCIONAL|RESERVAS|POSIBLES|GAS ...
- Columnas de texto: ['OPERADOR', 'CUENCA', 'PROVINCIA', 'CONCESIÓN O PERMISO', 'YACIMIENTO']
- Valores no numéricos: 0; vacíos: 0; negativos: 2
- Filas de texto vacías (operador/yacimiento): 0
- `OPERADOR`: 53 valores distintos; ej. ['PETROQUIMICA COMODORO RIVADAVIA S.A.', 'Petrolera Aconcagua Energia S.A.', 'PAN AMERICAN ENERGY SL']
- `CUENCA`: 7 valores distintos; ej. ['NEUQUINA', 'NOROESTE', 'AUSTRAL']
- `PROVINCIA`: 11 valores distintos; ej. ['La Pampa', 'Rio Negro', 'Salta']
- `CONCESIÓN O PERMISO`: 311 valores distintos; ej. ['25 DE MAYO - MEDANITO SUD ESTE LP', '25 DE MAYO - MEDANITO SUD ESTE RN', 'ACAMBUCO']
- `YACIMIENTO`: 1031 valores distintos; ej. ['25 DE MAYO - MEDANITO SUDESTE LP', '25 DE MAYO - MEDANITO SUDESTE RN', 'AGUARAY']
  - `OPERADOR`: espacios sobrantes en 14 filas; 0 grupos con variantes de escritura
  - `CUENCA`: espacios sobrantes en 0 filas; 0 grupos con variantes de escritura
  - `PROVINCIA`: espacios sobrantes en 0 filas; 0 grupos con variantes de escritura
  - `CONCESIÓN O PERMISO`: espacios sobrantes en 23 filas; 0 grupos con variantes de escritura
  - `YACIMIENTO`: espacios sobrantes en 6 filas; 2 grupos con variantes de escritura ej. [['CAÑADA DURA ', 'CAÑADA DURA'], ['RANQUIL CO', 'RANQUIL CO                           ']]
- Filas con clave (operador, cuenca, provincia, concesión, yacimiento) repetida: 0
- Columnas numéricas completas: ['CONVENCIONAL|RESERVAS|COMPROBADAS|PET', 'CONVENCIONAL|RESERVAS|COMPROBADAS|GAS', 'CONVENCIONAL|RESERVAS|PROBABLES|PET', 'CONVENCIONAL|RESERVAS|PROBABLES|GAS', 'CONVENCIONAL|RESERVAS|POSIBLES|PET', 'CONVENCIONAL|RESERVAS|POSIBLES|GAS', 'CONVENCIONAL|RECURSOS CONTINGENTES|None|PET', 'CONVENCIONAL|RECURSOS CONTINGENTES|None|GAS', 'NO CONVENCIONAL|RESERVAS|COMPROBADAS|PET', 'NO CONVENCIONAL|RESERVAS|COMPROBADAS|GAS', 'NO CONVENCIONAL|RESERVAS|PROBABLES|PET', 'NO CONVENCIONAL|RESERVAS|PROBABLES|GAS', 'NO CONVENCIONAL|RESERVAS|POSIBLES|PET', 'NO CONVENCIONAL|RESERVAS|POSIBLES|GAS', 'NO CONVENCIONAL|RECURSOS CONTINGENTES|None|PET', 'NO CONVENCIONAL|RECURSOS CONTINGENTES|None|GAS', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|COMPROBADAS|PET', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|COMPROBADAS|GAS', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|PROBABLES|PET', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|PROBABLES|GAS', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|POSIBLES|PET', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|POSIBLES|GAS', 'CONVENCIONAL + NO CONVENCIONAL|RECURSOS CONTINGENTES|None|PET', 'CONVENCIONAL + NO CONVENCIONAL|RECURSOS CONTINGENTES|None|GAS']
  - ⚠️ valor negativo: CERRO DRAGON / BAYO (PAN AMERICAN ENERGY SL), columna `CONVENCIONAL|RESERVAS|POSIBLES|GAS` = -0.01
  - ⚠️ valor negativo: CERRO DRAGON / BAYO (PAN AMERICAN ENERGY SL), columna `CONVENCIONAL + NO CONVENCIONAL|RESERVAS|POSIBLES|GAS` = -0.01
- Coherencia convencional + no convencional = total (celdas con diferencia > 0.5): 2
- Suma NO CONVENCIONAL reservas COMPROBADAS por cuenca (PET en Mm3, GAS en MMm3):
| CUENCA | NO CONVENCIONAL|RESERVAS|COMPROBADAS|PET | NO CONVENCIONAL|RESERVAS|COMPROBADAS|GAS |
|---|---|---|
| AUSTRAL | 523.8 | 5201.1 |
| CUYANA | 0.0 | 0.0 |
| GOLFO SAN JORGE | 0.0 | 70.4 |
| NEUQUINA | 407171.5 | 446845.3 |
| NORESTE | 0.0 | 0.0 |
| NOROESTE | 0.0 | 0.0 |
| ÑIRIHUAU | 0.0 | 0.0 |
- Filas con NO CONVENCIONAL comprobadas PET > 0: 67; provincias: {'Neuquén': 54, 'Rio Negro': 7, 'Santa Cruz': 5, 'Mendoza': 1}
- Mayores yacimientos NC por reserva comprobada de petróleo:
| OPERADOR | CUENCA | PROVINCIA | CONCESIÓN O PERMISO | YACIMIENTO | nc_pet | nc_gas |
|---|---|---|---|---|---|---|
| YPF S.A. | NEUQUINA | Neuquén | LA AMARGA CHICA | LA AMARGA CHICA | 53745.0 | 5186.0 |
| YPF S.A. | NEUQUINA | Neuquén | BANDURRIA SUR | BANDURRIA SUR | 50074.0 | 9279.0 |
| YPF S.A. | NEUQUINA | Neuquén | LOMA CAMPANA | LOMA CAMPANA-LLL | 49926.0 | 9120.0 |
| VISTA ENERGY ARGENTINA SAU | NEUQUINA | Neuquén | BAJADA DEL PALO OESTE | BAJADA DEL PALO OESTE | 37800.988 | 5641.515 |
| PAN AMERICAN ENERGY SL | NEUQUINA | Neuquén | COIRON AMARGO SUR ESTE | COIRON AMARGO SUR ESTE | 24115.0 | 1180.0 |
| PLUSPETROL CUENCA NEUQUINA S.R.L. | NEUQUINA | Neuquén | BAJO DEL CHOIQUE - LA INVERNADA | BAJO DEL CHOIQUE | 21523.149999999998 | 7559.5 |
| PLUSPETROL S.A. | NEUQUINA | Neuquén | LA CALERA | LA CALERA | 18505.9699256283 | 49978.643926871 |
| YPF S.A. | NEUQUINA | Neuquén | LA ANGOSTURA SUR I | LA ANGOSTURA SUR I | 17429.0 | 5505.0 |

##### Hoja `fin de vida util` — «RESERVAS Y RECURSOS  AL 31/12/2025 - HASTA EL FIN DE LA VIDA ÚTIL»
- Filas de datos: 1170 (más 1 fila 'TOTAL' al final de la hoja, que se excluye de los cálculos para no duplicar); columnas: 29
- Suma de filas vs fila TOTAL: columnas con diferencia > 1: 0 de 24
- Unidades (fila 7 de la hoja): petróleo `(Mm3)`, gas `(MMm3)`
- Estructura de columnas numéricas (bloque|tipo|categoría|PET/GAS): CONVENCIONAL|RESERVAS|COMPROBADAS|PET; CONVENCIONAL|RESERVAS|COMPROBADAS|GAS; CONVENCIONAL|RESERVAS|PROBABLES|PET; CONVENCIONAL|RESERVAS|PROBABLES|GAS; CONVENCIONAL|RESERVAS|POSIBLES|PET; CONVENCIONAL|RESERVAS|POSIBLES|GAS ...
- Columnas de texto: ['OPERADOR', 'CUENCA', 'PROVINCIA', 'CONCESIÓN O PERMISO', 'YACIMIENTO']
- Valores no numéricos: 0; vacíos: 0; negativos: 2
- Filas de texto vacías (operador/yacimiento): 0
- `OPERADOR`: 53 valores distintos; ej. ['PETROQUIMICA COMODORO RIVADAVIA S.A.', 'Petrolera Aconcagua Energia S.A.', 'PAN AMERICAN ENERGY SL']
- `CUENCA`: 7 valores distintos; ej. ['NEUQUINA', 'NOROESTE', 'AUSTRAL']
- `PROVINCIA`: 11 valores distintos; ej. ['La Pampa', 'Rio Negro', 'Salta']
- `CONCESIÓN O PERMISO`: 311 valores distintos; ej. ['25 DE MAYO - MEDANITO SUD ESTE LP', '25 DE MAYO - MEDANITO SUD ESTE RN', 'ACAMBUCO']
- `YACIMIENTO`: 1031 valores distintos; ej. ['25 DE MAYO - MEDANITO SUDESTE LP', '25 DE MAYO - MEDANITO SUDESTE RN', 'AGUARAY']
  - `OPERADOR`: espacios sobrantes en 14 filas; 0 grupos con variantes de escritura
  - `CUENCA`: espacios sobrantes en 0 filas; 0 grupos con variantes de escritura
  - `PROVINCIA`: espacios sobrantes en 0 filas; 0 grupos con variantes de escritura
  - `CONCESIÓN O PERMISO`: espacios sobrantes en 23 filas; 0 grupos con variantes de escritura
  - `YACIMIENTO`: espacios sobrantes en 6 filas; 2 grupos con variantes de escritura ej. [['CAÑADA DURA ', 'CAÑADA DURA'], ['RANQUIL CO', 'RANQUIL CO                           ']]
- Filas con clave (operador, cuenca, provincia, concesión, yacimiento) repetida: 0
- Columnas numéricas completas: ['CONVENCIONAL|RESERVAS|COMPROBADAS|PET', 'CONVENCIONAL|RESERVAS|COMPROBADAS|GAS', 'CONVENCIONAL|RESERVAS|PROBABLES|PET', 'CONVENCIONAL|RESERVAS|PROBABLES|GAS', 'CONVENCIONAL|RESERVAS|POSIBLES|PET', 'CONVENCIONAL|RESERVAS|POSIBLES|GAS', 'CONVENCIONAL|RECURSOS CONTINGENTES|None|PET', 'CONVENCIONAL|RECURSOS CONTINGENTES|None|GAS', 'NO CONVENCIONAL|RESERVAS|COMPROBADAS|PET', 'NO CONVENCIONAL|RESERVAS|COMPROBADAS|GAS', 'NO CONVENCIONAL|RESERVAS|PROBABLES|PET', 'NO CONVENCIONAL|RESERVAS|PROBABLES|GAS', 'NO CONVENCIONAL|RESERVAS|POSIBLES|PET', 'NO CONVENCIONAL|RESERVAS|POSIBLES|GAS', 'NO CONVENCIONAL|RECURSOS CONTINGENTES|None|PET', 'NO CONVENCIONAL|RECURSOS CONTINGENTES|None|GAS', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|COMPROBADAS|PET', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|COMPROBADAS|GAS', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|PROBABLES|PET', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|PROBABLES|GAS', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|POSIBLES|PET', 'CONVENCIONAL + NO CONVENCIONAL|RESERVAS|POSIBLES|GAS', 'CONVENCIONAL + NO CONVENCIONAL|RECURSOS CONTINGENTES|None|PET', 'CONVENCIONAL + NO CONVENCIONAL|RECURSOS CONTINGENTES|None|GAS']
  - ⚠️ valor negativo: CERRO DRAGON / BAYO (PAN AMERICAN ENERGY SL), columna `CONVENCIONAL|RESERVAS|POSIBLES|GAS` = -0.02
  - ⚠️ valor negativo: CERRO DRAGON / BAYO (PAN AMERICAN ENERGY SL), columna `CONVENCIONAL + NO CONVENCIONAL|RESERVAS|POSIBLES|GAS` = -0.02
- Coherencia convencional + no convencional = total (celdas con diferencia > 0.5): 2
- Suma NO CONVENCIONAL reservas COMPROBADAS por cuenca (PET en Mm3, GAS en MMm3):
| CUENCA | NO CONVENCIONAL|RESERVAS|COMPROBADAS|PET | NO CONVENCIONAL|RESERVAS|COMPROBADAS|GAS |
|---|---|---|
| AUSTRAL | 535.3 | 5282.1 |
| CUYANA | 0.0 | 0.0 |
| GOLFO SAN JORGE | 0.0 | 70.4 |
| NEUQUINA | 414491.8 | 456772.9 |
| NORESTE | 0.0 | 0.0 |
| NOROESTE | 0.0 | 0.0 |
| ÑIRIHUAU | 0.0 | 0.0 |
- Filas con NO CONVENCIONAL comprobadas PET > 0: 67; provincias: {'Neuquén': 54, 'Rio Negro': 7, 'Santa Cruz': 5, 'Mendoza': 1}
- Mayores yacimientos NC por reserva comprobada de petróleo:
| OPERADOR | CUENCA | PROVINCIA | CONCESIÓN O PERMISO | YACIMIENTO | nc_pet | nc_gas |
|---|---|---|---|---|---|---|
| YPF S.A. | NEUQUINA | Neuquén | LA AMARGA CHICA | LA AMARGA CHICA | 55710.0 | 5375.0 |
| YPF S.A. | NEUQUINA | Neuquén | BANDURRIA SUR | BANDURRIA SUR | 51674.0 | 9582.0 |
| YPF S.A. | NEUQUINA | Neuquén | LOMA CAMPANA | LOMA CAMPANA-LLL | 50888.0 | 9292.0 |
| VISTA ENERGY ARGENTINA SAU | NEUQUINA | Neuquén | BAJADA DEL PALO OESTE | BAJADA DEL PALO OESTE | 37993.822 | 5675.974999999999 |
| PAN AMERICAN ENERGY SL | NEUQUINA | Neuquén | COIRON AMARGO SUR ESTE | COIRON AMARGO SUR ESTE | 24940.0 | 1217.0 |
| PLUSPETROL CUENCA NEUQUINA S.R.L. | NEUQUINA | Neuquén | BAJO DEL CHOIQUE - LA INVERNADA | BAJO DEL CHOIQUE | 21530.0 | 7562.0 |
| PLUSPETROL S.A. | NEUQUINA | Neuquén | LA CALERA | LA CALERA | 18505.9699256283 | 49978.643926871 |
| YPF S.A. | NEUQUINA | Neuquén | LA ANGOSTURA SUR I | LA ANGOSTURA SUR I | 17429.0 | 5505.0 |

- Comparación hojas (mismas filas): 1170 filas emparejadas por clave; CONV comprobadas PET: filas donde vida útil > concesión: 127, menor: 4, igual: 1039
- Total CONV+NC comprobadas PET — fin de concesión: 601,383 Mm3 | fin de vida útil: 624,718 Mm3


---

## 3. Verificaciones específicas del proyecto

Las tablas completas de evidencia están en `docs/auditoria_detalle.md` (sección "Evidencia para las verificaciones específicas" y "Hallazgos adicionales"). Abreviaturas: **nc** = CSV de producción no convencional; **yac** = producción por yacimiento y formación; **padrón** = padrón de pozos; **shp** = shapefile de pozos.

### 3.1 Capítulo IV

**¿Cómo se identifica Vaca Muerta? ¿Hay columna de formación y/o de tipo de recurso?**
Sí, en nc, yac, shp y fractura. No hay una columna "es Vaca Muerta": se identifica por el **nombre de la formación**.

| Archivo | Columna(s) | Cómo aparece Vaca Muerta |
|---|---|---|
| nc | `formacion` y `formprod` (sigla) | `formacion = 'vaca muerta'` ↔ `formprod = 'VMUT'`: 219.848 filas, correspondencia 1 a 1 |
| yac | `formacion` | `'vaca muerta'`: 24.383 filas, **3.051 de ellas marcadas CONVENCIONAL** y 21.332 NO CONVENCIONAL (ver 5.1) |
| shp | `FORMACION` | `'vaca muerta'`: 3.660 pozos (nc solo tiene 3.417; ver 5.1) |
| fractura | `formacion_productiva` | `'vaca muerta'`: 3.033 filas |

Columnas de tipo de recurso: nc `tipo_de_recurso` (único valor: `NO CONVENCIONAL`, porque el archivo ya viene filtrado) y `sub_tipo_recurso`; yac `tipo_de_recurso`; shp `TIPO_RECUR` y `SUB_TIPO_R`; fractura `tipo_reservorio` y `subtipo_reservorio`.

Valores distintos (completos en el detalle):
- **nc `formacion` (29)**: vaca muerta (219.848), lajas (77.996), mulichinco (35.008), los molles (28.227), magallanes (15.806), precuyo (14.684), quintuco (11.038), punta rosada (9.691), agrio (5.747), basamento, lotena, formación improductiva, tordillo, sierras blancas, centenario, chachao, pozo d-129, ANITA, palermo aike, rayoso, yacoraite, springhill, grupo chubut, loma montosa, mina el carmen, cañadon seco, grupo neuquén, bajo barreal, tobífera.
- **nc `tipo_de_recurso`**: `NO CONVENCIONAL` (426.145).
- **nc `sub_tipo_recurso`**: SHALE (227.598), TIGHT (198.091), vacío (456). Los pozos de Vaca Muerta son 3.412 SHALE, 3 TIGHT y 2 sin dato.
- **yac `tipo_de_recurso`**: CONVENCIONAL (444.328), NO CONVENCIONAL (52.321), SIN RESERVORIO (108), NO DISCRIMINADO (38).
- **shp `TIPO_RECUR` de los pozos VM**: NO CONVENCIONAL 3.417, CONVENCIONAL 226, No informado 13, SIN RESERVORIO 3, NO DISCRIMINADO 1.
- Vaca Muerta en nc es **100% cuenca Neuquina**: Neuquén 3.393 pozos, Mendoza 15, Río Negro 9.

**¿En qué unidades vienen el petróleo y el gas?**
Los CSV **no traen metadatos de unidades**. Lo que sigue es **inferido** (y comprobado con identidades exactas contra la serie histórica):
- `prod_pet` (nc) y `suma_prod_pet` (yac): **m³ por mes**. Evidencia: la suma mensual de nc coincide al decimal con `shale + tight` de la serie de petróleo (2024-01: 1.730.193,7), y `kbbl_diario` de la serie = `total × 6,2898 / días / 1000` (679,68 ✓), o sea que `total` está en m³.
- `prod_gas` (nc) y `suma_prod_gas` (yac): **Mm³ (miles de m³) por mes**. Evidencia: suma de nc 2024-01 = 2.305.711,7 = `shale_gas + tight_gas` de la serie; `produccion_gas_natural_total_diario` = total ÷ 31 ÷ 1000 (123,8 millones de m³/día), o sea que el total está en miles de m³.
- ❓ Confirmar con el diccionario de datos del portal de origen antes de publicar números absolutos. Ojo: reservas vienen en Mm³ (petróleo) y MMm³ (gas), **no** en las mismas unidades que la producción (ver 3.3).

**¿Hay columna de agua producida?** Sí. nc: `prod_agua` (0 nulos, 0 negativos, máx 34.792,95; 127.774 filas en cero = 30%); yac: `suma_prod_agua`. También hay `iny_agua` (agua inyectada; en nc es 0 en 425.504 de 426.145 filas). ❓ **La unidad del agua no está declarada** (probablemente m³ por mes, pero no se puede comprobar con los datos).

**¿Cuántos pozos únicos de Vaca Muerta hay? ¿Desde qué año?**
- **3.417 pozos únicos** con `formacion = 'vaca muerta'` en nc (clave `idpozo`; ningún pozo mezcla VM con otra formación).
- Registros desde **2006-01** hasta **2026-08**. ⚠️ Pero 2006 es engañoso: en el padrón, 63.439 de 86.197 pozos tienen primera producción en **2006-01**, o sea que la serie está **cortada en 2006** (los pozos anteriores figuran como "2006-01"). Por eso hay 101 pozos VM "de 2006". El desarrollo real arranca más tarde. Pozos VM por año de primera producción (padrón, 3.338 de los 3.417; los otros 79 no están en el padrón):

| 2006* | 2007 | 2008 | 2010 | 2011 | 2012 | 2013 | 2014 | 2015 | 2016 | 2017 |
|---|---|---|---|---|---|---|---|---|---|---|
| 101 | 2 | 4 | 7 | 6 | 22 | 68 | 190 | 175 | 111 | 100 |

| 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 (hasta jul) |
|---|---|---|---|---|---|---|---|---|
| 196 | 195 | 82 | 275 | 305 | 345 | 395 | 483 | 276 |

(*2006 = "2006 o antes".) Pozos VM con producción en el año (nc): 2012 → 82; 2015 → 571; 2020 → 1.250; 2025 → 3.052; 2026 → 3.404.

**¿Qué columna une producción con coordenadas? ¿Cuántos pozos de producción no tienen coordenadas (y al revés)?**
- Clave: **`idpozo`** (nc, padrón, fractura) ↔ **`IDENTIFICA`** (shp). ❓ El nombre `IDENTIFICA` no es explícito: lo tomo como el id del pozo porque los valores coinciden (**5.126 de 5.126** pozos de nc y 3.417 de 3.417 VM están en el shp; `IDENTIFICA` es único: 85.797 ids sin repetidos).
- nc además trae sus propias coordenadas: `coordenadax` (longitud) y `coordenaday` (latitud), sin nulos ni ceros, una sola posición por pozo, e **idénticas** a la geometría del shp en los 5.126 pozos.
- **Pozos de producción sin coordenadas: 0** (ni en el total ni en VM).
- **Al revés** (pozos del shp sin producción en nc): 80.671 de 85.797. No es un error: el shp tiene todos los pozos del país (convencionales, inyectores, exploratorios…) y nc solo tiene los no convencionales; no existe producción por pozo de los convencionales (yac está agregado).
- ⚠️ Ejes invertidos (lat/long cambiadas): 1 pozo de nc (`idpozo` 162058, `PBE.Nq.M-1063(d)`, Neuquén, x = -38,59 / y = -69,42) y 2 puntos del shp (1 Neuquén, 1 Río Negro). Ninguno es de Vaca Muerta.
- Los 3.417 pozos VM caen dentro del polígono `NEUQUINA` de las cuencas (de los 5.126 NC, 228 caen fuera; ninguno VM).

**¿Hay columna de empresa operadora y de tipo (petróleo/gas)?** Sí, en nc:
- Empresa: `empresa` (nombre completo, 55 valores) e `idempresa` (sigla, ej. YPF). Para VM, por pozo en su último mes: YPF S.A. 1.876, Vista 275, Tecpetrol 250, Pan American 217, Shell 187, Pluspetrol 125, Total Austral 109, Pampa 104… ⚠️ 296 de los 3.417 pozos VM **cambian de empresa** a lo largo del tiempo.
- Tipo: `tipopozo`: Petrolífero, Gasífero, Otro tipo, Sumidero, Inyección de Agua/Gas, Acuífero (0,15% vacíos). VM por pozo (valor modal no calculado; conteo de pozos que alguna vez figuraron así): Petrolífero 2.579, Gasífero 871, Otro tipo 505, vacío 143. ⚠️ **523 pozos VM cambian de `tipopozo`** entre meses. Además existe `proyecto` (`GAS PLUS` / `Sin Proyecto`).
- shp: `EMPRESA`, `TIPO_POZO`. yac: `empresa`, pero no tiene `idpozo` ni tipo de pozo.

### 3.2 Fractura (Adjunto IV)

- **¿Trae agua y arena por pozo? ¿Unidades?** Sí: `agua_inyectada_m3` (**m³**), `arena_bombeada_nacional_tn` y `arena_bombeada_importada_tn` (**toneladas**), `co2_inyectado_m3` (m³; casi todo 0). Las unidades están en el nombre de la columna. ⚠️ La granularidad es **un registro de fractura, no un pozo**: 4.922 filas para 4.678 pozos (183 pozos tienen entre 2 y 6 filas), así que hay que sumar por `idpozo`. Otras columnas útiles: `longitud_rama_horizontal_m`, `cantidad_fracturas` (❓ no dice si son etapas), `tipo_terminacion`, `presion_maxima_psi`, `potencia_equipos_fractura_hp`.
- **¿Se une con Capítulo IV? ¿Por qué columna? ¿Cuántos pozos coinciden?** Sí, por **`idpozo`** (mismo nombre y tipo que en nc y padrón). De 4.678 pozos con fractura: **3.881 están en nc**, 4.646 en el padrón y 4.678 (todos) en el shp. De los **3.417 pozos VM, 3.017 (88%) tienen fractura** y 400 no. Los 797 pozos con fractura que no están en nc son sobre todo convencionales (766).
- **¿Desde qué año?** `fecha_inicio_fractura` mínima **2006-05-19** (1 registro en 2006 y 5 en 2009, probablemente casos aislados); cobertura sistemática desde **2010** (128 registros) y, para pozos VM, desde **2011** (1 pozo) / **2012** (22 pozos). Último año 2026 (parcial). Los datos se cargaron al sistema desde 2019-06 (`fecha_data` mínima), con actualización hasta 2026-10-02.
- Agua inyectada en fractura de pozos VM (m³): 2013 → 0,56 M; 2018 → 7,98 M; 2021 → 14,49 M; 2023 → 20,70 M; 2025 → 33,38 M (432 pozos); 2026 parcial → 17,00 M (217 pozos).

### 3.3 Regalías (petróleo, gas, GLP, gasolina y condensado)

Cada Excel tiene tres hojas en formato tabla dinámica ("Tabla precios", "Tabla producción", "Tabla regalías"; la de crudo suma "detalle de tipos de crudo"), con encabezados desplazados (cada hoja arranca el encabezado en una fila distinta, 10 a 13) y el año anotado **solo en la primera fila de cada año**.

- **¿Qué tan desagregadas?** Solo **mes × provincia** (`AÑO`, `MES` y una columna por provincia + `TOTAL PROVINCIA`). **No hay empresa, ni área/concesión, ni yacimiento.** Excepciones: la hoja "Tabla regalias" de **GLP** está por **cuenca** (`CUENCA NEUQUINA`, `CUENCA CUYANA`, …, `TOTAL CUENCA`), mientras que producción y precios de GLP vienen por provincia; y crudo/gas/gasolina incluyen la columna `ESTADO NACIONAL` (offshore).
- **¿Se puede aislar la producción no convencional o Vaca Muerta?** **NO.** No hay columna de formación ni de tipo de recurso. Lo máximo es la provincia **Neuquén** (`NEUQUEN`) como aproximación, que mezcla convencional y no convencional (en 2025 Neuquén fue 62% de las regalías de crudo, 68% de gas y 70% de gasolina). La hoja "detalle de tipos de crudo" asigna `MEDANITO` a Cuenca Neuquina (La Pampa + Mendoza + Neuquén + Río Negro), lo cual tampoco separa VM.
- **¿Moneda? ¿Precios?**

| Producto | Regalías | Precios | Producción |
|---|---|---|---|
| Crudo | **USD** (`Suma de USD`) | **USD/m³** | m³ |
| Gas | **ARS** (`Suma de ARS`) | **ARS/Mm³** | Mm³ |
| Gasolina/condensado | **USD** | **USD/m³** | m³ |
| GLP | **ARS** | **ARS/Mm³** | "Mm³" ❓ |

  **Las monedas están mezcladas entre productos** y no hay serie de tipo de cambio en los archivos (la nota de gas y GLP dice que se usa el "tipo de cambio divisa vendedor del BNA del día hábil anterior a la liquidación", Res. SE 188/93; no se informa el valor). ❓ No dice si los pesos son corrientes o constantes; por contexto (gas a ARS 35,8/Mm³ en 1993, paridad 1:1) son **nominales/corrientes sin deflactar**, pero no está declarado. Sí traen precios (hoja "Tabla precios"), por provincia; el `TOTAL` de precios es un promedio, no una suma.
- **Dos últimos períodos (provisorios):** en los 4 archivos, **2026-07 y 2026-08** (la nota de cada hoja: "La información correspondiente a los últimos dos períodos es provisoria"). ⚠️ Las hojas siguen listando meses hasta 2026-12 con ceros: son relleno, no producción cero. Fecha de realización del informe: 2026-10-06; próxima actualización: 2026-11-06.
- **Peso de GLP y gasolina/condensado (2025):**
  - En USD: gasolina/condensado USD 93,3 M vs crudo USD 1.875,2 M → **4,7%** de crudo + gasolina.
  - En ARS: GLP ARS 7.508 M vs gas ARS 797.539 M → **0,9%** de gas + GLP.
  - **No se puede dar un % sobre "el total" sin tipo de cambio** (USD y ARS no se suman). Decisión pendiente: ver 5.3.
  - ❓ Unidad de GLP: producción 2025 = 408.231 "Mm³". Si Mm³ fueran miles de m³ serían 408 millones de m³ de GLP, cifra imposible frente a 2 millones de m³ de gasolina y 40 millones de m³ de crudo. La etiqueta de unidad de GLP parece **errónea** (¿m³? ¿toneladas?). No se debería publicar volumen de GLP sin confirmarla.
  - Volumen 2025: crudo 39,9 M m³; gas 44.587.136 Mm³ (≈ 44,6 mil millones de m³, razonable); gasolina 2,06 M m³.

### 3.4 Reservas al 31/12/2025

- **¿"Hasta fin de la vida útil" vs "hasta fin de la concesión"?** **Sí, los distingue**: son **dos hojas** (`fin de concesión` y `fin de vida util`), con idéntica estructura y las mismas 1.170 filas. Vida útil ≥ concesión en general (reservas comprobadas de petróleo conv+NC: 601.383 Mm³ a fin de concesión vs 624.718 Mm³ a fin de vida útil); ❓ en 4 filas la de vida útil es menor que la de concesión, sin explicación.
- **¿Categorías? ¿Unidades?** Para **petróleo (PET)** y **gas (GAS)**: **COMPROBADAS, PROBABLES y POSIBLES** (bajo "RESERVAS") y **RECURSOS CONTINGENTES** (una sola columna, sin subcategorías). Tres bloques: CONVENCIONAL, NO CONVENCIONAL y CONVENCIONAL + NO CONVENCIONAL → 24 columnas numéricas. Unidades (fila 7 del Excel): **petróleo en Mm³** (miles de m³), **gas en MMm³** (millones de m³). Para compararlas con la producción hay que dividir producción de petróleo (m³) por 1.000 y producción de gas (Mm³) por 1.000.
- **¿Se puede filtrar Vaca Muerta o no convencional? ¿Por qué columna?** **No convencional: sí**, mediante los **encabezados de columnas** (bloque `NO CONVENCIONAL`, no hay una columna de filtro por fila). **Vaca Muerta: NO.** Las filas son yacimientos (`OPERADOR`, `CUENCA`, `PROVINCIA`, `CONCESIÓN O PERMISO`, `YACIMIENTO`) y no hay formación ni distinción shale/tight. Se puede aproximar VM como "no convencional en cuenca Neuquina": comprobadas NC Neuquina = 407.171 Mm³ de petróleo y 446.845 MMm³ de gas (de un total NC de 407.695 y 452.117), pero eso incluye tight de otras formaciones (❓ cuánto, no se puede saber). Solo 67 yacimientos tienen reservas NC comprobadas de petróleo > 0 (54 en Neuquén, 7 Río Negro, 5 Santa Cruz, 1 Mendoza).
- Totales NC comprobadas — fin de concesión: 407.695 Mm³ pet / 452.117 MMm³ gas; fin de vida útil: 415.027 / 462.125. Probables NC: 276.493 / 163.629 (concesión); posibles: 210.635 / 137.267; recursos contingentes: 1.147.497 / 1.990.568.
- Cruce con producción por texto (no hay IDs): de 67 yacimientos NC con reservas, 57 coinciden por nombre de concesión y 55 por nombre de yacimiento con áreas donde hay producción VM; 20 de 93 concesiones con VM en producción no aparecen en reservas con el mismo nombre. Hay que armar una tabla de equivalencias a mano.

### 3.5 Cuencas sedimentarias

- **Nombre de la Cuenca Neuquina:** `NEUQUINA` (columna `CUENCA`). TIPO = `Productiva`, UBICACION = `ONSHORE`.
- **Columnas:** `CUENCA`, `TIPO` (Productiva / No Productiva), `UBICACION` (ONSHORE / OFFSHORE / ONSHORE&OFFSHORE), `GEOJSON` (texto con una copia de la geometría; redundante) y `geometry`. 24 elementos (22 Polygon + 2 MultiPolygon), CRS **EPSG:4326 (WGS 84)**, sin geometrías vacías ni inválidas.
- ⚠️ **Encoding:** el `.dbf` no trae `.cpg` y se declara como cp1252, pero el texto es UTF-8: leído por defecto, `ÑIRIHUAU` sale `Ã\x91IRIHUAU`, `PENINSULA VALDÉS` sale `VALDÃ\x89S`. Se lee bien con `encoding="utf-8"`.
- ⚠️ Los nombres no coinciden con los de producción: el CSV dice `AUSTRAL`, el shp `AUSTRAL MARINA`; el yac tiene un `NORESTE` (23 filas, Jujuy, probablemente tipeo de `NOROESTE`) y el shp tiene una cuenca `NORESTE` distinta (no productiva).

---

## 4. Para qué sirve cada dato (propuesta)

| Parte del proyecto | Archivo(s) y columnas que propongo | Qué falta o es dudoso |
|---|---|---|
| **Pozos en el mapa** | nc: `idpozo`, `coordenadax`, `coordenaday` (o shp: `IDENTIFICA` + geometría; coinciden 100%), filtrando `formacion='vaca muerta'` → 3.417 pozos. Estado: `tipoestado`; tipo: `tipopozo`; empresa: `empresa`. Cuenca: polígono `NEUQUINA` del shp de cuencas | Definir qué es "Vaca Muerta" (3.417 en nc vs 3.660 en shp). `tipopozo` y `empresa` cambian en el tiempo (qué valor mostrar). 2 puntos con ejes invertidos (ninguno VM). Los nombres de columna del shp están truncados a 10 caracteres |
| **Dial de años** | padrón: `idpozo`, `anio`, `mes` (primera producción) → pozos que "nacen" cada año; nc: `anio`, `mes` para pozos activos por mes | Padrón cortado en 2006-01 (73% de los pozos): usar 2012 en adelante para VM, o decidir cómo mostrar lo anterior. 2026 llega hasta agosto (parcial). Fecha de primera producción falta para 79 pozos VM |
| **Petróleo y gas extraídos** | nc: `prod_pet` (m³/mes), `prod_gas` (Mm³/mes), por `idpozo`, `anio`, `mes`. Control: series históricas (coinciden exactamente con nc, por cuenca y shale/tight) | Unidades inferidas, no declaradas. 3 valores negativos (-0,001; -7,5; -12,3). Mucho "cero" legítimo (35% de las filas de petróleo, pozos gasíferos). Convertir a unidades legibles (¿barriles?) es decisión tuya |
| **Regalías** | `Informe Regalias CRUDO/GAS/GASOLINA/GLP.xlsx`, hoja "Tabla regalías": `AÑO`, `MES`, `NEUQUEN` (+ `TOTAL PROVINCIA`) | **No se puede aislar VM ni no convencional**: solo provincia. Monedas mezcladas (USD/ARS) sin tipo de cambio. Últimos 2 meses provisorios; relleno en cero hasta 2026-12. GLP por cuenca y con unidad dudosa. Posible desfase (gasolina: suma de provincias < total en 2026) |
| **% extraído** | Numerador: producción acumulada nc (`prod_pet`/`prod_gas`) por VM o NC-Neuquina. Denominador: reservas comprobadas (+probables/posibles/recursos) bloque `NO CONVENCIONAL` | **No hay "recurso original in situ"**: las reservas son lo que *queda* al 31/12/2025, así que % extraído = producido ÷ (producido + reservas) es una aproximación que hay que definir y explicar. Reservas no filtran VM. Reservas son una foto única (sin serie). Hay que convertir unidades (m³ ↔ Mm³ ↔ MMm³). Empalme por nombre de yacimiento, sin IDs |
| **Agua de fractura** | fractura: `idpozo`, `agua_inyectada_m3`, `arena_bombeada_nacional_tn` + `arena_bombeada_importada_tn`, `fecha_inicio_fractura`/`anio_if`, `formacion_productiva`; unir con nc por `idpozo` | Hay que sumar por pozo (183 pozos con varias filas). 400 pozos VM sin fractura (12%). 305 registros con agua = 0; valores extremos y repetidos (3 pozos XOM con exactamente 537.184,6 m³); 8 duplicados exactos; 2 inicios en el futuro; 41 con fin < inicio. Presión y potencia con valores imposibles (no necesarios para el proyecto) |
| **Agua residual** | nc: `prod_agua` (agua producida por pozo y mes). `iny_agua` si se quiere mostrar reinyección | **Unidad no declarada** (¿m³?). No hay datos sobre destino/tratamiento/disposición del agua, ni "flowback" separado. `iny_agua` es casi todo cero en nc (641 filas). Definir si "agua residual" = agua producida |

---

## 5. Problemas de limpieza detectados y opciones (sin resolver)

### 5.1 Definición de "Vaca Muerta"
**Problema:** nc: `formacion='vaca muerta'` → 3.417 pozos (todos NO CONVENCIONAL). shp: `FORMACION='vaca muerta'` → 3.660 pozos, de los cuales 226 están como CONVENCIONAL, 13 "No informado" y 4 más "sin reservorio/no discriminado". yac: 3.051 de 24.383 filas de VM figuran como CONVENCIONAL.
**Opciones:** (a) VM = `formacion='vaca muerta'` en nc (3.417): consistente y con producción; (b) VM = `formacion='vaca muerta'` en shp (3.660): más pozos pero sin producción garantizada; (c) VM = `sub_tipo_recurso='SHALE'` (3.412 de los VM + otros SHALE no VM, a verificar). **Recomendación a evaluar:** (a), y documentar la diferencia con el shp.

### 5.2 Fecha de primera producción cortada en 2006
**Problema:** 63.439 pozos con 2006-01 en el padrón (y 101 VM).
**Opciones:** (a) mostrar el dial desde 2012 y agrupar lo anterior como "hasta 2011"; (b) tratar 2006-01 como "antes de 2007" explícitamente; (c) usar el primer mes con producción > 0 en nc (más fiel para VM).

### 5.3 Monedas, unidades y comparabilidad
**Problema:** crudo y gasolina en USD, gas y GLP en ARS; producción en m³ / Mm³ / MMm³; unidad de GLP dudosa.
**Opciones:** (a) mostrar cada producto en su moneda original sin sumar; (b) incorporar una serie externa de tipo de cambio (BNA vendedor, fuente a citar) para llevar todo a USD; (c) mostrar solo volúmenes y precios, no montos. Y para el % de "peso de GLP y gasolina": calcularlo dentro de cada moneda, o con tipo de cambio externo.

### 5.4 Meses provisorios y relleno futuro (regalías)
**Problema:** 2026-07 y 2026-08 son provisorios; hay filas 2026-09 a 2026-12 con ceros.
**Opciones:** (a) cortar en 2026-06 (último definitivo); (b) incluir los provisorios marcándolos visualmente; (c) cortar en 2026-08 y avisar en nota. En cualquier caso, eliminar las filas de relleno.

### 5.5 Atributos que cambian en el tiempo (`empresa`, `tipopozo`)
**Problema:** 296 pozos VM cambian de empresa y 523 de tipo de pozo.
**Opciones:** (a) valor del último mes con producción; (b) valor más frecuente (moda); (c) valor del primer mes; (d) mantener el atributo por mes y decidir al mostrar.

### 5.6 Formato de los Excel
**Problema:** regalías en tabla dinámica ancha (provincias en columnas, año solo en la primera fila de cada año, encabezado en fila variable); reservas con encabezado de 4 niveles, columnas anchas y una fila `TOTAL` al final que duplicaría sumas.
**Opciones:** pasar a formato largo (`periodo`, `provincia`, `valor`) con relleno hacia abajo del año; en reservas armar nombres de columna (`bloque`, `categoria`, `producto`) y excluir `TOTAL`. Quién lo haga (script propio vs a mano) es decisión tuya.

### 5.7 Valores negativos, extremos y duplicados
- nc: `prod_pet` = -0,001 (idpozo 73804, 2008-12); `prod_gas` = -12,267 y -7,519 (idpozo 153228 y 153227, 2020-05). 15 filas con `tef` > 31 (¿días?). `profundidad`: 5.903 ceros y 156 > 8.000 m (máx 378.939). ❓ `tef` y `profundidad` no los uso en la propuesta.
- reservas: 2 celdas negativas (-0,01 y -0,02 MMm³ de gas posible, Cerro Dragón/Bayo) y 2 celdas donde convencional + no convencional ≠ total.
- fractura: ver 4. 
**Opciones:** poner a 0 / marcar y excluir / dejar tal cual (impacto despreciable); en fractura, excluir outliers por regla (ej. agua > 100.000 m³ o repetidos idénticos) o revisar los pozos a mano (hay pocos: 3 XOM, 10 con presión absurda).

### 5.8 Texto: espacios, mayúsculas y nombres entre archivos
- Espacios sobrantes: nc (`sigla` 32, `areapermisoconcesion` 11, `empresa` 2), yac (`areapermisoconcesion` 14), reservas (`OPERADOR` 14, `CONCESIÓN` 23, `YACIMIENTO` 6; ej. `'RANQUIL CO                           '`).
- Mayúsculas: `ANITA` y `Agua de la Piedra` entre formaciones en minúscula; `observaciones` con variantes ("Ensayo prolongado"/"ensayo prolongado").
- Nombres: provincias en CSV `Neuquén`/`Rio Negro` vs regalías `NEUQUEN`/`RIO NEGRO`; cuencas `AUSTRAL` vs `AUSTRAL MARINA`; `NORESTE` (probable tipeo) en yac; empresas con distinto nombre en reservas vs nc (`PAN AMERICAN ENERGY SL`, `YPF S.A.`).
**Opciones:** normalizar con `trim` + `upper` + quitar tildes **solo para unir** y conservar el nombre original para mostrar; o crear una tabla de equivalencias manual (suficiente para unas pocas decenas de nombres relevantes).

### 5.9 Encoding
- CSV con BOM (UTF-8): leer con `utf-8-sig`.
- nc `observaciones`: ~200 secuencias rotas (`SituaciÃ³n`, `EstudioÂ`); no la usaría, pero hay que saber que está.
- shapefile de cuencas: leer con `encoding='utf-8'`.
**Opciones:** forzar encoding al leer (sin tocar originales) o excluir la columna.

### 5.10 Fractura: registros dudosos
- 2 registros con inicio en el futuro (VIS.Nq.BPE-2322(h) y -2323(h): inicio 2026-11-05 / 2026-12-05 con fin 2026-05-28; ¿mes mal tipeado?).
- 41 con `fecha_fin_fractura` < `fecha_inicio_fractura`; 8 duplicados; 305 con agua = 0; 3 pozos con 537.184,6 m³ idénticos (¿total de la locación repetido en cada pozo?).
**Opciones:** corregir la fecha por la de `fecha_fin`, excluir los registros, o dejarlos y limitar el análisis a agua por año/pozo con la mediana como referencia.

### 5.11 Shapefile de pozos
- Nombres de columna truncados (`PROFUNDIDA`, `CLASIFICAC`, `SUB_TIPO_R`, `TIPO_ESTAD`, `FECHA_INIC`, `FECHA_FIN_`, `ASFECHA_IN`, `FECHA_F_01`): ❓ el significado de las 4 columnas de fecha no está documentado y **no** debe asumirse (40% de nulos).
- `COTA` y `PROFUNDIDA` son texto con sufijo ` m`.
**Opciones:** no usar esas columnas (el proyecto no las necesita) o buscar el diccionario original del portal.

---

## 6. Riesgos: qué partes podrían no ser posibles con estos datos

1. **Regalías de Vaca Muerta / no convencional: no es posible.** Solo hay provincia. Lo máximo es "regalías de Neuquén", que incluye convencional. Hay que planteárselo al jurado con transparencia o cambiar el enfoque (p. ej. regalías provinciales como contexto, no como atribución a VM).
2. **Un único "total de regalías" en una moneda: no es posible sin una fuente externa de tipo de cambio.** Y los montos en ARS están sin deflactar.
3. **"% extraído" exacto: no es posible.** Falta el recurso original; las reservas son un saldo al 31/12/2025, y no distinguen Vaca Muerta (solo no convencional). Se puede construir una versión aproximada y explicada, no un "% real".
4. **Evolución de las reservas en el tiempo: no es posible.** Hay una sola foto (31/12/2025).
5. **Agua residual: limitada.** Solo hay agua *producida* por pozo (sin unidad declarada). No hay datos de tratamiento, destino ni disposición final. El agua inyectada en nc casi no tiene datos (641 filas).
6. **Agua de fractura: posible pero incompleta.** Cubre 88% de los pozos VM, con valores extremos y duplicados; la serie histórica antes de 2012 es marginal.
7. **Dial de años:** posible desde ~2012 para VM. El dato anterior está censurado a 2006. 2026 es parcial (hasta agosto de 2026; el padrón llega a julio). Los archivos no cortan todos en la misma fecha (nc: 2026-08; padrón: 2026-07; regalías: 2026-08 provisorio; yac: solo hasta 2026-01).
8. **Unidades:** las de nc se infirieron (identidades exactas con las series, pero no hay metadato); las de agua y las de GLP quedan sin confirmar. Publicar sin confirmar es un riesgo de credibilidad.
9. **Calendario:** quedan 9 días para el cierre (2026-10-15). Todo lo que implique conseguir datos externos (tipo de cambio, diccionario de datos, recurso original) conviene decidirlo ya.
10. **Fuente de verdad del "pozo VM":** 3.417 vs 3.660 (ver 5.1); el número que se publique debe poder defenderse con un filtro explícito.
