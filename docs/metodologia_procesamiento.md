# Metodología de procesamiento — Vaca Muerta

- **Fecha:** 2026-10-06 · **Script:** `scripts/procesar.py` (reproducible de punta a punta desde `datos/raw`; no modifica los originales)
- **Salidas** (`datos/procesados/`): `pozos_vm.json` (1,4 MB, 3.363 pozos; ver sección 10), `serie_anual_vm.json` (12 KB), `cuenca_neuquina.geojson` (6 KB). Log completo de cifras y controles: `docs/procesamiento_log.json`.
- **Último dato de producción:** 2026-08. **Último mes definitivo de precios/regalías:** 2026-06.

## 1. Decisiones aplicadas y registros afectados

| # | Decisión | Cómo se aplicó | Registros afectados |
|---|---|---|---|
| 1 | Vaca Muerta = `formacion = 'vaca muerta'` en el CSV de producción no convencional; coordenadas = `coordenadax`/`coordenaday` del mismo CSV | Filtro exacto | **3.417 pozos**, 219.848 filas pozo-mes (los 54 sin producción cuentan en estas cifras y en los controles, pero no están en `pozos_vm.json`). 0 pozos sin coordenadas; 0 con más de una coordenada |
| 2 | Aparición = primer mes con `prod_pet > 0` o `prod_gas > 0` | Mínimo año-mes entre las filas con producción positiva | 3.363 pozos con fecha. **54 pozos VM nunca tuvieron producción positiva: por decisión de la autora se excluyen de `pozos_vm.json`** (3.417 − 54 = 3.363 exportados; ver sección 4) |
| 3 | Estadísticas anuales 2012–2025 + 2026 parcial | `serie_anual_vm.json` tiene 2012–2026; 2026 marcado `parcial: true`, `ultimo_mes: 8` | La producción anterior a 2012 **sí entra al acumulado** (desde 2006) pero no tiene fila propia |
| 4 | Empresa y tipo de pozo = valor del último mes con producción | Última fila con producción positiva (para los 54 sin producción: última fila registrada) | 296 pozos cambian de empresa y 523 de `tipopozo` a lo largo del tiempo; 0 con `tipopozo` vacío en su último mes con producción |
| 5 | Negativos de producción → 0 | `clip(lower=0)` sobre `prod_pet`, `prod_gas`, `prod_agua` | **0 valores cambiados en Vaca Muerta.** Los 3 negativos del CSV (idpozo 73804, 153227, 153228) pertenecen a pozos no VM |
| 6 | Fractura | Ver 1.1 | Ver 1.1 |
| 7 | Agua producida = `prod_agua`, **supuesto: m³** | Suma anual de pozos VM | Supuesto, ver sección 5 |
| 8 | Valor del petróleo (USD) = `prod_pet` VM mensual (m³) × precio crudo NEUQUEN del mes (USD/m³, hoja "Tabla precios"), hasta 2026-06. **Desde el 2026-10-08 el valor acumulado incluye 2006-2011** (misma metodología mensual; ver sección 12) | Producto mensual, suma anual. Julio y agosto 2026 se incluyen con precios provisorios (ver sección 13) | 0 meses VM 2012–2026-06 sin precio o con precio 0. 2026 incluye solo enero–junio (`valor_petroleo_usd_hasta_mes: 6`). El precio de Neuquén se aplica también a los 24 pozos VM de Mendoza y Río Negro, como indica la decisión |
| 9 | Regalías de crudo de Neuquén (USD, hoja "Tabla regalías") y tasa efectiva (marcada `tasa_efectiva_aplicable_a_vm: false`, ver sección 8) = regalías / (producción de crudo Neuquén × precio) | Suma mensual → anual; la tasa usa los mismos meses en numerador y denominador. Rótulo: "regalías de crudo de la provincia de Neuquén (incluye convencional)". Sin gas ni GLP | 2026 solo hasta junio (`regalias_hasta_mes: 6`) — ver sección 4 |
| 10 | % extraído, solo petróleo, **tres denominadores** (reservas, EIA, IAPG) | Ver 1.2 | — |
| 11 | Años restantes = (denominador − acumulado del año) / producción del año | Para ambos denominadores; 2026 vacío (ver sección 4) | — |
| 12 | 1 m³ = 6,2898 bbl, solo al final | Cálculos en m³; barriles solo en la salida y en la comparación con la EIA/IAE | — |

### 1.1 Fractura (decisión 6)
- Registros originales: **4.922**.
- **Duplicados exactos eliminados: 5** (pozos 68651, 161308, 162599, 162600, 163285). Criterio: igualdad en todas las columnas **excepto** `id_base_fractura_adjiv`, `fecha_data`, `anio_carga` y `mes_carga` (con todas las columnas, incluidas las de carga, no hay ningún duplicado porque el id es único).
- **Excluidos por agua = 537.184,6 m³ exacto: 3 registros / 3 pozos**: `XOM.Nq.PdY-1001(h)` (160191), `XOM.Nq.PdY-1002(h)` (160192), `XOM.Nq.PdY-1003(h)` (160193). Los 3 son pozos VM.
- **Inicio en el futuro → se usó la fecha de fin: 2 registros** (`VIS.Nq.BPE-2322(h)`: inicio 2026-11-05; `VIS.Nq.BPE-2323(h)`: inicio 2026-12-05; ambos con fin 2026-05-28, por lo que quedan en 2026). "Futuro" = posterior a la fecha de ejecución (2026-10-06).
- Registros tras la limpieza: 4.914; de pozos VM: 3.025, en **3.014 pozos VM** (de 3.417). Agrupado por `idpozo` y año de inicio: 3.023 combinaciones pozo-año.
- 1 registro VM es de 2011 (fuera de la serie 2012+). 2 registros VM tienen agua = 0 (se mantienen, suman 0).
- La serie de fractura cubre solo pozos VM.

### 1.2 % extraído y proyección (decisiones 10–11)
Todo se calcula en m³ y se convierte a barriles al final. El acumulado incluye toda la producción VM desde 2006.

- **Acumulado VM al 31/12/2025:** 114.760.353 m³ = **721.819.671 bbl**.
- **Denominador (a) "reservas"** (fijo) = acumulado VM al 31/12/2025 + reservas comprobadas NO CONVENCIONAL de la cuenca NEUQUINA, hoja "fin de vida util" = 114.760.353 + 414.491.800 = **529.252.119 m³** (3.329 M bbl). La suma de las filas de la hoja da exactamente **414.491,8 miles de m³**, igual al valor indicado. Las reservas se multiplican por 1.000 (miles de m³ → m³).
- **Denominador (b) "EIA"** (fijo) = **16.220 millones de bbl** = 2.578.778.340 m³ (cambiado de 16.200 a 16.220 por indicación de la autora). No se suma lo extraído.
- **Denominador (c) "IAPG"** (fijo) = acumulado VM al 31/12/2025 + **30.170 millones de bbl remanentes** (estudio IAPG 2026 a pedido de la Secretaría de Energía, "Estimación de los Recursos Remanentes Técnicamente Recuperables de Petróleo de la Formación Vaca Muerta") = **4.911.415.255 m³** (≈ 30.892 M bbl). Como son remanentes, se trata igual que las reservas. ❓ **Falta confirmar la fecha de referencia de los "remanentes"**: si no es 31/12/2025, el acumulado que se les suma estaría desfasado. Se usa el acumulado a fin de 2025, igual que en el denominador de reservas.
- `% extraído (año) = acumulado hasta el fin de ese año / denominador × 100`. `años restantes (año) = (denominador − acumulado de ese año) / producción de petróleo de ese año`. Ambas se calculan para los tres denominadores.
- ⚠️ **Advertencia (decisión 11):** las reservas (y por la misma razón los remanentes del IAPG) son una foto; los denominadores (a) y (c) son los mismos para todos los años, así que sus años restantes son estrictamente válidos solo para 2025.
- Interpretación aplicada a la decisión 10a: como el denominador usa el acumulado "VM" y las reservas son al 31/12/2025, se tomó **un único denominador fijo con el acumulado a fin de 2025** (no uno que cambie cada año). Si preferías que el acumulado del denominador cambie por año, hay que modificarlo.

## 2. Controles de calidad

**a) Producción anual de petróleo VM vs columna `shale` de la serie histórica** (m³; diferencia = VM − serie):

| Año | VM | Serie shale | Dif. m³ | Dif. % |
|---|---|---|---|---|
| 2012 | 163.760 | 164.393 | −633 | −0,39 |
| 2013 | 392.634 | 393.933 | −1.299 | −0,33 |
| 2014 | 960.093 | 966.690 | −6.597 | −0,68 |
| 2015 | 1.285.374 | 1.327.356 | −41.982 | −3,16 |
| 2016 | 1.711.074 | 1.733.438 | −22.364 | −1,29 |
| 2017 | 2.165.257 | 2.177.312 | −12.055 | −0,55 |
| 2018 | 3.299.384 | 3.313.379 | −13.996 | −0,42 |
| 2019 | 5.228.308 | 5.266.704 | −38.395 | −0,73 |
| 2020 | 6.582.523 | 6.595.556 | −13.033 | −0,20 |
| 2021 | 9.436.415 | 9.443.185 | −6.769 | −0,07 |
| 2022 | 14.087.579 | 14.091.678 | −4.099 | −0,03 |
| 2023 | 17.734.261 | 17.739.232 | −4.971 | −0,03 |
| 2024 | 22.507.501 | 22.685.421 | −177.920 | −0,78 |
| 2025 | 29.106.869 | 29.120.105 | −13.236 | −0,05 |
| 2026 (ene–ago) | 24.029.103 | 24.047.772 | −18.669 | −0,08 |

La serie `shale` es siempre ligeramente mayor: incluye pozos shale que no son de la formación Vaca Muerta (no verificado qué pozos explican la diferencia). Máxima diferencia: −3,16% (2015).

**b) Acumulado VM a fin de 2025 vs IAE:** 721.819.671 bbl vs 722.000.000 bbl → **−180.329 bbl (−0,02%)**.

**c) Coordenadas y cuenca:** 0 pozos VM sin coordenadas; 3.417 de 3.417 caen dentro del polígono NEUQUINA, tanto en el original (3.433 vértices) como en el simplificado (245 vértices, tolerancia 0,01°, ~1 km).

**d) Reservas:** 414.491,8 miles de m³ = valor esperado (653 filas de la cuenca Neuquina en la hoja; se excluye la fila TOTAL).

## 3. Resultados clave 2025

| Indicador | Valor |
|---|---|
| Pozos activos / nuevos | 2.694 / 470 |
| Petróleo | 29.106.869 m³ = 183.076.385 bbl |
| Gas | 27.529.886 miles de m³ |
| Petróleo acumulado | 114.760.353 m³ = 721.819.671 bbl |
| % extraído (reservas / EIA / IAPG) | 21,68% / 4,45% / 2,34% |
| Años restantes (reservas / EIA / IAPG) | 14,2 / 84,7 / 164,8 |
| Valor del petróleo | USD 11.359.746.935 |
| Agua de fractura / arena | 33.379.706 m³ / 5.099.546 t (432 pozos) |
| Agua producida (supuesto m³) | 15.622.239 m³ |
| Regalías de crudo de Neuquén (incluye convencional) | USD 1.165.758.332 |
| Tasa efectiva (no aplicable a VM hasta resolver, ver sección 8) | 11,61% |

## 4. Situaciones no cubiertas por las decisiones (criterio provisorio aplicado; revisar)

1. **54 pozos VM sin ninguna producción positiva** (nunca `prod_pet > 0` ni `prod_gas > 0`): **excluidos de `pozos_vm.json` por decisión de la autora** (quedan 3.363 pozos exportados). El número y la lista de idpozo están en `docs/procesamiento_log.json`. No afecta producción ni acumulados (aportan 0). 7 de esos 54 pozos tienen 8 registros de fractura (243.794 m³ de agua) que **se mantienen** en `agua_fractura_m3` de la serie (decisión de la autora, ver sección 9).
2. **2026 parcial y proyección:** `anios_restantes_*` de 2026 quedan vacíos (con 8 meses de producción no es comparable con años completos; anualizar sería una decisión de criterio).
3. **Regalías y tasa efectiva 2026:** se calcularon solo hasta 2026-06 (último mes definitivo), por coherencia con la decisión 8. Hasta agosto habría incluido 2 meses provisorios.
4. **Acumulado desde 2006** (no desde 2012), necesario para que cuadre con los 722 M bbl del IAE.

## 5. Supuestos

- **Unidades de producción inferidas** (no hay metadatos): petróleo en m³ por mes y gas en miles de m³ por mes. Respaldo: la suma mensual del CSV coincide exactamente con `shale + tight` de las series históricas, y `kbbl_diario` = `total × 6,2898 / días / 1000`.
- **Agua producida (`prod_agua`) en m³:** supuesto de la autora; la unidad no está declarada en el CSV.
- **Agua de fractura:** `agua_inyectada_m3` (m³) y arena en toneladas (nacional + importada), unidades presentes en el nombre de la columna.
- **Denominador (a):** foto al 31/12/2025, fijo; incluye "no convencional" de toda la cuenca Neuquina (tight y shale de otras formaciones, no solo Vaca Muerta), mientras que el numerador es solo Vaca Muerta.
- **Denominador (b):** recurso técnicamente recuperable estimado por la EIA (16.220 M bbl); no se le suma lo extraído.
- **Denominador (c):** recursos remanentes técnicamente recuperables según el IAPG 2026 (30.170 M bbl); fecha de referencia sin confirmar.
- **Regalías de Neuquén:** incluyen producción convencional; no es regalía atribuible a Vaca Muerta.
- **Precio de Neuquén** aplicado a todos los pozos VM (incluidos los 24 de Mendoza y Río Negro).
- Los precios, regalías y producción de crudo vienen de las hojas por provincia (`NEUQUEN`) del Excel de regalías de crudo, en USD (nominales, sin deflactar).

## 6. Fuentes

- **Capítulo IV** (producción por pozo no convencional, padrón, producción por yacimiento, series históricas), Secretaría de Energía: <https://datos.gob.ar/dataset/energia-produccion-petroleo-gas-por-pozo-capitulo-iv>
- **Regalías** (petróleo crudo, gas natural, GLP, gasolina y condensado): <https://datos.gob.ar/dataset/regalias-de-petroleo-crudo-gas-natural-glp-gasolina-y-condensado>
- **Cuencas sedimentarias:** <https://datos.gob.ar/dataset/exploracion-hidrocarburos-cuencas-sedimentarias>
- **Shapefile de pozos:** ❓ link pendiente (no fue indicado).
- **Reservas al 31/12/2025:** ❓ link pendiente (a completar por la autora).
- **Fractura (Adjunto IV):** ❓ link pendiente (a completar por la autora).
- **IAE, "Observatorio de Vaca Muerta: Resumen de la performance de la Formación Vaca Muerta en el año 2025"** (verificado por la autora): <https://www.iae.org.ar/wp-content/uploads/2026/03/Vaca-Muerta_analisis-2025_vmo_260330_155248.pdf>. Dice "Acumulado 2006-2025: 722 millones de barriles" en la columna PETRÓLEO (confirmado que es petróleo, no barriles equivalentes). Se usa solo como control de calidad.
- **IAPG (estudio a pedido de la Secretaría de Energía) y EIA 2013**, ambos citados en el comunicado oficial del Ministerio de Economía del 12/08/2026 (verificado por la autora): <https://www.argentina.gob.ar/noticias/vaca-muerta-aumento-en-un-89-sus-recursos-de-petroleo-respecto-de-las-ultimas-estimaciones>
  - Estudio IAPG "Estimación de los Recursos Remanentes Técnicamente Recuperables de Petróleo de la Formación Vaca Muerta": **30.170 millones de barriles**.
  - EIA: había proyectado **16.220 millones de barriles en 2013**. La cifra de la EIA se cita a través del comunicado oficial.
  - ❓ **Fecha de referencia de los remanentes: no informada en el comunicado.** Una diferencia de pocos meses no altera el resultado de forma significativa (el % extraído con IAPG sigue en torno a 2,3%).
- **Presentación EIA 2013** (Kuuskraa, Advanced Resources International): <https://www.eia.gov/conference/2013/pdf/presentations/kuuskraa.pdf>. **Solo muestra el recurso de gas de Vaca Muerta (308 Tcf), no el de petróleo**, por lo que no se usa como fuente del denominador de 16.220 M bbl.
- **Pendientes (a completar por la autora):** links de los datasets de **Reservas** y de **Fractura (Adjunto IV)**; también el del shapefile de pozos, si corresponde.
- Conversión 1 m³ = 6,2898 barriles: decisión de la autora.

## 7. Reproducir

```
python scripts/procesar.py
```
Requiere `duckdb`, `geopandas`, `pyogrio`, `openpyxl`, `pandas`, `shapely`. Regenera los tres archivos de `datos/procesados/` y `docs/procesamiento_log.json`.

## 8. Investigación: inconsistencia entre valor de VM y regalías de Neuquén (sin corregir)

> **Nota metodológica.** Por decisión de la autora, las regalías quedan **fuera de la visualización**. Esta investigación se conserva como documentación de una inconsistencia detectada y no resuelta. `regalias_crudo_neuquen_usd` y `tasa_efectiva_pct` permanecen en `serie_anual_vm.json` (sin cambios de cálculo), con `tasa_efectiva_aplicable_a_vm: false`.

**Problema:** valor VM 2025 (USD 11.360 M) × tasa efectiva 11,61% ≈ USD 1.319 M, más que las regalías de crudo de *toda* la provincia (USD 1.166 M). Tablas 2012–2025: `docs/investigacion_regalias.md` (script `scripts/investigar_regalias.py`).

**Hallazgo central (2025, m³):**

| Fuente | Crudo Neuquén 2025 |
|---|---|
| Excel de regalías, hoja "Tabla producción", columna NEUQUEN | **25.752.245** |
| Capítulo IV no convencional, provincia Neuquén (de ellos VM: 28.871.423) | 29.002.574 |
| Capítulo IV por yacimiento, provincia Neuquén (convencional 1.210.599 + no convencional 28.856.565) | **30.067.164** |

- La producción de crudo de Neuquén del Excel (25,75 M m³) es **menor que la de Vaca Muerta sola** según el Capítulo IV (28,87 M m³ en Neuquén): **−3.250.329 m³ (−11,2%)** frente al no convencional y **−4.314.919 m³ (−14,4%)** frente al total de Neuquén por yacimiento. Por eso el valor de VM (volumen del Capítulo IV × precio) supera al valor teórico de toda la provincia calculado con el volumen del Excel.
- El desfase **no es solo de Neuquén**: a nivel país el Excel es 85,9% del Capítulo IV en 2025 (39,9 vs 46,5 M m³) y 86,1% en 2024; en 2019–2023 era 93–94%; en 2012–2018, 87–90%.
- Consistencia interna del Capítulo IV: el no convencional de Neuquén (29,00 M) ≈ el del archivo por yacimiento (28,86 M), 0,5% de diferencia.
- Si se usara el volumen del Capítulo IV (30,07 M m³) en la tasa, la tasa 2025 sería ≈ 9,9% (aprox., con precio medio simple) y valor VM × 9,9% ≈ USD 1.120 M, **menor** que las regalías de Neuquén. O sea, el problema parece ser que la tasa de 11,61% está inflada por un volumen del Excel más bajo que el real. (Solo diagnóstico; no se aplicó.)

**Explicaciones posibles (no verificadas):**
1. **Condensado:** el `prod_pet` del Capítulo IV probablemente incluye condensado de pozos de gas, que las regalías informan aparte en "Gasolina/condensado". Sumar la gasolina de Neuquén del Excel al crudo lleva el cociente Excel/Capítulo IV a ≈ 1,00 en 2012–2023 (0,92–1,02), pero **queda en 0,875 en 2024 y 0,904 en 2025**: no explica todo en los últimos años.
2. **Definición del volumen:** el Excel podría informar producción *computable/liquidada* (neta de consumo propio, pérdidas o volúmenes en ensayo) y el Capítulo IV producción bruta.
3. **Desfase o rectificaciones de liquidación:** las regalías se ajustan después de la producción; los datos recientes podrían no estar rectificados.
4. **Asignación provincial distinta** (áreas interprovinciales, `ESTADO NACIONAL`), aunque el desfase también aparece en el total del país.
5. **Alícuotas y deducciones:** la tasa efectiva depende de la alícuota (la general suele citarse como 12%, ❓ a confirmar), de alícuotas reducidas por incentivos y de deducciones de transporte/tratamiento; no se puede separar de los problemas de volumen con estos datos.

**Estado:** la tasa efectiva queda en `serie_anual_vm.json` con `tasa_efectiva_aplicable_a_vm: false` ("no aplicable a VM hasta resolver"). No se aplicó a ningún valor de VM.

## 9. Decisiones posteriores a la revisión (2026-10-06) y pendientes

**Decisiones (tomadas por la autora; no cambian ningún cálculo):**
1. **Agua de fractura:** se **mantienen** en la serie los **243.794 m³** de los 7 pozos (8 registros) excluidos del mapa por no tener producción. El agua se usó igual. Esto se aclara en el tooltip de agua de fractura.
2. **Regalías:** quedan **fuera de la visualización**. La investigación de la inconsistencia queda como nota metodológica (sección 8).
3. **Valor del petróleo en USD:** se aclara que el `prod_pet` del Capítulo IV **probablemente incluye condensado**, valuado al precio del crudo de Neuquén (ver explicación 1 de la sección 8). Aclaración incluida en el tooltip.
4. **Hitos del dial:** `datos/procesados/hitos.json` (3 hitos: acuerdo YPF–Chevron 2013-07-16; Ley 27.742 publicada 2024-07-08, sancionada 2024-06-27; estudio IAPG, comunicado 2026-08-12). Texto descriptivo, sin afirmar efectos; cargado a mano desde fuentes verificadas por la autora.

**Referencias externas del IAE para tooltips** (no son datos abiertos: se citan como referencias, no como números principales):
- Horizonte de reservas probadas de petróleo: **13 años** (nuestro cálculo con el denominador de reservas da **14,2** en 2025; se menciona como validación independiente).
- **3,9%** de la superficie útil total de Vaca Muerta ya fue perforada.
- Regalías de Vaca Muerta hasta la fecha: ~**USD 4.591 M** (petróleo) y ~**USD 1.879 M** (gas).
- Pozos en la base del IAE: **2.184 petrolíferos y 685 gasíferos** (solo esos dos tipos; los 3.363 pozos nuestros incluyen todos los tipos de pozo).

**Borrador de tooltips:** `docs/tooltips.md` (a editar por la autora).

**Pendientes (marcados):**
- Links de los datasets de **Reservas** y de **Fractura (Adjunto IV)** (y del shapefile de pozos).
- **Confirmación de la unidad de `prod_agua`** (asumida m³).
- **Fecha de referencia de los remanentes del IAPG** (no informada en el comunicado).
- Inconsistencia de la tasa efectiva (sección 8): sin resolver; regalías fuera de la visualización.
- Unidades de petróleo (m³) y gas (miles de m³): inferidas de las series oficiales, no declaradas en los CSV.

## 10. Datos adicionales para la visualización (profundidad y series por pozo)

- **Profundidad (`prof`)**: columna `profundidad` del CSV no convencional (constante por pozo). Solo se aceptan valores entre **1.000 y 8.000 m**. Si falta (0 o vacío) o está fuera de rango, se usa la **mediana de los pozos VM con profundidad válida (5.569 m)** y el pozo queda marcado `prof_est: true`.
  - Casos: **174 de 3.417 pozos VM** con profundidad estimada (153 con valor 0 o vacío, 21 fuera de rango); **170 de los 3.363 pozos exportados**.
- **Series por pozo y año** (alineadas con `meta.anios`, 2012–2026; se omiten si todo es 0): `usd` (valor del petróleo en **miles** de USD: producción mensual × precio del crudo de Neuquén del mes, solo hasta 2026-06), `aguaf` (agua de fractura, m³), `arena` (toneladas) y `aguap` (agua producida, m³). Permiten recalcular los paneles al filtrar por operador o tipo de pozo.
- Control: la suma de los pozos exportados coincide con `serie_anual_vm.json` (diferencias de redondeo; en fractura 2026 la diferencia son los pozos sin producción, que no están en el mapa).
- `pozos_vm.json` pasó de 809 KB a 1,4 MB (297 KB comprimido, que es lo que viaja por GitHub Pages).
- Para el sitio, `scripts/preparar_web.py` envuelve los JSON en `web/datos/*.js` (así `web/index.html` abre con doble clic).


## 11. Sismos: INPRES desde 2019 (versión final)

Script: `scripts/procesar_sismos.py`. Informe con todas las tablas: `docs/auditoria_sismos.md`. Salidas: `datos/procesados/sismos.json`, `catalogo_sismos.csv`. Reemplaza el enfoque anterior (INPRES + Zenodo con deduplicación); no hay combinación de catálogos.

- **Fuente de la capa y del panel:** solo el INPRES (buscador http://contenidos.inpres.gob.ar/buscar_sismo; descarga manual, consulta del 08/10/2026; fechas 01/01/2000 a 08/10/2026, latitud −36,5 a −39,5, longitud −70,5 a −67,5, todas las provincias, magnitud 0 a 9). 473 eventos (12 anteriores a 2019, 461 desde 2019), hasta el 06/10/2026.
- **Filtros** (iguales para todos, en este orden): magnitud ≥ 2,0 (excluye 0), profundidad ≤ 30 km (excluye 10), área de estudio `area_estudio.geojson` (excluye 6; no se modificó). Quedan 445 (mapa) y 439 con M ≥ 2,5 (panel).
- **Por año** (M ≥ 2,0 / M ≥ 2,5): 2019 37/37; 2020 40/40; 2021 32/32; 2022 22/22; 2023 67/65; 2024 59/59; 2025 102/102; 2026 (hasta el 06/10) 86/82.
- **Zenodo (control y contexto):** M ≥ 2,5 con los mismos filtros, INPRES vs Zenodo: 2021 32/33, 2022 22/22, 2023 65/61, ene–mar 2024 15/14 (diferencia máxima 4). Contexto 2017: Zenodo 22, INPRES 0.
- **USGS (solo contexto):** `datos/raw/sismos/usgs/query.csv` (16 eventos M ≥ 4 desde 2000). Con profundidad ≤ 30 km y área de estudio quedan 9: 2 en 2009 (Barrancas, dentro del área) y 7 desde 2015. No se dibuja ni se suma.
- **Web:** `sismos.json` trae `meta` (filtros, contexto, control), `anual` (`m20`, `m25`) y `eventos` (`f`, `lat`, `lon`, `m`, `p`). Los textos fijos están en `web/textos.js`.


## 12. Valor acumulado desde 2006 (2026-10-08)

- **Criterio:** los tres acumulados principales (petróleo, gas y valor en USD) cubren el mismo período, desde 2006. El dial y las series anuales detalladas siguen desde 2012.
- **Metodología (sin cambios):** `prod_pet` mensual de VM × precio mensual del crudo de Neuquén (hoja "Tabla precios", USD/m³ nominales), meses definitivos (hasta 2026-06).
- **2006–2011 agregan USD 36.511.932** (99.322 m³ en 72 meses con producción; todos con precio): 2006 0,9 M; 2007 2,2 M; 2008 2,1 M; 2009 2,5 M; 2010 3,9 M; 2011 24,8 M. Salida: `usd_pre` por pozo (miles de USD) en `pozos_vm.json`, `valor_previo_usd` en `meta` y `valor_acumulado_usd` por año en `serie_anual_vm.json`. Valor acumulado a 2025: USD 45.512 M; a 2026-06: USD 54.283 M.
- **Limitación:** los precios históricos presentan particularidades de la fuente (p. ej. el precio de Neuquén aparece repetido, 295,6 USD/m³, de septiembre a diciembre de 2008) y son nominales (sin deflactar). El aporte de 2006–2011 es 0,07 % del acumulado, así que no afecta las conclusiones.
- Los porcentajes de "% extraído" no dependen del valor económico y no cambian.

---

## Reconstrucción final (2026-10-08): cambios que reemplazan lo anterior

La página (`web/index.html`, `estilos.css`, `app.js`, `textos.js`) se rehízo desde cero. Cambios de datos y de metodología, y qué se mantiene:

**Dos ajustes de datos (los únicos pedidos):**
1. **Dial y series anuales desde 2010** (antes 2012). `scripts/procesar.py`: `ANIO_DESDE = 2010`. `serie_anual_vm.json` y `pozos_vm.json` cubren 2010–2026 (2026 parcial, hasta agosto). Los acumulados siguen partiendo de enero de 2006: lo anterior a 2010 son 27.301 m³ de petróleo (≈ 0,17 M bbl, 0,02 % del acumulado a agosto de 2026) y USD 7,75 M de valor. Hay 2 pozos con primera producción en 2010 y 20 en 2011 (antes de 2010: 7). **Control:** acumulado a fin de 2025 = 721.819.671 bbl (**721,8 M bbl**, −0,02 % contra los 722 M bbl del IAE), igual que antes.
   - Para que el acumulado del agua producida también parta de 2006 se agregó el campo `aguap_pre` a `pozos_vm.json` (m³ producidos antes de 2010; total 12.545 m³). No cambia ninguna serie anual ni ningún cálculo existente; es el equivalente de `usd_pre` para el agua.
   - No hay registros de fractura de pozos VM anteriores a 2010 (`registros_vm_fuera_del_periodo_de_la_serie` = 0), así que el acumulado de agua de fractura es completo.
2. **Sismos cortados al 31/08/2026**, como el resto de los datos. `scripts/procesar_sismos.py`: `HASTA = 2026-08-31`. La consulta del INPRES (8/10/2026) trae 473 eventos; 25 son posteriores al corte. Quedan 448 (436 desde 2019); con los mismos filtros (magnitud ≥ 2,0, profundidad ≤ 30 km, área de estudio) quedan **420** en el mapa y **414** con magnitud ≥ 2,5. Por año (M ≥ 2,5): 2019 37; 2020 40; 2021 32; 2022 22; 2023 65; 2024 59; 2025 102; 2026 (hasta el 31/8; último evento 30/8) 57. Los filtros no cambian (excluyen 10 por profundidad y 6 por área). Zenodo y USGS (solo contexto) no cambian: el USGS no tiene eventos después de noviembre de 2025.

**Hitos:** se agregó el de 2010 (Repsol-YPF reconoce el potencial no convencional, Schultz et al. 2024); solo se conoce el año, se ubica al comienzo de 2010. Las etiquetas del dial se acortaron.

**Mapa (nuevo):** hexágonos 3D (grilla plana de ≈ 2,6 km de radio sobre proyección local; `app.js`, `hexRadioM`). Altura proporcional (lineal, escala fija: el máximo al final de la serie, sin filtros) al petróleo acumulado, o al agua de fractura acumulada, de los pozos del hexágono que ya empezaron a producir. Petróleo: el año se reparte de forma pareja desde la aparición del pozo (igual que antes). Agua de fractura: se asigna al año de la fractura y se reparte de forma pareja desde el 1.º de enero de ese año. Se eliminó la línea vertical de profundidad y su exageración; la profundidad solo aparece en el tooltip de cada pozo.

**Se mantiene sin cambios:** todos los cálculos de petróleo, gas, valor del petróleo, agua (limpieza de duplicados y del valor 537.184,6 m³), reservas / EIA / IAPG (denominadores y fórmulas), sismos (fuente, filtros, área de estudio, control con Zenodo, contexto USGS) y la profundidad. Las fechas de reservas (31/12/2025), valor (hasta junio de 2026) y EIA (2013) tampoco cambian.

**Cierre:** usa el acumulado hasta agosto de 2026 y el ritmo de 2025: % = acumulado ÷ denominador (reservas e IAPG: acumulado a fin de 2025 + volumen informado; EIA: el total original); años = (denominador − acumulado a agosto de 2026) ÷ producción de 2025. Es el mismo cálculo que ya usaba el dial en 2026.

**Textos:** todos los textos visibles están en `web/textos.js`. `docs/tooltips.md` quedó como registro histórico; el contenido vigente de cada (i) está en `textos.js` (Nivel 1 «Qué estoy viendo» y Nivel 2 «Cómo se calculó»).

---

## Ajustes a la reconstrucción (2026-10-08, segunda versión)

- **Estructura:** una sola pantalla (el explorador). La intro es una capa a pantalla completa que se desvanece; ya no hay scroll entre secciones, puntos de navegación ni pantalla de cierre. El explorador arranca en 2025.
- **Estimaciones en el encabezado:** dos tarjetas, «Reservas comprobadas» (Secretaría de Energía, 31/12/2025) y «Recursos técnicamente recuperables» (IAPG, 2026), con % extraído y años al ritmo del año del dial (en 2026, ritmo de 2025). Son los mismos cálculos de siempre (`pct_extraido_reservas`, `pct_extraido_iapg`, `anios_restantes_*` de `serie_anual_vm.json`); no se tocó ninguno. La EIA (2013, 16.220 M bbl) pasó a ser dato histórico en el (i) del IAPG. El acumulado de petróleo no se repite: ya está en el panel izquierdo.
- **Cifras de la intro** (`scripts/calcular_intro.py` → `datos/procesados/contexto_intro.json` → `web/datos/contexto.js`; no modifica ningún dato existente):
  - Vaca Muerta 2025: 29.106.869 m³ de petróleo sobre 46.623.109 m³ nacionales (serie histórica de petróleo, columna `total`) = **62,43 %**; gas: 27.529.886 sobre 51.594.686 miles de m³ (serie histórica de gas, columna `produccion_gas_natural_total`) = **53,36 %**. Referencia del IAE: 62 % y 53 % (diferencia: +0,43 y +0,36 puntos).
  - Valor del petróleo producido en 2025: USD 11.359,7 M (serie existente).
  - Récord de producción diaria de petróleo: **agosto de 2026, 669.801 bbl/día** (producción mensual VM ÷ días del mes × 6,2898); en 2025 el promedio fue de unos 501.600 bbl/día y la producción creció 29,3 % respecto de 2024.
  - 73 % de las inversiones del upstream en 2025 en Vaca Muerta: referencia citada del IAE, no es un cálculo propio.
- **Definición de «recurso técnicamente recuperable»:** verificada en el informe de la EIA (2013), nota sobre recursos técnicamente recuperables (el apartado exacto no se registró): «Technically recoverable resources represent the volumes of oil and natural gas that could be produced with current technology, regardless of oil and natural gas prices and production costs». La traducción al español es nuestra.


## 13. Valor del gas (2026-10-12)

- **Fórmula (por mes y por pozo):** `prod_gas` de VM (miles de m³, CSV no convencional) × precio del gas de NEUQUEN del mes (hoja `Tabla precios` de `Informe Regalias GAS.xlsx`, en **pesos por miles de m³**) ÷ tipo de cambio del mes (pesos por USD). Solo meses definitivos (hasta junio de 2026). Se muestra aparte; nunca se suma al valor del petróleo.
- **Unidades confirmadas:** producción del Excel y del CSV comparables (el Excel de Neuquén es ~90 % del CSV por yacimiento); el precio está en pesos porque regalías ÷ (producción × precio) da 12,04 % en agosto de 2025 (la alícuota).
- **Tipo de cambio:** serie diaria del BCRA, «Tipo de cambio mayorista de referencia» (Com. A 3500; API `estadisticas/v4.0/Monetarias/5`), guardada en `datos/raw/tipo_cambio/tc_bcra_a3500_mayorista_diario.csv` (2006-01-02 a 2026-09-30). Se usa el **promedio simple de los días de cada mes**. El Excel de regalías usa el dólar BNA vendedor del día hábil anterior a cada liquidación; contra la serie BNA de datos.gob.ar (2014-2026) el mayorista es idéntico hasta 2023 y entre 1,5 % y 2 % menor en 2024-2026, por lo que el valor en dólares podría ser algo menor con el tipo de cambio del Excel.
- **Cuenta de control, agosto de 2025:** 2.792.681,2 × 184.930,07 ARS = 5,1645 × 10¹¹ ARS; ÷ 1.329,5375 (promedio de 20 días hábiles) = **USD 388.443.902** (≈ 3,8 USD/MMBtu).
- **Resultados:** acumulado 2006-jun 2026 USD 18.814,5 millones; 2025 USD 3.166,5 millones; 2026 (hasta junio) USD 1.810,8 millones; lo anterior a 2010, USD 0,34 millones. Ningún mes definitivo con gas quedó sin precio o sin tipo de cambio.
- **Campos nuevos:** `valor_gas_usd`, `valor_acumulado_gas_usd`, `valor_gas_usd_hasta_mes` (serie anual) y `usdg`, `usdg_pre` (por pozo, miles de USD). No cambió ningún campo anterior.
- **Limitaciones:** precio de referencia de regalías de Neuquén, no el de cada contrato (hogares, industria, exportación); el gas producido no es necesariamente el vendido; valores nominales.
- **Panel izquierdo:** reorganizado en dos secciones, Petróleo y Gas (extraído, valor y mini gráfico de producción anual). El título del panel derecho pasó de «La otra cara» a «Lo que implica».


## 14. Vistas del mapa, panel «Lo que sale» y sismos (2026-10-12)

- **Vistas del mapa:** Pozos · Petróleo · Gas · Agua que entra · Agua que vuelve (reemplazan al selector «Relieve»). Pozos (por defecto al salir de la intro): puntos por tipo (petrolífero ámbar, gasífero blanco, otros gris), mapa plano. Las otras cuatro: grilla hexagonal con una columna por hexágono = valor **acumulado hasta el momento del dial de todos los pozos del hexágono**, sin importar su tipo, en la unidad de cada variable (petróleo en barriles; gas, agua que entra y agua que vuelve en m³). Escala **lineal y fija, propia de cada vista** (máximo = acumulado final del hexágono más alto, sin filtros); no se comparan alturas entre vistas.
- **Tipo de pozo:** el `tipopozo` del último mes con producción (campo `tipo` de `pozos_vm.json`). Pozos al final de la serie (agosto 2026): 2.528 petrolíferos, 833 gasíferos y 2 «Otro tipo» (3.363). El tipo «Sumidero» existe en el catálogo pero ningún pozo VM lo tiene como último tipo con producción.
- **Agua por hexágono:** agua que entra = `aguaf` (Adjunto IV, por año de fractura) y agua que vuelve = `aguap` + `aguap_pre` (Cap. IV), ambas unidas a cada pozo por `idpozo` y sumadas por hexágono; igual que petróleo y gas, el año se reparte de forma pareja. El agua que entra solo se suma desde que el pozo empezó a producir (regla anterior, no modificada). Cobertura del agua de fractura: 88 % (3.014 de 3.417 pozos VM). La unidad del agua que vuelve se asume en m³ (a confirmar).
- **Radio de la grilla:** 2,6 km (centro a vértice), sin cambios. Capturas comparativas con 1,8 km en `docs/capturas/hex_1800_*` y con 2,6 km en `hex_2600_*`. Al acercar mucho el zoom los hexágonos se achican hasta la mitad.
- **Desde arriba:** el color de cada hexágono usa la raíz cuadrada del valor (para distinguir hexágonos chicos); inclinado, un solo color por vista. La barra «Esta altura = X» (valor redondo 1, 2 o 5 × 10^n, hasta el 60 % del máximo) solo se dibuja con el mapa inclinado.
- **Relación agua/petróleo:** agua de fractura del año (m³) ÷ petróleo extraído ese año (m³; 1 m³ = 6,2898 bbl). Solo petróleo, sin gas. 2025: 1,15 m³ de agua por m³ de petróleo.
- **Sismos:** antes de 2019 el panel muestra un mensaje por tramo (2010-2013, 2014-2015, 2016-2018) y ningún número; desde 2019, el número con la nota del año (2019, 2021). El conteo de Zenodo de 2014-2018 (M ≥ 2,5, profundidad ≤ 30 km, dentro del área: 0, 1, 0, 22 y 10) se calcula con `scripts/zenodo_anual.py` y se guarda en `sismos.json → meta.contexto.zenodo_por_anio`; se muestra solo en el (i). El catálogo de Zenodo empieza el 9/11/2014. «Ver todos los sismos (2019-2026)» muestra todo el catálogo y todos los pozos a la vez, sin depender del dial, y se apaga al tocar el dial o ▶.
- **Datos de las estaciones (11 y 5) y de la Res. 054/2021:** vienen de los textos de la autora; no se verificaron contra una fuente.
- **Panel derecho:** se quitó el gráfico compartido del agua (no figura entre los bloques pedidos); el mini gráfico del bloque de sismos tiene dos filas alineadas por año (sismos arriba; agua de fractura abajo), cada una con su escala, sin doble eje vertical.
- **Pendiente:** la URL de la fuente del Adjunto IV (datos de fractura) sigue sin completar (`link pendiente`).


## 15. Corrección de «Lo confirmado» y «Lo que podría haber» (2026-10-14)

Reemplaza lo dicho en 1.2 (denominadores a y c) y en las secciones posteriores sobre «años restantes». Detalle, fuentes y verificación: `docs/auditoria_indicadores_petroleo.md`.

- **Fecha de los remanentes del IAPG (confirmada en el informe técnico de julio de 2026):** 31/12/2024. Extraído a esa fecha según el IAPG: 558 MMBO. Rango: P90 18.062 · Pmean 30.170 · P10 45.050 MMBO. Los remanentes incluyen las reservas FVU (comprobadas, probables y posibles), los recursos contingentes y los prospectivos.
- **Error corregido:** el denominador del IAPG sumaba lo extraído hasta fines de 2025 a remanentes de fines de 2024 (contaba dos veces la producción de 2025). Ahora se usa el total del IAPG: 558 + 30.170 = **30.728 MMBO** (4.885.369.964 m³).
- **Alcance homogéneo en reservas:** las reservas son de todo el no convencional de la cuenca Neuquina; el numerador pasa a ser la producción no convencional de la cuenca (CSV por pozo, todas las formaciones). Inventario = 119.207.354 + 414.491.765 = **533.699.120 m³**.
- **Años:** se eliminan los «años restantes» por año del dial. Horizonte fijo: reservas ÷ producción NC 2025 = **14,1 años**; (30.170 − 183,08) ÷ 183,08 = **163,8 años** (P90 97,7 · P10 245,1).
- **Resultados 2025:** % reservas 22,34 (antes 21,68); % IAPG 2,35 (antes 2,34).
- **Comparación con la EIA:** 30.170 / 16.220 = +86,0 %; el «+89 %» del comunicado corresponde al total (30.728 / 16.220 = +89,4 %).
- **Código:** `scripts/indicadores_petroleo.py` (nuevo; lo llama `procesar.py` al final) y `scripts/test_indicadores.py` (pruebas).

## 16. Horizonte dinámico (2026-10-14, tercera revisión)

Reemplaza el horizonte fijo de la sección 15. H(t) = R(t) / P(t) para cada año del dial. Reservas (m³): R(t) = inventario de referencia − acumulado NC hasta t. IAPG (millones de bbl): R(t) = 30.728 − [558 + producción VM de Capítulo IV entre fines de 2024 y t] (R(2024) = 30.170; R(2025) = 29.987, aproximación propia). 2026: R hasta agosto, P = 2025. Producción cero o faltante: no calculable. Más de 1.000 años: abreviado en la tarjeta, exacto en el (i). Campos nuevos por año: `horizonte_reservas` y `horizonte_iapg` (restante, producción, año del ritmo, años). Detalle: `docs/auditoria_indicadores_petroleo.md`, sección 12.


## 13. Valor y regalías hasta agosto de 2026, con precios provisorios (14/10/2026)

- **Corrección:** antes se decía que julio y agosto de 2026 estaban vacíos en los Excel de regalías. Era incorrecto: la hoja "Tabla precios" (crudo y gas) trae precios de ambos meses. El archivo avisa que «la información correspondiente a los últimos dos períodos es provisoria»; próxima actualización prevista: 6/11/2026. Los Excel descargados el 14/10/2026 tienen las mismas tablas que los del 6/10.
- **Cambio:** `ULTIMO_MES_DEFINITIVO = (2026, 8)` en `scripts/procesar.py` (se usa en el cálculo), y `ULTIMO_MES_PRECIOS_DEFINITIVOS = (2026, 6)` (último mes no provisorio). `meta` de la serie ahora lleva `ultimo_mes_precios_regalias_usado: 2026-08` y `precios_provisorios_desde: 2026-07`. Valor del petróleo, valor del gas, regalías y tasa de 2026 llegan hasta agosto (`*_hasta_mes: 8`). El tipo de cambio BCRA llega a 30/9/2026, así que cubre agosto.
- **Precios provisorios (Neuquén):** crudo jun 481,6 / jul 437,4 / ago 474,8 USD/m³; gas jun 227.693 / jul 223.563 / ago 227.602 ARS por mil m³.
- **Resultados 2026 (hasta agosto):** valor del petróleo USD 11,946,610,958 (antes, hasta junio: 8.770.640.772); acumulado desde 2006 USD 57,458,711,062; valor del gas USD 2,709,030,827, acumulado USD 19,712,776,539; regalías de crudo de Neuquén USD 1,233,554,419; tasa 11.61 %. Los años 2010-2025 no cambian.
- **En la web:** los textos marcan que julio y agosto usan precios provisorios. Si la próxima actualización los cambia, hay que volver a correr `procesar.py` y `preparar_web.py`.
- **Respaldo previo:** `_backup_valor_agosto_20261014/`.

## 17. Auditoría final antes de la inscripción (15/10/2026)

No se modificó ningún dato procesado ni ninguna fórmula: `datos/procesados/` y `web/datos/` quedan iguales. Los cambios son de rotulado, explicación e interacción.

- **Fechas de corte del valor (petróleo y gas):** el volumen y el valor de 2026 cubren el mismo período (enero-agosto); el valor usa precios definitivos hasta junio y provisorios en julio y agosto (sección 13). Antes, la cifra del panel decía «hasta 2026» sin mes; ahora dice «hasta agosto de 2026 (julio y agosto con precios provisorios)». La producción del año en curso dice «en 2026 (enero-agosto)». Alternativa documentada si se prefiere usar solo precios definitivos: valor del petróleo 2026 hasta junio = USD 8.770.640.772 (sección 13); habría que correr `procesar.py` con `ULTIMO_MES_DEFINITIVO = (2026, 6)` y rotular el valor «hasta junio de 2026».
- **Tarjetas del encabezado:** los nombres indican el alcance («Reservas comprobadas de petróleo no convencional (cuenca Neuquina)» y «Recursos técnicamente recuperables de petróleo (Fm. Vaca Muerta)»). La línea del horizonte pasa de «Horizonte ≈ N años al ritmo de AAAA» a «Equivale a ≈ N años al ritmo de AAAA (extrapolación)». Valores comprobados: 2025 → 14,1 y 163,8 años; 2026 → 13,3 (390,3 ÷ 29,3 millones de m³) y 163,0 años (29.835,8 ÷ 183,1 millones de bbl), con producción de referencia de 2025. Porcentajes: 2025 → 22,3 % y 2,3 %; 2026 → 26,9 % (143,4 ÷ 533,7) y 2,8 % (873,0 ÷ 30.728).
- **IAPG verificado contra el informe:** fecha de corte 31/12/2024; RTRP 18.062 / 30.170 / 45.050 MMBO (estimación baja / mejor / alta); 558 MMBO extraídos; RRP total 30.728; informe de julio de 2026. Comunicado del Ministerio de Economía: 12/08/2026 (verificado). Las reservas al 31/12/2025 (414.491,8 miles de m³) no pudieron verificarse contra el Excel original en esta revisión (el repositorio no incluye datos crudos); se verificaron contra los datos procesados y las pruebas.
- **Sismos:** se agrega la aclaración visible «Registros analizados desde 2019» en el bloque del panel y, con la capa activa, debajo del mapa. Antes de 2019 el panel dice «Sin conteo para AAAA: no significa que no haya habido sismos» y mantiene el mensaje de contexto de la autora. Las cifras de estaciones y las notas de 2019 y 2021 se verificaron después (ver «Fuentes de los mensajes sobre la red sísmica», más abajo). El (i) de un año parcial usa la fecha de corte (31/8/2026) en vez de la del último evento (30/8). Conteos comprobados: 37, 40, 32, 22, 65, 59, 102 y 57 (M ≥ 2,5, 2019-2026) = 414 = `filtros.final_m25`; 420 eventos en el mapa (M ≥ 2,0). Filtros sin cambios.
- **Leyenda de pozos:** «Pozos petrolíferos: N · Pozos gasíferos: N · Otros pozos: N, con primera producción hasta AAAA». Categorías excluyentes (tipo del último mes con producción); al final de la serie 2.528 + 833 + 2 = 3.363 pozos.
- **Mini gráficos:** cada uno indica «por año · máx. V unidad» (barras anuales, no acumuladas, con su máximo como escala) y el extremo derecho dice «2026 ene-ago»; la barra de 2026 sigue rayada.
- **Agua:** el (i) de «Agua que vuelve» aclara que su composición y destino requieren interpretación cuidadosa, que no puede suponerse un tratamiento único y que no se resta del agua que entra (fuentes, pozos y períodos distintos; incluye agua de formación). La relación agua/petróleo se rotula como cociente de totales del año.
- **Hitos:** fechas verificadas (Chevron 16/07/2013; Ley 27.742 publicada el 08/07/2024; comunicado IAPG 12/08/2026; Repsol-YPF 2010 según Schultz et al., 2024). La etiqueta corta del primer hito pasa de «Descubrimiento» a «Repsol-YPF»: el hito es el reconocimiento del potencial no convencional, no el descubrimiento de la formación. Se corrigió que los marcadores de los hitos quedaran tapados por el control del dial.
- **Pruebas:** `scripts/test_indicadores.py` actualizado al nuevo texto del horizonte (457 pruebas OK).

### Fuentes de los mensajes sobre la red sísmica (15/10/2026)

Reemplaza lo dicho en la sección 14 («Datos de las estaciones (11 y 5) y de la Res. 054/2021: vienen de los textos de la autora; no se verificaron contra una fuente»).

- **2010-2013, «Pocas estaciones sísmicas en la zona»:** Schultz et al. (2024), sección 1: «the seismic history of the Neuquén Basin is quiescent and sparsely recorded». Antes decía «Sin monitoreo sísmico sistemático», que la fuente no afirma con esas palabras.
- **2014-2015, red local de 11 estaciones desde noviembre de 2014:** Schultz et al. (2024), sección 2.1: «It comprised 11 stations covering an area of approximately 70×70 km2 [...] which consistently collected data from November 2014 to July 2016» (red del proyecto doctoral de Correa-Otto, 2021). Coincide con el catálogo de Zenodo, que empieza el 9/11/2014.
- **2016-2018, 5 estaciones desde julio de 2016:** misma sección: «From July 2016 until June 2020, the number of stations operational in the network was reduced to 5».
- **2019, ampliación de la red:** misma sección: el catálogo del INPRES «starts detecting events more routinely» desde 2019, «partly because of network expansion in 2019»; también «Limited station availability hampered event detection (~10 events from 2015-2019)». El artículo no dice quién amplió la red; por eso el texto dice «Se amplía la red sísmica» y no atribuye la ampliación al INPRES.
- **2021, Res. 054/2021:** informe de sismicidad del Gobierno de Neuquén (Ministerio de Energía y Recursos Naturales) del 15/12/2021, reproducido por NoticiasNQN: el Programa Provincial de Monitoreo Sísmico fue «establecido mediante la Resolución N° 054/2021»; a esa fecha, dos equipos provinciales (Sauzal Bonito y Añelo) integraban la red del INPRES y se gestionaba una red de 16 equipos. **Corrección:** el texto anterior decía «Neuquén suma 8 sismógrafos a la red del INPRES (Res. 054/2021)»; no se encontró respaldo para 8 equipos en 2021 (en noviembre de 2022, Diario Río Negro menciona «ocho sismógrafos a prueba»). No se encontró el texto de la resolución en un sitio oficial: la fuente es el comunicado reproducido por un medio.
- Las dos fuentes figuran en el (i) de sismos y en «Metodología y fuentes».

### Se quitan las afirmaciones que no pudieron confirmarse (15/10/2026)

Pedido de la autora: dejar solo lo que se pueda confirmar con una fuente.

- **Nota de 2021 eliminada** («Neuquén crea su programa de monitoreo sísmico (Res. 054/2021)»). La única fuente de ese contenido era un informe provincial reproducido por un medio (NoticiasNQN). El dictamen de la Procuración General (FGR 5139/2021/CS1, mayo de 2022) confirma que la Res. 54/2021 del Ministerio de Energía de Neuquén existe y se publicó en el Boletín Oficial provincial el 12/05/2021, pero la describe, según los demandantes, como la convalidación de un convenio de cooperación de 2019; no confirma que haya creado un programa de monitoreo ni que haya sumado sismógrafos. También se quitó esa fuente de la lista.
- **Frase del Observatorio de Sismicidad Inducida eliminada** («informa cifras distintas porque usa otras fuentes y criterios»): no tenía fuente en el proyecto y Schultz et al. (2024) no lo menciona. Se conserva el 42 %, confirmado en el artículo («~42% of the earthquakes were associated with hydraulic fracturing operations»).
- **Agua que vuelve:** el artículo dice que el agua residual «is then disposed of via subsurface injection (only a 5% recycling fraction is reported)». Se reemplazó «se trata y se reinyecta en pozos sumideros» por «se elimina por inyección subterránea», que es lo que dice la fuente.
- **Se conservan, confirmados en Schultz et al. (2024):** región «previously seismically quiet» y con historia sísmica «sparsely recorded»; red local de 11 estaciones desde noviembre de 2014; 5 estaciones desde julio de 2016; ampliación de la red en 2019.

### Se revierten los rótulos de los mini gráficos (15/10/2026)

A pedido de la autora, se quitaron los rótulos «por año · máx. …» y «2026 ene-ago» de los mini gráficos, que saturaban los paneles: los ejes vuelven a decir «2010» y «2026», como antes. También se quitó la nota de sismos debajo del mapa (achicaba el mapa) y la relación agua/petróleo vuelve a ocupar una línea («m³ de agua por m³ de petróleo»); su aclaración como cociente de totales queda en el (i) de «Agua que entra». Se mantienen «Registros analizados desde 2019» en el bloque de sismos y la barra rayada de 2026. El recuadro de texto de sismos vuelve a su altura original (la ampliación dejaba un espacio vacío y hacía desbordar el panel); «Registros analizados desde 2019» pasa a estar dentro de ese recuadro y, antes de 2019, el texto principal dice «Sin conteo para AAAA: los registros analizados empiezan en 2019».

### Texto del horizonte (15/10/2026)

A pedido de la autora, la línea del horizonte de las tarjetas pasa de «Equivale a ≈ N años al ritmo de AAAA (extrapolación)» a «≈ N años de producción si se mantuviera el ritmo de AAAA». El condicional marca que es una cuenta hipotética (lo que queda ÷ producción del año), no un pronóstico; el (i) lo sigue explicando. El cálculo no cambia.

### Simplificación de los paneles laterales (15/10/2026)

A pedido de la autora, para que los paneles se lean mejor (ningún dato ni cálculo cambia; la información quitada sigue en los (i) y en esta metodología):

- Se quitó la relación «m³ de agua por m³ de petróleo» del bloque «Agua que entra» y de su (i): dividía el agua de los pozos fracturados en el año por el petróleo de todos los pozos en producción, que no son los mismos.
- Se quitó la línea «Acumulado desde 2006 / 2010» de los cuatro bloques; la unidad dice ahora «… acumulados». La fecha de inicio de cada acumulado está en el (i) («Período»).
- Sismos: el título pasa a «Sismos», con el formato de los demás bloques; «sismos (M ≥ 2,5) registrados en AAAA» pasa a «sismos en AAAA» (el criterio de magnitud está en el (i)); «414 desde 2019» y «Registros analizados desde 2019» se juntan en «414 desde 2019, cuando empiezan los registros analizados».
- Se quitaron los puntos de los hitos debajo de las mini gráficas (no tenían etiqueta; los hitos siguen en la línea de tiempo).
- Se quitó «(enero-agosto)» del renglón del año 2026 (el encabezado dice «2026 (hasta agosto)») y la aclaración de precios provisorios junto al valor; el valor sigue diciendo «hasta agosto de 2026» y los precios provisorios de julio y agosto se explican en su (i).

### Tarjetas del encabezado más cortas (15/10/2026)

A pedido de la autora: los nombres pasan a «Reservas comprobadas» y «Recursos recuperables»; la fuente, a «Sec. de Energía, 2025» e «IAPG, 2024»; el horizonte, a «≈ N años si se mantuviera el ritmo de AAAA». El alcance (no convencional de la cuenca Neuquina; Formación Vaca Muerta), la categoría completa («técnicamente recuperables») y las fechas exactas (31/12/2025 y 31/12/2024) siguen en el (i) de cada tarjeta y en «¿Por qué dos respuestas?». La diferencia de alcance es chica (Vaca Muerta fue el 99,3 % de la producción no convencional de la cuenca en 2025 y el 96 % de lo extraído hasta 2025); lo que distingue a las tarjetas es la categoría (reserva o recurso) y la fecha, que siguen visibles. Los cálculos no cambian.

### Nombre completo del recurso y año del acumulado (15/10/2026)

- La tarjeta del IAPG vuelve a decir «Recursos técnicamente recuperables · IAPG, 2024» (término preciso de la fuente). Verificación del «% extraído»: numerador = petróleo acumulado de los pozos de Vaca Muerta (Capítulo IV) hasta el año del dial (2025: 721,8 millones de barriles); denominador = total de recursos técnicamente recuperables del IAPG al 31/12/2024 (558 extraídos + 30.170 remanentes = 30.728 millones de barriles); 721,8 ÷ 30.728 = 2,3 %. Misma formación y misma unidad; las limitaciones (numerador posterior a la fecha de la estimación y Capítulo IV 3,5 % menor que lo extraído según el IAPG) están en el (i).
- La unidad de los acumulados dice hasta qué año llegan y cambia con el dial: «millones de barriles acumulados hasta 2025», y lo mismo para gas, agua que entra y agua que vuelve. En 2026 dice «hasta 2026» (el encabezado indica «2026 (hasta agosto)»; «hasta agosto de 2026» no entraba en un renglón).
- A pedido de la autora, la unidad del acumulado se acorta («millones de barriles · acum. a 2025», «millones de m³ · acum. a 2025») y se muestra más chica y del color de su sección, para distinguirla del renglón anual («183,1 millones de barriles en 2025») y que entre en un renglón.
