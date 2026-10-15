> **Nota (2026-10-08):** este archivo es un registro histórico de la versión anterior. Los textos vigentes de los (i) están en `web/textos.js` (dos niveles: «Qué estoy viendo» y «Cómo se calculó»).

# Borrador de tooltips (i)

**BORRADOR** para editar. Estructura de cada uno: *Qué es / Cómo se calculó / Fuente / Limitación* (máx. 4 líneas). Los links marcados ❓ están pendientes. Las cifras entre `{llaves}` salen de `serie_anual_vm.json` según el año del dial.

Convención: "Cap. IV" = Capítulo IV, Secretaría de Energía — <https://datos.gob.ar/dataset/energia-produccion-petroleo-gas-por-pozo-capitulo-iv>

---

## 0. Tarjetas de la intro y títulos
- **Título (intro, explorador, `<title>`, README):** «¿Cuánto petróleo queda en Vaca Muerta?»
- **Tarjeta «Lo extraído del petróleo estimado»:** «del petróleo confirmado ya se extrajo…» / «…pero solo {v} % del petróleo que podría haber en total».
- **Cierre de «¿Por qué dos respuestas?»:** termina con: Estas estimaciones corresponden solo al petróleo. Para el gas no hay una estimación actualizada comparable: la última (EIA, 2013) calculaba unos 308 billones de pies cúbicos técnicamente recuperables en Vaca Muerta.

---

## 1. Barras del titular (% extraído, tres denominadores)

### 1a. Según reservas
- **Qué es:** porcentaje del petróleo de Vaca Muerta ya extraído, si el "total" fuera lo producido más las reservas comprobadas no convencionales de la cuenca Neuquina.
- **Cómo se calculó:** petróleo acumulado desde 2006 ÷ (acumulado a fin de 2025 + 414,5 millones de m³ de reservas).
- **Fuente:** Cap. IV (producción) y Secretaría de Energía, reservas al 31/12/2025 (❓ link pendiente).
- **Aclaración (nivel 1):** Petróleo confirmado = lo ya extraído + las reservas comprobadas al 31/12/2025. Incluye todo el petróleo no convencional de la Cuenca Neuquina, porque la Secretaría de Energía no publica las reservas separadas por formación; Vaca Muerta es la gran mayoría. Estas estimaciones corresponden solo al petróleo. Para el gas no hay una estimación actualizada comparable: la última (EIA, 2013) calculaba unos 308 billones de pies cúbicos técnicamente recuperables en Vaca Muerta.
- **Limitación:** las reservas son una foto al 31/12/2025 y no distinguen Vaca Muerta de otros no convencionales de la cuenca; el denominador es fijo para todos los años.

### 1b. Según EIA
- **Qué es:** porcentaje extraído respecto del recurso técnicamente recuperable que la EIA proyectó para Vaca Muerta en 2013 (16.220 millones de barriles).
- **Cómo se calculó:** petróleo acumulado desde 2006 ÷ 16.220 millones de barriles (sin sumar lo extraído).
- **Fuente:** comunicado del Ministerio de Economía del 12/08/2026 — <https://www.argentina.gob.ar/noticias/vaca-muerta-aumento-en-un-89-sus-recursos-de-petroleo-respecto-de-las-ultimas-estimaciones>
- **Limitación:** estimación de 2013, anterior a casi toda la producción; la presentación de la EIA de 2013 solo muestra el recurso de gas (308 Tcf), no el de petróleo.

### 1c. Según IAPG
- **Qué es:** porcentaje extraído considerando los recursos remanentes técnicamente recuperables estimados por el IAPG (30.170 millones de barriles).
- **Cómo se calculó:** acumulado ÷ (acumulado a fin de 2025 + 30.170 millones de barriles), igual que las reservas.
- **Fuente:** estudio del IAPG (asociación civil de la industria) a pedido de la Secretaría de Energía, citado en el comunicado oficial del 12/08/2026 (link de 1b).
- **Aclaración (nivel 1):** El total estimado por el IAPG incluye lo ya extraído más el recurso remanente. Estas estimaciones corresponden solo al petróleo. Para el gas no hay una estimación actualizada comparable: la última (EIA, 2013) calculaba unos 308 billones de pies cúbicos técnicamente recuperables en Vaca Muerta.
- **Limitación:** el comunicado no informa la fecha de referencia de los remanentes; una diferencia de pocos meses no altera el resultado de forma significativa (el % sigue en torno al 2,3%).

---

## 2. Años restantes
- **Qué es:** cuántos años durarían el petróleo restante al ritmo de extracción de ese año.
- **Cómo se calculó:** (denominador − acumulado a fin de ese año) ÷ producción de petróleo de ese año, para cada uno de los tres denominadores.
- **Fuente:** Cap. IV y las fuentes de cada denominador (ver 1a–1c). Referencia externa citada: el IAE estima un horizonte de reservas probadas de petróleo de 13 años (nuestro cálculo con reservas da 14,2 en 2025), como validación independiente.
- **Limitación:** es un cálculo ilustrativo, no un pronóstico; con reservas e IAPG solo es estrictamente válido para 2025, y en el año parcial (2026) no se calcula.

---

## 3. Pozos del mapa
- **Qué es:** pozos de Vaca Muerta con producción de petróleo o gas; cada punto aparece el mes de su primera producción.
- **Cómo se calculó:** pozos con formación "vaca muerta" en el CSV no convencional del Cap. IV; posición y fecha de aparición (primer mes con producción > 0) del mismo CSV. Se excluyen 54 pozos que nunca produjeron.
- **Fuente:** Cap. IV (producción no convencional); límite de la cuenca: <https://datos.gob.ar/dataset/exploracion-hidrocarburos-cuencas-sedimentarias>
- **Limitación:** incluye todos los tipos de pozo (el IAE cuenta 2.184 petrolíferos y 685 gasíferos, solo esos dos tipos; son bases distintas). Referencia citada del IAE: 3,9% de la superficie útil de Vaca Muerta ya fue perforada.

---

## 4. Petróleo
- **Qué es:** petróleo producido por los pozos de Vaca Muerta en el año, en m³ y en barriles.
- **Cómo se calculó:** suma de `prod_pet` mensual de los pozos VM; 1 m³ = 6,2898 barriles.
- **Fuente:** Cap. IV. Control: coincide con la serie histórica de shale (diferencia máxima −3,2%, año 2015) y el acumulado a fin de 2025 con los 722 millones de barriles del IAE (−0,02%).
- **Limitación:** la unidad (m³) está inferida de las series oficiales, no declarada en el CSV. 2026 es parcial (hasta agosto).

## 5. Gas
- **Qué es:** gas producido por los pozos de Vaca Muerta en el año.
- **Cómo se calculó:** suma de `prod_gas` mensual de los pozos VM, en miles de m³.
- **Fuente:** Cap. IV.
- **Limitación:** unidad inferida (miles de m³), no declarada en el CSV; incluye gas de pozos petrolíferos y gasíferos. 2026 es parcial.

## 6. Valor del petróleo (USD)
- **Qué es:** valor aproximado del petróleo extraído en el año, a precio del crudo de Neuquén.
- **Cómo se calculó:** para cada mes, `prod_pet` VM (m³) × precio del crudo de Neuquén (USD/m³); se suman los meses. Solo meses definitivos (hasta junio de 2026).
- **Fuente:** Cap. IV (producción) y Secretaría de Energía, regalías de crudo — <https://datos.gob.ar/dataset/regalias-de-petroleo-crudo-gas-natural-glp-gasolina-y-condensado>
- **Limitación:** el `prod_pet` del Cap. IV probablemente incluye condensado, valuado igual al precio del crudo de Neuquén; no es un ingreso real ni descuenta costos. Referencia citada del IAE (no son datos abiertos): regalías de Vaca Muerta hasta la fecha ~USD 4.591 M (petróleo) y ~USD 1.879 M (gas).

---

## 7. Agua de fractura
- **Qué es:** agua inyectada para fracturar los pozos de Vaca Muerta, por año de inicio de la fractura (m³).
- **Cómo se calculó:** suma de `agua_inyectada_m3` por pozo y año; se eliminaron 5 duplicados exactos y 3 registros con un valor repetido (537.184,6 m³).
- **Fuente:** Datos de fractura (Adjunto IV): ❓ link pendiente.
- **Limitación:** incluye 243.794 m³ de 7 pozos que no aparecen en el mapa por no tener producción; cubre 3.014 de 3.417 pozos VM; hay registros con valores extremos o agua = 0.

## 8. Arena
- **Qué es:** arena bombeada en las fracturas de Vaca Muerta, por año (toneladas).
- **Cómo se calculó:** suma de arena nacional + importada por pozo y año de inicio de fractura.
- **Fuente:** Datos de fractura (Adjunto IV): ❓ link pendiente.
- **Limitación:** mismas que el agua de fractura; no distingue tipo ni granulometría de arena.

## 9. Agua producida
- **Qué es:** agua que sale junto con el petróleo y el gas de los pozos de Vaca Muerta en el año.
- **Cómo se calculó:** suma de `prod_agua` mensual de los pozos VM.
- **Fuente:** Cap. IV.
- **Limitación:** ❓ la unidad no está declarada; se asume m³ (a confirmar). No informa tratamiento ni destino del agua.

---

## 10. Dial de años
- **Qué es:** selector de año (2012–2026) que actualiza el mapa y los indicadores; 2026 es un año parcial.
- **Cómo se calculó:** los indicadores son anuales; los pozos se muestran desde el mes de su primera producción.
- **Fuente:** Cap. IV (último dato: agosto de 2026).
- **Limitación:** 2026 llega hasta agosto (valor del petróleo hasta junio); los años restantes de 2026 no se calculan.

## 11. Hitos del dial
Los hitos son referencias contextuales, no se afirma que causen cambios en la producción. Datos en `datos/procesados/hitos.json`.

### 11a. Acuerdo YPF–Chevron (16/07/2013)
- **Qué es:** acuerdo para la explotación conjunta de no convencionales en Loma Campana y Loma La Lata Norte (Vaca Muerta, Neuquén).
- **Cómo se eligió:** hito indicado por la autora; fecha de firma.
- **Fuente:** <https://novedades.ypf.com/Conferencia_29082013.html>
- **Limitación:** es un hecho puntual; no mide su efecto sobre la producción.

### 11b. Ley 27.742 — Ley de Bases / RIGI (08/07/2024)
- **Qué es:** ley que incluye el Régimen de Incentivo para Grandes Inversiones (RIGI); sancionada el 27/06/2024.
- **Cómo se eligió:** hito indicado por la autora; se usa la fecha de publicación en el Boletín Oficial.
- **Fuente:** <https://www.boletinoficial.gob.ar/detalleAviso/primera/310189/20240708>
- **Limitación:** no se afirma efecto sobre la producción; la ley es más amplia que el sector hidrocarburífero.

### 11c. Estudio IAPG de recursos remanentes (12/08/2026)
- **Qué es:** estudio que estima 30.170 millones de barriles de recursos remanentes técnicamente recuperables de petróleo; la EIA había proyectado 16.220 millones en 2013.
- **Cómo se eligió:** hito indicado por la autora; fecha del comunicado oficial.
- **Fuente:** <https://www.argentina.gob.ar/noticias/vaca-muerta-aumento-en-un-89-sus-recursos-de-petroleo-respecto-de-las-ultimas-estimaciones>
- **Limitación:** la fecha de referencia de los remanentes no está informada; la fecha del hito es la del comunicado, no la del cálculo.
