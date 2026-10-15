# Auditoría de «Lo confirmado» y «Lo que podría haber» (petróleo)

Fecha: 14/10/2026. Alcance: los dos indicadores del encabezado del explorador (`% extraído` y años). No se tocó ningún otro cálculo ni el diseño.

**Resumen en una línea:** los dos porcentajes se pueden defender con correcciones de alcance y fecha; los «años restantes» calculados para cada año del dial no se pueden defender y se reemplazan por un único horizonte de referencia fijo.

---

## 0. Qué se verificó y con qué

| Dato | Fuente consultada | Resultado |
|---|---|---|
| 30.170 millones de barriles | Informe técnico del IAPG (julio de 2026): <https://iapg.org.ar/documentos/IAPG_Estudio_prospectivo_de_recursos_de_petroleo.pdf> | **Fecha de referencia: 31/12/2024** (tapa y resumen ejecutivo, p. 4). Son **remanentes**: excluyen lo extraído. |
| Lo extraído según el IAPG | Mismo informe, p. 4 | **558 millones de barriles al 31/12/2024** (dato de la Secretaría de Energía). |
| Rango | Mismo informe, p. 4 | P90 18.062 · Pmean 30.170 · P10 45.050 millones de barriles. No informa P50. |
| Qué incluye | Mismo informe, pp. 5, 31 y glosario | RTRP = Reservas FVU (comprobadas + probables + posibles al fin de la vida útil) + recursos contingentes + recursos prospectivos. Método: volumétrico probabilístico, PRMS 2018. |
| Total del IAPG | Mismo informe, p. 28-29 | RRP (antes de restar lo extraído) = 18.620 / **30.728** / 45.608. Cada valor es el RTRP + 558. |
| Comunicado | <https://www.argentina.gob.ar/noticias/vaca-muerta-aumento-en-un-89-sus-recursos-de-petroleo-respecto-de-las-ultimas-estimaciones> | No informa la fecha de referencia ni enlaza el informe. Dice «+89 %» respecto de 16.220. |
| EIA 2013 | <https://www.eia.gov/analysis/studies/worldshalegas/pdf/overview.pdf> | Vaca Muerta: **16,2 mil millones de barriles** de shale oil técnicamente recuperable con riesgo (Argentina total: 27). Las tablas lo rotulan como recurso «unproved», separado de las reservas probadas. Estudio EIA/ARI de mayo/junio de 2013. |
| 414,5 millones de m³ | `datos/raw/reservas/reservas al 31-12-2025.xlsx`, hoja «fin de vida util», columna N | 414.491,8 **miles de m³** (Mm³) = 414,49 millones de m³; no convencional · reservas · comprobadas · petróleo; 62 filas con valor > 0 de la cuenca Neuquina. Hasta fin de concesión: 407.171,5 Mm³. |
| Alcance de la producción | CSV por pozo no convencional (Capítulo IV) | Permite aislar `formacion = 'vaca muerta'`. Las reservas **no** vienen por formación. |

**Lo que no pude verificar (declararlo así):**
- Los valores por categoría (reservas FVU, contingentes, prospectivos) están en las figuras 24-26 del informe del IAPG (pp. 32-34), que no pude leer como texto.
- El informe del IAPG no separa con claridad crudo y condensado: incluye la ventana de gas y condensado.
- El origen exacto de los 558 millones (el informe solo dice que lo aportó la Secretaría de Energía).
- La URL oficial del Excel de reservas al 31/12/2025 (sigue como «link pendiente»).
- El informe se leyó con una herramienta que extrae el texto del PDF. **Antes de entregar, comprobá a ojo las páginas 1, 4, 5, 28-31 y 45-46 del PDF del IAPG.**

---

## 1. Veredicto por indicador

### «Lo confirmado» (reservas comprobadas)

| Parte | Veredicto | Por qué |
|---|---|---|
| % extraído | **Correcto con salvedades → corregido** | Fechas compatibles (las dos al 31/12/2025) y unidades bien convertidas (Mm³ × 1.000). Pero se mezclaban alcances: el numerador era solo Vaca Muerta y las reservas son de **todo el no convencional de la cuenca Neuquina**. La diferencia es chica (VM = 96,3 % de lo extraído NC hasta 2025; 99,3 % de la producción de 2025), pero el jurado la puede señalar. Se pasa a usar no convencional de la cuenca en las dos partes de la cuenta. |
| Años para cada año del dial | **Incorrecto** | Divide lo que quedaba según lo que se sabía a fines de 2025 por la producción de años en los que esa cifra no se conocía. Da resultados sin sentido: 45.340 años en 2010. No es una estimación que hubiera sido válida en ningún año. |
| Años en 2025 | Correcto (14,2 → 14,1 con alcance homogéneo) | Es el cociente reservas/producción (R/P) habitual. |
| Años en 2026 | **Inconsistente** | Restaba 8 meses de 2026 a las reservas de 2025 y dividía por el ritmo de 2025: una actualización de reservas que nadie publicó. |

### «Lo que podría haber» (IAPG)

| Parte | Veredicto | Por qué |
|---|---|---|
| % extraído | **Incorrecto → corregido** | Los 30.170 son remanentes **al 31/12/2024**, no a fines de 2025. Al sumarles lo extraído hasta fines de 2025 se contaba **dos veces la producción de 2025** (183 millones de barriles), que en la fecha del IAPG todavía estaba bajo tierra. Error chico en el número (el denominador pasaba de 30.728 a 30.892 millones: +0,5 %), pero metodológicamente indefendible. Se corrige usando el total del propio IAPG: 558 + 30.170 = **30.728 millones de barriles**. |
| Años para cada año del dial | **Incorrecto** | Mismo problema que en reservas (420.781 años en 2010). |
| Años en 2025 | Correcto con salvedades (164,8 → 163,8) | Ahora se descuenta la producción de 2025 del remanente de 2024 y se agrega el rango P90-P10. |
| Comparación con la EIA | **No equivalente** | Ver punto 6. |

### Contraste de tus hipótesis

| Hipótesis | Resultado |
|---|---|
| El % de reservas solo vale como comparación contra un inventario fijo de 2025 | **Confirmada.** |
| Los años por año del dial son engañosos | **Confirmada.** |
| Las reservas abarcan más que Vaca Muerta | **Confirmada**, con magnitud: ≈ 99 % de las reservas NC comprobadas de la cuenca está en yacimientos cuya producción NC de 2025 fue de Vaca Muerta (estimación propia: se reparte la reserva de cada yacimiento según su producción de 2025; no es un dato oficial). Entre las excepciones: Río Neuquén (2.257 Mm³, 23 % VM), Estación Fernández Oro (1.800 Mm³, 0 % VM: Lajas). |
| Los 30.170 son remanentes, no el inventario original | **Confirmada.** Fecha 31/12/2024. Ya incluyen las reservas. |
| Sumarles la producción hasta 2025 no es válido sin fecha compatible | **Confirmada:** había doble conteo de 2025. |
| La EIA 2013 no es metodológicamente equivalente | **Confirmada.** |
| El «+89 %» no prueba que los recursos aumentaron un 89 % | **Confirmada, y además:** 30.170 / 16.220 = 1,860, o sea **+86 %**. El +89 % coincide con comparar el **total** (30.728) con 16.220 (+89,4 %), no el remanente. Es una inferencia: el informe del IAPG no menciona el 89 %. |

---

## 2. Fórmulas recomendadas

**Regla general:** cada cociente divide dos cantidades del mismo alcance, a la misma fecha y en la misma unidad. El porcentaje y el horizonte responden a preguntas distintas y se muestran por separado.

### «Lo confirmado»

```
% extraído(año) = Q_NC(2006 → año) / [ Q_NC(2006 → 31/12/2025) + R_1P(31/12/2025) ] × 100

Horizonte de referencia = R_1P(31/12/2025) / P_NC(2025)            (un solo valor, no cambia con el dial)
```

### «Lo que podría haber»

```
% extraído(año) = Q_VM(2006 → año) × 6,2898 / RRP_IAPG × 100
   RRP_IAPG = Extraído_IAPG(31/12/2024) + RTRP_IAPG(31/12/2024) = 558 + 30.170 = 30.728 millones de bbl

Remanente a fin de 2025 = RTRP_IAPG(31/12/2024) − P_VM(2025) × 6,2898
Horizonte de referencia = Remanente a fin de 2025 / (P_VM(2025) × 6,2898)   (Pmean, con la estimación baja y la alta del IAPG)
   Remanente a fin de 2025 = aproximación propia, no publicada por el IAPG
```

Por qué se usa el total del IAPG y no «lo extraído propio + 30.170»: así el denominador es una cifra publicada, no una reconstrucción propia que mezcla dos contabilidades de la producción. El costo es que el numerador (Capítulo IV) mide 3,5 % menos que lo extraído según el IAPG al 31/12/2024; eso se declara.

---

## 3. Variables

| Variable | Definición | Unidad | Alcance | Fecha |
|---|---|---|---|---|
| `Q_NC(2006 → año)` | Suma de `prod_pet` (negativos → 0) de **todos** los pozos del CSV no convencional con `cuenca = NEUQUINA` | m³ | Petróleo NC de la cuenca Neuquina (shale + tight, todas las formaciones) | enero de 2006 al 31/12 del año (2026: hasta agosto) |
| `Q_VM(2006 → año)` | Igual, solo `formacion = 'vaca muerta'` | m³ | Fm. Vaca Muerta | ídem |
| `P_NC(2025)`, `P_VM(2025)` | Producción del año 2025 | m³ | ídem | 2025 completo |
| `R_1P(31/12/2025)` | Reservas comprobadas de petróleo no convencional, cuenca Neuquina, hoja «fin de vida util» (Mm³ × 1.000) | m³ | NC cuenca Neuquina | 31/12/2025 |
| `RTRP_IAPG` | Recursos remanentes técnicamente recuperables de petróleo, Pmean (P90 y P10 aparte) | millones de bbl | Fm. Vaca Muerta, cuenca Neuquina | 31/12/2024 |
| `Extraído_IAPG` | Petróleo ya extraído según el IAPG | millones de bbl | Fm. Vaca Muerta | 31/12/2024 |
| `6,2898` | barriles por m³ (1 bbl = 0,158987 m³) | bbl/m³ | — | — |

---

## 4. Resultados recalculados

### Conversiones

- Reservas: 414.491,8 Mm³ × 1.000 = 414.491.800 m³ × 6,2898 = **2.607 millones de bbl**.
- IAPG total: 30.728 × 10⁶ bbl ÷ 6,2898 = **4.885,4 millones de m³**.
- Producción VM 2025: 29.106.869 m³ × 6,2898 = **183,08 millones de bbl**.
- Extraído VM al 31/12/2024 (Capítulo IV): 85.653.484 m³ × 6,2898 = 538,7 millones de bbl (IAPG: 558; −3,5 %).

### «Lo confirmado»

- Inventario de referencia = 119.207.354 + 414.491.765 = **533.699.120 m³**.
- % 2025 = 119.207.354 / 533.699.120 = **22,34 %** (antes 21,68 %).
- Horizonte = 414.491.765 / 29.319.874 = **14,1 años** (antes 14,2).

### «Lo que podría haber»

- % 2025 = 114.760.353 × 6,2898 / 30.728 × 10⁶ = 721,8 / 30.728 = **2,35 %** (antes 2,34 %).
- Remanente a fin de 2025 = 30.170 − 183,08 = **29.987 millones de bbl** (estimación baja 17.879 · alta 44.867). **Aproximación propia**, no una estimación publicada por el IAPG; no modifica el total fijo de 30.728 que usa el porcentaje.
- Horizonte = 29.987 / 183,08 = **163,8 años** (con la estimación baja y la alta del IAPG: 97,7 y 245,1). Es un rango entre estimaciones del estudio, no un intervalo de confianza.

### Serie (% extraído)

| Año | Q_VM (m³) | Q_NC (m³) | % reservas antes → ahora | % IAPG antes → ahora |
|---|---|---|---|---|
| 2010 | 38.973 | 205.264 | 0,01 → 0,04 | 0,00 → 0,00 |
| 2013 | 655.716 | 1.206.951 | 0,12 → 0,23 | 0,01 → 0,01 |
| 2015 | 2.901.182 | 3.862.204 | 0,55 → 0,72 | 0,06 → 0,06 |
| 2020 | 21.887.728 | 24.951.502 | 4,14 → 4,68 | 0,45 → 0,45 |
| 2024 | 85.653.484 | 89.887.480 | 16,18 → 16,84 | 1,74 → 1,75 |
| 2025 | 114.760.353 | 119.207.354 | 21,68 → 22,34 | 2,34 → 2,35 |
| 2026 (hasta ago.) | 138.789.457 | 143.374.979 | 26,22 → 26,86 | 2,83 → 2,84 |

Los años previos a 2019 cambian más en la tarjeta de reservas porque el tight (Lajas, Punta Rosada, Mulichinco) pesaba más en el no convencional de esos años.

---

## 5. Serie histórica y 2026

- **% extraído:** se calcula para todos los años del dial con un denominador **fijo** (inventario 2025 o total IAPG 2024). Se rotula como «porción extraída del inventario de referencia», nunca como lo que se conocía en ese año.
- **Horizonte:** un único valor, igual en todo el dial. Se eliminan los campos `anios_restantes_*` por año.
- **2026 (enero-agosto):** el % usa lo extraído hasta agosto. No se anualiza ni se extrapola nada. El horizonte no se recalcula con datos de 2026.
- **Años con producción cero o nula:** el % no los necesita (el denominador es fijo); como ya no hay división por la producción de cada año, desaparece el riesgo de dividir por cero o por casi cero (2006-2011). Los meses negativos se llevan a 0 (1 registro), igual que en el resto del proyecto.

---

## 6. Limitaciones para el público

1. **Reserva no es recurso.** Las reservas comprobadas son la parte segura y rentable hoy del recurso; el recurso técnicamente recuperable incluye además lo probable, lo posible, lo contingente y lo no descubierto. Los dos % no se comparan entre sí.
2. **Totales fijos.** Reservas al 31/12/2025; IAPG al 31/12/2024. El % de 2015 compara con lo que se sabe hoy, no con lo que se sabía en 2015.
3. **Alcance.** Las reservas no se publican por formación: la tarjeta de reservas usa todo el no convencional de la cuenca Neuquina (≈ 99 % Vaca Muerta).
4. **Horizonte.** Supone producción constante al nivel de 2025. La producción crece (29 % en 2025) y las reservas se revisan cada año: no es una fecha de agotamiento.
5. **Diferencia de extraído.** Capítulo IV da 3,5 % menos de lo extraído de Vaca Muerta que el IAPG al 31/12/2024.
6. **EIA 2013.** Estimación con otro método (volumétrico con factores de riesgo, recurso «no probado») y antes de casi toda la producción. Que el número nuevo sea +86 % (remanente) o +89 % (total) muestra cuánto cambió la estimación, no cuánto petróleo «apareció».
7. **Condensado.** El IAPG incluye la zona de gas y condensado; la producción de Capítulo IV probablemente también incluye condensado (ya figura en las limitaciones del valor del petróleo).
8. **Reservas hasta fin de vida útil.** Si se contaran solo hasta el fin de las concesiones serían 407,2 millones de m³. Se usa fin de vida útil porque es la misma base («Reservas FVU») que usa el IAPG.

---

## 7. Textos para la web (ya incorporados en `web/textos.js`)

### Encabezado

- Línea de años: «Horizonte ≈ {n} años al ritmo de 2025».
- Fuente de la tarjeta del IAPG: «IAPG (al 31/12/2024)».

### «Lo confirmado» — (i)

**Qué estoy viendo.** Qué parte del petróleo «confirmado» ya se extrajo. El total de referencia es lo extraído hasta fines de 2025 más las reservas comprobadas a esa fecha: el petróleo que las empresas declaran, con datos geológicos y de ingeniería, que se puede extraer y vender con razonable certeza (al menos 90 % de probabilidad). La barra muestra qué parte de ese total de 2025 ya había salido en el año del dial. Debajo, cuántos años durarían las reservas de fines de 2025 al ritmo de producción de 2025: es un número fijo, que no es un pronóstico de producción ni una fecha de agotamiento, porque las reservas se revisan cada año y suelen crecer a medida que se perforan y confirman nuevas zonas. Petróleo confirmado = lo ya extraído + las reservas comprobadas al 31/12/2025. Incluye todo el petróleo no convencional de la Cuenca Neuquina, porque la Secretaría de Energía no publica las reservas separadas por formación; Vaca Muerta es la gran mayoría. Estas estimaciones corresponden solo al petróleo. Para el gas no hay una estimación actualizada comparable: la última (EIA, 2013) calculaba unos 308 billones de pies cúbicos técnicamente recuperables en Vaca Muerta.

**Detalle.** Porción extraída del inventario comprobado de referencia 2025. Reservas comprobadas de petróleo no convencional de la cuenca Neuquina al 31/12/2025: 414,5 millones de m³ (2.607 millones de barriles). Lo extraído de ese mismo petróleo hasta el 31/12/2025: 119,2 millones de m³. Total de referencia: 533,7 millones de m³.

**Cálculo.** % extraído = petróleo no convencional de la cuenca Neuquina extraído desde enero de 2006 hasta el año del dial ÷ (lo extraído hasta el 31/12/2025 + reservas comprobadas al 31/12/2025) × 100. En 2025: 119,2 ÷ 533,7 = 22,3 %. Horizonte = reservas comprobadas ÷ producción de 2025 = 414,5 ÷ 29,3 millones de m³ ≈ 14 años; es el mismo para todos los años del dial. Las reservas se publican en miles de m³ y se multiplican por 1.000; 1 m³ = 6,2898 barriles.

**Período.** Reservas: al 31/12/2025 (hasta el fin de la vida útil de los yacimientos). Producción: enero de 2006 a agosto de 2026. 2026 está incompleto: su porcentaje incluye lo extraído hasta agosto.

**Fuente.** Secretaría de Energía, reservas al 31/12/2025 (hoja «fin de vida útil», no convencional, comprobadas, petróleo) · Resolución 324/2006 · Resolución 482/1998 · Capítulo IV.

**Limitaciones.** Para que las dos partes de la cuenta midan lo mismo, se usa todo el petróleo no convencional de la cuenca Neuquina y no solo Vaca Muerta: las reservas no se publican por formación. Vaca Muerta fue el 99,3 % de esa producción en 2025 y el 96 % de lo extraído hasta 2025. El total de referencia es el de fines de 2025: en los años anteriores no se conocía esa cifra, así que el porcentaje de cada año compara con lo que se sabe hoy, no con lo que se sabía entonces. Si se contaran las reservas solo hasta el fin de las concesiones serían 407,2 millones de m³. El horizonte supone un ritmo constante, pero la producción crece y las reservas cambian cada año: no es un pronóstico de producción ni una fecha de agotamiento. Esta tarjeta mide todo el no convencional de la cuenca Neuquina al 31/12/2025; la de recursos, solo la Formación Vaca Muerta al 31/12/2024: sus porcentajes no se comparan entre sí.

### «Lo que podría haber» — (i)

**Qué estoy viendo.** Qué parte del petróleo que podría extraerse de Vaca Muerta con la tecnología actual ya se extrajo, sin considerar si sería rentable hacerlo. Lo estimó el Instituto Argentino del Petróleo y del Gas (IAPG) a pedido de la Secretaría de Energía, con datos al 31/12/2024. Incluye las reservas y además petróleo que todavía no está confirmado o que hoy no sería rentable: por eso es mucho mayor. Debajo, cuántos años alcanzaría lo que queda al ritmo de producción de 2025: un número fijo e ilustrativo, que no es un pronóstico de producción ni una fecha de agotamiento. El total estimado por el IAPG incluye lo ya extraído más el recurso remanente. Estas estimaciones corresponden solo al petróleo. Para el gas no hay una estimación actualizada comparable: la última (EIA, 2013) calculaba unos 308 billones de pies cúbicos técnicamente recuperables en Vaca Muerta.

**Detalle.** Porción extraída del total técnicamente recuperable estimado por el IAPG. Recursos remanentes técnicamente recuperables de petróleo de la Formación Vaca Muerta al 31/12/2024: 30.170 millones de barriles (mejor estimación; entre 18.062 y 45.050 millones según la estimación baja y la alta del IAPG). Ya extraído a esa fecha, según el IAPG: 558 millones de barriles. Total estimado: 30.728 millones de barriles (4.885 millones de m³). Lo remanente incluye las reservas comprobadas, probables y posibles, los recursos contingentes y los prospectivos.

**Cálculo.** % extraído = petróleo de los pozos de Vaca Muerta extraído desde enero de 2006 hasta el año del dial ÷ 30.728 millones de barriles × 100 (1 m³ = 6,2898 barriles). En 2025: 721,8 ÷ 30.728 = 2,35 % (se muestra como 2,3 %). Horizonte = remanente aproximado a fines de 2025 ÷ producción de 2025. Ese remanente es una aproximación propia, no una estimación publicada por el IAPG: 30.170 − 183 millones de barriles producidos en 2025 = 29.987 millones. 29.987 ÷ 183 ≈ 164 años; entre ≈ 98 y ≈ 245 años con la estimación baja y la alta del IAPG. El horizonte no cambia el total fijo de 30.728 que usa el porcentaje, y es el mismo para todos los años del dial.

**Período.** Estimación del IAPG al 31/12/2024 (informe de julio de 2026, comunicado el 12/08/2026). Producción: enero de 2006 a agosto de 2026; 2026 está incompleto.

**Fuente.** IAPG (julio de 2026), informe técnico · Ministerio de Economía, comunicado del 12/08/2026 · EIA (2013) · Capítulo IV.

**Limitaciones.** Es un recurso, no una reserva: no asegura que ese petróleo se vaya a extraer. Lo extraído según el IAPG (558 millones de barriles al 31/12/2024) es un 3,5 % mayor que lo que suman los pozos de Vaca Muerta en Capítulo IV (539 millones), así que el porcentaje puede estar levemente subestimado. El IAPG incluye la zona de gas y condensado de la formación. El horizonte supone un ritmo constante: no es un pronóstico de producción ni una fecha de agotamiento. Esta tarjeta mide solo la Formación Vaca Muerta al 31/12/2024; la de reservas, todo el no convencional de la cuenca Neuquina al 31/12/2025: sus porcentajes no se comparan entre sí. La EIA estimó en 2013 16.220 millones de barriles con otro método, como recurso «no probado» y antes de casi toda la producción: la diferencia (+86 % para lo remanente, +89 % para el total) muestra cuánto cambió la estimación, no cuánto petróleo «apareció».

### Módulo «¿Por qué dos respuestas?»

- **Recurso técnicamente recuperable:** Es el petróleo que podría extraerse con la tecnología actual, sin importar los precios ni los costos de producción (definición de la EIA, 2013). Es una categoría más amplia que las reservas comprobadas, que solo cuentan lo que puede recuperarse de forma comercial, con razonable certeza, en las condiciones actuales. En el estudio del IAPG (2026, norma PRMS 2018), los recursos remanentes se definen como la suma de las reservas (comprobadas, probables y posibles), los recursos contingentes (ya descubiertos, pero que todavía no son comerciales) y los recursos prospectivos (aún no descubiertos); es la clasificación de ese estudio, no una equivalencia válida para todas las clasificaciones de recursos. Que un volumen sea técnicamente recuperable no significa que vaya a extraerse ni que sea rentable hacerlo.
- **Cierre:** Lo confirmado es una categoría más acotada y comercialmente definida; lo que podría haber abarca, además, volúmenes cuya extracción comercial no está demostrada. En este sitio las dos cifras también tienen distinto alcance y fecha: las reservas son de todo el no convencional de la cuenca Neuquina al 31/12/2025; los recursos, de la Formación Vaca Muerta al 31/12/2024. Por eso sus porcentajes y horizontes no se comparan entre sí ni se restan. La distancia entre las dos cifras depende de la exploración, la inversión, los precios y la tecnología de los próximos años. Estas estimaciones corresponden solo al petróleo. Para el gas no hay una estimación actualizada comparable: la última (EIA, 2013) calculaba unos 308 billones de pies cúbicos técnicamente recuperables en Vaca Muerta.

También se actualizaron: el (i) del dial, el (i) del hito «Estudio IAPG» y los párrafos de Períodos, Cálculos, Limitaciones y Fuentes de la metodología.

---

## 8. Cambios en el código

| Archivo | Cambio |
|---|---|
| `scripts/indicadores_petroleo.py` (**nuevo**) | Calcula los dos % y los horizontes con alcance y fecha compatibles; agrega a `serie_anual_vm.json` los campos `petroleo_nc_neuquina_m3`, `petroleo_nc_neuquina_acumulado_m3`, reescribe `pct_extraido_reservas` y `pct_extraido_iapg` (4 decimales, para no redondear dos veces en la web), elimina `anios_restantes_*` y escribe `meta.indicadores_petroleo` (todas las cifras intermedias, fórmulas, fechas y alcances). Constantes del IAPG: `IAPG_RTRP_MMBO`, `IAPG_EXTRAIDO_MMBO`, `IAPG_RRP_MMBO`, `IAPG_ANIO_REF = 2024`. Verifica con `assert` la estructura y la fecha del Excel y que el acumulado VM coincida con el de `procesar.py`. |
| `scripts/procesar.py` | Se eliminaron `EIA_BBL`, `IAPG_REMANENTES_BBL`, `RESERVAS_ESPERADAS_MM3`, la función `reservas_neuquina_nc_comprobadas_pet()`, el bloque «10-11» (`D_res`, `D_eia`, `D_iapg` y las seis columnas `pct_*`/`anios_*`), los campos de la fila y `meta.denominadores`. Al final de `main()` llama a `indicadores_petroleo.main()`. |
| `scripts/test_indicadores.py` (**nuevo**) | 173 pruebas de consistencia (punto 9). |
| `datos/procesados/serie_anual_vm.json` y `web/datos/serie.js` | Regenerados con el script nuevo (sin volver a correr `procesar.py`: el resto de los campos no cambió). |
| `web/app.js` | `CAB`: el campo `anios` se reemplazó por `horizonte`, que lee `D.serie.meta.indicadores_petroleo`. `actualizarCabecera()`: se eliminó el cálculo de años por año del dial y el caso especial de 2026; el horizonte es fijo y usa `T.cabecera.anioRitmo`. |
| `web/textos.js` | Nueva constante `FUENTE_IAPG`; `cabecera.anios`, `cabecera.anioRitmo`, `cabecera.iapg.fuente`; `modulo.recurso`, `modulo.cierre`; `info.dial.n2.limite`; `info.tarjeta_reservas`, `info.tarjeta_iapg`; `hitos.estudio_iapg_2026`; metodología (Períodos, Cálculos, Limitaciones, Fuentes). |

Copia de los archivos anteriores: `_backup_auditoria_indicadores_20261014/`.

**Para regenerar todo desde cero** (si algún día volvés a correr el procesamiento): `python scripts/procesar.py`, después `python scripts/preparar_web.py` y `python scripts/test_indicadores.py`.

---

## 9. Pruebas de consistencia (`scripts/test_indicadores.py`)

1. `web/datos/serie.js` es idéntico a `serie_anual_vm.json` (la web muestra lo procesado).
2. Unidades: 414.491,8 Mm³ × 1.000; m³ × 6,2898 = bbl; 30.170 + 558 = 30.728 (y lo mismo para P90 y P10); total IAPG en m³ × 6,2898 = 30.728 millones de bbl.
3. Fechas de referencia: reservas 2025-12-31, IAPG 2024-12-31.
4. Acumulados: cada año = año anterior + producción del año (VM y NC), sin saltos ni doble conteo; NC ≥ VM en todos los años; el acumulado del denominador es el de 2025.
5. Porcentajes: se recalculan desde los datos (tolerancia 0,0001 puntos), están entre 0 y 100 y no bajan nunca.
6. No queda ningún `anios_restantes_*`.
7. Horizontes: se recalculan; P90 < media < P10.
8. 2026 está marcado como parcial hasta agosto; 2025 está completo.
9. Interfaz: `app.js` no lee `anios_restantes`; las cifras que citan los textos (22,3 %, 2,3 %, 119,2, 533,7, 414,5, 29,3, ≈ 14, ≈ 164, ≈ 98, ≈ 245, 30.728, 31/12/2024, 3,5 %, 722, 183) coinciden con las calculadas; no quedan frases viejas («fecha de referencia no informada», «años restantes con el ritmo de 2025», «IAPG (2026)»); ningún texto atribuye «89 %» a los 30.170.

Además se verificó en Chromium (1366×768) que el encabezado muestra, con el dial en 2010, 2025 y 2026: «22,3 % / Horizonte ≈ 14 años al ritmo de 2025» y «2,3 % / Horizonte ≈ 164 años al ritmo de 2025» (en 2025), sin errores de JavaScript (el mapa no se pudo dibujar porque la librería deck.gl viene de internet y no se podía cargar en el entorno de prueba).

---

## 10. Pendientes de la autora

- Comprobar a ojo las páginas citadas del PDF del IAPG.
- Completar la URL oficial del Excel de reservas al 31/12/2025.
- Decidir si el título de la tarjeta también debe decir «porción extraída del inventario de referencia» (hoy lo dice el (i), para no cambiar el diseño).
- Agregar el informe del IAPG a la lista de fuentes del documento de entrega del concurso.

---

## 11. Segunda revisión (14/10/2026)

Tras la revisión de la autora:

- **Numerador del % IAPG (opción A):** se mantiene Capítulo IV como fuente única de lo extraído en toda la serie (2025: 114.760.353 m³ × 6,2898 = 721,8 millones de bbl; 721,8 ÷ 30.728 = 2,349 %). No se mezcla con los 558 del IAPG: hacerlo daría 2,41 % en 2025, pero cambiaría de fuente a mitad de la serie. La brecha de 3,5 % al 31/12/2024 queda documentada.
- **Alcance del CSV verificado:** todas sus filas son `tipo_de_recurso = NO CONVENCIONAL`; el filtro es `cuenca = NEUQUINA` (shale 138,97 + tight 4,38 + sin subtipo 0,02 millones de m³ hasta agosto de 2026). No incluye convencional. Riesgo residual: que una operadora clasifique distinto un yacimiento en reservas y en producción (61 de 62 yacimientos con reservas se encuentran en el CSV).
- **Textos:** (1) el remanente de 29.987 se rotula como aproximación propia; (2) el rango se llama «estimación baja y alta del IAPG», no P90–P10 ni intervalo de confianza; (3) los horizontes dicen «no es un pronóstico de producción ni una fecha de agotamiento»; (4) el módulo presenta la suma de categorías como la clasificación del estudio del IAPG, no como una equivalencia universal, y las dos tarjetas advierten la diferencia de alcance y fecha.
- **Pruebas nuevas (34):** % IAPG 2025 = 721,8 / 30.728; redondeo de la interfaz igual al del valor exacto; horizonte con 29.987 y 183; el total fijo de 30.728 no cambia; % de todos los años con ese total; presencia de las frases de alcance, fecha y aclaraciones. Total: 207 pruebas, todas correctas. Verificación en Chromium sin errores de JavaScript.

---

## 12. Tercera revisión: horizonte que cambia con el dial (14/10/2026)

A pedido de la autora, el horizonte vuelve a cambiar con el año del dial (reemplaza al horizonte fijo de las secciones 2, 4 y 5). Pregunta que responde: ¿cuántos años cubriría el volumen de referencia restante si la producción se mantuviera al ritmo del año seleccionado?

**Fórmula:** H(t) = R(t) / P(t), sin redondeos intermedios; se redondea solo al mostrar.

| Tarjeta | R(t) | P(t) | Unidad |
|---|---|---|---|
| Lo confirmado | (acumulado NC cuenca Neuquina a fin de 2025 + reservas comprobadas al 31/12/2025) − acumulado NC hasta t. En 2025 = reservas comprobadas. | producción NC cuenca Neuquina del año t | m³ |
| Lo que podría haber | 30.728 − [558 + (acumulado VM Cap. IV hasta t − acumulado VM Cap. IV hasta 2024)]. En 2024 = 30.170 (IAPG); en 2025 = 29.987 (aproximación propia). Mismo cálculo con la estimación baja (18.062) y la alta (45.050). | producción VM del año t × 6,2898 | millones de bbl |

**Convención temporal del IAPG:** lo extraído hasta la fecha del estudio se toma del propio IAPG (558) y de Capítulo IV solo la producción anual antes y después de esa fecha. Así R(2024) coincide exactamente con la cifra publicada y la diferencia de nivel de 3,5 % entre las dos fuentes no se traslada al remanente. El % histórico sigue usando Capítulo IV en todo el numerador (opción A). Si se restara el acumulado de Capítulo IV directamente de 30.728, R(2025) daría 30.006 en lugar de 29.987 (19 millones de bbl de diferencia, 0,06 %): el horizonte mostrado no cambia (164 años).

**2026 (parcial):** R descuenta lo extraído hasta agosto de 2026 (sin revisión de reservas posterior al 31/12/2025 ni nueva estimación del IAPG); P = producción de 2025, sin anualizar 2026. La tarjeta lo indica: «al ritmo de 2025 (2026 incompleto)».

**Producción cero o faltante:** no se divide; la tarjeta muestra «no calculable». Ningún año del dial tiene producción cero (el primero, 2010, tiene 65.719 m³ NC y 11.672 m³ VM), pero el caso está probado con datos sintéticos.

**Valores muy altos:** por encima de 1.000 años la tarjeta muestra «más de 1.000 años al ritmo de {año}». El valor exacto, con R y P, figura en el (i) de cada tarjeta para el año elegido.

**Comprobación manual (años del dial):**

| Año | Reservas: R ÷ P | H | IAPG: R ÷ P (media) | H (baja – alta) |
|---|---|---|---|---|
| 2010 | 533,49 ÷ 0,0657 millones de m³ | 8.117,9 | 30.708,5 ÷ 0,0734 | 418.287 (253.362 – 620.971) |
| 2020 | 508,75 ÷ 6,939 | 73,3 | 30.571,1 ÷ 41,40 | 738,4 (445,9 – 1.097,8) |
| 2025 | 414,49 ÷ 29,32 | 14,1 | 29.986,9 ÷ 183,08 | 163,8 (97,7 – 245,1) |
| 2026* | 390,32 ÷ 29,32 | 13,3 | 29.835,8 ÷ 183,08 | 163,0 (96,8 – 244,3) |

\* R hasta agosto de 2026; P de 2025.

Los porcentajes históricos no cambiaron (2025: 22,34 % y 2,35 %).

**Pruebas:** 457 en `scripts/test_indicadores.py`, todas correctas (fórmulas año por año, unidades, años de referencia 2024/2025, 2026 parcial, producción cero y faltante con datos sintéticos, valores manuales de 2010, 2020, 2025 y 2026, % intactos, textos). Control negativo: al alterar a mano el horizonte de 2020, 7 pruebas fallan como se espera. Verificación en Chromium: el horizonte cambia con el dial (2010 «más de 1.000», 2014 474, 2020 73 / 738, 2025 14 / 164, 2026 13 / 163) y el (i) muestra el valor exacto; sin errores de JavaScript.
