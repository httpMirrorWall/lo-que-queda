# Registro de uso de IA

Registro para la declaración de uso de inteligencia artificial del concurso "Contar con Datos" 2026 (UdeSA). Cada entrada se completa en el momento en que se usa la herramienta.

## Entrada 1

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-06 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Auditoría de datos (previa a cualquier procesamiento) |
| **Finalidad** | Asistencia en código y revisión de datos: organizar los archivos descargados y auditar su estructura y calidad para que la autora decida qué datos usar |

**Qué hizo la herramienta**
- Descomprimió los ZIP y movió los archivos a la estructura `datos/raw/<fuente>/` (sin modificar ni borrar originales).
- Escribió `scripts/auditoria.py` (DuckDB, geopandas, openpyxl): lee los archivos en modo solo lectura y genera `docs/auditoria_detalle.md`.
- Redactó `docs/auditoria.md` (inventario, auditoría por archivo, verificaciones específicas, propuesta de uso de cada dato, problemas de limpieza con opciones y riesgos) y este registro.
- Instaló librerías de Python (`duckdb`, `geopandas`, `pyogrio`, `openpyxl`, `chardet`) en el equipo de la autora.

**Qué NO hizo la herramienta**
- No procesó, limpió ni transformó datos; `datos/procesados/` está vacía.
- No generó gráficos, visualizaciones ni código de visualización.
- No tomó decisiones de contenido: los problemas de limpieza figuran con opciones y quedan sin resolver.

**Supervisión humana y decisiones de la autora**
- La autora definió el alcance (solo auditoría) y las preguntas a verificar.
- Las decisiones sobre qué datos usar, cómo definir "Vaca Muerta", cómo tratar monedas/unidades y cómo resolver cada problema de calidad quedan a cargo de la autora (listadas en `docs/auditoria.md`, secciones 5 y 6).
- Los resultados de la auditoría son reproducibles con `python scripts/auditoria.py`. Las unidades del petróleo y el gas de la producción son **inferidas** (no hay metadatos) y están marcadas como tales; la autora debe validarlas contra la fuente antes de publicar.

## Entrada 2

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-06 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Procesamiento de datos |
| **Finalidad** | Asistencia en código: escribir `scripts/procesar.py`, que aplica las decisiones metodológicas definidas por la autora y genera `datos/procesados/pozos_vm.json`, `serie_anual_vm.json` y `cuenca_neuquina.geojson`, además de los controles de calidad y `docs/metodologia_procesamiento.md` |

**Qué hizo la herramienta:** implementó en código las 12 decisiones de la autora, ejecutó los controles de calidad, buscó en la web las fuentes externas (EIA, IAE; algunas quedaron sin confirmar) y redactó la documentación metodológica.

**Qué NO hizo:** no tomó decisiones de criterio. Los casos no cubiertos (54 pozos sin producción, 2026 parcial, regalías 2026) se señalaron en `docs/metodologia_procesamiento.md`, sección 4, para decisión de la autora. No se generaron gráficos ni visualizaciones. Los datos originales en `datos/raw/` no se modificaron.

---

## Entrada 3

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-06 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Procesamiento de datos (ajustes tras revisión de la autora) |
| **Finalidad** | Asistencia en código y análisis: aplicar los ajustes indicados por la autora a `scripts/procesar.py` (exclusión de 54 pozos sin producción, denominador EIA 16.220 M bbl, tercer denominador IAPG, tasa efectiva marcada como no aplicable a VM, links de fuentes) y escribir `scripts/investigar_regalias.py` para comparar la producción de crudo de Neuquén del Excel de regalías con el Capítulo IV (solo diagnóstico; no se corrigió nada) |

**Decisiones:** todas tomadas por la autora. La herramienta señaló cuestiones sin resolver (fecha de referencia de los remanentes IAPG, inconsistencia de la tasa efectiva, links pendientes) sin resolverlas.

---

## Entrada 4

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-06 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Documentación y preparación de contenido para la visualización (registro de fuentes, hitos y borrador de tooltips) |
| **Finalidad** | Asistencia en redacción y organización: actualizar la sección de fuentes de `docs/metodologia_procesamiento.md` con las fuentes verificadas por la autora, registrar sus decisiones, crear `datos/procesados/hitos.json` y redactar un borrador de textos de tooltips en `docs/tooltips.md` |

**Qué hizo la herramienta:** volcó a los documentos las fuentes, cifras, decisiones y hitos provistos y verificados por la autora; redactó el borrador de tooltips a partir de ellos y de los resultados ya calculados. No modificó ningún cálculo ni dato.

**Supervisión humana:** las fuentes (IAE, IAPG, EIA, comunicado oficial, Boletín Oficial, YPF) fueron verificadas por la autora; la herramienta no accedió a ellas. Los textos de tooltips son un borrador que la autora edita y aprueba.

---

## Entrada 5

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-06 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Desarrollo del frontend (datos adicionales, mapa 3D, dial, titular, paneles, (i), filtros, introducción y panel de metodología) |
| **Finalidad** | Asistencia en código: extender `scripts/procesar.py` (profundidad de pozos; valor del petróleo, agua de fractura, arena y agua producida por pozo y año), escribir `scripts/preparar_web.py` y el sitio estático de `web/` (`index.html`, `estilos.css`, `app.js`, `textos.js`) con deck.gl |

**Qué hizo la herramienta:** implementó en código el diseño descrito por la autora (disposición de la pantalla, mapa 3D con pozos como líneas verticales, dial con reproducción, hitos, paleta). Donde el diseño no estaba especificado (tipografía, tamaños, tiempos de animación, factor de exageración vertical, color de los pozos gasíferos) propuso valores sobrios y los listó para revisión de la autora.

**Supervisión humana:** el diseño, los textos y las decisiones de contenido son de la autora; los textos de `web/textos.js` son borradores que ella reescribe. Los datos originales en `datos/raw/` no se modificaron.

---

## Entrada 6

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-06 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Desarrollo del frontend (ajustes tras revisión de la autora) |
| **Finalidad** | Asistencia en código: paneles laterales con el acumulado como número principal y el valor del año debajo (filtros incluidos; petróleo y gas suman lo anterior a 2012), dial que arranca en 2025, años restantes de 2026 calculados con el ritmo de 2025, paneles sin scroll y fondo oscuro en la etiqueta «Añelo»; actualización de títulos y tooltips en `web/textos.js` |

**Qué hizo la herramienta:** implementó en `web/app.js`, `web/estilos.css` y `web/textos.js` los cinco ajustes pedidos por la autora. Los tamaños y espaciados de los paneles (escala con la altura de la ventana) son una propuesta a revisar.

**Supervisión humana:** los criterios (acumulado como cifra principal, ritmo de 2025 para 2026, año inicial) son de la autora; la herramienta no modificó datos ni cálculos de `datos/procesados/`. No se probó en un navegador: la autora debe verificar visualmente que los paneles entren sin scroll en sus pantallas.

---

## Entrada 7

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-08 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Integración del catálogo de sismos, reorganización del panel «Lo que cuesta» y rediseño visual del frontend |
| **Finalidad** | Asistencia en código y redacción: descargar y auditar el catálogo de sismos (Schultz et al., 2024, Zenodo, CC BY 4.0), escribir `scripts/procesar_sismos.py` (genera `datos/procesados/sismos.json` y `docs/auditoria_sismos.md`), mostrar los sismos en el mapa y en el panel, fusionar agua de fractura y agua producida en el bloque «Agua» (m³ por día), eliminar «Arena» como cifra propia, actualizar `web/textos.js` (atribución, metodología, fuente de la EIA) y rediseñar `web/index.html` y `web/estilos.css` (tipografía Geist, paleta, panel de dos bloques, dial, (i)) |

**Qué hizo la herramienta:** descargó el ZIP de Zenodo a `datos/raw/sismos/` y lo auditó (545 eventos, 09/11/2014 a 03/03/2024, sin faltantes, todos dentro de la cuenca); leyó `CAT.mat` con scipy (columnas numéricas) y con `mat-io` (fechas, que scipy no decodifica); eliminó 1 copia exacta (544 eventos); verificó contra el texto del artículo de Seismica el 42%, la cita de Rosa y D'Odorico (2019) y los 16,2×10⁹ bbl de la EIA (2013); implementó el diseño pedido por la autora y propuso el rediseño visual con las guías de las habilidades `design-taste-frontend-v1` e `impeccable`.

**Qué NO hizo:** no afirma causalidad entre fractura y sismos (solo cita la asociación estadística del estudio); no modificó los datos originales de `datos/raw/`; no confirmó los links pendientes (Adjunto IV, reservas).

**Supervisión humana:** la autora verificó la licencia, definió el contenido de cada bloque y la atribución. Puntos a revisar por la autora: (1) en Zenodo el registro figura con el título «RyanJamesSchultz/VM-ID: Seismica release» y un solo autor (Ryan Schultz); los cuatro autores de la atribución son los del artículo asociado; (2) la cifra de la EIA usada en el cálculo sigue siendo 16.220 millones (comunicado oficial) mientras que el informe da 16,2 mil millones; (3) el diseño visual es una propuesta y no se probó en celulares reales.

---

## Entrada 8

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-08 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Cambio de la fuente principal de sismos: del catálogo de Zenodo al del INPRES |
| **Finalidad** | Asistencia en código y redacción: auditar el archivo guardado de la búsqueda del INPRES, armar el catálogo recortado a la cuenca, compararlo con Zenodo (control), calcular conteos y atípicos, regenerar `sismos.json` y actualizar `scripts/procesar_sismos.py`, `docs/auditoria_sismos.md`, `docs/metodologia_procesamiento.md`, `web/app.js` y `web/textos.js` |

**Qué hizo la herramienta:** leyó solo el HTML guardado por la autora (no consultó el sitio del INPRES); comprobó que la tabla visible tiene 10 filas por la paginación y extrajo los 473 eventos del script de descarga embebido, que coinciden con el total de la página; recortó a la cuenca (471 eventos); comparó los conteos anuales con magnitud ≥ 2,5 con Zenodo (2015 a marzo de 2024); calculó los atípicos (profundidad > 30 km o > 20 km del pozo VM más cercano) sin eliminarlos; hizo que el panel use magnitud ≥ 2,5.

**Qué NO hizo:** no incluyó la frase sobre los sismos de 2000–2009 con una cifra, porque el archivo no tiene eventos anteriores a junio de 2014 (total 0); no eliminó atípicos; no explicó las diferencias con Zenodo más allá de señalar que Zenodo suma una red local.

**Supervisión humana:** la autora definió la fuente principal, los criterios de búsqueda, el umbral de magnitud y la redacción del «antes». Puntos a revisar por la autora: (1) por qué la búsqueda de 2000 a 2026 no devuelve eventos anteriores a 2014; (2) los 27 atípicos; (3) la diferencia de 2015–2020 con Zenodo.

---

## Entrada 9

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-08 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Catálogo combinado de sismos (INPRES + Zenodo), filtros, deduplicación y rediseño del panel de sismos; reemplaza el enfoque de la entrada 8 |
| **Finalidad** | Asistencia en código y redacción: unión de catálogos con deduplicación en UTC y controles anti-duplicados, filtros (magnitud, profundidad, área de estudio), conteos por año con fuente, `scripts/procesar_sismos.py`, `area_estudio.geojson`, `sismos.json`, `web/app.js` (panel, barras, franja de períodos, (i) dinámico por año, contorno del área en el mapa), `web/textos.js`, `web/estilos.css`, `docs/auditoria_sismos.md` y `docs/metodologia_procesamiento.md` |

**Qué hizo la herramienta:** unió los catálogos y detectó, con los controles pedidos, duplicados que el criterio inicial no atrapaba; frenó y los mostró a la autora antes de seguir; aplicó las reglas 1 a 3 que la autora decidió; probó la página en Chrome (modo headless, protocolo de depuración) para varios años del dial, sin errores de consola. Confirmó con la API pública de Zenodo el título del registro («RyanJamesSchultz/VM-ID: Seismica release»).

**Qué NO hizo:** no definió los períodos de monitoreo ni las estaciones de la red local (datos de la autora, sin verificar contra una fuente); no afirma que los sismos sean inducidos; no tocó los datos de `datos/raw/`; no probó en celulares ni en otros navegadores.

**Supervisión humana:** la autora decidió las reglas de deduplicación, el piso de magnitud 2,0, el área de estudio, los umbrales y los textos. Puntos a revisar: (1) los 5 posibles duplicados (4 de 2019 + 1 de 2020 que apareció con el mismo criterio); (2) los 19 eventos solo-Zenodo de 2021–2022, que superan el máximo de 5 por año pero son de magnitud menor a 2,5 salvo 1; (3) los 5 casos dudosos dentro del INPRES (no se tocaron); (4) en Zenodo el registro figura con un solo autor.

---

## Entrada 10

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-08 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Versión final de sismos: INPRES desde 2019 como única fuente de la capa; Zenodo como control y USGS como contexto; reemplaza las entradas 8 y 9 |
| **Finalidad** | Asistencia en código y redacción: reescritura de `scripts/procesar_sismos.py`, regeneración de `sismos.json` y `web/datos/`, `web/app.js` (anillos con destello, panel, mini gráfico con marcas, (i) dinámico y general), `web/textos.js`, `web/estilos.css`, `docs/auditoria_sismos.md` y `docs/metodologia_procesamiento.md` |

**Qué hizo la herramienta:** aplicó los filtros pedidos al INPRES desde 2019, calculó los conteos por año, filtró el USGS con los mismos criterios de área y profundidad, comparó con Zenodo y probó la página en Chrome (modo headless) para varios años del dial, sin errores de consola.

**Qué NO hizo:** no modificó el área de estudio; no dibujó ni sumó Zenodo ni USGS; no verificó contra una fuente la resolución 054/2021 ni la ampliación de la red del INPRES en 2019 (datos de la autora); no reconstruyó la URL exacta de la descarga manual del USGS (la que figura es una consulta equivalente); no probó en celulares ni en otros navegadores.

**Supervisión humana:** la autora decidió la fuente, los filtros, los umbrales y los textos. Puntos a revisar: (1) los 2 eventos del USGS de 2009 quedan dentro del área, por lo que el texto del (i) informa 2 en 2000–2014 en lugar de «ninguno»; (2) la frase «todos en las cercanías de Añelo» se ajustó porque uno de los 7 está cerca de Plaza Huincul; (3) en Zenodo, 2017 aparece con 22 sismos y el INPRES con 0 en el área.

---

## Entrada 11

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-08 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Reconstrucción final de la página (tres pantallas) y dos ajustes de datos |
| **Finalidad** | Asistencia en código y redacción: ajustar `scripts/procesar.py` (dial desde 2010; campo `aguap_pre`) y `scripts/procesar_sismos.py` (corte al 31/08/2026), regenerar los datos procesados y `web/datos/`, reescribir `web/index.html`, `web/estilos.css`, `web/app.js` y `web/textos.js` según la especificación de la autora (intro, explorador con hexágonos 3D y dial, cierre, (i) de dos niveles, glosario, metodología), probar la página con Chrome en modo headless (capturas en `docs/capturas/`) y actualizar `docs/metodologia_procesamiento.md` |

**Qué hizo la herramienta:** implementó la especificación de la autora; recalculó la serie desde 2010 y verificó que el acumulado a fin de 2025 siga dando 721,8 M bbl; cortó los sismos al 31/08/2026 (448 eventos del INPRES, 420 en el mapa, 414 con M ≥ 2,5); redactó borradores de textos que la autora debe reescribir (nivel 1 de los (i), glosario, definiciones, introducción de la metodología) usando solo información presente en el proyecto o en la especificación; marcó como [FALTA FUENTE] lo que necesita una fuente; tomó las decisiones de diseño no especificadas (listadas en la entrega) eligiendo lo más sobrio; capturó la página en 1366×768 y 1920×1080 y revisó cada captura (sin textos encimados, sin scroll interno, sin errores de consola).

**Qué NO hizo:** no cambió ningún cálculo, fuente ni dato procesado salvo los dos ajustes pedidos (más el campo `aguap_pre`, que solo hace que el acumulado del agua producida parta de 2006 como los demás); no inventó definiciones de «reservas» ni de «recurso técnicamente recuperable» (quedan [FALTA FUENTE]); no verificó contra una fuente el hito de 2010 (Repsol-YPF, Schultz et al. 2024: falta la cita exacta) ni la resolución 054/2021 ni la ampliación de la red del INPRES en 2019 (datos de la autora); no probó en celulares reales ni en otros navegadores; no escribió la declaración de uso de IA de la metodología (espacio reservado para la autora).

**Supervisión humana:** la autora definió la estructura, los textos de partida, los hitos, los períodos y los cortes; el diseño y los textos finales son de la autora, que debe revisarlos y reescribirlos. Puntos a revisar: (1) todo lo marcado [FALTA FUENTE]; (2) los borradores de Nivel 1 de cada (i) y las definiciones del glosario (redactadas como definiciones generales, sin cita); (3) el tamaño de los hexágonos (≈ 2,6 km) y la escala de altura (lineal y fija), que son decisiones de diseño; (4) las decisiones de diseño listadas en la entrega.

---

## Entrada 12

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-08 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Segunda versión de la página: una sola pantalla, estimaciones en el encabezado, módulo «Reserva o recurso» e intro con cifras |
| **Finalidad** | Asistencia en código y redacción: `scripts/calcular_intro.py` (cifras de contexto de la intro), `scripts/preparar_web.py`, y reescritura de `web/index.html`, `web/estilos.css`, `web/app.js` y `web/textos.js` según la especificación de la autora; capturas con Chrome headless en 1920×870 y 1366×650 (`docs/capturas/`); actualización de `docs/metodologia_procesamiento.md` |

**Qué hizo la herramienta:** unificó el explorador en una pantalla sin scroll (verificó con mediciones que el dial entra completo y que no hay scroll interno ni elementos encimados); movió las dos estimaciones al encabezado; calculó con los datos del proyecto el % del petróleo y del gas nacional de 2025, el récord mensual de producción y el crecimiento interanual; leyó el informe de la EIA (PDF descargado) y tomó de allí, de forma textual, la definición de «recurso técnicamente recuperable»; incorporó los textos que redactó la autora (Nivel 1 de las dos estimaciones, definición de reserva basada en las resoluciones citadas por la autora, introducción).

**Qué NO hizo:** no abrió las Resoluciones 324/2006, 482/1998 ni 69/2016: las definiciones y el 90 % de confiabilidad son las que indicó la autora; tampoco verificó la frase sobre auditores externos del Nivel 1 de las reservas ni el 73 % de inversiones del IAE; no cambió ningún cálculo existente; no probó en celulares ni en otros navegadores.

**Supervisión humana:** la autora redactó o aprobó los textos del Nivel 1, la introducción y las fuentes del módulo; debe verificar las resoluciones y las cifras del IAE. El diseño y los textos finales son de la autora.

---

## Entrada 13

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-12 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Valor estimado del gas y reorganización del panel izquierdo («Petróleo» y «Gas») |
| **Finalidad** | Asistencia en código y redacción: descarga de la serie diaria del tipo de cambio mayorista de referencia del BCRA (`datos/raw/tipo_cambio/`), `scripts/procesar.py` (valor del gas), regeneración de `datos/procesados/` y `web/datos/`, `web/app.js`, `web/textos.js`, `web/estilos.css`, `docs/metodologia_procesamiento.md` (sección 13) y capturas con Chrome en modo headless (`docs/capturas/explorador_gas_*`) |

**Qué hizo la herramienta:** verificó que el precio del gas del Excel de regalías está en pesos por miles de m³ (la tasa implícita de regalías da 12,04 %), mostró la cuenta completa de agosto de 2025 (USD 388.443.902), calculó el valor mensual del gas con el tipo de cambio mensual promedio y comprobó que no cambió ningún campo anterior de los datos; reorganizó el panel izquierdo en dos secciones con el mismo peso (extraído, valor y mini gráfico) y redactó el (i) del valor del gas con el texto de Nivel 1 indicado por la autora; cambió el título del panel derecho a «Lo que implica»; verificó en 1920×870 y 1366×650 (años 2015, 2025 y 2026) que no hay scroll interno ni errores de consola.

**Qué NO hizo:** no modificó el mapa, los hexágonos, los puntos ni la barra de relieve (la autora pidió no tocarlos); no implementó las columnas de petróleo y gas en barriles equivalentes ni el cambio de modo de vista (puntos 12 de la especificación): quedan pendientes y el factor de conversión a BEP no tiene fuente elegida; no movió «pozos en producción» y «pozos nuevos» al (i) del contador de pozos; no verificó que la variable 5 de la API del BCRA sea la Com. A 3500 más allá de su descripción («Tipo de cambio mayorista de referencia»); no probó en celulares ni en otros navegadores.

**Supervisión humana:** la autora definió la fórmula, el texto de Nivel 1 del (i) del gas y el título «Lo que implica». Puntos a revisar: (1) el promedio mensual como criterio de tipo de cambio (el Excel usa el dólar BNA del día hábil anterior; diferencia de 1,5 % a 2 % en 2024-2026); (2) el texto de Nivel 2 del (i) del gas, redactado por la herramienta; (3) el valor del gas no se suma al del petróleo.

---

## Entrada 14

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-12 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Cinco vistas del mapa (Pozos, Petróleo, Gas, Agua que entra, Agua que vuelve), bloques tocables, relación agua/petróleo y ajustes de sismos |
| **Finalidad** | Asistencia en código y redacción: `web/app.js`, `web/textos.js`, `web/estilos.css`, `web/index.html`, `scripts/zenodo_anual.py` (conteo anual de Zenodo 2014-2018), regeneración de `web/datos/`, `docs/metodologia_procesamiento.md` (sección 14) y capturas con Chrome en modo headless (`docs/capturas/mapa_*`, `sismos_*`, `hex_*`) |

**Qué hizo la herramienta:** reemplazó el selector «Relieve» por cinco vistas con transición suave; calculó por hexágono, con escala lineal y fija propia de cada vista, el acumulado de petróleo (barriles), gas, agua que entra y agua que vuelve (m³), unidas por `idpozo`; coloreó los pozos por tipo del último mes con producción; agregó la barra «Esta altura = X», el color por valor desde arriba, la reducción de hexágonos con el zoom, el tooltip por hexágono, la relación agua/petróleo y los pozos en producción y nuevos en el (i) del contador; hizo tocables los bloques de los paneles; rearmó el bloque de sismos (mensajes antes de 2019, notas de 2019 y 2021, dos series por año) y el botón «Ver todos los sismos»; calculó con los mismos filtros el conteo de Zenodo 2014-2018 para el (i); verificó en 1920×870 y 1366×650 que no hay scroll interno ni errores de consola, y corrigió un error propio (las columnas no se redibujaban al inclinar la cámara).

**Qué NO hizo:** no cambió ningún cálculo existente de producción ni de valor (salvo lo indicado); no verificó contra una fuente las 11 y 5 estaciones ni la Res. 054/2021 (textos de la autora); no completó la URL del Adjunto IV (sigue «link pendiente»); no confirmó la unidad del agua que vuelve (se asume m³); no volvió a correr `procesar_sismos.py` porque faltan en `datos/raw/sismos/` el HTML del INPRES y el CSV del USGS; no probó en celulares ni en otros navegadores.

**Supervisión humana:** la autora definió las vistas, los textos de los (i) de Nivel 1, los mensajes de sismos y los criterios de escala. Puntos a revisar: (1) radio de la grilla (2,6 km; alternativa de 1,8 km en las capturas); (2) color del gas (amarillo claro) y raíz cuadrada en el color desde arriba; (3) se quitó el gráfico compartido del agua del panel derecho porque no figura entre los bloques pedidos; (4) el Nivel 2 de los (i) nuevos lo redactó la herramienta.

---

## Entrada 15

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-14 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Intento de agregar mapa base de teselas (CARTO dark_nolabels) y etiquetas de localidades y agua; **revertido** |
| **Finalidad** | Prueba en `web/app.js`, `web/textos.js` y capturas con Chrome headless; copia de seguridad en `_backup_web_mapabase/` |

**Qué hizo la herramienta:** hizo una copia de seguridad de `web/`; implementó una capa `TileLayer` + `BitmapLayer` de deck.gl con las teselas de CARTO (opacidad 0,5), cuatro etiquetas de localidades y tres de agua; consultó coordenadas en Wikidata (propiedad P625, 14/10/2026) y Wikipedia (es). Al renderizar, todas las teselas de CARTO mostraban la marca de agua «API KEY REQUIRED». Se probaron las variantes de URL (subdominios a-d, `rastertiles`, `@2x`, dominio fastly): todas devuelven la misma tesela de 2.513 bytes (ETag «wm-…»). Como el mapa quedaba peor, **se restauró `web/` desde la copia** (verificado archivo por archivo) y la app se volvió a cargar sin errores en 1920×870.

**Qué NO hizo:** no dejó ningún cambio en `web/`; no agregó la atribución ni las fuentes a la metodología; no verificó GitHub Pages (el mapa base no llegó a funcionar); no sacó las capturas de `docs/capturas/`.

**Coordenadas verificadas (para uso futuro, sin aplicar):** Rincón de los Sauces −37,39028 / −68,92528 (Wikidata Q993293); Sauzal Bonito −38,6 / −69,10389 (Q7427646); Cutral Có −38,93333 / −69,23333 (Q970536); Plaza Huincul −38,93376 / −69,19869 (Q980712); Lago Los Barreales −38,55083 / −68,8225 y Lago Mari Menuco −38,59694 / −68,54472 (Wikipedia es). El trazo del Río Neuquén no se ubicó.

**Seguimiento (14/10/2026, opción 3 elegida por la autora):** sin mapa base, se agregaron en `web/textos.js` y `web/app.js` las etiquetas de Rincón de los Sauces, Sauzal Bonito, Cutral Có y Plaza Huincul (mismo estilo que Añelo, con fondo oscuro) y, en azul tenue y cursiva, «Embalse Los Barreales» y «Embalse Mari Menuco»; se agregaron las fuentes (Wikidata, Wikipedia) a la metodología. No se agregó «Río Neuquén» (sin punto verificado ni mapa base donde ubicarlo). Verificado en 1366×768 y 1920×870 sin scroll ni errores. Las etiquetas de Rincón, Cutral Có y Plaza Huincul quedan fuera del encuadre inicial.

**Seguimiento 2 (14/10/2026, opción 2 elegida por la autora):** como CARTO exige clave, se probó y adoptó el servicio «World Dark Gray Base» de Esri (teselas sin clave, sin etiquetas propias salvo rótulos de límites provinciales muy tenues, p. ej. «NEUQUÉN») con `TileLayer` + `BitmapLayer` de deck.gl y opacidad 0,3. Se verificó que las coordenadas de Wikipedia de los lagos coinciden con los espejos de agua de las teselas; el Río Neuquén se ubicó sobre su trazo en las teselas (−68,6239 / −38,4371, criterio propio, no una fuente). Se agregó la atribución en el pie del mapa y en la metodología (Esri, HERE, Garmin, © OpenStreetMap contributors y la comunidad de usuarios GIS), las etiquetas de agua con prueba de profundidad (las columnas 3D las tapan) y «Sauzal Bonito» a la izquierda de su punto. Capturas: `docs/capturas/mapabase_*`. Verificado en Chrome local, 1366×768, 1920×870 y 800×900 sin scroll ni errores; **no se verificó en GitHub Pages** (no hay repositorio ni despliegue disponibles) ni se revisaron los términos de uso de Esri para este concurso. Copia previa: `_backup_web_opcion3/`.

**Supervisión humana:** decidir qué proveedor de teselas usar (ver alternativas en la respuesta) antes de reintentar.

---

## Entrada 16

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-14 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Correcciones del mapa: encuadre inicial, límites de zoom, hexágonos de radio fijo, leyenda de pozos |
| **Finalidad** | Cambios en `web/app.js`, `web/textos.js`, `web/index.html`, `web/estilos.css`; capturas con Chrome headless en `docs/capturas/vista_*`; copia previa en `_backup_web_correcciones/` |

**Qué hizo la herramienta:** (1) encuadre de toda el área de estudio (vértices de `area_estudio` proyectados con la inclinación pedida; zoom 6,04) con 45° al salir de la intro y al cambiar de pestaña; botón «Restablecer vista» junto a «Vista desde arriba»; zoom mínimo = encuadre de la cuenca (5,76; en la práctica no se puede alejar más que el encuadre inicial) y máximo = encuadre + 2,5 niveles (8,54); la rueda del mouse hace zoom. (2) Radio de hexágono fijo (2,6 km) con `coverage` 0,9; se eliminó la reducción de radio con el zoom; la grilla ya se calculaba una sola vez y no se reagrupa. Las columnas parten de elevación 0 (verificado en capturas, sin piezas flotando). (3) Mapa base: **no se cambió a CARTO**: las teselas de CARTO siguen devolviendo la marca de agua «API KEY REQUIRED» (verificado el 14/10/2026, ETag «wm-…»); se mantiene Esri «World Dark Gray Base», pendiente de decisión de la autora. (4) Leyenda: «hasta agosto de 2026» solo en 2026; en los demás años, «hasta {año}». (5) Etiquetas por nivel: con el encuadre completo solo Añelo, Neuquén y Rincón de los Sauces; las demás aparecen al acercar 1,2 niveles (para que no se pisen). Capturas en 1920×870 con el dial en 2019 y 2025.

**Qué NO hizo:** no verificó GitHub Pages ni otros navegadores; no leyó completos los términos de Esri (solo que el servicio es público y se licencia bajo el Esri Master License Agreement, con atribución obligatoria); no cambió ningún dato ni cálculo.

**Supervisión humana:** decidir el proveedor del mapa base; evaluar si el encuadre del área de estudio (donde los pozos ocupan una parte pequeña de la pantalla) es el deseado frente a un encuadre sobre los pozos.

---

## Entrada 17

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-14 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Pulido visual final del mapa (solo ajustes visuales, sin funcionalidades nuevas) |
| **Finalidad** | Cambios en `web/app.js`, `web/textos.js`, `web/estilos.css`; capturas `docs/capturas/pulido_*`; copia previa en `web_backup_20261014_0235/` |

**Qué hizo la herramienta:** (0) Verificó que el mapa **no tiene relieve ni modelo de elevación**; la única fuente externa es el mapa base plano Esri «World Dark Gray Base» (teselas con atribución, ver entrada 15; términos de uso de Esri no revisados a fondo), que se mantuvo. (1) Pozos más chicos (radio 1,7 px; mínimo 1,2 px) y opacidad 0,8; sin agrupación. (2) Etiquetas de localidades sin recuadro negro: texto de 12 px con halo oscuro fino; Añelo más grande y destacada y desplazada a la derecha de su punto para no tapar el racimo de pozos; la referencia «Esta altura = …» también perdió el recuadro. (3) Ríos y embalses: etiquetas más chicas y tenues que las de localidades. (4) Límite del área de estudio: opacidad 46 → 30. (5) Sismos como capa activable: botón «Sismos» (interruptor con anillo violeta y su (i)) sobre el mapa; el bloque de sismos del panel (con la pista «Tocá para ver en el mapa») hace lo mismo y comparten estado y resaltado. Por defecto apagada. Con la capa activa los sismos aparecen según su fecha con el dial, destellan y quedan visibles con opacidad ≈0,6; no cambia año, vista ni cámara. Se eliminaron el botón «Ver todos los sismos (2019-2026)», el modo atenuado del dial y su aviso; su texto pasó al (i) del botón (en `sismos_todos` se reescribió también la frase «detalle», que describía el modo eliminado). No se tocaron catálogo, filtros ni textos metodológicos. (6) Leyenda: se eliminó el botón y el panel de leyenda a pedido de la autora; bajo el mapa quedan solo los conteos por tipo de pozo según el dial y la atribución. La barra del mapa se compactó por debajo de 1500 px para que entre el botón «Sismos». (7) Hexágonos de radio fijo, las cinco vistas, el dial, los paneles y los (i): sin cambios. (8) Capturas 1920×870 y 1366×768: `pulido_pozos_2025_*`, `pulido_pozos_sismos_2026_*` (capa activa, dial en 2026), `pulido_petroleo_2025_*`.

**Qué NO hizo / límites:** en las capturas con Chrome headless de esta sesión **no se dibujan las columnas hexagonales** de la vista Petróleo; ocurre igual con la copia previa (`web_backup_20261014_0235/`), por lo que no es una regresión de estos cambios, pero **la vista Petróleo con columnas no pudo verificarse visualmente aquí** y debe revisarse en un navegador normal. Las etiquetas con acento se ven sin tilde a 12 px en las capturas de baja resolución (el glifo sí está; se comprobó ampliando). Sin verificar en GitHub Pages ni otros navegadores. «Añelo» roza el borde de los pozos dispersos en la vista Pozos.

**Supervisión humana:** revisar en un navegador real la vista Petróleo y el resaltado del bloque de sismos; decidir sobre los términos de uso de Esri antes de la entrega.

---

## Entrada 18

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-14 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Rediseño de los bloques de los paneles (gráficos de barras anuales) y de los hitos del dial |
| **Finalidad** | Cambios en `web/app.js`, `web/textos.js`, `web/estilos.css`; capturas `docs/capturas/paneles_*`; copia previa en `web_version_antes_graficos/` (el proyecto no usa git: no hubo commit) |

**Qué hizo la herramienta:** (1) Cada bloque (petróleo, gas, agua que entra, agua que vuelve) pasó a: título de una línea con su (i); «Acumulado hasta {año}» y el número acumulado; unidad; «{valor} en {año}» (en 2026, «(enero-agosto)»); en petróleo y gas, «Valor: USD {X} millones hasta {año}» con su (i), que ahora incluye el valor anual en USD; y «Producción de cada año» / «Agua de cada año» con un gráfico de 17 barras (2010-2026) de 45 px (40 px en pantallas bajas): llenas hasta el año del dial, la del año del dial más brillante y con borde, las posteriores solo con contorno, 2026 rayada, sin ejes ni números salvo «2010» y «2026», con tooltip (año y valor) y puntos neutros de hitos (2010, 2013, 2024, 2026) con tooltip con el nombre del hito. La línea «Por cada m³ de petróleo extraído…» se mantiene. Sismos: el número grande es el de los sismos registrados en el año del dial (M ≥ 2,5) y debajo «{X} desde 2019»; se ajustó la frase del (i) de sismos que decía que el número grande era el acumulado, y las frases «Debajo, el valor de ese año» de los (i) de valor. (2) Hitos del dial: marca chica con etiqueta corta («Descubrimiento», «Chevron», «RIGI», «IAPG») en una sola fila, sin encimarse; al pasar el mouse, tocar o enfocar la marca se expande el nombre completo con su (i). (3) Los textos de los (i) de cada hito no se cambiaron. (4) Verificación con Chrome headless: sin scroll en los paneles a 1920×870 y 1366×768 con el dial en 2013, 2015, 2020, 2025 y 2026.

**Ajuste posterior (misma fecha, a pedido de la autora):** paneles compactados: la unidad pasó a la derecha del número grande, se eliminó el título «Producción de cada año» / «Agua de cada año» y ambos paneles usan la misma altura de gráfico (variable `--alto-graf`, 34-45 px según el alto de la ventana). Sin scroll hasta 1366×650; a 1280×600 el panel derecho desborda unos 15 px. Capturas `paneles_*` regeneradas.

**Qué NO hizo / límites:** no se verificó en otros navegadores ni en pantallas táctiles (el despliegue del hito al tocar se probó con un clic programático); los tooltips de las barras son los nativos del navegador (atributo `title`), no se vieron en pantalla. Con el hito expandido, su recuadro puede tapar un instante la etiqueta vecina (p. ej. «RIGI»). El mapa base Esri sigue en el mapa (con su atribución) y en la metodología. Las columnas hexagonales de la vista Petróleo siguen sin poder verificarse en Chrome headless (ver entrada 17).

**Supervisión humana:** revisar en un navegador real que los gráficos no se vean amontonados, los tooltips y el despliegue de los hitos; decidir sobre el mapa base Esri.

---

## Entrada 19

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-14 |
| **Herramienta** | Claude (Anthropic), modo Cowork; modelo configurado: claude-opus-5-5 |
| **Etapa** | Auditoría metodológica de los indicadores del encabezado («Lo confirmado» y «Lo que podría haber») |
| **Finalidad** | Verificar fuentes, definiciones, unidades y fechas; corregir los cálculos; documentar en `docs/auditoria_indicadores_petroleo.md`. Copia previa en `_backup_auditoria_indicadores_20261014/` |

**Qué hizo la herramienta:** (1) Leyó el comunicado del 12/08/2026, el informe técnico del IAPG (julio de 2026) y el informe de la EIA (2013); encontró que los remanentes del IAPG están referidos al 31/12/2024 y que ya excluyen 558 MMBO extraídos. (2) Revisó el Excel de reservas y el CSV por pozo: las reservas son de todo el no convencional de la cuenca Neuquina. (3) Corrigió el doble conteo de la producción de 2025 en el denominador del IAPG, igualó el alcance del numerador y del denominador en la tarjeta de reservas y reemplazó los «años restantes» por año por un horizonte fijo de referencia 2025 (con rango P90–P10 en el IAPG). (4) Escribió `scripts/indicadores_petroleo.py` y `scripts/test_indicadores.py`; modificó `scripts/procesar.py`, `web/app.js` y `web/textos.js`; regeneró `datos/procesados/serie_anual_vm.json` y `web/datos/serie.js`. (5) Verificó el encabezado en Chromium con el dial en 2010, 2025 y 2026.

**Qué NO hizo / límites:** no volvió a correr `procesar.py` completo (solo el script nuevo, sobre los mismos datos crudos); no pudo leer las figuras 24-26 del informe del IAPG ni confirmar la URL del Excel de reservas; el informe del IAPG se leyó con una herramienta que extrae texto del PDF; el mapa no se dibujó en la prueba (deck.gl no carga sin internet en ese entorno). No cambió el diseño.

**Supervisión humana:** comprobar a ojo las páginas citadas del informe del IAPG; revisar los textos nuevos de los (i); completar la URL de reservas.

---

## Entrada 20

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-14 |
| **Herramienta** | Claude (Anthropic), modo Cowork; modelo configurado: claude-opus-5-5 |
| **Etapa** | Horizonte en años que cambia con el dial (indicadores del encabezado) |
| **Finalidad** | Recuperar el horizonte dinámico pedido por la autora, con una fórmula documentada. Copia previa en `_backup_horizonte_fijo_20261014/` |

**Qué hizo la herramienta:** implementó H(t) = R(t) / P(t) en `scripts/indicadores_petroleo.py` (función `horizontes`), en `web/app.js` (`textoHorizonte` y el detalle del (i)) y en `web/textos.js`; regeneró `serie_anual_vm.json` y `serie.js`; agregó pruebas (457 en total) y verificó el dial en Chromium.

**Decisión de la herramienta, a revisar:** para el remanente del IAPG en cada año usa lo extraído según el IAPG hasta 2024 (558) más la producción anual de Capítulo IV, en lugar de restar el acumulado de Capítulo IV de 30.728, para que 2024 coincida con la cifra publicada y 2025 dé 29.987. La diferencia entre ambas opciones es de 0,06 %.

**Supervisión humana:** la autora definió la fórmula, el tratamiento de 2026 y de los valores extremos; revisar los textos del (i).

---

## Entrada 21

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-14 |
| **Herramienta** | Claude Code (Anthropic), modelo Claude Sonnet 5.5 |
| **Etapa** | Cierre de la documentación: declaración de uso de IA en la página, README sin datos crudos y revisión del seudónimo |
| **Finalidad** | Cambios en `web/textos.js`, `README.md` y `.gitignore`; búsqueda de datos personales en el proyecto |

**Qué hizo la herramienta:** (1) Cargó en `web/textos.js` (sección «Uso de inteligencia artificial») los cuatro párrafos de la declaración, con el texto dictado por la autora; agregó la constante `URL_REPO` (vacía, marcada con un `TODO` para completar): mientras esté vacía, la ruta `docs/registro_ia.md` se muestra como texto y, cuando se complete, pasa a ser un enlace. (2) Actualizó `README.md` porque se eliminó `datos/raw/`: indica que los datos originales no están en el repositorio, agrega la tabla de carpetas y nombres de archivo que esperan `procesar.py`, `procesar_sismos.py` y los demás scripts, y agrega los enlaces a la sección «Fuentes». (3) Sacó de `.gitignore` la regla `datos/raw/` y la regla `/data/` (carpeta de descargas que ya no existe). (4) Buscó en `web/`, `docs/`, `scripts/` y `README.md` nombres, emails y usuarios que identifiquen a la autora y se lo informó, sin modificar nada.

**Qué NO hizo / límites:** no cambió el texto de la declaración más allá de agregar negritas a las etiquetas de cada párrafo; no pudo completar `URL_REPO` porque el proyecto no tiene URL de repositorio; no reemplazó el nombre de la autora, que sigue en el README a la espera de su decisión; no volvió a correr los scripts, por lo que no verificó que los nombres de archivo del README funcionen con una descarga nueva (se leyeron de las rutas del código).

**Supervisión humana:** la autora redactó la declaración; falta que complete `URL_REPO`, decida el seudónimo y revise la tabla de archivos del README.

---

## Entrada 22

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-10-15 |
| **Herramienta** | Claude (Anthropic), a través de Claude Cowork |
| **Etapa** | Auditoría final antes de la inscripción |
| **Finalidad** | Revisar fechas de corte, tarjetas, sismos, leyenda de pozos, mini gráficos, agua, hitos y textos; cambios en `web/textos.js`, `web/app.js`, `web/estilos.css`, `scripts/test_indicadores.py` y `docs/metodologia_procesamiento.md` (sección 17) |

**Qué hizo la herramienta:** comprobó contra los datos procesados los porcentajes, horizontes, acumulados, conteos de sismos y de pozos; verificó en la web el informe del IAPG (fecha de corte, cifras) y la fecha del comunicado; agregó en la interfaz las fechas de corte del valor de 2026, el alcance de cada tarjeta, la aclaración «Registros analizados desde 2019», la leyenda «Pozos petrolíferos / gasíferos / Otros pozos», el rótulo anual y el máximo de cada mini gráfico, y las aclaraciones sobre el agua que vuelve; corrigió que los marcadores de los hitos quedaran tapados por el dial; actualizó una prueba y la metodología.

**Qué NO hizo / límites:** no cambió datos, fórmulas ni filtros; no verificó las reservas contra el Excel original ni las cifras de estaciones sísmicas (11 y 5) ni la Res. 054/2021; probó la página en un navegador sin conexión a la librería del mapa, por lo que no comprobó visualmente el mapa 3D.

**Supervisión humana:** la autora debe revisar los textos nuevos y abrir la página para controlar el mapa antes de publicar.

**Agregado (mismo día, pedido de la autora):** la herramienta buscó en la web las fuentes de los mensajes sobre la red sísmica. Encontró en Schultz et al. (2024) las 11 y 5 estaciones y la ampliación de 2019, y en un informe del Gobierno de Neuquén del 15/12/2021 la Res. 054/2021; corrigió la nota de 2021 (no había respaldo para «8 sismógrafos») y la de 2010-2013, acortó los mensajes y agregó las fuentes. No encontró el texto oficial de la resolución. Luego, a pedido de la autora, quitó todo lo que no pudo confirmarse: la nota de 2021 y su fuente, y la frase sobre el Observatorio de Sismicidad Inducida; ajustó el texto del agua que vuelve a lo que dice Schultz et al. (2024).

---

_Próximas entradas: agregar una por cada nueva etapa en la que se use IA (procesamiento de datos, desarrollo de la visualización, redacción, etc.), con fecha, herramienta, etapa y finalidad._
