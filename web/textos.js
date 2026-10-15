/*
 * TEXTOS VISIBLES de la visualización.
 * Editá solamente este archivo para cambiar títulos, etiquetas, (i), hitos, glosario, metodología y la
 * declaración de uso de IA. No hace falta tocar el resto del código.
 *
 * Convenciones:
 *  - {n}, {año}, {mes}, {v}, {arena}... entre llaves son huecos que el programa rellena.
 *  - G("clave", "texto") marca un término del glosario: al pasar el mouse (o tocar) aparece su definición.
 *  - Cada (i) tiene SIEMPRE dos niveles:
 *      n1  = «Qué estoy viendo» (lenguaje simple, 2 o 3 líneas)
 *      n2  = «Cómo se calculó» { detalle, como, periodo, fuente {texto,url}, limite }
 *    Si una fuente todavía no tiene link, dejá url: "" y se mostrará "(link pendiente)".
 *  - [FALTA FUENTE] marca un texto que necesita una fuente que no está en el proyecto.
 *  - Las cifras de Añelo / Neuquén son coordenadas de referencia (grados decimales, WGS84).
 */
const G = (k, t) => `<span class="gl" tabindex="0" data-gl="${k}">${t}</span>`;

/* Atribución obligatoria del catálogo de sismos (licencia CC BY 4.0). Se usa en el (i) de sismos y en la metodología. */
const ATRIBUCION_SISMOS =
  "Schultz, R., Tamburini-Beliveau, G., Correa-Otto, S. y Grosso-Heredia, J. (2024). <i>RyanJamesSchultz/VM-ID: Seismica release</i>. Zenodo. " +
  "<a href='https://doi.org/10.5281/zenodo.14065345' target='_blank' rel='noopener noreferrer'>https://doi.org/10.5281/zenodo.14065345</a>. " +
  "Licencia <a href='https://creativecommons.org/licenses/by/4.0/deed.es' target='_blank' rel='noopener noreferrer'>CC BY 4.0</a>. " +
  "Usado como control y para el contexto anterior a 2019 (conteos anuales filtrados al área de estudio). " +
  "Artículo asociado: Schultz et al. (2024), «Chasing the ghost of fracking in the Vaca Muerta Formation», <i>Seismica</i>, " +
  "<a href='https://doi.org/10.26443/seismica.v3i2.1435' target='_blank' rel='noopener noreferrer'>https://doi.org/10.26443/seismica.v3i2.1435</a>.";

/* URL de docs/registro_ia.md en el repositorio público. Si se vaciara, la declaración de IA muestra la ruta como texto, sin enlace. */
const URL_REPO = "https://github.com/httpMirrorWall/lo-que-queda/blob/main/docs/registro_ia.md";

const FUENTE_CAP4 = { texto: "Capítulo IV, Secretaría de Energía", url: "https://datos.gob.ar/dataset/energia-produccion-petroleo-gas-por-pozo-capitulo-iv" };
const FUENTE_SCHULTZ = { texto: "Schultz et al. (2024), «Chasing the ghost of fracking in the Vaca Muerta Formation», Seismica", url: "https://doi.org/10.26443/seismica.v3i2.1435" };
const FUENTE_IAPG = { texto: "IAPG (julio de 2026), «Estimación de los Recursos Remanentes Técnicamente Recuperables de Petróleo de la Fm. Vaca Muerta», informe técnico", url: "https://iapg.org.ar/documentos/IAPG_Estudio_prospectivo_de_recursos_de_petroleo.pdf" };
const FUENTE_COMUNICADO = { texto: "Ministerio de Economía, comunicado del 12/08/2026", url: "https://www.argentina.gob.ar/noticias/vaca-muerta-aumento-en-un-89-sus-recursos-de-petroleo-respecto-de-las-ultimas-estimaciones" };

window.TEXTOS = {

  /* ------------------------------------------------------------ general */
  tituloPagina: "Lo que queda · Vaca Muerta",
  linkMetodo: "Metodología y fuentes",

  /* ------------------------------------------------------------ 1. introducción: capa a pantalla completa (BORRADOR: la reescribe la autora) */
  intro: {
    sobre: "CONTAR CON DATOS · 2026",
    titulo: "Lo que queda",
    subtitulo: "Vaca Muerta: petróleo, gas y la evolución de su explotación.",
    parrafo:
      "A casi 3 kilómetros de profundidad, en la Cuenca Neuquina, hay una formación de roca que guarda enormes cantidades de petróleo y gas: Vaca Muerta. " +
      "Desde que comenzó a explotarse a gran escala, hace poco más de una década, transformó la producción energética argentina: hoy aporta más de la mitad del petróleo y del gas del país. " +
      "En agosto de 2026, un estudio del Instituto Argentino del Petróleo y del Gas (IAPG) casi duplicó la estimación del petróleo que podría extraerse de la formación.",
    parrafo2:
      "Entonces, ¿cuánto petróleo queda? Depende de qué contemos: las reservas comprobadas o los recursos que podrían llegar a extraerse. " +
      "Pero la historia no termina ahí. ¿Cuánta agua se utiliza para fracturar la roca? ¿Qué sabemos de los sismos registrados en la zona? " +
      "Lo que queda es una visualización interactiva para explorar, año a año, lo que se extrajo de Vaca Muerta y lo que implicó su explotación.",
    boton: "Explorá la evolución de Vaca Muerta",
    saltar: "Saltar",
    /* tarjetas de importancia: los números salen de datos/procesados/contexto_intro.json (scripts/calcular_intro.py) y de serie_anual_vm.json */
    /* cuatro tarjetas, todas hasta agosto de 2026 (último mes con datos); las aclaraciones de cálculo y fuente están en los (i): info.intro_* */
    tarjetas: {
      extraido: { tag: "Lo extraído", unidad: "millones", etiqueta: "de barriles de petróleo salieron de Vaca Muerta hasta agosto de 2026" },
      ritmo:    { tag: "El ritmo",    unidad: "mil",      etiqueta: "barriles por día: récord de producción de petróleo de Vaca Muerta ({mes} de {anio})" },
      agua:     { tag: "El agua",     unidad: "millones", etiqueta: "de m³ de agua se inyectaron para fracturar la roca hasta agosto de 2026", equiv: "≈ {n} piletas olímpicas" },
      queda:    { tag: "Lo que queda", etiqueta: "del petróleo confirmado sigue bajo tierra…", etiqueta2: "…y el {v} % del que podría haber en total" },
    },
  },

  /* ------------------------------------------------------------ 2. explorador */
  explorador: {
    titulo: "¿Cuánto petróleo queda en " + G("vacamuerta", "Vaca Muerta") + "?",
    anioParcial: "2026",
    anioParcialNota: "hasta agosto",
  },

  /* paneles */
  izquierda: { titulo: "Lo que sale" },
  derecha:   { titulo: "Lo que implica" },

  paneles: {
    acumulado: "Acumulado desde {desde}",
    enAnio: "{v} en {año}",
    enAnioParcial: "{v} en {año}",
    valor: "Valor: USD {v} millones hasta {año}",
    valorParcial: "Valor: USD {v} millones hasta {mes} de {año}",   // julio y agosto con precios provisorios: en el (i) del valor
    produccion: "Producción de cada año",
    aguaAnio: "Agua de cada año",
    barraTip: "{año}: {v}",
    barraTipParcial: "{año} (enero-agosto, parcial): {v}",
    unidades: { petroleo: "millones de barriles", gas: "millones de m³", entran: "millones de m³", vuelven: "millones de m³" },
    /* junto al número grande: el acumulado (la fecha de inicio está en el (i) de cada bloque) */
    unidadesAcum: { petroleo: "millones de barriles · acum. a {hasta}", gas: "millones de m³ · acum. a {hasta}", entran: "millones de m³ · acum. a {hasta}", vuelven: "millones de m³ · acum. a {hasta}" },
    hastaParcial: "{año}",   // {hasta} en 2026 (año parcial): «hasta agosto de 2026» no entra en un renglón; el encabezado ya dice «2026 (hasta agosto)»
    sismoUnidad: "sismos en {año}",   // magnitud 2,5 o más: en el (i) de sismos
    sismoDesde: "{v} desde 2019, cuando empiezan los registros analizados",
    valorAnio: "Valor en {año}: USD {v} millones",
    valorAnioParcial: " (parcial; datos hasta {mes}, con precios de julio y agosto provisorios)",
  },

  metricas: {
    petroleo: { nombre: "Petróleo", unidad: "millones de barriles extraídos hasta {año}", anio: "{v} millones en {año}" },
    gas:      { nombre: "Gas",      unidad: "millones de m³ hasta {año}",          anio: "{v} en {año}" },
    valor:    { nombre: G("valor", "Valor"), prefijo: "USD", unidad: "millones hasta {año}", anio: "USD {v} millones en {año}" },
    valor_gas: { nombre: "Valor estimado", prefijo: "USD", unidad: "millones hasta {año}", anio: "USD {v} millones en {año}" },
    extraido: "Extraído",
    parcial: "parcial: hasta {mes}",
    parcialValor: "parcial: hasta {mes}",
    graficoAria: "Producción anual de {nombre}, de 2010 a 2026 (2026 parcial)",
  },

  agua: {
    entran:  { nombre: "Agua que entra",  unidad: "millones de m³ hasta {año}", anio: "{v} millones de m³ en {año}",
               equivalencia: "≈ {n} piletas olímpicas de 2.500 m³" },
    vuelven: { nombre: "Agua que vuelve", unidad: "millones de m³ hasta {año}", anio: "{v} millones de m³ en {año}" },
    parcial: "parcial: hasta {mes}",
  },

  sismos: {
    titulo: "Sismos",
    unidad: "sismos acumulados con registro comparable (desde 2019)",
    anio: "{v} en {año} (magnitud ≥ 2,5)",
    /* antes de 2019 no hay número: un mensaje corto por tramo de años (datos de la autora) */
    sinNumero: "Sin conteo para {año}: los registros analizados empiezan en 2019.",
    /* mensajes por tramo de años. Fuente: Schultz et al. (2024), sección 2.1 (red local de Correa-Otto, 2021) y sección 1.
       Solo se muestran afirmaciones confirmadas en esa fuente. Ver el (i) de sismos y la metodología. */
    mensajes: [
      { desde: 2010, hasta: 2013, texto: "Pocas estaciones sísmicas en la zona (Schultz et al., 2024)." },
      { desde: 2014, hasta: 2015, texto: "Red local temporaria de 11 estaciones desde nov. de 2014 (Schultz et al., 2024)." },
      { desde: 2016, hasta: 2018, texto: "La red local baja a 5 estaciones en julio de 2016 (Schultz et al., 2024)." },
    ],
    /* nota debajo del número, en los años en que cambia la red */
    notas: {
      2019: "Se amplía la red sísmica (Schultz et al., 2024).",
    },
    parcial: "parcial: hasta agosto",
    barraTitulo: "{año}: {n} sismos registrados (magnitud ≥ 2,5)",
    barraTituloParcial: "{año} (parcial, hasta el 31 de agosto): {n} sismos registrados (magnitud ≥ 2,5)",
    aguaTitulo: "{año}: {v} millones de m³ de agua de fractura",
    aguaTituloParcial: "{año} (parcial, hasta agosto): {v} millones de m³ de agua de fractura",
    graficoAria: "Dos series por año, de 2019 a 2026 (2026 parcial): arriba, sismos registrados de magnitud 2,5 o más; abajo, agua de fractura",
    graficoLeyenda: { sismos: "sismos", agua: "agua que entra" },
    /* minigráfico del panel: mismo eje 2010–2026 que los del agua; antes de 2019, sin barras */
    miniAria: "Sismos registrados por año (magnitud ≥ 2,5), de 2019 a 2026 (2026 parcial). Antes de 2019 no hay registro comparable.",
    miniSinDato: "{año}: fuera del período analizado (desde 2019); no significa que no hubiera sismos",
    /* piezas que arma app.js con los datos del año del dial (Nivel 2 del (i)) */
    infoQue: "En {año} se registraron {n} sismos de magnitud 2,5 o más en el área de estudio.",
    infoQueAntes: "Para {año} no se muestra un número: los registros analizados (INPRES) empiezan en 2019. Esto no significa que antes no hubiera sismos.",
    infoZenodo: "En {año}, una red local de investigación registró {n} sismos de magnitud 2,5 o más en la zona (Schultz et al., 2024). Estas cifras no son comparables con las del INPRES desde 2019.",
    infoZenodoInicio2014: " El catálogo de esa red empieza el 9 de noviembre de 2014.",
    infoComo: "Fuente: INPRES. Filtros: magnitud 2,5 o más, profundidad hasta 30 km y dentro del área de estudio (el contorno tenue del mapa). El número grande cuenta los sismos del año del dial; debajo se indica el total desde el 1/1/2019 hasta el final de ese año.",
    infoComoAntes: "Antes de 2019 había pocos sismógrafos en la zona; las cifras de ese período provienen de redes distintas y no son comparables con la serie desde 2019.",
    infoParcial: "Año parcial: datos hasta el {fecha}.",
    infoLimite: "Son los sismos registrados, no necesariamente todos los que ocurrieron. Su coincidencia con la actividad petrolera no prueba que cada uno haya sido inducido.",
    fuenteInpres: { texto: "INPRES, buscador de sismos (consulta del 8/10/2026)", url: "http://contenidos.inpres.gob.ar/buscar_sismo" },
    /* fuente de los mensajes sobre la red de estaciones (antes de 2019 y 2019) */
    fuentesRed: [
      { texto: "Schultz et al. (2024), sección 2.1 (estaciones de la red local y ampliación de 2019)", url: "https://seismica.library.mcgill.ca/article/view/1435/1728" },
    ],
    general: {
      lineas: [
        "Se muestran los sismos registrados, no necesariamente todos los que ocurrieron.",
        "La capacidad de detección cambió con el tiempo: por eso el registro es comparable recién desde 2019.",
        "La coincidencia en el tiempo y el espacio con la actividad petrolera no prueba, por sí sola, que cada sismo haya sido inducido.",
      ],
      previo: "La Cuenca Neuquina era considerada una región sísmicamente tranquila (Schultz et al., 2024). Antes de 2019 había pocos sismógrafos en la zona: una red local temporaria instalada para una investigación registró {zenodo} sismos de magnitud 2,5 o más en 2017, cuando el INPRES {inpres}. Estas cifras provienen de redes distintas y no son comparables con la serie desde 2019.",
      inpresCero: "no registró ninguno",
      inpresN: "registró {n}",
      usgs: "El catálogo del USGS registra {a} sismos superficiales de magnitud 4 o más en esta zona entre 2000 y 2014 (ambos de agosto de 2009, cerca de Barrancas). Desde 2015 registra {b}: seis en el sector de Añelo (a entre 19 y 52 km, según el USGS) y uno cerca de Plaza Huincul. Esto describe lo que contiene el catálogo; no demuestra que antes no hayan ocurrido: el USGS advierte que fuera de Estados Unidos los sismos de magnitud menor a 4,5 pueden no quedar registrados.",
      cierre: "Según Schultz et al. (2024), alrededor del 42 % de los sismos de su catálogo se asocian estadísticamente con operaciones de fractura.",
    },
  },

  /* ------------------------------------------------------------ mapa */
  mapa: {
    vista: "Vista",
    vistas: { pozos: "Pozos", petroleo: "Petróleo", gas: "Gas", agua_entra: "Agua que entra", agua_vuelve: "Agua que vuelve" },
    /* variable de cada vista con columnas: nombre largo, unidad y cómo se escribe un valor */
    variables: {
      petroleo:    { nombre: "Petróleo acumulado",         corto: "Petróleo",        unidad: "barriles" },
      gas:         { nombre: "Gas acumulado",              corto: "Gas",             unidad: "m³" },
      agua_entra:  { nombre: "Agua que entra, acumulada",  corto: "Agua que entra",  unidad: "m³" },
      agua_vuelve: { nombre: "Agua que vuelve, acumulada", corto: "Agua que vuelve", unidad: "m³" },
    },
    cantidades: { unMilMillones: "mil millones de {u}", milMillones: "{v} mil millones de {u}", unMillon: "1 millón de {u}", millones: "{v} millones de {u}", unidades: "{v} {u}" },
    pistaColumnas: "Tocá para ver en el mapa",
    sismos: "Sismos",
    vistaArriba: "Vista desde arriba",
    vistaInclinada: "Vista inclinada",
    ayuda: "Arrastrá: mover · rueda: acercar o alejar · clic derecho + arrastrar: rotar",
    ayudaTactil: "Un dedo mueve · dos dedos acercan, rotan e inclinan",
    etiquetaPozos: "con primera producción hasta {mes} de {año}",
    etiquetaPozosAnio: "con primera producción hasta {año}",
    tipos: { pet: "petrolíferos", gas: "gasíferos", otro: "otros" },
    /* leyenda debajo del mapa: cada cifra cuenta pozos (no empresas, yacimientos ni instalaciones); las tres categorías son excluyentes */
    tiposLeyenda: { pet: "Pozos petrolíferos", gas: "Pozos gasíferos", otro: "Otros pozos" },
    leyenda: {
      titulo: "Leyenda",
      abrir: "Mostrar leyenda", cerrar: "Ocultar leyenda",
      tipoNota: "Tipo de pozo: el del último mes con producción",
      columna: "Altura: {variable} de todos los pozos del hexágono, en {unidad} (escala lineal y fija, solo de esta vista)",
      referencia: "Esta altura = {v}",
      rampa: "Color desde arriba: de menos a más",
      sismo: "Sismo registrado (tamaño = magnitud; registro comparable desde 2019)",
      area: "Área de estudio de los sismos",
    },
    tooltip: {
      empresa: "Empresa", inicio: "Inicio de producción", profundidad: "Profundidad", profundidadEstimada: "(estimada)",
      petroleoAcum: "Petróleo acumulado", gasAcum: "Gas acumulado", barriles: "barriles", millonesM3: "millones de m³",
    },
    tooltipHex: {
      pozosUno: "1 pozo", pozosN: "{n} pozos",
      tipos: "Pozos por tipo",
    },
    tooltipSismo: { titulo: "Sismo registrado", fecha: "Fecha", magnitud: "Magnitud", profundidad: "Profundidad", sinDato: "(sin dato fiable)", fuente: "Fuente", fuenteInpres: "INPRES" },
    etiquetas: [
      { texto: "Añelo",   lon: -68.7889, lat: -38.3547, dx: 38, dy: 12, nivel: 1, destacada: true },
      { texto: "Neuquén", lon: -68.0591, lat: -38.9516, nivel: 1 },
      /* Coordenadas de Wikidata (propiedad P625, consulta del 14/10/2026); ver Metodología y fuentes */
      { texto: "Rincón de los Sauces", lon: -68.92528, lat: -37.39028, nivel: 1 },
      { texto: "Sauzal Bonito",        lon: -69.10389, lat: -38.6, ancla: "end", dx: -9, dy: 0, nivel: 2 },
    ],
    /* Agua (azul tenue, cursiva). Centro de cada lago según Wikipedia (es), consulta del 14/10/2026. */
    etiquetasAgua: [
      { texto: "Embalse Los Barreales", lon: -68.8225,  lat: -38.55083, nivel: 2 },
      { texto: "Embalse Mari Menuco",   lon: -68.54472, lat: -38.59694, nivel: 2 },
      /* el río se ubicó sobre su trazo en las teselas del mapa base (Esri / OpenStreetMap) */
      { texto: "Río Neuquén",           lon: -68.6239,  lat: -38.4371, ancla: "start", dx: 8, dy: -9, nivel: 2 },
    ],
    atribucion: "Mapa base: Esri, HERE, Garmin, © OpenStreetMap contributors y la comunidad de usuarios GIS",
  },

  filtros: {
    titulo: "Filtros", operador: "Operador", tipo: "Tipo de pozo", todos: "Todos", limpiar: "Quitar filtros",
    nota: "Afectan los pozos y las columnas del mapa y los números de «Lo que sale» y del agua. No afectan los sismos ni las dos estimaciones del encabezado.",
  },

  /* ------------------------------------------------------------ dial */
  dial: {
    reproducir: "Reproducir", pausar: "Pausar",
    ultimaParada: "2026", ultimaParadaNota: "",   // «hasta agosto» se dice una sola vez, junto al año del encabezado
    ultimaParadaCompleta: "2026 (hasta agosto)",
    aria: "Año",
  },
  meses: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],

  /* ------------------------------------------------------------ encabezado del explorador: las dos estimaciones */
  cabecera: {
    dependeDe: "Depende de qué contemos:",
    nota: "",   // «no es un pronóstico» ya figura en el (i) de cada tarjeta
    enlace: "¿Por qué dos respuestas?",
    pct: "{v} % extraído",
    anios: "≈ {n} años si se mantuviera el ritmo de {año}",
    aniosParcial: "≈ {n} años si se mantuviera el ritmo de {año}",   // la aclaración de 2026 incompleto está en el (i)
    aniosMas: "Más de 1.000 años si se mantuviera el ritmo de {año}",
    aniosTope: 1000,   // por encima, se abrevia; el valor exacto figura en el (i)
    aniosNo: "Horizonte no calculable: sin producción en {año}",
    barraAria: "Porcentaje extraído",
    reservas: { etiqueta: "Lo confirmado", nombre: "Reservas comprobadas", fuente: "Sec. de Energía, 2025" },   // alcance (no convencional, cuenca Neuquina) y fecha exacta (31/12/2025): en el (i)
    iapg:     { etiqueta: "Lo que podría haber", nombre: "Recursos técnicamente recuperables", fuente: "IAPG, 2024" },   // Fm. Vaca Muerta y fecha exacta (31/12/2024): en el (i)
  },

  /* módulo «¿Por qué dos respuestas? Reserva o recurso» */
  modulo: {
    titulo: "¿Por qué dos respuestas?",
    subtitulo: "Reserva o recurso",
    cerrar: "Cerrar",
    reserva: {
      termino: "Reserva comprobada",
      def: "Según la Resolución 324/2006 de la Secretaría de Energía, son las reservas que, según datos geológicos y de ingeniería, pueden estimarse con razonable certeza como comercialmente recuperables de reservorios conocidos, a partir de una fecha dada. La Resolución 482/1998 precisa que «razonable certeza» implica, con métodos probabilísticos, al menos un 90 % de confiabilidad. Las definiciones fueron actualizadas por la Resolución 69/2016.",
      fuentes: [
        { texto: "Resolución 324/2006, Secretaría de Energía", url: "https://www.argentina.gob.ar/normativa/nacional/norma-114769/texto" },
        { texto: "Resolución 482/1998, Secretaría de Energía", url: "https://www.argentina.gob.ar/normativa/nacional/norma-53548/texto" },
      ],
    },
    recurso: {
      termino: "Recurso técnicamente recuperable",
      def: "Es el petróleo que podría extraerse con la tecnología actual, sin importar los precios ni los costos de producción (definición de la EIA, 2013). Es una categoría más amplia que las reservas comprobadas, que solo cuentan lo que puede recuperarse de forma comercial, con razonable certeza, en las condiciones actuales. En el estudio del IAPG (2026, norma PRMS 2018), los recursos remanentes se definen como la suma de las reservas (comprobadas, probables y posibles), los recursos contingentes (ya descubiertos, pero que todavía no son comerciales) y los recursos prospectivos (aún no descubiertos); es la clasificación de ese estudio, no una equivalencia válida para todas las clasificaciones de recursos. Que un volumen sea técnicamente recuperable no significa que vaya a extraerse ni que sea rentable hacerlo.",
      fuentes: [FUENTE_IAPG, { texto: "EIA (2013), informe original", url: "https://www.eia.gov/analysis/studies/worldshalegas/pdf/overview.pdf" }],
    },
    cierre: "Lo confirmado es una categoría más acotada y comercialmente definida; lo que podría haber abarca, además, volúmenes cuya extracción comercial no está demostrada. En este sitio las dos cifras también tienen distinto alcance y fecha: las reservas son de todo el no convencional de la cuenca Neuquina al 31/12/2025; los recursos, de la Formación Vaca Muerta al 31/12/2024. Por eso sus porcentajes y horizontes no se comparan entre sí ni se restan. La distancia entre las dos cifras depende de la exploración, la inversión, los precios y la tecnología de los próximos años. Estas estimaciones corresponden solo al petróleo. Para el gas no hay una estimación actualizada comparable: la última (EIA, 2013) calculaba unos 308 billones de pies cúbicos técnicamente recuperables en Vaca Muerta.",
  },

  /* ------------------------------------------------------------ glosario */
  glosario: {
    titulo: "Glosario",
    terminos: {
      vacamuerta: { nombre: "Vaca Muerta", def: "Formación de roca de la Cuenca Neuquina que contiene petróleo y gas. Está a casi 3 kilómetros de profundidad bajo Neuquén." },
      shale: { nombre: "Shale", def: "Roca de grano muy fino y poco permeable que contiene petróleo o gas atrapados. Para extraerlos hace falta fracturarla." },
      fractura: { nombre: "Fractura hidráulica", def: "Técnica para extraer petróleo y gas de la roca: se inyecta a alta presión agua con arena y aditivos, que abre pequeñas grietas; la arena las mantiene abiertas para que el petróleo y el gas fluyan." },
      pozo: { nombre: "Pozo", def: "Perforación en la tierra por la que se extraen petróleo o gas." },
      produccion: { nombre: "Producción", def: "Cantidad de petróleo o gas que sale de los pozos en un período." },
      acumulado: { nombre: "Acumulado", def: "Suma de todo lo producido desde que empieza el registro (enero de 2006) hasta la fecha indicada." },
      reservas: { nombre: "Reservas", def: "Petróleo y gas que, según datos geológicos y de ingeniería, pueden estimarse con razonable certeza como comercialmente recuperables de reservorios conocidos (Resolución 324/2006 de la Secretaría de Energía)." },
      recursos: { nombre: "Recursos técnicamente recuperables", def: "Volúmenes de petróleo y gas natural que podrían producirse con la tecnología actual, sin importar los precios ni los costos de producción (EIA, 2013)." },
      aguaformacion: { nombre: "Agua de formación", def: "Agua que ya estaba en la roca, salada y con restos de hidrocarburos, y que sale del pozo junto con el petróleo." },
      sismicidad: { nombre: "Sismicidad", def: "Actividad sísmica de una zona: cuántos sismos ocurren, de qué tamaño y dónde." },
      magnitud: { nombre: "Magnitud", def: "Medida del tamaño de un sismo: a mayor magnitud, sismo más grande." },
      valor: { nombre: "Valor del petróleo", def: "Precio del crudo de Neuquén de cada mes multiplicado por lo producido ese mes. No es ganancia ni lo que recibe el Estado." },
    },
  },

  /* ------------------------------------------------------------ etiquetas de los (i) */
  etiquetasInfo: {
    n1: "Qué estoy viendo", n2: "Cómo se calculó", verMas: "Cómo se calculó", verMenos: "Ocultar el cálculo",
    detalle: "Detalle", como: "Cálculo", periodo: "Período", fuente: "Fuente", limite: "Limitaciones", atribucion: "Atribución",
    linkPendiente: "(link pendiente)", masInfo: "Más información",
  },

  /* ------------------------------------------------------------ (i): Nivel 1 + Nivel 2 */
  info: {
    /* (i) de las tarjetas de la intro: valores fijos a agosto de 2026 */
    intro_extraido: {
      n1: "A casi 3 kilómetros de profundidad, en la Cuenca Neuquina, hay una formación de roca que guarda enormes cantidades de petróleo y gas. Esta cifra es todo el petróleo que produjeron los pozos de Vaca Muerta desde el primer dato disponible (2006) hasta agosto de 2026, en barriles. Es el mismo número que muestra el panel «Lo que sale» con el dial en 2026.",
      n2: {
        como: "Cálculo propio: suma de la producción mensual de petróleo de los pozos con formación «vaca muerta»; 1 m³ = 6,2898 barriles.",
        periodo: "Desde enero de 2006 hasta agosto de 2026.",
        fuente: FUENTE_CAP4,
        limite: "La unidad (m³) está inferida de las series oficiales, no declarada en el CSV. Lo anterior a 2010 es muy poco (unos 0,17 millones de barriles).",
      },
    },
    intro_ritmo: {
      n1: "El mes en que Vaca Muerta produjo más petróleo por día en toda la serie. Es solo Vaca Muerta: la producción de todo el país ese mes fue mayor, porque suma otras cuencas y la producción convencional.",
      n2: {
        como: "Cálculo propio: producción mensual de petróleo de los pozos de Vaca Muerta, en barriles (1 m³ = 6,2898 barriles), dividida por los días del mes. Se toma el mes más alto.",
        periodo: "Datos mensuales desde 2006 hasta agosto de 2026.",
        fuente: FUENTE_CAP4,
        limite: "Agosto de 2026 es el último mes con datos; las empresas pueden corregir sus declaraciones más adelante. El explorador muestra años, no meses: el horizonte del encabezado usa el ritmo anual.",
      },
    },
    intro_agua: {
      n1: "Para extraer de Vaca Muerta se usa fractura hidráulica: se inyecta agua a alta presión con arena y aditivos. Es el agua inyectada declarada por las empresas, sumada desde 2010. No incluye el agua que vuelve a la superficie, que se muestra aparte en el panel «Lo que implica».",
      n2: {
        como: "Cálculo propio: suma del agua inyectada de cada fractura (Adjunto IV), asignada al año de inicio de la fractura. Se eliminaron 5 duplicados exactos y 3 registros con un valor repetido. Pileta olímpica = 2.500 m³.",
        periodo: "Desde 2010 hasta agosto de 2026.",
        fuente: { texto: "Datos de fractura (Adjunto IV)", url: "https://datos.gob.ar/dataset/datos-de-fractura-de-pozos-adjunto-iv" },
        limite: "Cubre 3.014 de 3.417 pozos de Vaca Muerta; hay registros con valores extremos o agua = 0.",
      },
    },
    intro_queda: {
      n1: "Qué parte del petróleo todavía no se extrajo, según dos estimaciones distintas de cuánto hay: lo confirmado (reservas comprobadas) y lo que podría haber (recursos técnicamente recuperables). Es el complemento de lo extraído, o sea 100 % menos el porcentaje de las dos barras del encabezado del explorador, con el dial en 2026. No es un pronóstico de producción.",
      n2: {
        como: "Cálculo propio: lo que queda = 100 % − % extraído, con % extraído = petróleo extraído hasta agosto de 2026 ÷ total de referencia. Petróleo confirmado (total de referencia) = extraído + reservas comprobadas; total del IAPG = extraído + recurso remanente. Con el dial en 2026: 100 − 26,9 = 73 % (redondeado) y 100 − 2,8 = 97 %. Cada porcentaje usa numerador y denominador del mismo alcance: las reservas son de todo el no convencional de la cuenca Neuquina (al 31/12/2025); los recursos, de la Formación Vaca Muerta (al 31/12/2024).",
        periodo: "Extraído hasta agosto de 2026.",
        fuente: [{ texto: "Secretaría de Energía, reservas al 31/12/2025 (hoja «fin de vida útil», no convencional, comprobadas, petróleo)", url: "https://datos.gob.ar/dataset/reservas-de-petroleo-y-gas/resource/b37bb43f-22a5-53b5-ac7e-c3ceecdb30c8" }, FUENTE_IAPG],
        limite: "«Sigue bajo tierra» es el volumen de referencia que todavía no se extrajo: no significa que vaya a extraerse. Las dos cifras tienen distinto alcance y fecha: no se comparan entre sí ni se restan. Ver «¿Por qué dos respuestas?» en el explorador.",
      },
    },
    petroleo: {
      n1: "Cuánto petróleo salió de los pozos de Vaca Muerta. El número grande suma todo lo producido desde 2006 hasta el año elegido; debajo, lo producido solo ese año. Se mide en barriles.",
      n2: {
        detalle: "Petróleo acumulado por los pozos de Vaca Muerta desde enero de 2006 hasta el año del dial, en barriles. Debajo, lo producido ese año. El gráfico muestra la serie anual y marca el año del dial.",
        como: "Suma de la producción mensual de petróleo de los pozos VM; 1 m³ = 6,2898 barriles. Acumulado = lo producido antes de 2010 + la suma de los años desde 2010 hasta el del dial.",
        periodo: "Acumulado desde enero de 2006; gráfico y dial desde 2010; 2026 hasta agosto.",
        fuente: FUENTE_CAP4,
        limite: "La unidad (m³) está inferida de las series oficiales, no declarada en el CSV. 2026 es parcial (hasta agosto). Lo anterior a 2010 es muy poco (unos 0,17 millones de barriles).",
      },
    },
    gas: {
      n1: "Cuánto gas salió de los pozos de Vaca Muerta. Igual que el petróleo: el número grande suma todo desde 2006 hasta el año elegido y debajo figura el de ese año. Se mide en millones de metros cúbicos.",
      n2: {
        detalle: "Gas acumulado por los pozos de Vaca Muerta desde enero de 2006 hasta el año del dial. Debajo, lo producido ese año.",
        como: "Suma de la producción mensual de gas de los pozos VM, en miles de m³ (se muestra en millones de m³: 1.000 miles de m³ = 1 millón de m³).",
        periodo: "Acumulado desde enero de 2006; gráfico y dial desde 2010; 2026 hasta agosto.",
        fuente: FUENTE_CAP4,
        limite: "Unidad inferida (miles de m³); incluye gas de pozos petrolíferos y gasíferos. 2026 es parcial.",
      },
    },
    valor: {
      n1: "Cuánto valdría el petróleo producido: el precio del crudo de Neuquén de cada mes multiplicado por lo producido ese mes. No es ganancia ni lo que recibe el Estado, y puede incluir condensado.",
      n2: {
        detalle: "Valor aproximado del petróleo extraído, acumulado desde 2006 hasta el año del dial, a precio del crudo de Neuquén. Más abajo se indica el valor del año del dial.",
        como: "Cada mes: producción VM (m³) × precio del crudo de Neuquén (USD/m³); se suman los meses y los años desde 2006 (lo anterior a 2010 aporta unos USD 7,8 millones). Precios definitivos hasta junio de 2026; julio y agosto de 2026 usan precios provisorios.",
        periodo: "Desde enero de 2006 hasta agosto de 2026 (julio y agosto con precios provisorios).",
        fuente: { texto: "Cap. IV y regalías de crudo, Secretaría de Energía", url: "https://datos.gob.ar/dataset/regalias-de-petroleo-crudo-gas-natural-glp-gasolina-y-condensado" },
        limite: "No es un ingreso real ni descuenta costos; la producción probablemente incluye condensado, valuado igual que el crudo. Los precios son nominales (sin deflactar) y algunos valores históricos tienen particularidades de la fuente, como el precio repetido de septiembre a diciembre de 2008.",
      },
    },
    valor_gas: {
      n1: "Es una estimación: el precio del gas en Argentina estuvo regulado y varía según el destino (hogares, industria, exportación). Se usó el precio de referencia que la Secretaría de Energía aplica para las regalías en Neuquén, convertido a dólares con el tipo de cambio oficial de cada mes.",
      n2: {
        detalle: "Valor aproximado del gas extraído, acumulado desde 2006 hasta el año del dial. Más abajo se indica el valor del año del dial. Es un número aparte del valor del petróleo: no se suman.",
        como: "Cada mes: producción de gas de los pozos VM (miles de m³) × precio del gas de Neuquén (pesos por miles de m³) ÷ tipo de cambio mayorista de referencia (Com. A 3500 del BCRA, promedio simple de los días del mes, pesos por dólar). Se suman los meses y los años desde 2006 (lo anterior a 2010 aporta unos USD 0,3 millones). Precios definitivos hasta junio de 2026; julio y agosto de 2026 usan precios provisorios.",
        periodo: "Desde enero de 2006 hasta agosto de 2026 (julio y agosto con precios provisorios).",
        fuente: [
          { texto: "Cap. IV y regalías de gas natural, Secretaría de Energía", url: "https://datos.gob.ar/dataset/regalias-de-petroleo-crudo-gas-natural-glp-gasolina-y-condensado" },
          { texto: "Tipo de cambio mayorista de referencia, BCRA (serie diaria)", url: "https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/5" },
        ],
        limite: "No es un ingreso real ni descuenta costos. El precio es el de referencia para regalías en Neuquén, no el de cada contrato, y el gas producido no es necesariamente el vendido (incluye gas de pozos petrolíferos y gasíferos). El Excel de regalías convierte con el dólar BNA del día hábil anterior a cada liquidación, que en 2024-2026 es entre 1,5 % y 2 % más alto que el promedio mensual usado acá: con ese tipo de cambio el valor sería algo menor. Valores nominales (sin deflactar).",
      },
    },
    agua_entran: {
      n1: "Para extraer de Vaca Muerta se usa " + G("fractura", "fractura hidráulica") + ": se inyecta a alta presión agua con arena y aditivos, que abre pequeñas grietas en la roca; la arena las mantiene abiertas para que fluyan el petróleo y el gas. Se muestra el agua inyectada declarada por las empresas. En {año} también se usaron {arena} toneladas de arena.",
      n2: {
        detalle: "Agua de fractura declarada, acumulada hasta el año del dial; debajo, la de ese año. Pileta olímpica = 2.500 m³.",
        como: "Suma del agua inyectada de cada fractura (Adjunto IV), asignada al año de inicio de la fractura. Se eliminaron 5 duplicados exactos y 3 registros con un valor repetido (537.184,6 m³).",
        periodo: "Desde 2010; 2026 hasta agosto.",
        fuente: { texto: "Datos de fractura (Adjunto IV)", url: "https://datos.gob.ar/dataset/datos-de-fractura-de-pozos-adjunto-iv" },
        limite: "Cubre 3.014 de 3.417 pozos VM; hay registros con valores extremos o agua = 0. Sin filtros incluye 7 pozos que no se ven en el mapa. Se asigna al año de inicio de la fractura. El agua que entra y el agua que vuelve no se restan: provienen de fuentes, pozos y períodos distintos (ver el (i) de «Agua que vuelve»).",
      },
    },
    agua_vuelven: {
      n1: "Agua que sale del pozo junto con el petróleo: " + G("aguaformacion", "agua que estaba en la roca") + " (salada, con hidrocarburos) y parte del agua de fractura que regresa; los datos no permiten separarlas. Su composición y su destino requieren una interpretación cuidadosa: la fuente no informa qué se hace con el agua de cada pozo. Según Rosa y D'Odorico (2019), citado por Schultz et al. (2024), en la producción no convencional alrededor de un tercio del fluido producido es agua residual, que se elimina por inyección subterránea, y solo alrededor del 5 % se recicla; es una referencia general, no un dato de estos pozos. No se resta del agua que entra: son series de fuentes distintas.",
      n2: {
        detalle: "Agua producida acumulada hasta el año del dial; debajo, la de ese año. Comparte el gráfico con el agua que entra.",
        como: "Suma del agua producida mensual de los pozos VM (Capítulo IV), asignada al mes en que se declaró. Según Rosa y D'Odorico (2019), citado en Schultz et al. (2024), alrededor de un tercio del fluido producido es agua residual, que se elimina por inyección subterránea, y solo alrededor del 5 % se recicla; es una referencia general, no un dato de estos pozos.",
        periodo: "Acumulado desde 2006; gráfico desde 2010; 2026 hasta agosto.",
        fuente: FUENTE_CAP4,
        limite: "La fuente no especifica la unidad; se asume m³, como el resto de los volúmenes del Capítulo IV. No informa el tratamiento ni el destino del agua de cada pozo. No se afirman otros destinos que los citados. No se compara con el agua que entra como un balance: el agua que entra es la inyectada en las fracturas (Adjunto IV, 3.014 de 3.417 pozos, asignada al año de la fractura) y el agua que vuelve es la declarada mes a mes por todos los pozos en producción (Capítulo IV); no corresponden necesariamente a los mismos pozos ni a los mismos períodos, y el agua que vuelve incluye agua de formación. Por eso la diferencia entre las dos cifras no indica cuánta agua quedó bajo tierra.",
      },
    },
    sismos: {
      n1: "Un sismo es una vibración del suelo y la " + G("magnitud", "magnitud") + " mide su tamaño. Se muestran los sismos registrados por el INPRES, el organismo nacional que los mide, en la zona de Vaca Muerta. Aparecen junto a la actividad petrolera en el tiempo y en el espacio, pero eso no significa que cada uno haya sido causado por ella.",
      /* el Nivel 2 se arma en app.js con los datos del año del dial + el contexto general de sismos.general */
    },
    pozos: {
      n1: "Cada punto es un " + G("pozo", "pozo") + " de Vaca Muerta: una perforación de la que sale petróleo o gas de esta formación. Aparece en el mes en que empezó a producir. No se muestran pozos convencionales, de otras formaciones, pozos sumideros ni pozos que nunca produjeron.",
      n2: {
        detalle: "Pozos de Vaca Muerta con producción de petróleo o gas; cada punto aparece el mes de su primera producción y no implica que siga produciendo. Los números debajo del mapa cuentan los pozos que ya habían empezado a producir hasta el año del dial (en 2026, hasta agosto), con los filtros aplicados.",
        como: "Posición, fecha y producción del Cap. IV (formación «vaca muerta» del CSV no convencional). Primera producción = primer mes con petróleo o gas mayor que cero. Se excluyen 54 pozos que nunca produjeron.",
        periodo: "Pozos con primera producción anterior a 2010 se muestran presentes desde el inicio del dial.",
        fuente: { texto: "Cap. IV; límite de la cuenca: datos.gob.ar", url: "https://datos.gob.ar/dataset/exploracion-hidrocarburos-cuencas-sedimentarias" },
        limite: "Profundidad faltante o inválida: mediana de VM (marcada «estimada»; solo se ve en el tooltip). Se supone pozo vertical. El tipo (petrolífero, gasífero, otros) es el del último mes con producción; «otros» incluye los pozos de tipo «Otro tipo».",
        enAnio: "En {año}: {a} pozos de Vaca Muerta produjeron petróleo o gas y {b} empezaron a producir ese año (total de la formación, sin filtros).",
      },
    },
    vista: {
      n1: "La vista Pozos muestra cuándo y dónde empezó a producir cada pozo. Las otras vistas muestran, con columnas, cuánto se acumuló en cada zona: petróleo, gas o agua. Cada vista tiene su propia unidad y escala, así que las alturas no se comparan entre vistas.",
      n2: {
        detalle: "Grilla de hexágonos de {radio} km de radio (de centro a vértice) sobre la zona de pozos. En las vistas con columnas, la altura es proporcional a lo acumulado por todos los pozos del hexágono hasta el momento del dial, sin importar su tipo. Escala lineal y fija: el máximo es el acumulado final de cada variable, igual para todos los años, y es propia de cada vista. Al acercar el zoom los hexágonos y las columnas mantienen su forma y tamaño real, como edificios, para ver los pozos de cada uno.",
        como: "Petróleo (barriles), gas (m³) y agua que vuelve (m³): producción acumulada de cada pozo hasta el momento del dial, repartida de forma pareja dentro de cada año desde la aparición del pozo. Agua que entra (m³): agua inyectada, asignada al año de la fractura y repartida de forma pareja dentro de ese año; solo se suma desde que el pozo empezó a producir. El agua se une a cada pozo por su idpozo. Color desde arriba: raíz cuadrada del valor, para distinguir hexágonos chicos.",
        periodo: "Desde 2006 (petróleo, gas y agua que vuelve) y desde 2010 (agua que entra) hasta el mes del dial.",
        fuente: [
          { texto: "Cap. IV y Adjunto IV (fractura), Secretaría de Energía", url: "https://datos.gob.ar/dataset/energia-produccion-petroleo-gas-por-pozo-capitulo-iv" },
        ],
        limite: "Tipo de pozo: el del último mes con producción (un pozo puede haber cambiado de tipo; «otros» incluye el tipo «Otro tipo»). El agua que entra cubre el 88 % de los pozos VM (3.014 de 3.417); falta el resto. La fuente no especifica la unidad del agua que vuelve; se asume m³, como el resto de los volúmenes del Capítulo IV. La pertenencia a un hexágono depende del tamaño y la posición de la grilla; la altura no es profundidad. Los filtros afectan las columnas.",
      },
    },
    sismos_todos: {
      n1: "Con el dial al final, se ven juntos todos los sismos registrados desde 2019, para ver dónde se concentran respecto de los pozos. Que ocurran cerca no prueba que cada uno haya sido inducido.",
      n2: {
        detalle: "Activa o desactiva la capa de sismos del mapa. Con la capa activa, cada sismo del catálogo (del 1/1/2019 al 31/8/2026) aparece en su fecha según el dial, destella y queda visible; con el dial en 2026 se ven todos juntos sobre los pozos de Vaca Muerta.",
        como: "Mismos filtros que el resto del mapa: magnitud 2,0 o más, profundidad de hasta 30 km y dentro del área de estudio (pozos VM + 20 km). El tamaño del anillo indica la magnitud.",
        periodo: "Del 1/1/2019 al 31/8/2026.",
        fuente: { texto: "INPRES, buscador de sismos (consulta del 8/10/2026)", url: "http://contenidos.inpres.gob.ar/buscar_sismo" },
        limite: "Son los sismos registrados, no necesariamente todos los que ocurrieron. Su cercanía con los pozos no demuestra causalidad.",
      },
    },
    sismos_graf: {
      n1: "Las dos series se muestran juntas para comparar su evolución; una coincidencia en el tiempo no prueba causalidad.",
      n2: {
        detalle: "Arriba, sismos registrados por año (magnitud 2,5 o más, INPRES). Abajo, agua de fractura inyectada por año (Adjunto IV). Cada serie tiene su propia escala vertical: se comparan las formas, no las alturas.",
        como: "Sismos: conteo anual con los filtros del mapa. Agua: suma del agua inyectada de cada fractura, asignada al año de inicio. 2026 es parcial (sismos hasta el 31/8; agua hasta agosto).",
        periodo: "2019 a 2026.",
        fuente: [
          { texto: "INPRES, buscador de sismos (consulta del 8/10/2026)", url: "http://contenidos.inpres.gob.ar/buscar_sismo" },
          { texto: "Datos de fractura (Adjunto IV)", url: "https://datos.gob.ar/dataset/datos-de-fractura-de-pozos-adjunto-iv" },
        ],
        limite: "El agua que entra cubre el 88 % de los pozos VM. El filtro por operador o tipo de pozo afecta la serie de agua, no la de sismos.",
      },
    },
    dial: {
      n1: "Elegí un año para ver cómo estaba Vaca Muerta entonces: el mapa y todos los números cambian con él. ▶ recorre los años mes a mes. 2026 está incompleto (llega hasta agosto).",
      n2: {
        detalle: "Selector de año (2010–2026) que actualiza el mapa y los indicadores. 2026 es un año parcial.",
        como: "Los indicadores son anuales; los pozos se muestran desde el mes de su primera producción. Los acumulados incluyen también lo producido desde 2006 (0,02 % del total).",
        periodo: "2010 a 2025, más 2026 hasta agosto.",
        fuente: { texto: "Capítulo IV (último dato: agosto de 2026)", url: FUENTE_CAP4.url },
        limite: "2026 llega hasta agosto (el valor usa precios provisorios en julio y agosto). Los horizontes en años del encabezado cambian con el ritmo de producción del año elegido; en 2026 usan el ritmo de 2025, porque el año está incompleto.",
      },
    },

    /* estimaciones del encabezado */
    tarjeta_reservas: {
      n1: "Qué parte del petróleo «confirmado» ya se extrajo. El total de referencia es lo extraído hasta fines de 2025 más las reservas comprobadas a esa fecha: el petróleo que las empresas declaran, con datos geológicos y de ingeniería, que se puede extraer y vender con razonable certeza (al menos 90 % de probabilidad). La barra muestra qué parte de ese total de 2025 ya había salido en el año del dial. Debajo, cuántos años cubriría lo que queda si la producción se mantuviera al ritmo del año elegido: a medida que la producción se acelera, el número baja. Es una extrapolación a ritmo constante: no es un pronóstico de producción ni una fecha de agotamiento, y las reservas se revisan cada año. Petróleo confirmado = lo ya extraído + las reservas comprobadas al 31/12/2025. Incluye todo el petróleo no convencional de la Cuenca Neuquina, porque la Secretaría de Energía no publica las reservas separadas por formación; Vaca Muerta es la gran mayoría. Estas estimaciones corresponden solo al petróleo. Para el gas no hay una estimación actualizada comparable: la última (EIA, 2013) calculaba unos 308 billones de pies cúbicos técnicamente recuperables en Vaca Muerta.",
      n2: {
        detalle: "Porción extraída del inventario comprobado de referencia 2025. Reservas comprobadas de petróleo no convencional de la cuenca Neuquina al 31/12/2025: 414,5 millones de m³ (2.607 millones de barriles). Lo extraído de ese mismo petróleo hasta el 31/12/2025: 119,2 millones de m³. Total de referencia: 533,7 millones de m³.",
        como: "% extraído = petróleo no convencional de la cuenca Neuquina extraído desde enero de 2006 hasta el año del dial ÷ (lo extraído hasta el 31/12/2025 + reservas comprobadas al 31/12/2025) × 100. En 2025: 119,2 ÷ 533,7 = 22,3 %. Horizonte del año elegido = lo que queda ÷ producción de ese año, todo en m³. Lo que queda = total de referencia (533,7 millones de m³) − lo extraído hasta ese año; en 2025 es igual a las reservas comprobadas: 414,5 ÷ 29,3 ≈ 14 años. En 2020: 508,7 ÷ 6,9 ≈ 73 años. Los años restantes se calculan dividiendo el volumen de referencia que se estima pendiente por la producción anual del año seleccionado. El resultado indica cuántos años cubriría ese volumen si la producción se mantuviera constante a ese ritmo. No es un pronóstico de producción ni una fecha de agotamiento. Las reservas y los recursos pueden cambiar con nuevas exploraciones, revisiones, tecnología y condiciones económicas. Las reservas se publican en miles de m³ y se multiplican por 1.000; 1 m³ = 6,2898 barriles.",
        periodo: "Reservas: al 31/12/2025 (hasta el fin de la vida útil de los yacimientos). Producción: enero de 2006 a agosto de 2026. 2026 está incompleto: su porcentaje incluye lo extraído hasta agosto.",
        fuente: [{ texto: "Secretaría de Energía, reservas al 31/12/2025 (hoja «fin de vida útil», no convencional, comprobadas, petróleo)", url: "https://datos.gob.ar/dataset/reservas-de-petroleo-y-gas/resource/b37bb43f-22a5-53b5-ac7e-c3ceecdb30c8" },
                 { texto: "Resolución 324/2006", url: "https://www.argentina.gob.ar/normativa/nacional/norma-114769/texto" },
                 { texto: "Resolución 482/1998", url: "https://www.argentina.gob.ar/normativa/nacional/norma-53548/texto" }, FUENTE_CAP4],
        enAnio: {
          texto: "En {año}: quedan {r} millones de m³ (total de referencia − lo extraído hasta {año}); producción de {ritmo}: {p} millones de m³; horizonte = {r} ÷ {p} = {h} años (valor sin redondear a años enteros).",
          parcial: "{año} está incompleto: lo extraído llega hasta {mes} de {año} y la producción usada es la de {ritmo}, sin anualizar {año}.",
          noCalculable: "En {año} no hubo producción registrada: el horizonte no se puede calcular.",
        },
        limite: "Para que las dos partes de la cuenta midan lo mismo, se usa todo el petróleo no convencional de la cuenca Neuquina y no solo Vaca Muerta: las reservas no se publican por formación. Vaca Muerta fue el 99,3 % de esa producción en 2025 y el 96 % de lo extraído hasta 2025. El total de referencia es el de fines de 2025: en los años anteriores no se conocía esa cifra, así que el porcentaje de cada año compara con lo que se sabe hoy, no con lo que se sabía entonces. Si se contaran las reservas solo hasta el fin de las concesiones serían 407,2 millones de m³. El horizonte supone un ritmo constante, pero la producción crece y las reservas cambian cada año: no es un pronóstico de producción ni una fecha de agotamiento, ni lo que se estimaba en el año elegido. En los primeros años la producción era mínima y el horizonte da cifras muy altas (más de 8.000 años en 2010): la interfaz las abrevia como «más de 1.000 años» y el valor exacto aparece arriba. En 2026 se descuenta lo extraído hasta agosto, sin una revisión de reservas posterior al 31/12/2025. Esta tarjeta mide todo el no convencional de la cuenca Neuquina al 31/12/2025; la de recursos, solo la Formación Vaca Muerta al 31/12/2024: sus porcentajes no se comparan entre sí.",
      },
    },
    tarjeta_iapg: {
      n1: "Qué parte del petróleo que podría extraerse de Vaca Muerta con la tecnología actual ya se extrajo, sin considerar si sería rentable hacerlo. Lo estimó el Instituto Argentino del Petróleo y del Gas (IAPG) a pedido de la Secretaría de Energía, con datos al 31/12/2024. Incluye las reservas y además petróleo que todavía no está confirmado o que hoy no sería rentable: por eso es mucho mayor. Debajo, cuántos años cubriría lo que queda si la producción se mantuviera al ritmo del año elegido: a medida que la producción se acelera, el número baja. Es una extrapolación a ritmo constante: no es un pronóstico de producción ni una fecha de agotamiento, y no significa que todo ese petróleo vaya a ser rentable o a extraerse. El total estimado por el IAPG incluye lo ya extraído más el recurso remanente. Estas estimaciones corresponden solo al petróleo. Para el gas no hay una estimación actualizada comparable: la última (EIA, 2013) calculaba unos 308 billones de pies cúbicos técnicamente recuperables en Vaca Muerta.",
      n2: {
        detalle: "Porción extraída del total técnicamente recuperable estimado por el IAPG. Recursos remanentes técnicamente recuperables de petróleo de la Formación Vaca Muerta al 31/12/2024: 30.170 millones de barriles (mejor estimación; entre 18.062 y 45.050 millones según la estimación baja y la alta del IAPG). Ya extraído a esa fecha, según el IAPG: 558 millones de barriles. Total estimado: 30.728 millones de barriles (4.885 millones de m³). Lo remanente incluye las reservas comprobadas, probables y posibles, los recursos contingentes y los prospectivos.",
        como: "% extraído = petróleo de los pozos de Vaca Muerta extraído desde enero de 2006 hasta el año del dial ÷ 30.728 millones de barriles × 100 (1 m³ = 6,2898 barriles). En 2025: 721,8 ÷ 30.728 = 2,35 % (se muestra como 2,3 %). Horizonte del año elegido = lo que queda ÷ producción de ese año, todo en millones de barriles. Lo que queda parte del total de 30.728: se resta lo extraído según el IAPG hasta el 31/12/2024 (558) y la producción de Capítulo IV posterior a esa fecha, o se suma la que hubo entre el año elegido y 2024. Así, en 2024 queda exactamente lo que estimó el IAPG (30.170: 30.170 ÷ 142 ≈ 213 años) y en 2025, 30.170 − 183 = 29.987 (29.987 ÷ 183 ≈ 164 años; entre ≈ 98 y ≈ 245 con la estimación baja y la alta del IAPG). El remanente de fines de 2025 es una aproximación propia: se resta la producción de 2025 a los recursos remanentes estimados por el IAPG al 31/12/2024. No es una nueva estimación del IAPG. El horizonte no cambia el total fijo de 30.728 que usa el porcentaje. Los años restantes se calculan dividiendo el volumen de referencia que se estima pendiente por la producción anual del año seleccionado. El resultado indica cuántos años cubriría ese volumen si la producción se mantuviera constante a ese ritmo. No es un pronóstico de producción ni una fecha de agotamiento. Las reservas y los recursos pueden cambiar con nuevas exploraciones, revisiones, tecnología y condiciones económicas.",
        periodo: "Estimación del IAPG al 31/12/2024 (informe de julio de 2026, comunicado el 12/08/2026). Producción: enero de 2006 a agosto de 2026; 2026 está incompleto.",
        fuente: [FUENTE_IAPG, FUENTE_COMUNICADO, { texto: "EIA (2013), informe original", url: "https://www.eia.gov/analysis/studies/worldshalegas/pdf/overview.pdf" }, FUENTE_CAP4],
        enAnio: {
          texto: "En {año}: quedan {r} millones de barriles (entre {rb} y {ra} con la estimación baja y la alta del IAPG); producción de {ritmo}: {p} millones de barriles; horizonte = {h} años (entre {hb} y {ha}), valor sin redondear a años enteros.",
          parcial: "{año} está incompleto: lo extraído llega hasta {mes} de {año} y la producción usada es la de {ritmo}, sin anualizar {año}.",
          noCalculable: "En {año} no hubo producción registrada: el horizonte no se puede calcular.",
        },
        limite: "Es un recurso, no una reserva: no asegura que ese petróleo se vaya a extraer. Lo extraído según el IAPG (558 millones de barriles al 31/12/2024) es mayor que lo que suman los pozos de Vaca Muerta en Capítulo IV (539 millones): Capítulo IV es un 3,5 % menor que lo informado por el IAPG, así que el porcentaje puede estar levemente subestimado. El IAPG incluye la zona de gas y condensado de la formación. El horizonte supone un ritmo constante: no es un pronóstico de producción ni una fecha de agotamiento, ni lo que se estimaba en el año elegido. Hasta 2018 supera los 1.000 años porque la producción era mínima: la interfaz las abrevia como «más de 1.000 años» y el valor exacto aparece arriba. Para lo que queda se usa lo extraído según el IAPG hasta 2024 y solo la producción anual de Capítulo IV; el porcentaje, en cambio, usa siempre Capítulo IV: por eso no se mezclan las dos fuentes dentro de una misma cuenta. Esta tarjeta mide solo la Formación Vaca Muerta al 31/12/2024; la de reservas, todo el no convencional de la cuenca Neuquina al 31/12/2025: sus porcentajes no se comparan entre sí. La EIA estimó en 2013 16.220 millones de barriles con otro método, como recurso «no probado» y antes de casi toda la producción: la diferencia (+86 % para lo remanente, +89 % para el total) muestra cuánto cambió la estimación, no cuánto petróleo «apareció».",
      },
    },
  },

  /* ------------------------------------------------------------ hitos del dial (la fecha viene de datos/procesados/hitos.json) */
  hitos: {
    repsol_ypf_2010: {
      corta: "Repsol-YPF",
      etiqueta: "Repsol-YPF reconoce el potencial no convencional",
      n1: "En 2010 Repsol-YPF reconoció el potencial no convencional de Vaca Muerta, según Schultz et al. (2024).",
      n2: {
        detalle: "Reconocimiento del potencial no convencional de la formación por parte de Repsol-YPF, en 2010.",
        como: "Hito elegido por la autora. Solo se conoce el año: se ubica al comienzo de 2010.",
        periodo: "2010.",
        fuente: FUENTE_SCHULTZ,
        limite: "Es un hecho puntual; no se afirma su efecto sobre la producción. Según Schultz et al. (2024), el potencial económico de la formación como objetivo de fractura hidráulica fue reconocido por primera vez en 2010 por Repsol-YPF; la fuente no da el día ni el mes.",
      },
    },
    acuerdo_ypf_chevron_2013: {
      corta: "Chevron",
      etiqueta: "Acuerdo YPF–Chevron",
      n1: "En julio de 2013 YPF y Chevron firmaron un acuerdo para explotar juntas hidrocarburos no convencionales en Vaca Muerta.",
      n2: {
        detalle: "Acuerdo para la explotación conjunta de no convencionales en Loma Campana y Loma La Lata Norte (Vaca Muerta, Neuquén). Firmado el 16/07/2013.",
        como: "Hito elegido por la autora; se usa la fecha de firma.",
        periodo: "16/07/2013.",
        fuente: { texto: "YPF, conferencia del 29/08/2013", url: "https://novedades.ypf.com/Conferencia_29082013.html" },
        limite: "Es un hecho puntual; no se afirma su efecto sobre la producción.",
      },
    },
    ley_27742_2024: {
      corta: "RIGI",
      etiqueta: "Ley 27.742 (incluye el RIGI)",
      n1: "En 2024 se publicó la Ley 27.742, que incluye el Régimen de Incentivo para Grandes Inversiones (RIGI).",
      n2: {
        detalle: "Ley que incluye el Régimen de Incentivo para Grandes Inversiones (RIGI); sancionada el 27/06/2024, publicada el 08/07/2024.",
        como: "Hito elegido por la autora; se usa la fecha de publicación en el Boletín Oficial.",
        periodo: "08/07/2024.",
        fuente: { texto: "Boletín Oficial, 08/07/2024", url: "https://www.boletinoficial.gob.ar/detalleAviso/primera/310189/20240708" },
        limite: "No se afirma efecto sobre la producción; la ley es más amplia que el sector hidrocarburífero.",
      },
    },
    estudio_iapg_2026: {
      corta: "IAPG",
      etiqueta: "Estudio IAPG",
      n1: "En agosto de 2026 se comunicó un estudio del IAPG que estima los recursos de petróleo que todavía quedan en Vaca Muerta (30.170 millones de barriles).",
      n2: {
        detalle: "El 12/08/2026 se comunicó el estudio del IAPG: 30.170 millones de barriles de recursos remanentes técnicamente recuperables al 31/12/2024. La EIA había estimado 16.220 millones en 2013, con otro método.",
        como: "Hito elegido por la autora; se usa la fecha del comunicado oficial.",
        periodo: "12/08/2026.",
        fuente: [FUENTE_COMUNICADO, FUENTE_IAPG],
        limite: "La fecha del hito es la del comunicado; los volúmenes estimados están referidos al 31/12/2024.",
      },
    },
  },

  /* ------------------------------------------------------------ metodología y fuentes */
  metodologia: {
    titulo: "Metodología y fuentes",
    cerrar: "Cerrar",
    /* Texto para público general: va ARRIBA; la metodología detallada sigue debajo, sin cambios de fondo. */
    introGeneral: [
      "Esta página combina datos abiertos de producción de petróleo y gas de los pozos de Vaca Muerta con registros de sismos y con distintas estimaciones de lo que queda. Responde cuatro preguntas: ¿cuánto queda?, ¿cómo creció la actividad?, ¿qué se obtiene? y ¿qué otras cosas pasan mientras tanto?",
      "Cada (i) de la página explica en dos pasos qué se está viendo y cómo se calculó. Acá se reúne todo en un solo lugar.",
    ],
    secciones: [
      {
        titulo: "Datos",
        parrafos: [
          "Pozos de Vaca Muerta (formación «vaca muerta» en el CSV de producción no convencional del Capítulo IV de la Secretaría de Energía). Cada pozo aparece el mes de su primera producción de petróleo o gas. Se excluyen 54 pozos que nunca produjeron. Quedan 3.363 pozos.",
        ],
        fuentes: [
          { texto: "Producción de petróleo y gas por pozo, Capítulo IV (Secretaría de Energía)", url: "https://datos.gob.ar/dataset/energia-produccion-petroleo-gas-por-pozo-capitulo-iv" },
          { texto: "Límite de la cuenca: Exploración, hidrocarburos, cuencas sedimentarias", url: "https://datos.gob.ar/dataset/exploracion-hidrocarburos-cuencas-sedimentarias" },
          { texto: "Mapa base: Esri, «World Dark Gray Base» (sin etiquetas propias; Esri, HERE, Garmin, © OpenStreetMap contributors y la comunidad de usuarios GIS), mostrado con baja opacidad", url: "https://www.arcgis.com/home/item.html?id=358ec1e175ea41c3bf5c68f0da11ae2b" },
          { texto: "OpenStreetMap, derechos de autor y licencia (datos incluidos en el mapa base)", url: "https://www.openstreetmap.org/copyright" },
          { texto: "Wikidata (CC0): coordenadas de Rincón de los Sauces (Q993293) y Sauzal Bonito (Q7427646)", url: "https://www.wikidata.org/wiki/Q993293" },
          { texto: "Wikipedia (es): coordenadas del Lago Los Barreales y del Lago Mari Menuco (llamados «embalses» en el mapa); el Río Neuquén se ubicó sobre su trazo en el mapa base", url: "https://es.wikipedia.org/wiki/Lago_Los_Barreales" },
          { texto: "Regalías de petróleo crudo, gas natural, GLP, gasolina y condensado (precios del crudo y del gas de Neuquén)", url: "https://datos.gob.ar/dataset/regalias-de-petroleo-crudo-gas-natural-glp-gasolina-y-condensado" },
          { texto: "BCRA, tipo de cambio mayorista de referencia (Com. A 3500), serie diaria", url: "https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/5" },
          { texto: "EIA (2013), estimación de recursos de shale oil y gas técnicamente recuperables (informe original, resumen)", url: "https://www.eia.gov/analysis/studies/worldshalegas/pdf/overview.pdf" },
          { texto: "Comunicado del Ministerio de Economía, 12/08/2026 (estudio IAPG y cifras de referencia)", url: FUENTE_COMUNICADO.url },
          { texto: FUENTE_IAPG.texto + " (valores al 31/12/2024)", url: FUENTE_IAPG.url },
          { texto: "Reservas al 31/12/2025 (Secretaría de Energía)", url: "https://datos.gob.ar/dataset/reservas-de-petroleo-y-gas/resource/b37bb43f-22a5-53b5-ac7e-c3ceecdb30c8" },
          { texto: "Datos de fractura (Adjunto IV)", url: "https://datos.gob.ar/dataset/datos-de-fractura-de-pozos-adjunto-iv" },
          { texto: "IAE, Observatorio de Vaca Muerta: resumen de la performance de la formación en 2025 (control del acumulado)", url: "https://www.iae.org.ar/wp-content/uploads/2026/03/Vaca-Muerta_analisis-2025_vmo_260330_155248.pdf" },
          { texto: "Schultz et al. (2024), «Chasing the ghost of fracking in the Vaca Muerta Formation», Seismica (cita a Rosa y D'Odorico, 2019, sobre agua residual y reciclaje; y el reconocimiento del potencial no convencional por Repsol-YPF en 2010)", url: "https://doi.org/10.26443/seismica.v3i2.1435" },
          { texto: "Catálogo de sismos: INPRES, buscador de sismos (información pública; criterios: fechas 01/01/2000 a 08/10/2026, lat −36,5 a −39,5, long −70,5 a −67,5, magnitud 0 a 9; descarga manual, consulta del 8/10/2026)", url: "http://contenidos.inpres.gob.ar/buscar_sismo" },
          { texto: "Schultz, R., Tamburini-Beliveau, G., Correa-Otto, S. y Grosso-Heredia, J. (2024), RyanJamesSchultz/VM-ID: Seismica release, Zenodo, CC BY 4.0: usado como control y para el contexto anterior a 2019", url: "https://doi.org/10.5281/zenodo.14065345" },
          { texto: "USGS Earthquake Hazards Program, ComCat (dominio público): sismos de magnitud 4 o más desde 2000, lat −36,5 a −39,5, long −70,5 a −67,5; descarga manual del 8/10/2026", url: "https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=2000-01-01&minmagnitude=4&minlatitude=-39.5&maxlatitude=-36.5&minlongitude=-70.5&maxlongitude=-67.5&orderby=time" },
          { texto: "Schultz et al. (2024), sección 2.1: red local temporaria de 11 estaciones (noviembre de 2014 a julio de 2016; 5 estaciones de julio de 2016 a junio de 2020) y ampliación de la red en 2019 (datos de los mensajes de sismos anteriores a 2019)", url: "https://seismica.library.mcgill.ca/article/view/1435/1728" },
          { texto: "YPF, conferencia del 29/08/2013 (acuerdo YPF–Chevron)", url: "https://novedades.ypf.com/Conferencia_29082013.html" },
          { texto: "Boletín Oficial, 08/07/2024 (Ley 27.742)", url: "https://www.boletinoficial.gob.ar/detalleAviso/primera/310189/20240708" },
        ],
      },
      {
        titulo: "Períodos",
        parrafos: [
          "Los acumulados de petróleo, gas, valor y agua producida suman todo lo registrado desde enero de 2006 en el CSV por pozo, con el mismo filtro de formación. El dial y los gráficos muestran los años desde 2010 hasta 2025, más 2026 hasta agosto. Los pozos con primera producción anterior a 2010 se muestran presentes desde el inicio.",
          "Lo anterior a 2010 es muy poco: 27.301 m³ de petróleo (unos 0,17 millones de barriles) en total, el 0,02 % del acumulado a agosto de 2026; entre 11 y 107 pozos por año. Sacarlo no cambia los porcentajes de «ya extraído» en más de 0,03 puntos (la tarjeta de reservas usa todo el no convencional de la cuenca: 139.545 m³ antes de 2010). Los registros de 2006 pueden estar cortados al inicio de la serie, y el valor del petróleo se calcula con la misma metodología mensual desde 2006 (precios nominales; algunos precios históricos tienen particularidades de la fuente, como el valor repetido de septiembre a diciembre de 2008).",
          "Agua de fractura: años de fractura desde 2010 (no hay registros de fractura de pozos VM anteriores). Sismos: registros analizados desde el 1/1/2019 hasta el 31/8/2026, igual que el resto de los datos (el INPRES tiene registros posteriores al corte: no se usan). El dial empieza en 2010, pero para 2010-2018 no se muestran conteos: no significa que no hubiera sismos, sino que no se analizaron registros comparables. Valor del petróleo y del gas: hasta agosto de 2026, el mismo período que los volúmenes; los precios de julio y agosto son provisorios (definitivos hasta junio), como se indica en el (i) del valor. Con precios definitivos solamente, el valor llegaría hasta junio de 2026. Reservas: al 31/12/2025. IAPG: estimación al 31/12/2024 (comunicada el 12/08/2026). Horizontes del encabezado: producción de 2025. EIA (dato histórico): estimación de 2013. Tarjetas de la intro: las cuatro están a agosto de 2026.",
        ],
      },
      {
        titulo: "Cálculos",
        parrafos: [
          "Petróleo: suma mensual de la producción de los pozos VM; 1 m³ = 6,2898 barriles. Gas: miles de m³. Las unidades de producción están inferidas de las series oficiales, no declaradas en el CSV.",
          "Valor del petróleo producido: producción mensual × precio del crudo de Neuquén del mes (USD/m³), precios definitivos hasta junio de 2026; julio y agosto de 2026 con precios provisorios. No es una ganancia, un ingreso real ni regalías, y no descuenta costos.",
          "Valor estimado del gas producido: producción mensual de gas de los pozos VM (miles de m³) × precio del gas de Neuquén del mes (pesos por miles de m³, Excel de regalías de gas) ÷ tipo de cambio mayorista de referencia (Com. A 3500 del BCRA, promedio simple del mes); precios definitivos hasta junio de 2026, julio y agosto de 2026 provisorios. Se muestra aparte y nunca se suma al valor del petróleo.",
          "Agua: «Agua que entra» es el agua de fractura (Adjunto IV), asignada al año de inicio de la fractura; «Agua que vuelve» es el agua producida junto con el petróleo y el gas (Capítulo IV). Se muestran como acumulado hasta el año del dial y total del año. Se eliminaron 5 duplicados exactos y 3 registros con un valor repetido (537.184,6 m³) en el agua de fractura. La arena se menciona solo en el (i) de «Agua que entra».",
          "Mapa, vista Pozos: un punto por pozo, desde el mes de su primera producción; color según el tipo del último mes con producción (petrolífero, gasífero u otros). Mapa, vistas con columnas (petróleo, gas, agua que entra, agua que vuelve): grilla de hexágonos; la altura es proporcional (escala lineal y fija, propia de cada vista) a lo acumulado por todos los pozos del hexágono hasta el momento del dial, en la unidad de cada variable (barriles o m³). Dentro de cada año, la producción se reparte de forma pareja desde la aparición del pozo.",
          "Sismos, fuente: la capa y el panel usan solo el catálogo del INPRES, desde el 1/1/2019 (información pública; buscador de sismos, http://contenidos.inpres.gob.ar/buscar_sismo). Criterios de búsqueda: fechas 01/01/2000 a 08/10/2026, cuadrante de latitud −36,5 a −39,5 y longitud −70,5 a −67,5, todas las provincias, magnitud 0 a 9, sin filtro de intensidad. Consulta y descarga manual el 8/10/2026: 473 eventos. Se cortan al 31/08/2026 (25 posteriores quedan fuera): 448 eventos, 436 desde 2019. No se combina con otros catálogos.",
          "Sismos, filtros y conteo: a todos los eventos por igual se les aplican, en este orden, magnitud de 2,0 o más para el mapa (excluye 0; es el mínimo que registra el INPRES; el número del panel usa 2,5 o más), profundidad de hasta 30 km (excluye 10) y área de estudio (excluye 6). La profundidad es un criterio de análisis: los sismos asociados a la actividad petrolera son superficiales; la sismicidad profunda de la región se asocia a la subducción. El área es la envolvente de los 3.363 pozos VM más 20 km, definida geográficamente antes de mirar los sismos y sin depender de la distancia de cada sismo a un pozo. Quedan 420 sismos en el mapa, 414 de magnitud 2,5 o más. Los filtros son criterios analíticos, no pruebas del origen de cada evento.",
          "Sismos, Zenodo y USGS (solo contexto; no se dibujan ni se suman): el catálogo de Schultz et al. (2024) se usa como control —con magnitud 2,5 o más, los conteos anuales del INPRES y de Zenodo de 2021 a marzo de 2024 difieren en 4 sismos o menos por año— y para el contexto anterior a 2019. Del USGS Earthquake Hazards Program (ComCat, dominio público) se descargó a mano el 8/10/2026 la consulta de magnitud 4 o más desde 2000 en el mismo cuadrante (16 eventos; con los filtros de profundidad y área quedan 9), usada solo como contexto en el (i) de sismos.",
          "«Extraído» y horizonte (encabezado). Cada porcentaje divide dos cantidades del mismo alcance. Reservas comprobadas: petróleo no convencional de la cuenca Neuquina extraído desde 2006 hasta el año del dial ÷ (lo extraído hasta el 31/12/2025, 119,2 millones de m³, + reservas comprobadas al 31/12/2025, 414,5 millones de m³). IAPG: petróleo de los pozos de Vaca Muerta extraído desde 2006 hasta el año del dial ÷ total del IAPG (558 millones de barriles extraídos + 30.170 remanentes al 31/12/2024 = 30.728 millones). Horizonte del año del dial: H(t) = R(t) ÷ P(t). Reservas (m³): R(t) = total de referencia − lo extraído hasta t (en 2025, las reservas: 414,5 ÷ 29,3 ≈ 14 años). IAPG (millones de barriles): R(t) = 30.728 − [558 + producción de Capítulo IV entre fines de 2024 y t] (en 2024, 30.170; en 2025, 29.987, aproximación propia: 29.987 ÷ 183 ≈ 164 años, ≈ 98 a 245 con la estimación baja y la alta del IAPG). En 2026, incompleto, R descuenta lo extraído hasta agosto y P es la producción de 2025. Por encima de 1.000 años la interfaz lo abrevia; el valor exacto está en el (i). Los años restantes se calculan dividiendo el volumen de referencia que se estima pendiente por la producción anual del año seleccionado. El resultado indica cuántos años cubriría ese volumen si la producción se mantuviera constante a ese ritmo. No es un pronóstico de producción ni una fecha de agotamiento. Las reservas y los recursos pueden cambiar con nuevas exploraciones, revisiones, tecnología y condiciones económicas. La EIA (2013) ya no es una tarjeta; su cifra, 16.220 millones de barriles (el informe original dice 16,2 mil millones, citado también por Schultz et al. (2024); se usa la cifra del comunicado oficial), figura como dato histórico en el (i) del IAPG y no se compara en forma directa.",
          "Tarjetas de la intro: las cuatro están a agosto de 2026. Lo extraído: petróleo acumulado desde 2006 (873 millones de barriles). Récord de producción: mes con mayor producción diaria de petróleo de Vaca Muerta (producción mensual ÷ días del mes × 6,2898 barriles por m³): agosto de 2026, unos 670 mil barriles por día. Agua: suma del agua de fractura desde 2010 (156,5 millones de m³; pileta olímpica = 2.500 m³). Lo que queda: el complemento (100 % menos) de los porcentajes de «ya extraído» de las dos estimaciones del encabezado con el dial en 2026 (26,9 % y 2,8 %): 73 % y 97 %.",
          "Texto de la intro: «más de la mitad del petróleo y del gas del país» se apoya en la producción de Vaca Muerta de 2025 (pozos de la formación) ÷ la producción nacional de 2025 (series históricas de petróleo y gas, columna total, Capítulo IV): 62,4 % del petróleo y 53,4 % del gas (referencia del IAE: 62 % y 53 %). Solo estos dos porcentajes usan 2025, y no se muestran como cifras en la página. El 73 % de las inversiones del upstream es una referencia citada del IAE que figura en los datos como control (no es un cálculo propio) y no se muestra en la página.",
          "Profundidad (solo se ve en el tooltip de cada pozo): solo valores entre 1.000 y 8.000 m; si falta o es inválida se usa la mediana de los pozos VM y se la marca como estimada.",
          "Al filtrar por operador o tipo de pozo, el mapa, las columnas y los números de petróleo, gas, valor y agua se recalculan a partir de los pozos mostrados; los sismos y las dos estimaciones del encabezado no cambian.",
        ],
      },
      {
        titulo: "Limitaciones",
        parrafos: [
          "Las reservas no se publican por formación: por eso la tarjeta de reservas usa todo el no convencional de la cuenca Neuquina (99,3 % Vaca Muerta en 2025). Los dos totales de referencia son fijos (reservas al 31/12/2025; IAPG al 31/12/2024) y no reconstruyen lo que se sabía en cada año. Lo que suman los pozos de Vaca Muerta en Capítulo IV es un 3,5 % menor que lo extraído según el IAPG. La EIA es una estimación de 2013, con otro método.",
          "2026 es parcial (hasta agosto): sus porcentajes de «ya extraído» incluyen solo esos meses y sus horizontes usan la producción de 2025 (no se anualiza 2026). El agua producida se asume en m³ (la fuente no especifica la unidad, como en el resto de los volúmenes del Capítulo IV) y no puede separarse del agua de fractura que regresa. El agua de fractura cubre 3.014 de 3.417 pozos VM y se asigna al año de inicio de la fractura.",
          "El valor del petróleo no es una ganancia ni un ingreso; la producción probablemente incluye condensado, valuado igual que el crudo; los precios son nominales y algunos tienen particularidades de la fuente.",
          "El valor del gas es una estimación: usa el precio de referencia de regalías de Neuquén, no el de cada contrato (hogares, industria, exportación); el gas producido no es necesariamente el vendido; el Excel de regalías convierte con el dólar BNA del día hábil anterior a cada liquidación, que en 2024-2026 es entre 1,5 % y 2 % más alto que el promedio mensual usado acá.",
          "Sismos: (1) la cantidad registrada depende de la red de detección (antes de 2019 había pocos sismógrafos en la zona, por eso la serie comienza en 2019); (2) los filtros son criterios analíticos, no pruebas del origen de cada evento; (3) la coincidencia en el tiempo y el espacio con la actividad petrolera no demuestra causalidad. 2026 es parcial (datos hasta el 31/8/2026). Se cuentan los sismos del área de estudio (pozos VM + 20 km), no toda la cuenca. Según Schultz et al. (2024), alrededor del 42 % de los sismos de su catálogo se asocian estadísticamente con operaciones de fractura.",
          "Columnas del mapa: dependen del tamaño y la posición de la grilla; la altura no es profundidad y no se compara entre vistas. El tiempo dentro de un año es una aproximación (reparto parejo). El agua que entra cubre el 88 % de los pozos VM; la unidad del agua que vuelve se asume en m³.",
        ],
      },
      {
        titulo: "Glosario",
        glosario: true,
      },
      {
        titulo: "Atribución del catálogo de Zenodo (control y contexto)",
        atribucion: true,
        parrafos: ["Dataset: " + ATRIBUCION_SISMOS],
      },
      {
        titulo: "Uso de inteligencia artificial",
        espacioIA: true,
        parrafos: [
          "<b>Herramientas:</b> Claude (Anthropic), usado a través de Claude Code y Claude Cowork, entre el 6 y el 15 de octubre de 2026.",
          "<b>Etapas y finalidad:</b> auditoría y exploración de los archivos descargados (estructura, calidad, valores faltantes o dudosos); procesamiento de datos, escribiendo en Python los scripts que aplican las decisiones metodológicas de la autora; asistencia en la generación del código de la página (mapa, dial, paneles); búsqueda y verificación de fuentes; y redacción de la documentación metodológica y de parte de los textos explicativos, revisados por la autora.",
          "<b>Lo que no hizo la IA:</b> no generó imágenes ni gráficos con IA generativa, ni creó la visualización de forma automática. La pregunta, la idea, la estructura de la visualización, la elección de las fuentes y todas las decisiones metodológicas (qué se considera Vaca Muerta, cómo se tratan los datos faltantes o dudosos, qué denominadores se usan, qué sismos se incluyen) son de la autora, que supervisó y verificó cada resultado. La autora es la única responsable del contenido.",
          "Cada uso está documentado, con lo que hizo y lo que no hizo la herramienta, en el registro de uso de IA: " +
            (URL_REPO ? "<a href='" + URL_REPO + "' target='_blank' rel='noopener noreferrer'>docs/registro_ia.md</a>" : "docs/registro_ia.md") + " del repositorio.",
        ],
      },
    ],
  },
};
