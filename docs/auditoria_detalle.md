# Auditoría automática — detalle por archivo
_Generado por `scripts/auditoria.py`. Raíz del proyecto: `VisualizacionVacaMuerta`_

# PARTE A — Capítulo IV (CSV)

## Producción de pozos de gas y petróleo NO CONVENCIONAL
- **Archivo:** `datos/raw/capitulo_iv/produccin-de-pozos-de-gas-y-petrleo-no-convencional.csv`
- **Tamaño:** 140.29 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos:  ³ÁÂÃÍÑáéíñó﻿; ⚠️ 203 secuencias tipo mojibake (Ã, Â, �), ej. ['EstudioÂ', 'InactivoÂ', 'ReparaciÃ³n', 'SituaciÃ³n']
- **Filas:** 426,145
- **Columnas:** 40

### Columnas
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

### Calidad
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

## Padrón de pozos Capítulo IV (fecha de primera producción)
- **Archivo:** `datos/raw/capitulo_iv/padrn-de-pozos-de-captulo-iv-con-fecha-de-primera-produccin.csv`
- **Tamaño:** 1.12 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos: ﻿; sin mojibake detectado
- **Filas:** 86,197
- **Columnas:** 3

### Columnas
| columna | tipo | % faltante | ejemplos |
|---|---|---|---|
| idpozo | BIGINT | 0.00 | 238; 244; 298 |
| anio | BIGINT | 0.00 | 2009; 2016; 2012 |
| mes | BIGINT | 0.00 | 11; 9; 5 |

### Calidad
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

## Producción de petróleo y gas por yacimiento y antigüedad de pozo productivo
- **Archivo:** `datos/raw/capitulo_iv/produccin-de-petrleo-y-gas-captulo-iv-por-yacimiento-y-antigedad-de-pozo-productivo.csv`
- **Tamaño:** 71.54 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos: ÁÍÑÜéíñó﻿; sin mojibake detectado
- **Filas:** 496,795
- **Columnas:** 21

### Columnas
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

### Calidad
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

## Serie histórica de gas natural por cuenca y subtipo de recurso
- **Archivo:** `datos/raw/capitulo_iv/serie-histrica-de-produccin-de-gas-natural-por-cuenca-y-sub-tipo-de-recurso-captulo-iv-.csv`
- **Tamaño:** 0.03 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos: ﻿; sin mojibake detectado
- **Filas:** 248
- **Columnas:** 11

### Columnas
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

### Calidad
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

## Serie histórica de petróleo por cuenca y subtipo de recurso
- **Archivo:** `datos/raw/capitulo_iv/serie-histrica-de-produccin-de-petrleo-por-cuenca-y-sub-tipo-de-recurso-captulo-iv-.csv`
- **Tamaño:** 0.03 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos: ﻿; sin mojibake detectado
- **Filas:** 248
- **Columnas:** 12

### Columnas
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

### Calidad
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

# PARTE B — Fractura (Adjunto IV)

## Datos de fractura de pozos (Adjunto IV)
- **Archivo:** `datos/raw/fractura/datos-de-fractura-de-pozos-de-hidrocarburos-adjunto-iv-actualizacin-diaria.csv`
- **Tamaño:** 1.18 MB
- **Formato:** CSV, separador `,`
- **Encoding:** UTF-8 con BOM; saltos de línea LF; caracteres no-ASCII distintos: ÁÍÑéíñó﻿; sin mojibake detectado
- **Filas:** 4,922
- **Columnas:** 30

### Columnas
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

### Calidad
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

# PARTE C — Shapefiles

## Shapefile de pozos
- **Archivo:** `datos/raw/capitulo_iv/shapefile_pozos/shapefile-de-pozos-shp.shp`
- **Componentes:** .cpg (0 KB), .dbf (38291 KB), .prj (0 KB), .shp (2346 KB), .shx (670 KB)
- **Encoding declarado (.cpg):** UTF-8
- **Elementos:** 85,797
- **CRS:** EPSG:4326 — WGS 84
- **Tipos de geometría:** {'Point': 85797}
- **Geometrías vacías/nulas:** 0; inválidas: 0
- **Extensión (minx, miny, maxx, maxy):** [-72.1059, -69.4158, -38.5901, -22.0026]

### Columnas de atributos
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

### Calidad
- Filas de atributos duplicadas: 0

## Cuencas sedimentarias (exploración de hidrocarburos)
- **Archivo:** `datos/raw/cuencas/exploracin-hidrocarburos-cuencas-sedimentarias-shp.shp`
- **Componentes:** .dbf (7 KB), .prj (0 KB), .shp (419 KB), .shx (0 KB)
- **Encoding declarado (.cpg):** no hay .cpg
- ⚠️ Lectura por defecto: 3 valores de texto con caracteres rotos (ej. ['CAÃ\x91ADON ASFALTO', 'PENINSULA VALDÃ\x89S', 'Ã\x91IRIHUAU']); el .dbf declara cp1252 pero el contenido es UTF-8. Leyendo con `encoding='utf-8'` se ve bien.
- **Elementos:** 24
- **CRS:** EPSG:4326 — WGS 84
- **Tipos de geometría:** {'Polygon': 22, 'MultiPolygon': 2}
- **Geometrías vacías/nulas:** 0; inválidas: 0
- **Extensión (minx, miny, maxx, maxy):** [-73.1184, -54.4103, -46.8924, -21.8189]

### Columnas de atributos
| columna | tipo | % faltante | ejemplos |
|---|---|---|---|
| CUENCA | str | 0.00 | CAÑADON ASFALTO; MERCEDES; BOLSONES INTERMONTANOS |
| TIPO | str | 0.00 | No Productiva; Productiva |
| UBICACION | str | 0.00 | ONSHORE; OFFSHORE; ONSHORE&OFFSHORE |
| GEOJSON | str | 0.00 | {"type":"MultiPolygon","coordinates":[[[[-66.7925635651499,-; {"type":"MultiPolygon","coordinates":[[[[-65.846387795375,-3; {"type":"MultiPolygon","coordinates":[[[[-65.8490508666824,- |

### Calidad
- Filas de atributos duplicadas: 0

# PARTE D — Regalías (Excel)

## Regalías — CRUDO
- **Archivo:** `datos/raw/regalias/crudo/Informe Regalias CRUDO.xlsx`
- **Tamaño:** 1.20 MB; formato Excel (.xlsx)
- **Hojas:** ['Tabla precios', 'Tabla producción', 'Tabla regalías', 'detalle de tipos de crudo']

### Hoja `Tabla precios`
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

### Hoja `Tabla producción`
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

### Hoja `Tabla regalías`
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

### Hoja `detalle de tipos de crudo`
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

## Regalías — GAS
- **Archivo:** `datos/raw/regalias/gas/Informe Regalias GAS.xlsx`
- **Tamaño:** 1.40 MB; formato Excel (.xlsx)
- **Hojas:** ['Tabla precios', 'Tabla producción', 'Tabla regalías']

### Hoja `Tabla precios`
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

### Hoja `Tabla producción`
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

### Hoja `Tabla regalías`
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

## Regalías — GASOLINA
- **Archivo:** `datos/raw/regalias/gasolina/Informe Regalias GASOLINA-CONDENSADO.xlsx`
- **Tamaño:** 0.62 MB; formato Excel (.xlsx)
- **Hojas:** ['Tabla precios', 'Tabla producción', 'Tabla regalías']

### Hoja `Tabla precios`
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

### Hoja `Tabla producción`
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

### Hoja `Tabla regalías`
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

## Regalías — GLP
- **Archivo:** `datos/raw/regalias/glp/Informe Regalias GLP.xlsx`
- **Tamaño:** 0.71 MB; formato Excel (.xlsx)
- **Hojas:** ['Tabla precios', 'Tabla producción', 'Tabla regalias']

### Hoja `Tabla precios`
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

### Hoja `Tabla producción`
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

### Hoja `Tabla regalias`
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

# PARTE E — Reservas (Excel)

## Reservas al 31/12/2025
- **Archivo:** `datos/raw/reservas/reservas al 31-12-2025.xlsx`
- **Tamaño:** 0.29 MB; formato Excel (.xlsx)
- **Hojas:** ['fin de concesión', 'fin de vida util']

### Hoja `fin de concesión` — «RESERVAS Y RECURSOS  AL 31/12/2025 - HASTA EL FIN DE LA CONCESIÓN»
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

### Hoja `fin de vida util` — «RESERVAS Y RECURSOS  AL 31/12/2025 - HASTA EL FIN DE LA VIDA ÚTIL»
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


# EVIDENCIA PARA LAS VERIFICACIONES ESPECÍFICAS (Tarea 3)

## C-IV · Valores distintos de columnas de formación / recurso (no convencional)

**nc.`formacion`**
| valor | filas |
|---|---|
| vaca muerta | 219848 |
| lajas | 77996 |
| mulichinco | 35008 |
| los molles | 28227 |
| magallanes | 15806 |
| precuyo | 14684 |
| quintuco | 11038 |
| punta rosada | 9691 |
| agrio | 5747 |
| basamento | 2188 |
| lotena | 1605 |
| formación improductiva | 718 |
| tordillo | 521 |
| sierras blancas | 468 |
| centenario | 414 |
| chachao | 412 |
| pozo d-129 | 396 |
| ANITA | 213 |
| palermo aike | 208 |
| rayoso | 190 |
| yacoraite | 185 |
| springhill | 160 |
| grupo chubut | 152 |
| loma montosa | 126 |
| mina el carmen | 39 |
| cañadon seco | 33 |
| grupo neuquén | 31 |
| bajo barreal | 22 |
| tobífera | 19 |

**nc.`formprod`**
| valor | filas |
|---|---|
| VMUT | 219848 |
| LAJA | 77996 |
| MULI | 35008 |
| LMOL | 28227 |
| MAGA | 15806 |
| PREC | 14684 |
| QTUC | 11038 |
| PROS | 9691 |
| AGRI | 5747 |
| BASA | 2188 |
| LOTE | 1605 |
| FIMP | 718 |
| TORD | 521 |
| SBLA | 468 |
| CENT | 414 |
| CHCH | 412 |
| POD1 | 396 |
| ANIT | 213 |
| PAIK | 208 |
| RAYO | 190 |
| YACO | 185 |
| SPRI | 160 |
| GCHU | 152 |
| LOMO | 126 |
| MELC | 39 |
| CSEC | 33 |
| GNEU | 31 |
| BBAR | 22 |
| TOBI | 19 |

**nc.`tipo_de_recurso`**
| valor | filas |
|---|---|
| NO CONVENCIONAL | 426145 |

**nc.`sub_tipo_recurso`**
| valor | filas |
|---|---|
| SHALE | 227598 |
| TIGHT | 198091 |
| nan | 456 |

**nc.`clasificacion`**
| valor | filas |
|---|---|
| EXPLOTACION | 386474 |
| EXPLORACION | 37837 |
| nan | 926 |
| SERVICIO | 908 |

**nc.`subclasificacion`**
| valor | filas |
|---|---|
| DESARROLLO | 371065 |
| EXPLORACION | 26787 |
| AVANZADA | 15599 |
| EXTENSION | 5465 |
| EXPLORATORIO PROFUNDO | 5233 |
| nan | 926 |
| CONTROL | 821 |
| ESTUDIO | 162 |
| SUMIDERO | 87 |

**nc.`proyecto`**
| valor | filas |
|---|---|
| Sin Proyecto | 326222 |
| GAS PLUS | 99923 |

**nc.`cuenca`**
| valor | filas |
|---|---|
| NEUQUINA | 408912 |
| AUSTRAL | 16406 |
| GOLFO SAN JORGE | 642 |
| NOROESTE | 185 |

**nc.`provincia`**
| valor | filas |
|---|---|
| Neuquén | 376072 |
| Rio Negro | 29659 |
| Santa Cruz | 16779 |
| Mendoza | 3181 |
| Chubut | 269 |
| Salta | 185 |

**nc.`tipopozo`**
| valor | filas |
|---|---|
| Gasífero | 230259 |
| Petrolífero | 165815 |
| Otro tipo | 28610 |
| Sumidero | 735 |
| nan | 618 |
| Inyección de Agua | 56 |
| Inyección de Gas | 51 |
| Acuífero | 1 |

**nc.`tipoestado`**
| valor | filas |
|---|---|
| Extracción Efectiva | 352418 |
| Parado Transitoriamente | 26757 |
| En Estudio | 24079 |
| A Abandonar | 3809 |
| Abandonado | 3792 |
| Otras Situación Inactivo | 3269 |
| En Reserva de Gas | 3110 |
| En Espera de Reparación | 2718 |
| Otras Situación Activo | 2334 |
| Abandono Temporario | 874 |
| En Inyección Efectiva | 789 |
| En Reparación | 778 |
| nan | 618 |
| Parado Alta Relación Agua/Petróleo | 338 |
| En Reserva para Recup. Sec./Asist. | 209 |
| Parado Alta Relación Gas/Petróleo | 154 |
| Mantenimiento de Presión | 99 |

**nc.`tipoextraccion`**
| valor | filas |
|---|---|
| Surgencia Natural | 274294 |
| Plunger Lift | 69112 |
| Bombeo Mecánico | 47528 |
| Sin Sistema de Extracción | 18295 |
| Gas Lift | 15405 |
| nan | 618 |
| Bombeo Hidráulico | 355 |
| Electrosumergible | 315 |
| Otros Tipos de Extracción | 107 |
| Jet Pump | 98 |
| Pistoneo (Swabbing) | 13 |
| Cavidad Progresiva | 5 |

## C-IV · Valores distintos en yacimiento (yac)

**yac.`tipo_de_recurso`**
| valor | filas |
|---|---|
| CONVENCIONAL | 444328 |
| NO CONVENCIONAL | 52321 |
| SIN RESERVORIO | 108 |
| NO DISCRIMINADO | 38 |

**yac.`cuenca`**
| valor | filas |
|---|---|
| NEUQUINA | 284068 |
| GOLFO SAN JORGE | 154168 |
| AUSTRAL | 29429 |
| CUYANA | 20987 |
| NOROESTE | 8120 |
| NORESTE | 23 |

**yac.`provincia`**
| valor | filas |
|---|---|
| Neuquén | 154356 |
| Chubut | 93886 |
| Santa Cruz | 79198 |
| Mendoza | 69679 |
| Rio Negro | 51732 |
| La Pampa | 29288 |
| Tierra del Fuego | 9688 |
| Salta | 6262 |
| Formosa | 1472 |
| Estado Nacional | 825 |
| Jujuy | 409 |

**yac.`formacion`** (top 80 por filas)
| valor | filas |
|---|---|
| comodoro rivadavia | 56197 |
| quintuco | 29544 |
| bajo barreal | 27179 |
| mina el carmen | 26476 |
| centenario | 26025 |
| vaca muerta | 24383 |
| lajas | 23729 |
| cañadon seco | 21584 |
| tordillo | 21140 |
| lotena | 19652 |
| precuyo | 18233 |
| mulichinco | 16771 |
| springhill | 16142 |
| sierras blancas | 15853 |
| huitrín | 14175 |
| los molles | 10751 |
| agrio | 10702 |
| choiyoi | 9358 |
| magallanes | 9324 |
| punta rosada | 8738 |
| rayoso | 7901 |
| rio blanco | 7883 |
| grupo neuquén | 7295 |
| pozo d-129 | 6320 |
| grupo chubut | 6291 |
| barrancas | 5743 |
| loma montosa | 4859 |
| castillo | 4122 |
| tobífera | 3080 |
| formación improductiva | 2994 |
| challacó | 2922 |
| chachao | 2680 |
| el trebol | 2590 |
| conglomerado rojo inferior | 2393 |
| basamento | 1987 |
| catriel | 1774 |
| yacoraite | 1717 |
| quebrada del sapo | 1617 |
| potrerillos | 1592 |
| tupambi | 1123 |
| nan | 1024 |
| santa rosa | 1004 |
| huamampampa | 996 |
| glauconitico  | 994 |
| palmar largo | 950 |
| papagayo | 941 |
| barda negra | 879 |
| icla | 741 |
| salamanca | 612 |
| victor oscuro | 574 |
| pircala | 552 |
| loncoche | 500 |
| las cabras | 497 |
| ANITA | 471 |
| las peñas | 423 |
| Agua de la Piedra | 322 |
| neocomiano | 257 |
| vulcanitas medanito | 241 |
| la pilona | 205 |
| tarija | 201 |

Variantes de 'vaca muerta' en yac.formacion:
| formacion | tipo_de_recurso | filas |
|---|---|---|
| vaca muerta | NO CONVENCIONAL | 21332 |
| vaca muerta | CONVENCIONAL | 3051 |

Variantes de 'vaca muerta' en nc.formacion / formprod:
| formacion | formprod | sub_tipo_recurso | filas | pozos |
|---|---|---|---|---|
| vaca muerta | VMUT | SHALE | 219476 | 3412 |
| vaca muerta | VMUT | TIGHT | 258 | 3 |
| vaca muerta | VMUT | nan | 114 | 2 |

Relación formprod (sigla) ↔ formacion (nombre) en nc, top 60:
| formprod | formacion | filas |
|---|---|---|
| VMUT | vaca muerta | 219848 |
| LAJA | lajas | 77996 |
| MULI | mulichinco | 35008 |
| LMOL | los molles | 28227 |
| MAGA | magallanes | 15806 |
| PREC | precuyo | 14684 |
| QTUC | quintuco | 11038 |
| PROS | punta rosada | 9691 |
| AGRI | agrio | 5747 |
| BASA | basamento | 2188 |
| LOTE | lotena | 1605 |
| FIMP | formación improductiva | 718 |
| TORD | tordillo | 521 |
| SBLA | sierras blancas | 468 |
| CENT | centenario | 414 |
| CHCH | chachao | 412 |
| POD1 | pozo d-129 | 396 |
| ANIT | ANITA | 213 |
| PAIK | palermo aike | 208 |
| RAYO | rayoso | 190 |
| YACO | yacoraite | 185 |
| SPRI | springhill | 160 |
| GCHU | grupo chubut | 152 |
| LOMO | loma montosa | 126 |
| MELC | mina el carmen | 39 |
| CSEC | cañadon seco | 33 |
| GNEU | grupo neuquén | 31 |
| BBAR | bajo barreal | 22 |
| TOBI | tobífera | 19 |

## C-IV · Unidades (no hay metadatos en el CSV: se infieren de la serie histórica)
Comparación producción nc (suma mensual, todos los pozos NO CONVENCIONAL cuenca NEUQUINA) vs serie histórica:
| anio | mes | nc_prod_pet | nc_prod_gas | pozos |
|---|---|---|---|---|
| 2024.0 | 1.0 | 1730193.7 | 2305711.7 | 3833.0 |
| 2024.0 | 6.0 | 1810154.7 | 2888619.3 | 4021.0 |
| 2024.0 | 12.0 | 2232711.2 | 2359023.3 | 4239.0 |
Serie histórica petróleo (2024-01, 2024-06, 2024-12):
| indice_tiempo | cuenca_austral | cuenca_gsj | cuenca_neuquina | cuenca_noroeste | cuenca_cuyana | total | total_diario | shale | tight | part_no_conv | kbbl_diario |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2024-01 | 53205.5025 | 988258.852 | 2207054.6104 | 19864.1122 | 81501.7888 | 3349884.8659 | 108060.8021 | 1702433.6891 | 27760.0086 | 51.6493 | 679.682 |
| 2024-06 | 49101.7816 | 795654.2653 | 2258002.9427 | 16819.6329 | 77742.131 | 3197320.7535 | 106577.3585 | 1781851.2981 | 28303.3772 | 56.6147 | 670.3514 |
| 2024-12 | 49674.9505 | 955536.4111 | 2676586.9208 | 16926.8796 | 76597.08 | 3775322.242 | 121784.5885 | 2206329.9055 | 26381.2729 | 59.1396 | 766.002 |
Serie histórica gas (2024-01, 2024-06, 2024-12):
| indice_tiempo | produccion_gas_natural_cuenca_austral | produccion_gas_natural_cuenca_gsj | produccion_gas_natural_cuenca_neuquina | produccion_gas_natural_cuenca_noroeste | produccion_gas_natural_cuenca_cuyana | produccion_gas_natural_total | produccion_gas_natural_total_diario | produccion_shale_gas | produccion_tight_gas | participacion_no_convencional |
|---|---|---|---|---|---|---|---|---|---|---|
| 2024-01 | 682615.5851 | 342479.7818 | 2702096.6806 | 106192.3961 | 4557.406 | 3837941.8496 | 123.8046 | 1736564.250537 | 569147.4291064 | 60.0768 |
| 2024-06 | 720480.694 | 315399.8976 | 3286134.8811 | 100386.1993 | 4337.4743 | 4426739.1463 | 147.558 | 2326445.930550384 | 562173.3619281 | 65.2539 |
| 2024-12 | 723347.5662 | 325201.7771 | 2702780.2275 | 104054.2108 | 3619.6115 | 3859003.3931 | 124.484 | 1899850.312192762 | 459172.9392705 | 61.1304 |

## C-IV · Agua
Columnas con 'agua' en nc: prod_agua, iny_agua; en yac: suma_prod_agua, suma_iny_agua; en fractura: agua_inyectada_m3
| mn | mx | prom | neg | nulos | ceros |
|---|---|---|---|---|---|
| 0.0 | 34792.95 | 190.97 | 0.0 | 0.0 | 127774.0 |

## C-IV · Pozos únicos de Vaca Muerta (por formación 'vaca muerta' en formacion o formprod)
| pozos_VM | desde | hasta | filas |
|---|---|---|---|
| 3417 | 2006 | 2026 | 219848 |
Pozos VM por año (distintos con registro ese año):
| anio | pozos | pet | gas |
|---|---|---|---|
| 2006.0 | 101.0 | 3299.0 | 218.0 |
| 2007.0 | 103.0 | 7704.0 | 1025.0 |
| 2008.0 | 107.0 | 7268.0 | 1393.0 |
| 2009.0 | 11.0 | 9031.0 | 2116.0 |
| 2010.0 | 20.0 | 11672.0 | 3986.0 |
| 2011.0 | 36.0 | 60348.0 | 24978.0 |
| 2012.0 | 82.0 | 163760.0 | 78243.0 |
| 2013.0 | 204.0 | 392634.0 | 189651.0 |
| 2014.0 | 394.0 | 960093.0 | 525344.0 |
| 2015.0 | 571.0 | 1285374.0 | 1143693.0 |
| 2016.0 | 682.0 | 1711074.0 | 1579444.0 |
| 2017.0 | 786.0 | 2165257.0 | 2283156.0 |
| 2018.0 | 981.0 | 3299384.0 | 6717221.0 |
| 2019.0 | 1171.0 | 5228308.0 | 11496075.0 |
| 2020.0 | 1250.0 | 6582523.0 | 10950357.0 |
| 2021.0 | 1525.0 | 9436415.0 | 13313882.0 |
| 2022.0 | 1831.0 | 14087579.0 | 18204561.0 |
| 2023.0 | 2174.0 | 17734261.0 | 21171426.0 |
| 2024.0 | 2569.0 | 22507501.0 | 25423062.0 |
| 2025.0 | 3052.0 | 29106869.0 | 27529886.0 |
| 2026.0 | 3404.0 | 24029103.0 | 21326208.0 |
Pozos con filas VM y no-VM a la vez:
| count_star() |
|---|
| 0 |
Pozos únicos total en nc:
| pozos_total_nc | pozos_NC |
|---|---|
| 5126 | 5126 |

## C-IV · Cruce producción ↔ coordenadas
Coordenadas dentro de nc: coordenadax, coordenaday (columnas del propio CSV)
| filas | sin_coord | coord_cero | minx | maxx | miny | maxy |
|---|---|---|---|---|---|---|
| 426145.0 | 0.0 | 0.0 | -71.99831 | -38.59007 | -69.41577 | -24.11656 |
Pozos con coordenadas distintas según el mes (ubicación inconsistente):
| pozos_con_mas_de_1_coord |
|---|
| 0 |

## C-IV · Cruce con shapefile de pozos
Columnas del shapefile: ['SIGLA', 'IDENTIFICA', 'EMPRESA', 'AREA', 'YACIMIENTO', 'FORMACION', 'CUENCA', 'PROVINCIA', 'COTA', 'PROFUNDIDA', 'CLASIFICAC', 'SUBCLASIFI', 'TIPO_RECUR', 'SUB_TIPO_R', 'GASPLUS', 'TIPO_POZO', 'TIPO_EXTRA', 'TIPO_ESTAD', 'FECHA_INIC', 'FECHA_FIN_', 'ASFECHA_IN', 'FECHA_F_01', 'geometry']
Columna candidata de unión con `idpozo`: ['IDENTIFICA'] (el nombre NO es explícito: se valida por coincidencia de valores)

`IDENTIFICA` en shapefile: 85,797 filas, 85,797 ids únicos, nulos/no numéricos 0, duplicados 0
| pozos_nc | nc_con_shp | nc_SIN_shp | shp_sin_prod_nc |
|---|---|---|---|
| 5126 | 5126 | 0 | 80671 |
Pozos Vaca Muerta (nc) sin geometría en shapefile / con coordenadas propias en el CSV:
| pozos_VM | VM_sin_shp | VM_sin_coord_csv |
|---|---|---|
| 3417 | 0 | 0 |
Padrón (pad) vs shapefile vs nc:
| pad_ids | pad_filas | pad_en_shp | pad_en_nc | nc_en_pad |
|---|---|---|---|---|
| 86197 | 86197 | 85658 | 5044 | 5044 |

## Fractura · evidencia
| etapas_filas | pozos | ini_min | ini_max | anio_min | anio_max |
|---|---|---|---|---|---|
| 4922 | 4678 | 2006-05-19 00:00:00 | 2026-12-05 00:00:00 | 2006 | 2026 |
Valores de tipo_reservorio / subtipo_reservorio / formacion_productiva / cuenca:

**fr.`tipo_reservorio`**
| valor | filas |
|---|---|
| NO CONVENCIONAL | 3954 |
| CONVENCIONAL | 932 |
| nan | 35 |
| NO DISCRIMINADO | 1 |

**fr.`subtipo_reservorio`**
| valor | filas |
|---|---|
| SHALE | 3046 |
| nan | 973 |
| TIGHT | 903 |

**fr.`cuenca`**
| valor | filas |
|---|---|
| NEUQUINA | 4119 |
| GOLFO SAN JORGE | 589 |
| AUSTRAL | 214 |

**fr.`tipo_terminacion`**
| valor | filas |
|---|---|
| Tapón disparo | 2663 |
| Punzado | 2096 |
| Camisas deslizables | 70 |
| Jetteo | 49 |
| Camisas y punzados | 44 |

**fr.`formacion_productiva`** (top 40)
| valor | filas |
|---|---|
| vaca muerta | 3033 |
| lajas | 338 |
| mina el carmen | 336 |
| magallanes | 199 |
| comodoro rivadavia | 177 |
| mulichinco | 159 |
| huitrín | 151 |
| los molles | 147 |
| punta rosada | 87 |
| precuyo | 74 |
| agrio | 68 |
| cañadon seco | 37 |
| lotena | 19 |
| el trebol | 13 |
| bajo barreal | 12 |
| rayoso | 11 |
| tordillo | 10 |
| quintuco | 9 |
| castillo | 8 |
| springhill | 7 |
| pozo d-129 | 6 |
| ANITA | 6 |
| formación improductiva | 5 |
| chachao | 4 |
| palermo aike | 2 |
| loma montosa | 2 |
| sierras blancas | 1 |
| grupo neuquén | 1 |

Agua / arena / CO2 (resumen):
| agua_min | agua_max | agua_mediana | agua_cero_o_nula | arena_max_tn | arena_cero |
|---|---|---|---|---|---|
| 0.0 | 537184.6 | 19641.3 | 305.0 | 91094.0 | 94.0 |
Filas por año de inicio de fractura:
| anio_if | etapas_filas | pozos | agua_m3 | arena_tn |
|---|---|---|---|---|
| 2006.0 | 1.0 | 1.0 | 36.0 | 7.0 |
| 2009.0 | 5.0 | 5.0 | 2187.0 | 600.0 |
| 2010.0 | 128.0 | 127.0 | 14941.0 | 7851.0 |
| 2011.0 | 160.0 | 144.0 | 35638.0 | 31016.0 |
| 2012.0 | 170.0 | 164.0 | 169094.0 | 31879.0 |
| 2013.0 | 215.0 | 206.0 | 645713.0 | 130257.0 |
| 2014.0 | 325.0 | 320.0 | 1187563.0 | 246075.0 |
| 2015.0 | 344.0 | 342.0 | 1468107.0 | 311643.0 |
| 2016.0 | 266.0 | 263.0 | 2395618.0 | 444782.0 |
| 2017.0 | 293.0 | 291.0 | 4709413.0 | 729293.0 |
| 2018.0 | 349.0 | 339.0 | 8292650.0 | 1134296.0 |
| 2019.0 | 321.0 | 313.0 | 9725813.0 | 1528292.0 |
| 2020.0 | 118.0 | 115.0 | 4616525.0 | 749298.0 |
| 2021.0 | 354.0 | 343.0 | 14667875.0 | 2304263.0 |
| 2022.0 | 429.0 | 414.0 | 18298206.0 | 3026113.0 |
| 2023.0 | 420.0 | 403.0 | 20883009.0 | 3195676.0 |
| 2024.0 | 364.0 | 364.0 | 23522245.0 | 3687268.0 |
| 2025.0 | 438.0 | 438.0 | 33407267.0 | 5104785.0 |
| 2026.0 | 222.0 | 222.0 | 17137239.0 | 2520350.0 |
Unión con Capítulo IV (idpozo):
| pozos_fractura | en_nc | en_padron | en_shapefile |
|---|---|---|---|
| 4678 | 3881 | 4646 | 4678 |
Pozos de fractura que son Vaca Muerta según nc:
| count(DISTINCT idpozo) |
|---|
| 3017 |
Pozos VM (nc) que tienen datos de fractura:
| VM_pozos | VM_con_fractura |
|---|---|
| 3417 | 3017 |
Duplicados de etapas (mismo pozo+fechas+agua):
| filas | dup |
|---|---|
| 4922 | 8 |
Fracturas con fecha_fin < fecha_inicio:
| count_star() |
|---|
| 41 |


# HALLAZGOS ADICIONALES (chequeos cruzados)

## Clave única en producción no convencional
| filas | combinaciones_pozo_mes |
|---|---|
| 426145 | 426145 |

## Vaca Muerta: cuenca/provincia/tipo de pozo/empresa (por pozo)

**VM por `cuenca`** (pozos distintos)
| valor | pozos |
|---|---|
| NEUQUINA | 3417 |

**VM por `provincia`** (pozos distintos)
| valor | pozos |
|---|---|
| Neuquén | 3393 |
| Mendoza | 15 |
| Rio Negro | 9 |

**VM por `tipopozo`** (pozos distintos)
| valor | pozos |
|---|---|
| Petrolífero | 2579 |
| Gasífero | 871 |
| Otro tipo | 505 |
| nan | 143 |
| Sumidero | 7 |
| Inyección de Agua | 2 |
| Acuífero | 1 |
| Inyección de Gas | 1 |

**VM por `sub_tipo_recurso`** (pozos distintos)
| valor | pozos |
|---|---|
| SHALE | 3412 |
| TIGHT | 3 |
| nan | 2 |

**VM por empresa (top 15, pozos distintos en el último mes con dato de cada pozo)**
| empresa | pozos |
|---|---|
| YPF S.A. | 1876 |
| VISTA ENERGY ARGENTINA SAU | 275 |
| TECPETROL S.A. | 250 |
| PAN AMERICAN ENERGY SL | 217 |
| SHELL ARGENTINA S.A. | 187 |
| PLUSPETROL S.A. | 125 |
| TOTAL AUSTRAL S.A. | 109 |
| PAMPA ENERGIA S.A. | 104 |
| PHOENIX GLOBAL RESOURCES S.A. | 65 |
| PLUSPETROL CUENCA NEUQUINA S.R.L. | 62 |
| CHEVRON ARGENTINA S.R.L. | 53 |
| VACA MUERTA INVERSIONES SAU | 26 |
| GEOPARK ARGENTINA S.A. | 18 |
| CAPEX S.A. | 18 |
| PETROQUIMICA COMODORO RIVADAVIA S.A. | 9 |
Pozos VM cuya empresa o tipo de pozo cambia a lo largo del tiempo:
| cambian_empresa | cambian_tipopozo | total |
|---|---|---|
| 296 | 523 | 3417 |

## Vaca Muerta: año de primera producción según padrón (más fiable que el primer año en el CSV)
| anio | pozos_VM_primera_prod |
|---|---|
| 2006 | 101 |
| 2007 | 2 |
| 2008 | 4 |
| 2010 | 7 |
| 2011 | 6 |
| 2012 | 22 |
| 2013 | 68 |
| 2014 | 190 |
| 2015 | 175 |
| 2016 | 111 |
| 2017 | 100 |
| 2018 | 196 |
| 2019 | 195 |
| 2020 | 82 |
| 2021 | 275 |
| 2022 | 305 |
| 2023 | 345 |
| 2024 | 395 |
| 2025 | 483 |
| 2026 | 276 |
Pozos del padrón con primera producción en 2006-01 (posible corte de la serie en el inicio):
| en_2006_01 | en_2006 | total |
|---|---|---|
| 63439 | 63448 | 86197 |
Pozos NC (nc) que NO están en el padrón:
| count(DISTINCT idpozo) |
|---|
| 82 |
Pozos con producción de VM antes de su fecha de primera producción del padrón:
| count(DISTINCT n.idpozo) |
|---|
| 0 |

## Coherencia de unidades y valores de la producción
Días de operación `tef` > 31 y otros valores raros:
| tef_mayor_31 | negativos | prof_mayor_8000m | prof_cero | prod_con_tef_cero |
|---|---|---|---|---|
| 15 | 3 | 156 | 5903 | 264 |
Valores negativos de producción:
| idpozo | anio | mes | prod_pet | prod_gas |
|---|---|---|---|---|
| 153228.0 | 2020.0 | 5.0 | 1.67 | -12.267 |
| 153227.0 | 2020.0 | 5.0 | 1.02 | -7.519 |
| 73804.0 | 2008.0 | 12.0 | -0.001 | 0.0 |
Comparación con la serie histórica (cuenca neuquina+resto, total no convencional): nc vs shale+tight
| indice_tiempo | nc_pet | serie_pet_shale_mas_tight | nc_gas | serie_gas_shale_mas_tight |
|---|---|---|---|---|
| 2020-06 | 588446.5 | 588446.5 | 1630811.6 | 1630811.6 |
| 2024-01 | 1730193.7 | 1730193.7 | 2305711.7 | 2305711.7 |
| 2025-12 | 2930406.2 | 2930406.2 | 2657729.6 | 2657729.6 |
Consistencia kbbl_diario: total*6.2898/días/1000 vs columna (2024-01):
| indice_tiempo | total | kbbl_diario | calculado |
|---|---|---|---|
| 2024-01 | 3349884.8659 | 679.682 | 679.68 |
Última fila de las series históricas:
| indice_tiempo | cuenca_austral | cuenca_gsj | cuenca_neuquina | cuenca_noroeste | cuenca_cuyana | total | total_diario | shale | tight | part_no_conv | kbbl_diario |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-08 | 37072.6806 | 769057.615 | 3689119.6057 | 13143.3175 | 66158.1511 | 4574551.3699 | 147566.1732 | 3309792.6353 | 21599.8143 | 72.8245 | 928.1633 |
| 2026-07 | 45103.6824 | 816435.5126 | 3572096.3279 | 13395.8102 | 65530.564 | 4512561.8971 | 145566.5128 | 3175041.7611 | 23148.559 | 70.8731 | 915.5858 |
| indice_tiempo | produccion_gas_natural_total | produccion_shale_gas | produccion_tight_gas | participacion_no_convencional |
|---|---|---|---|---|
| 2026-08 | 4743830.5074 | 2956835.105802 | 410259.64666259 | 70.9784 |
| 2026-07 | 4899707.373 | 2991644.75805907 | 445560.8991563 | 70.1512 |
Producción NC en yacimiento (yac, redondeada a enteros) vs nc, 2024-01:
| yac_nc_pet | nc_pet | yac_nc_gas | nc_gas |
|---|---|---|---|
| 1730192.0 | 1730193.6977043995 | 2305725.0 | 2305711.6796434005 |
yac: último período y cobertura de `anio_primera_prod`:
| ultimo | primera_min | primera_posterior_a_produccion |
|---|---|---|
| 202601 | 2006 | 0 |
yac: el campo `cuenca` tiene el valor 'NORESTE' (probable error de tipeo de 'NOROESTE'):
| provincia | areayacimiento | filas |
|---|---|---|
| Jujuy | LA BREA ESTE | 22 |
| Jujuy | EL OCULTO | 1 |

## Coordenadas: ejes invertidos (longitud/latitud intercambiadas)
En Argentina continental: longitud ≈ -74 a -53, latitud ≈ -55 a -21. Se considera 'invertido' si x > -53 (parece latitud) y y < -55 (parece longitud) o si x > -45.
| pozos | pozos_con_x_y_invertidos | fuera_de_rango |
|---|---|---|
| 5126 | 1 | 0 |
Pozos VM con ejes invertidos:
| count(DISTINCT idpozo) |
|---|
| 0 |
Ejemplos de pozos invertidos (nc):
| idpozo | sigla | provincia | coordenadax | coordenaday |
|---|---|---|---|---|
| 162058 | PBE.Nq.M-1063(d) | Neuquén | -38.59007 | -69.41577 |

Shapefile de pozos: 2 de 85,797 puntos con x/y invertidos (0.00%); x en [-72.106, -38.590], y en [-69.416, -22.003]
Por provincia (shapefile, puntos invertidos):
| PROVINCIA | puntos |
|---|---|
| Neuquén | 1 |
| Rio Negro | 1 |
Coordenadas del CSV (nc) vs geometría del shapefile (por pozo):
| pozos | iguales | iguales_pero_invertidas | distintas |
|---|---|---|---|
| 5126 | 5126 | 0 | 0 |

## Fractura: valores extremos y calidad
Mayores valores de agua / presión / potencia (posibles errores de carga):
| idpozo | sigla | anio_if | etapas | agua_inyectada_m3 | arena_tn | presion_maxima_psi | potencia_equipos_fractura_hp |
|---|---|---|---|---|---|---|---|
| 160191 | XOM.Nq.PdY-1001(h) | 2018 | 52 | 537184.6 | 18428.03 | 13000.0 | 40000.0 |
| 160193 | XOM.Nq.PdY-1003(h) | 2018 | 54 | 537184.6 | 24000.09 | 12575.0 | 40000.0 |
| 160192 | XOM.Nq.PdY-1002(h) | 2018 | 52 | 537184.6 | 18877.690000000002 | 12406.0 | 40000.0 |
| 160770 | CGC.SCA.EPu-6(d) | 2019 | 1 | 273048.0 | 132.95 | 2202.0 | 546.0 |
| 158182 |  TPT.Nq.PS-1010(d) | 2017 | 13 | 263391.53 | 1019.27 | 8800.0 | 6561.0 |
| presion_gt_25000psi | potencia_gt_100000hp | agua_gt_100000m3 | inicio_en_el_futuro | agua_cero | agua_por_etapa_gt_5000m3 |
|---|---|---|---|---|---|
| 10 | 1 | 145 | 2 | 305 | 8 |
Fechas de inicio en el futuro (hoy = 2026-10-06):
| idpozo | sigla | fecha_inicio_fractura | fecha_fin_fractura | fecha_data |
|---|---|---|---|---|
| 167248 | VIS.Nq.BPE-2322(h) | 2026-11-05 00:00:00 | 2026-05-28 00:00:00 | 2026-06-03 16:03:46.096455 |
| 167249 | VIS.Nq.BPE-2323(h) | 2026-12-05 00:00:00 | 2026-05-28 00:00:00 | 2026-06-03 16:04:28.391683 |
Pozos con más de una fila de fractura:
| pozos_con_mas_de_una | max_filas |
|---|---|
| 183 | 6 |
¿`anio`/`mes` coinciden con anio_if/mes_if o con fecha de carga?
| igual_inicio | igual_fin | igual_carga | total |
|---|---|---|---|
| 4922 | 2639 | 12 | 4922 |
Fractura VM: agua por año (solo pozos VM en nc) y cobertura:
| anio | pozos | agua_m3 | arena_tn |
|---|---|---|---|
| 2011.0 | 1.0 | 17456.0 | 2229.0 |
| 2012.0 | 22.0 | 144348.0 | 22683.0 |
| 2013.0 | 105.0 | 564847.0 | 104326.0 |
| 2014.0 | 167.0 | 1022737.0 | 192314.0 |
| 2015.0 | 173.0 | 1295009.0 | 270015.0 |
| 2016.0 | 116.0 | 2196560.0 | 394875.0 |
| 2017.0 | 140.0 | 4166220.0 | 664867.0 |
| 2018.0 | 176.0 | 7976984.0 | 1046673.0 |
| 2019.0 | 190.0 | 9297017.0 | 1493317.0 |
| 2020.0 | 87.0 | 4588114.0 | 739763.0 |
| 2021.0 | 251.0 | 14494923.0 | 2260380.0 |
| 2022.0 | 294.0 | 18107940.0 | 2980782.0 |
| 2023.0 | 319.0 | 20701650.0 | 3159845.0 |
| 2024.0 | 336.0 | 23334290.0 | 3654692.0 |
| 2025.0 | 432.0 | 33379706.0 | 5099546.0 |
| 2026.0 | 217.0 | 16996041.0 | 2501994.0 |
Pozos con fractura según tipo_reservorio, pero que NO están en nc (producción NC):
| tipo_reservorio | subtipo_reservorio | pozos |
|---|---|---|
| CONVENCIONAL | nan | 766 |
| nan | nan | 29 |
| NO DISCRIMINADO | nan | 1 |
| NO CONVENCIONAL | SHALE | 1 |

## Regalías: peso de cada producto (últimos 12 meses con datos y 2025)
| producto | ult12_sin_provisorios | 2025 | vol_2025 | neuquen_2025 | periodos | moneda |
|---|---|---|---|---|---|---|
| crudo | 2239007037.8718033 | 1875242650.1930854 | 39939365.44228639 | 1165758331.8205833 | 2025-07 a 2026-06 | USD |
| gas | 883396469373.7228 | 797539175283.8279 | 44587135.93847576 | 546267823402.31976 | 2025-07 a 2026-06 | ARS |
| gasolina | 113232376.49015136 | 93290037.08235031 | 2063440.349670782 | 65788212.759330675 | 2025-07 a 2026-06 | USD |
| glp | 8409759368.084135 | 7508256033.275133 | 408231.02047720057 | nan | 2025-07 a 2026-06 | ARS |
- En USD: gasolina/condensado = 4.74% de (crudo + gasolina) en 2025
- En ARS: GLP = 0.93% de (gas + GLP) en 2025
- Sumar USD con ARS requiere un tipo de cambio que NO viene en los archivos.
- Meses cubiertos por cada archivo y último con datos coincide en 2026-08 (los 4 archivos).

## Cuencas — nombres
| CUENCA | TIPO | UBICACION |
|---|---|---|
| CAÑADON ASFALTO | No Productiva | ONSHORE |
| MERCEDES | No Productiva | ONSHORE |
| BOLSONES INTERMONTANOS | No Productiva | ONSHORE |
| NORESTE | No Productiva | ONSHORE |
| PENINSULA VALDÉS | No Productiva | OFFSHORE |
| MALVINAS ORIENTAL | No Productiva | OFFSHORE |
| MALVINAS | No Productiva | OFFSHORE |
| GOLFO SAN JORGE | Productiva | ONSHORE&OFFSHORE |
| EL TRANQUILO | No Productiva | ONSHORE |
| RAWSON | No Productiva | OFFSHORE |
| NOROESTE | Productiva | ONSHORE |
| CUYANA | Productiva | ONSHORE |
| ÑIRIHUAU | No Productiva | ONSHORE |
| COLORADO MARINA | No Productiva | OFFSHORE |
| CLAROMECO | No Productiva | ONSHORE&OFFSHORE |
| NEUQUINA | Productiva | ONSHORE |
| SAN LUIS | No Productiva | ONSHORE |
| AUSTRAL MARINA | Productiva | ONSHORE&OFFSHORE |
| DEL SALADO | No Productiva | ONSHORE&OFFSHORE |
| ARGENTINA | No Productiva | OFFSHORE |
| LEVALLE | No Productiva | ONSHORE |
| SAN JULIAN | No Productiva | OFFSHORE |
| MALVINAS NORTE | No Productiva | OFFSHORE |
| MACACHIN | No Productiva | ONSHORE |