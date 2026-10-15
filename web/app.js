/*
 * Visualización Vaca Muerta: una sola pantalla (explorador) con una capa de intro.
 * Mapa con hexágonos 3D (deck.gl, sin mapa base) + dial de años 2010–2026.
 * Los textos visibles están en textos.js; los datos, en datos/*.js.
 *
 * Para pruebas: ?intro=0 (sin la capa de intro)  ?anio=2015  ?mapa=pozos|petroleo|gas|agua_entra|agua_vuelve  ?vista=arriba  ?hex=2600 (radio, m)
 */
(function () {
  "use strict";

  const T = window.TEXTOS;
  const D = { pozos: window.DATOS_POZOS, serie: window.DATOS_SERIE, cuenca: window.DATOS_CUENCA, area: window.DATOS_AREA, hitos: window.DATOS_HITOS, sismos: window.DATOS_SISMOS, contexto: window.DATOS_CONTEXTO };
  const QS = new URLSearchParams(location.search);

  /* ============================================================ parámetros de diseño */
  const CFG = {
    anioInicial: 2010,
    nParadas: 17,                  // 2010..2025 + 2026 (parcial)
    mesFinParcial: 8,              // 2026 llega hasta agosto
    mesesPorSegundo: 8,            // velocidad de ▶ (1,5 s por año)
    mesesDeAparicion: 2,           // un pozo "aparece" creciendo durante 2 meses
    bblPorM3: 6.2898,
    hexRadioM: Number(QS.get("hex")) || 2600,   // radio (centro–vértice) de cada hexágono, en metros
    alturaMaxM: 30000,             // altura del hexágono más alto al final de la serie (m); escala lineal y fija
    pitch3d: 52, bearing3d: -14, maxPitch: 75,
    transicionCamaraMs: 1400,
    transicionInclinarMs: 2600,
    radioPozoPx: 1.7,
    colorPetroleo: [237, 164, 58],
    colorGas: [242, 212, 107],          // gas: el color de su bloque en el panel (y de sus columnas)
    colorPozoGas: [232, 236, 242],      // punto de un pozo gasífero
    colorPozoOtro: [138, 146, 156],     // punto de un pozo de otro tipo
    colorAgua: [95, 183, 234],          // agua que entra
    colorAguaVuelve: [63, 134, 191],
    colorSismo: [186, 148, 246],
    piletaM3: 2500,
    mesesDestelloSismo: 1.5,
  };
  const NP = CFG.nParadas;
  const ULT = NP - 1;
  const BBL = CFG.bblPorM3;

  /* ============================================================ utilidades */
  const $ = (id) => document.getElementById(id);
  const nf = new Intl.NumberFormat("es-AR");
  const nf1 = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });
  const nfd = (d) => new Intl.NumberFormat("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const sinTags = (s) => String(s).replace(/<[^>]+>/g, "");
  const v0 = (arr, i) => (arr ? arr[i] || 0 : 0);

  /** Número grande de los paneles: menos decimales cuanto más grande. */
  function fmt(v, div, entero) {
    const s = Math.abs(v) / div;
    if (s === 0) return "0";
    if (entero && s >= 100) return nf.format(Math.round(v / div));   // gas en millones de m³: sin decimales desde 100
    return nfd(s < 0.1 ? 3 : s < 1 ? 2 : 1).format(v / div);
  }

  function aplicarTextos() {
    document.title = T.tituloPagina;
    document.querySelectorAll("[data-t]").forEach((el) => {
      const v = el.dataset.t.split(".").reduce((o, k) => (o ? o[k] : undefined), T);
      if (typeof v === "string") el.textContent = v;
    });
  }

  const hayDeck = typeof window.deck !== "undefined";

  /* ============================================================ datos */
  const meta = D.pozos.meta;
  const empresas = meta.empresas;
  const tipos = meta.tipos;

  const pozos = D.pozos.pozos.map((p) => {
    const nombreTipo = p.tipo == null ? "" : tipos[p.tipo];
    const pet = p.pet, gas = p.gas;
    // acumulado a inicio de cada año (incluye lo producido antes de 2010, desde 2006)
    const cumPet = new Float64Array(NP + 1), cumGas = new Float64Array(NP + 1), cumAf = new Float64Array(NP + 1), cumAp = new Float64Array(NP + 1);
    cumAp[0] = p.aguap_pre || 0;
    const sp = pet.reduce((a, b) => a + b, 0), sg = gas.reduce((a, b) => a + b, 0);
    cumPet[0] = Math.max(0, p.pet_ac - sp);
    cumGas[0] = Math.max(0, p.gas_ac - sg);
    for (let i = 0; i < NP; i++) {
      cumPet[i + 1] = cumPet[i] + pet[i];
      cumGas[i + 1] = cumGas[i] + gas[i];
      cumAf[i + 1] = cumAf[i] + v0(p.aguaf, i);
      cumAp[i + 1] = cumAp[i] + v0(p.aguap, i);
    }
    return {
      id: p.id, sigla: p.sigla, lon: p.lon, lat: p.lat, prof: p.prof, profEst: !!p.prof_est,
      emp: p.emp, tipo: p.tipo, esPet: norm(nombreTipo).startsWith("petrol"),
      // tipo del último mes con producción: petrolífero, gasífero u otros (incluye «Otro tipo»)
      tipoCat: norm(nombreTipo).startsWith("petrol") ? "pet" : norm(nombreTipo).startsWith("gasif") ? "gas" : "otro",
      anio: p.anio, mes: p.mes,
      // meses desde enero de 2010 (los pozos anteriores a 2010 ya están presentes al comenzar)
      inicio: p.anio < CFG.anioInicial ? -1000 : (p.anio - CFG.anioInicial) * 12 + (p.mes - 1),
      pet, gas, cumPet, cumGas, cumAf, cumAp, usd: p.usd, usdPre: p.usd_pre || 0, usdg: p.usdg, usdgPre: p.usdg_pre || 0, aguaf: p.aguaf, arena: p.arena, aguap: p.aguap, aguapPre: p.aguap_pre || 0,
    };
  });

  /* Sismos: instante en meses desde enero de 2010 (mismo eje que los pozos) */
  const sismos = D.sismos.eventos.map((e) => {
    const [y, mo, d] = e.f.slice(0, 10).split("-").map(Number);
    const hora = Number(e.f.slice(11, 13)) / 24;
    return { ...e, anio: y, mes: mo, dia: d, inicio: (y - CFG.anioInicial) * 12 + (mo - 1) + (d - 1 + hora) / 30 };
  });
  const COB = D.sismos.meta;
  const sis0 = COB.anio_inicio, sisN = COB.anio_parcial;

  /** Acumulado (m³ de petróleo o miles de m³ de gas) hasta el instante t (meses desde ene-2010), repartiendo
   *  la producción de cada año de forma pareja desde la aparición del pozo (o desde el 1.º de enero si `deAnio`). */
  function acumulado(p, t, cum, anual, deAnio) {
    const y = Math.min(Math.floor(t / 12), ULT);
    let c = cum[y];
    const v = anual ? anual[y] : 0;
    if (v) {
      const y0 = y * 12, fin = y0 + (y === ULT ? CFG.mesFinParcial : 12);
      const a = deAnio ? y0 : Math.max(p.inicio, y0);
      c += v * clamp((t - a) / Math.max(1, fin - a), 0, 1);
    }
    return c;
  }
  const petAc = (p, t) => acumulado(p, t, p.cumPet, p.pet);
  const gasAc = (p, t) => acumulado(p, t, p.cumGas, p.gas);
  const aguaAc = (p, t) => acumulado(p, t, p.cumAf, p.aguaf, true);
  const aguaVAc = (p, t) => acumulado(p, t, p.cumAp, p.aguap);
  /** Las cuatro variables de las vistas con columnas, cada una en su unidad: petróleo en barriles, gas y aguas en m³. */
  const VARS = ["petroleo", "gas", "agua_entra", "agua_vuelve"];
  const VALOR = {
    petroleo: (p, t) => petAc(p, t) * BBL,
    gas: (p, t) => gasAc(p, t) * 1000,          // el CSV da miles de m³
    agua_entra: aguaAc,
    agua_vuelve: aguaVAc,
  };
  const COLOR_VARS = { petroleo: CFG.colorPetroleo, gas: CFG.colorGas, agua_entra: CFG.colorAgua, agua_vuelve: CFG.colorAguaVuelve };
  const rgb = (c, a) => (a == null ? `rgb(${c.join(",")})` : `rgba(${c.join(",")},${a})`);

  /* ============================================================ hexágonos (grilla fija, plana) */
  const LAT0 = -38.4, LON0 = -69.0;
  const MX = 111320 * Math.cos((LAT0 * Math.PI) / 180), MY = 110574;
  const hexes = [];
  (function () {
    const R = CFG.hexRadioM, mapa = new Map(), s3 = Math.sqrt(3);
    const redondear = (qf, rf) => {
      const xf = qf, zf = rf, yf = -xf - zf;
      let x = Math.round(xf), y = Math.round(yf), z = Math.round(zf);
      const dx = Math.abs(x - xf), dy = Math.abs(y - yf), dz = Math.abs(z - zf);
      if (dx > dy && dx > dz) x = -y - z; else if (dy > dz) y = -x - z; else z = -x - y;
      return [x, z];
    };
    for (const p of pozos) {
      const x = (p.lon - LON0) * MX, y = (p.lat - LAT0) * MY;
      const [q, r] = redondear(((2 / 3) * x) / R, ((-1 / 3) * x + (s3 / 3) * y) / R);
      const k = q + "," + r;
      let h = mapa.get(k);
      if (!h) {
        const cx = R * 1.5 * q, cy = R * s3 * (r + q / 2);
        h = { i: hexes.length, lon: cx / MX + LON0, lat: cy / MY + LAT0, n: 0, val: { petroleo: 0, gas: 0, agua_entra: 0, agua_vuelve: 0 }, tipos: { pet: 0, gas: 0, otro: 0 }, pozos: [] };
        mapa.set(k, h); hexes.push(h);
      }
      h.pozos.push(p); p.hex = h.i;
    }
  })();

  /* ============================================================ estado */
  const S = {
    t: 0,
    sonando: false,
    modoMes: false,        // true: durante ▶ o tras pausar en medio de un año
    anio: ULT - 1,         // el explorador arranca en 2025
    vista: "pozos",        // pozos | petroleo | gas | agua_entra | agua_vuelve
    vistaCol: null,        // variable cuyas columnas se dibujan (null: ninguna); va un poco detrás de `vista` por la transición
    alt: 1,                // 0..1: altura de las columnas durante la transición entre vistas
    preferArriba: false,   // si la persona eligió mirar desde arriba en una vista con columnas
    sismos: false,         // capa de sismos activable (botón «Sismos» o bloque del panel); por defecto apagada
    arriba: true,          // la cámara mira desde arriba (inclinación < 5°): las columnas se colorean según su valor
    filtros: { emp: null, tipo: null },
  };
  const tFinDeParada = (i) => i * 12 + (i === ULT ? CFG.mesFinParcial : 12) - 0.001;
  S.t = tFinDeParada(ULT - 1);

  const pasaFiltros = (p) =>
    (S.filtros.emp == null || p.emp === S.filtros.emp) && (S.filtros.tipo == null || p.tipo === S.filtros.tipo);

  /** Instante que se dibuja: el del dial, o el final de la serie cuando se muestran todos los sismos. */
  const tVista = () => S.t;

  /** Actualiza, para cada hexágono, la cantidad de pozos por tipo y el valor acumulado de las cuatro variables al instante t. */
  function agregarHexagonos(t) {
    for (const h of hexes) { h.n = 0; h.tipos.pet = 0; h.tipos.gas = 0; h.tipos.otro = 0; for (const k of VARS) h.val[k] = 0; }
    for (const p of pozos) {
      if (p.inicio > t || !pasaFiltros(p)) continue;
      const h = hexes[p.hex];
      h.n++; h.tipos[p.tipoCat]++;
      for (const k of VARS) h.val[k] += VALOR[k](p, t);
    }
  }
  // escala fija y lineal, propia de cada variable: el valor máximo de un hexágono al final de la serie, sin filtros
  const MAX_HEX = (function () {
    const tf = tFinDeParada(ULT), r = {};
    for (const k of VARS) {
      const sum = new Float64Array(hexes.length);
      for (const p of pozos) sum[p.hex] += VALOR[k](p, tf);
      r[k] = Math.max(...sum, 1);
    }
    return r;
  })();
  /** Valor «redondo» (1, 2 o 5 × 10^n) para la altura de referencia: el mayor que no pasa del 60 % del máximo. */
  function valorRedondo(max) {
    const tope = max * 0.6, e = Math.pow(10, Math.floor(Math.log10(tope)));
    return [5, 2, 1].map((m) => m * e).find((v) => v <= tope) || e;
  }
  /** Cantidad con su unidad: «12,3 millones de barriles», «1,2 mil millones de m³». */
  function fmtCantidad(k, v) {
    const X = T.mapa.cantidades, u = T.mapa.variables[k].unidad;
    const f = (x) => new Intl.NumberFormat("es-AR", { maximumFractionDigits: x >= 100 ? 0 : x >= 10 ? 1 : 2 }).format(x);
    if (v >= 1e9) return v === 1e9 ? X.unMilMillones.replace("{u}", u) : X.milMillones.replace("{v}", f(v / 1e9)).replace("{u}", u);
    if (v >= 1e6) return v === 1e6 ? X.unMillon.replace("{u}", u) : X.millones.replace("{v}", f(v / 1e6)).replace("{u}", u);
    return X.unidades.replace("{v}", nf.format(Math.round(v))).replace("{u}", u);
  }

  /* ============================================================ mapa 3D (deck.gl) */
  const contMapa = $("mapa");
  let viewState = null, deckgl = null, zoomBase = 8, inclinado = false;
  /* Encuadre del mapa: toda el área de estudio (area_estudio.geojson) a la inclinación pedida. Se reduce el zoom hasta que
     todos sus vértices, proyectados con esa inclinación, entran en el contenedor. El zoom mínimo muestra toda la cuenca. */
  const PIT_INICIAL = 45, MARGEN_ENC = 24, ZOOM_MAX = 20;
  let vistaArea = null;   // { longitude, latitude, zoom } por inclinación
  const vertices = (geo) => {
    const out = [];
    const rec = (c) => { if (typeof c[0] === "number") out.push(c); else c.forEach(rec); };
    (geo.features || [geo]).forEach((f) => rec((f.geometry || f).coordinates));
    return out;
  };
  const cajaDe = (v) => ({ w: Math.min(...v.map((c) => c[0])), e: Math.max(...v.map((c) => c[0])), s: Math.min(...v.map((c) => c[1])), n: Math.max(...v.map((c) => c[1])) });
  function encuadreArea(cont, pitch) {
    const w = cont.clientWidth || 800, h = cont.clientHeight || 500;
    const v = vertices(D.area), b = cajaDe(v);
    const fit = new deck.WebMercatorViewport({ width: w, height: h }).fitBounds([[b.w, b.s], [b.e, b.n]], { padding: MARGEN_ENC });
    const base = { longitude: fit.longitude, latitude: fit.latitude, pitch, bearing: 0 };
    let zoom = fit.zoom;
    const entra = (z) => {
      const vp = new deck.WebMercatorViewport({ width: w, height: h, ...base, zoom: z });
      return v.every((c) => { const [x, y] = vp.project(c); return x >= MARGEN_ENC / 2 && x <= w - MARGEN_ENC / 2 && y >= MARGEN_ENC / 2 && y <= h - MARGEN_ENC / 2; });
    };
    for (let i = 0; i < 60 && !entra(zoom); i++) zoom -= 0.05;
    return { ...base, zoom };
  }
  function zoomCuenca(cont) {
    const w = cont.clientWidth || 800, h = cont.clientHeight || 500, b = cajaDe(vertices(D.cuenca));
    return new deck.WebMercatorViewport({ width: w, height: h }).fitBounds([[b.w, b.s], [b.e, b.n]], { padding: MARGEN_ENC }).zoom;
  }
  const camara3d = () => encuadreArea(contMapa, PIT_INICIAL);
  const camara2d = () => encuadreArea(contMapa, 0);
  const camaraInicial = () => (S.preferArriba ? camara2d() : camara3d());

  function encuadre(cont, padding, extra) {
    const lons = pozos.map((p) => p.lon).sort((a, b) => a - b), lats = pozos.map((p) => p.lat).sort((a, b) => a - b);
    const q = (a, f) => a[Math.floor((a.length - 1) * f)];
    const w = cont.clientWidth || 800, h = cont.clientHeight || 500;
    const vp = new deck.WebMercatorViewport({ width: w, height: h });
    const fit = vp.fitBounds([[q(lons, 0.03), q(lats, 0.03)], [q(lons, 0.97), q(lats, 0.97)]], { padding });
    return { longitude: fit.longitude, latitude: fit.latitude, zoom: fit.zoom - 0.1, pitch: 0, bearing: 0, ...(extra || {}) };
  }

  const radioSismo = (m) => 2.6 * Math.pow(1.45, m - 2);
  const ESTILO_TT = { background: "rgba(24,29,36,0.97)", color: "#e9ecf0", border: "1px solid rgba(190,205,225,0.22)", borderRadius: "8px", padding: "9px 12px", fontSize: "12px", lineHeight: "1.55", fontFamily: "Geist, 'Segoe UI', system-ui, sans-serif", boxShadow: "0 14px 30px -10px rgba(0,0,0,0.7)", zIndex: 20 };
  const nfMag = nfd(1);
  const fila = (k, v) => `<div><span style="color:#8a929c">${k}</span> ${v}</div>`;

  function fechaLarga(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return `${d} de ${T.meses[m - 1]} de ${y}`;
  }

  function tooltipSismo(s) {
    const tt = T.mapa.tooltipSismo;
    const prof = s.p > 0 ? nf1.format(s.p) + " km" : "0 km <span style=\"color:#8a929c\">" + tt.sinDato + "</span>";
    const html = `<div style="font-size:13px;font-weight:600;margin-bottom:3px;color:#ba94f6">${tt.titulo}</div>` +
      fila(tt.fecha, `${s.dia} de ${T.meses[s.mes - 1]} de ${s.anio}`) + fila(tt.magnitud, nfMag.format(s.m)) + fila(tt.profundidad, prof) + fila(tt.fuente, tt.fuenteInpres);
    return { html, style: ESTILO_TT };
  }
  function textoTipos(o) {
    const Tp = T.mapa.tipos;
    return ["pet", "gas", "otro"].map((c) => `<span style="color:${c === "pet" ? "#eda43a" : c === "gas" ? "#e8ecf2" : "#8a929c"}">●</span> ${nf.format(o.tipos[c])} ${Tp[c]}`).join(" · ");
  }
  function tooltipMapa(info) {
    const o = info && info.object;
    if (!o) return null;
    const X = T.mapa.tooltipHex, tt = T.mapa.tooltip, V = T.mapa.variables;
    if (info.layer.id === "sismos") return tooltipSismo(o);
    if (info.layer.id === "hex") {
      const k = S.vistaCol || S.vista, otras = VARS.filter((x) => x !== k);
      return { html: `<div style="font-size:13px;font-weight:600;margin-bottom:3px;color:${rgb(COLOR_VARS[k])}">${V[k].nombre}: ${fmtCantidad(k, o.val[k])}</div>` +
        `<div style="font-size:11px;color:#8a929c;line-height:1.5">${otras.map((x) => `${V[x].corto}: ${fmtCantidad(x, o.val[x])}`).join("<br>")}</div>` +
        `<div style="margin-top:4px;font-size:11.5px"><b>${o.n === 1 ? X.pozosUno : X.pozosN.replace("{n}", nf.format(o.n))}</b>: ${textoTipos(o)}</div>`, style: ESTILO_TT };
    }
    return null;   // la ficha del pozo no sale al pasar el cursor: solo al hacer click (mostrarFichaPozo)
  }
  let fichaPozo = null;
  function ocultarFichaPozo() { if (fichaPozo) fichaPozo.style.display = "none"; }
  function mostrarFichaPozo(info) {
    const o = info && info.object;
    if (!o || !info.layer || info.layer.id !== "pozos-punto") return ocultarFichaPozo();
    const t = tooltipPozo(o);
    if (!fichaPozo) {
      fichaPozo = document.createElement("div");
      Object.assign(fichaPozo.style, { position: "absolute", pointerEvents: "none", maxWidth: "min(280px, calc(100% - 24px))", boxSizing: "border-box", overflowWrap: "anywhere" }, t.style);
      contMapa.appendChild(fichaPozo);
    }
    fichaPozo.innerHTML = t.html;
    fichaPozo.style.display = "block";
    const w = fichaPozo.offsetWidth, h = fichaPozo.offsetHeight, W = contMapa.clientWidth, H = contMapa.clientHeight;
    fichaPozo.style.left = Math.max(4, Math.min(info.x + 12, W - w - 4)) + "px";
    fichaPozo.style.top = Math.max(4, Math.min(info.y + 12, H - h - 4)) + "px";
  }
  function tooltipPozo(o) {
    const tt = T.mapa.tooltip;
    let html = `<div style="font-size:13px;font-weight:600;margin-bottom:3px">${o.sigla}</div>` +
      fila(tt.empresa, empresas[o.emp] || "—") + fila(tt.inicio, o.anio) +
      fila(tt.profundidad, nf.format(o.prof) + " m" + (o.profEst ? " " + tt.profundidadEstimada : "")) +
      fila(tt.petroleoAcum, nf.format(Math.round(petAc(o, tVista()) * BBL)) + " " + tt.barriles);
    if (!o.esPet) html += fila(tt.gasAcum, nf1.format(acumulado(o, tVista(), o.cumGas, o.gas) / 1000) + " " + tt.millonesM3);
    return { html, style: ESTILO_TT };
  }

  // mapa base: Esri «World Dark Gray Base» (sin etiquetas), muy atenuado para no competir con los datos
  const OPACIDAD_BASE = 0.3;
  // constantes fuera de la función: si cambiaran en cada redibujo, deck.gl volvería a pedir las teselas
  const URL_TESELAS = "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
  const subcapaTesela = (props) => {
    const { west, south, east, north } = props.tile.bbox;
    return new deck.BitmapLayer(props, { data: null, image: props.data, bounds: [west, south, east, north], opacity: OPACIDAD_BASE, parameters: { depthWriteEnabled: false } });
  };
  const sinError = () => {};
  function capaTeselas() {
    if (!deck.TileLayer) return null;
    return new deck.TileLayer({ id: "mapa-base", data: URL_TESELAS, minZoom: 0, maxZoom: 16, tileSize: 256, refinementStrategy: "best-available", maxCacheSize: 200, onTileError: sinError, renderSubLayers: subcapaTesela });
  }

  function capasBase() {
    return [
      capaTeselas(),
      new deck.GeoJsonLayer({
        id: "cuenca", data: D.cuenca, filled: true, stroked: true,
        getFillColor: [255, 255, 255, 16], getLineColor: [150, 155, 165, 120], lineWidthMinPixels: 1,
        parameters: { depthWriteEnabled: false },
      }),
      // área de estudio de los sismos: contorno muy sutil, sin relleno
      new deck.GeoJsonLayer({
        id: "area-estudio", data: D.area, filled: false, stroked: true,
        getLineColor: [...CFG.colorSismo, 30], lineWidthMinPixels: 1, getLineWidth: 1,
        parameters: { depthWriteEnabled: false },
      }),
    ];
  }

  // posición de la barra de referencia de altura: al este de la zona de pozos, en un sector sin columnas
  const REF_POS = (function () {
    const lons = pozos.map((p) => p.lon).sort((a, b) => a - b), lats = pozos.map((p) => p.lat).sort((a, b) => a - b);
    return [lons[Math.floor((lons.length - 1) * 0.97)] + 0.16, lats[Math.floor((lats.length - 1) * 0.5)]];
  })();
  const colorPozo = (p) => (p.tipoCat === "pet" ? CFG.colorPetroleo : p.tipoCat === "gas" ? CFG.colorPozoGas : CFG.colorPozoOtro);

  /** «● N petrolíferos · ● N gasíferos · ● N otros, que ya habían empezado a producir hasta {mes} de {año}» */
  function pintarEtiquetaPozos(t, cuenta) {
    const Tp = T.mapa.tipos, a = Math.min(Math.floor(t / 12), ULT), mes = T.meses[clamp(Math.floor(t - a * 12), 0, 11)];
    // «hasta agosto de 2026» solo en el año con datos parciales; en los demás, «hasta {año}»
    const textoHasta = (a === ULT ? T.mapa.etiquetaPozos : T.mapa.etiquetaPozosAnio).replace("{mes}", mes).replace("{año}", CFG.anioInicial + a);
    // cada cifra cuenta pozos; las tres categorías son excluyentes (tipo del último mes con producción)
    const TL = T.mapa.tiposLeyenda;
    const dato = (c, cls) => `<span class="et-tipo"><span class="ley-punto ${cls}"></span>${TL[c]}: <b>${nf.format(cuenta[c])}</b></span>`;
    $("etiqueta-pozos").innerHTML = [dato("pet", "ley-pet"), dato("gas", "ley-gas"), dato("otro", "ley-otro")].join('<span class="et-sep">·</span>') +
      (textoHasta ? `<span class="et-resto">, ${textoHasta}</span>` : "");
  }

  function construirCapas() {
    const t = tVista(), frame = Math.round(t * 1000), tS = t, verSismos = S.sismos;
    agregarHexagonos(t);
    const vis = [], cuenta = { pet: 0, gas: 0, otro: 0 };
    for (const p of pozos) if (p.inicio <= t && pasaFiltros(p)) { vis.push(p); cuenta[p.tipoCat]++; }
    pintarEtiquetaPozos(t, cuenta);
    const crecimiento = (p) => { const e = clamp((t - p.inicio) / CFG.mesesDeAparicion, 0, 1); return 1 - (1 - e) * (1 - e); };
    const col = S.vistaCol, enPlano = S.vista === "pozos" && !col;
    const capas = [...capasBase()];

    if (col) {
      const activos = hexes.filter((h) => h.n > 0), color = COLOR_VARS[col], max = MAX_HEX[col];
      const escala = (CFG.alturaMaxM / max) * S.alt, arriba = S.arriba;
      const ref = valorRedondo(max);
      capas.push(new deck.ColumnLayer({
        id: "hex", data: activos, pickable: true, extruded: true, diskResolution: 6, radius: CFG.hexRadioM, coverage: 0.9, angle: 0, offset: [0, 0],
        getPosition: (h) => [h.lon, h.lat], getElevation: (h) => h.val[col] * escala,
        // desde arriba el color informa la cantidad (raíz cuadrada, para distinguir hexágonos chicos); inclinado, un solo color
        getFillColor: (h) => {
          if (!arriba) return [...color, 215];
          const f = Math.sqrt(clamp(h.val[col] / max, 0, 1)), m = 0.22 + 0.78 * f;
          return [Math.round(color[0] * m), Math.round(color[1] * m), Math.round(color[2] * m), 235];
        },
        material: { ambient: 0.6, diffuse: 0.55, shininess: 18, specularColor: [90, 90, 90] },
        updateTriggers: { getElevation: [frame, col, S.alt, S.filtros.emp, S.filtros.tipo], getFillColor: [frame, col, arriba, S.filtros.emp, S.filtros.tipo] },
      }));
      if (!arriba) {
        // barra de referencia: «esta altura = X»
        capas.push(new deck.ColumnLayer({
          id: "ref-altura", data: [{ p: REF_POS }], pickable: false, extruded: true, diskResolution: 6, radius: 650, angle: 0,
          getPosition: (d) => d.p, getElevation: ref * escala, getFillColor: [...color, 255],
          material: { ambient: 0.7, diffuse: 0.5, shininess: 10 }, updateTriggers: { getElevation: [S.alt, col] },
        }));
        capas.push(new deck.TextLayer({
          id: "ref-texto", data: [{ p: REF_POS, texto: T.mapa.leyenda.referencia.replace("{v}", fmtCantidad(col, ref)) }], pickable: false,
          getPosition: (d) => [d.p[0], d.p[1], ref * escala], getText: (d) => d.texto, getSize: 12, getColor: [236, 239, 243, 255],
          getTextAnchor: contMapa.clientWidth < 640 ? "end" : "start", getAlignmentBaseline: "bottom", getPixelOffset: [contMapa.clientWidth < 640 ? 8 : -8, -8], characterSet: "auto", fontFamily: "Segoe UI, system-ui, sans-serif", fontWeight: 600,
          wordBreak: "break-word", maxWidth: 10, billboard: true, fontSettings: { sdf: true }, outlineWidth: 1.5, outlineColor: [10, 11, 13, 255],
          updateTriggers: { getPosition: [S.alt, col], getText: col }, parameters: { depthCompare: "always" },
        }));
      }
    }

    // sismos (INPRES, registro comparable desde 2019): anillos huecos; al llegar su fecha destellan y quedan tenues
    capas.push(
      new deck.ScatterplotLayer({
        id: "sismos", data: verSismos ? sismos.filter((s) => s.inicio <= tS) : [], pickable: verSismos, billboard: true, filled: false, stroked: true,
        getPosition: (s) => [s.lon, s.lat, 0], radiusUnits: "pixels", lineWidthUnits: "pixels",
        getRadius: (s) => radioSismo(s.m),
        getLineColor: (s) => [...CFG.colorSismo, 235 - 82 * (1 - Math.pow(1 - clamp((tS - s.inicio) / (CFG.mesesDestelloSismo * 2), 0, 1), 2))],
        getLineWidth: (s) => 1 + 0.9 * (1 - clamp((tS - s.inicio) / CFG.mesesDestelloSismo, 0, 1)),
        updateTriggers: { getLineColor: frame, getLineWidth: frame },
        parameters: { depthCompare: "always" },
      }),
      new deck.ScatterplotLayer({
        id: "sismos-destello", data: verSismos ? sismos.filter((s) => s.inicio <= tS && tS - s.inicio < CFG.mesesDestelloSismo) : [],
        filled: false, stroked: true, pickable: false, billboard: true, getPosition: (s) => [s.lon, s.lat, 0],
        radiusUnits: "pixels", lineWidthUnits: "pixels", getLineWidth: 1.4,
        getRadius: (s) => radioSismo(s.m) * (1 + 2.2 * clamp((tS - s.inicio) / CFG.mesesDestelloSismo, 0, 1)),
        getLineColor: (s) => [...CFG.colorSismo, 230 * (1 - clamp((tS - s.inicio) / CFG.mesesDestelloSismo, 0, 1))],
        updateTriggers: { getRadius: frame, getLineColor: frame },
        parameters: { depthCompare: "always" },
      }),
      // pozos: puntos en el plano; aparecen mes a mes. Color según el tipo (petrolífero, gasífero, otros)
      new deck.ScatterplotLayer({
        id: "pozos-punto", data: vis, pickable: true, billboard: true, getPosition: (p) => [p.lon, p.lat, 0], radiusUnits: "pixels",
        getRadius: (p) => (enPlano ? CFG.radioPozoPx : Math.max(1.2, CFG.radioPozoPx - 0.4)) * crecimiento(p),
        getFillColor: (p) => [...colorPozo(p), 204],
        updateTriggers: { getRadius: [frame, enPlano] },
        parameters: { depthCompare: "always" },
      }),
      ...capasEtiquetas(),
    );
    return capas;
  }

  // etiquetas por nivel: con el encuadre completo solo las principales (nivel 1); al acercar ~1,2 niveles aparecen las demás
  const ZOOM_NIVEL2 = 1.2;
  const nivelEtiquetas = () => (viewState && viewState.zoom >= zoomBase + ZOOM_NIVEL2 ? 2 : 1);
  const datosEtiq = new Map();
  function etiquetasVisibles(lista) {
    const n = nivelEtiquetas(), clave = lista + "|" + n;   // misma referencia mientras no cambie el nivel (deck no recalcula)
    if (!datosEtiq.has(clave)) datosEtiq.set(clave, lista.filter((e) => (e.nivel || 1) <= n));
    return datosEtiq.get(clave);
  }
  function capasEtiquetas() {
    return [
      new deck.ScatterplotLayer({
        id: "etiq-punto", data: etiquetasVisibles(T.mapa.etiquetas), billboard: true, getPosition: (e) => [e.lon, e.lat, 0], radiusUnits: "pixels", getRadius: (e) => (e.destacada ? 2.6 : 2),
        getFillColor: [210, 214, 220, 230], parameters: { depthCompare: "always" },
      }),
      new deck.TextLayer({
        id: "etiq-texto", data: etiquetasVisibles(T.mapa.etiquetas), getPosition: (e) => [e.lon, e.lat, 0], getText: (e) => e.texto,
        getSize: (e) => (e.destacada ? 14 : 12), getColor: (e) => (e.destacada ? [236, 239, 243, 255] : [200, 205, 212, 235]), getTextAnchor: (e) => e.ancla || "start", getAlignmentBaseline: "center", getPixelOffset: (e) => [e.dx === undefined ? 7 : e.dx, e.dy || 0],
        characterSet: "auto", fontFamily: "Segoe UI, system-ui, sans-serif", fontWeight: 600, billboard: true, fontSettings: { sdf: true },
        outlineWidth: 1.2, outlineColor: [10, 11, 13, 235],
        parameters: { depthCompare: "always" },
      }),
      // agua: azul tenue y cursiva, sin fondo
      new deck.TextLayer({
        id: "etiq-agua", data: etiquetasVisibles(T.mapa.etiquetasAgua), getPosition: (e) => [e.lon, e.lat, 0], getText: (e) => e.texto,
        getSize: 10, getColor: [125, 170, 210, 120], getTextAnchor: "middle", getAlignmentBaseline: "center",
        characterSet: "auto", fontFamily: "Segoe UI, system-ui, sans-serif", fontWeight: "italic 500", billboard: true, fontSettings: { sdf: true },
        outlineWidth: 1.5, outlineColor: [10, 11, 13, 160], // con prueba de profundidad: las columnas 3D tapan el texto en vez de mezclarse con él
      }),
    ];
  }

  function iniciarMapa() {
    if (!hayDeck) { contMapa.innerHTML = `<p style="padding:24px;color:#aab1bb">No se pudo cargar la librería del mapa (se necesita conexión a internet).</p>`; return; }
    const v3 = camara3d(), v0 = camara2d();
    // zoom mínimo: toda la cuenca; máximo: el que admite el mapa (los hexágonos y columnas están en metros: conservan su forma al acercarse)
    const zMin = Math.min(zoomCuenca(contMapa), v3.zoom, v0.zoom), zMax = ZOOM_MAX;
    viewState = { ...v3, maxPitch: CFG.maxPitch, minZoom: zMin, maxZoom: zMax };
    zoomBase = v0.zoom;
    // la rueda del mouse (botón del medio) mueve la cámara igual que el botón derecho
    class ControladorMapa extends deck.MapController {
      _onPanStart(ev) {
        if (!ev.middleButton) return super._onPanStart(ev);
        const e = Object.create(ev); e.rightButton = true;
        return super._onPanStart(e);
      }
    }
    contMapa.addEventListener("mousedown", (e) => { if (e.button === 1) e.preventDefault(); });   // evita el autoscroll del navegador
    deckgl = new deck.Deck({
      parent: contMapa,
      views: new deck.MapView({ id: "mapa", farZMultiplier: 4, controller: { type: ControladorMapa, inertia: 250, touchRotate: true, scrollZoom: true } }),
      viewState,
      onViewStateChange: ({ viewState: vs }) => {
        viewState = vs;
        ocultarFichaPozo();
        const arr = vs.pitch < 5;
        // se redibujan las capas solo si la cámara pasa de inclinada a cenital (o al revés); el radio de los hexágonos es fijo
        const nivel = nivelEtiquetas();
        if (arr !== S.arriba || nivel !== S.nivelEtiq) { S.arriba = arr; S.nivelEtiq = nivel; deckgl.setProps({ viewState, layers: construirCapas() }); } else deckgl.setProps({ viewState });
        actualizarBotonVista();
      },
      layers: construirCapas(),
      getTooltip: tooltipMapa,
      onClick: mostrarFichaPozo,
      pickingRadius: 5,
      getCursor: ({ isDragging, isHovering }) => (isDragging ? "grabbing" : isHovering ? "pointer" : "grab"),
    });
  }

  function moverCamara(cambios, ms) {
    if (!deckgl) return;
    viewState = { ...viewState, ...cambios, transitionDuration: ms, transitionInterpolator: new deck.LinearInterpolator(Object.keys(cambios)), transitionEasing: (x) => x * x * (3 - 2 * x) };
    deckgl.setProps({ viewState });
    if (cambios.pitch != null) $("btn-vista").textContent = cambios.pitch < 1 ? T.mapa.vistaInclinada : T.mapa.vistaArriba;
  }
  function actualizarBotonVista() {
    if (!viewState) return;
    $("btn-vista").textContent = viewState.pitch < 1 ? T.mapa.vistaInclinada : T.mapa.vistaArriba;
  }
  /* ---------- vistas del mapa: Pozos · Petróleo · Gas · Agua que entra · Agua que vuelve ---------- */
  const VISTAS = ["pozos", ...VARS];
  let tweenId = 0;
  const refrescar = () => { if (deckgl) deckgl.setProps({ layers: construirCapas() }); };

  /** Anima la altura de las columnas: se bajan las de la vista anterior y suben las de la nueva. */
  function tweenColumnas(destino) {
    const id = ++tweenId;
    const ir = (hasta, ms, fin) => {
      const t0 = performance.now(), a0 = S.alt;
      (function paso(ahora) {
        if (id !== tweenId) return;
        const x = clamp((ahora - t0) / ms, 0, 1), e = x * x * (3 - 2 * x);
        S.alt = a0 + (hasta - a0) * e;
        refrescar();
        if (x < 1) requestAnimationFrame(paso); else if (fin) fin();
      })(t0);
    };
    if (!destino) ir(0, 420, () => { S.vistaCol = null; refrescar(); });
    else if (S.vistaCol && S.vistaCol !== destino) ir(0, 200, () => { S.vistaCol = destino; ir(1, 460); });
    else if (S.vistaCol === destino) ir(1, 300);
    else { S.vistaCol = destino; S.alt = 0; ir(1, 700); }
  }

  /** Pinta las pestañas, resalta el bloque activo de los paneles y arma la leyenda. */
  function pintarVistaUI() {
    document.querySelectorAll("#seg-vista button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === S.vista)));
    document.querySelectorAll(".tocable").forEach((b) => { if (b !== SIS_EL) b.classList.toggle("activa", b.dataset.vista === S.vista); });
  }

  function cambiarVista(k, ms) {
    if (!VISTAS.includes(k) || k === S.vista) return;
    S.vista = k;
    pintarVistaUI();
    // la cámara se conserva al cambiar de vista; solo se reencuadra al forzar el cambio sin animación (enlace con ?mapa=)
    if (ms === 0) moverCamara(camaraInicial(), 0);
    tweenColumnas(k === "pozos" ? null : k);
  }

  /** Capa de sismos: la comparten el botón «Sismos» del mapa y el bloque del panel; no toca el año, la vista ni la cámara. */
  function alternarSismos() {
    S.sismos = !S.sismos;
    pintarSismosUI();
    refrescar();
  }
  function pintarSismosUI() {
    if (SIS_EL) SIS_EL.classList.toggle("activa", S.sismos);
    $("btn-sismos").setAttribute("aria-pressed", String(S.sismos));
  }

  /* ---------- fondo de la intro: el mapa visto desde arriba, oscurecido ---------- */
  let introDeck = null;
  function iniciarFondoIntro() {
    if (!hayDeck) return;
    const cont = $("intro-mapa");
    const w = cont.clientWidth || window.innerWidth;
    const vs = encuadre(cont, { top: 40, bottom: 40, right: 40, left: Math.round(w * 0.36) });
    introDeck = new deck.Deck({
      parent: cont, views: new deck.MapView({ id: "intro", controller: false }), viewState: vs, controller: false,
      layers: [
        ...capasBase(),
        new deck.ScatterplotLayer({ id: "intro-pozos", data: pozos, getPosition: (p) => [p.lon, p.lat], radiusUnits: "pixels", getRadius: 1.7, getFillColor: [...CFG.colorPetroleo, 190] }),
      ],
    });
    window.addEventListener("resize", () => {
      const w2 = cont.clientWidth;
      introDeck.setProps({ viewState: encuadre(cont, { top: 40, bottom: 40, right: 40, left: Math.round(w2 * 0.36) }) });
    });
  }

  /* ============================================================ dial */
  const rango = $("dial-rango");

  function construirDial() {
    const marcas = $("dial-marcas");
    for (let i = 0; i < NP; i++) {
      const m = document.createElement("div");
      m.className = "marca" + (i === ULT ? " parcial" : "");
      m.style.left = (i / ULT) * 100 + "%";
      m.dataset.i = i;
      m.innerHTML = i === ULT ? T.dial.ultimaParada + (T.dial.ultimaParadaNota ? `<small>${T.dial.ultimaParadaNota}</small>` : "") : String(CFG.anioInicial + i);
      m.addEventListener("click", () => irAParada(i));
      marcas.appendChild(m);
    }
    $("dial-tramo-parcial").style.width = 100 / ULT + "%";

    // hitos: marca chica con etiqueta corta (una sola fila); al pasar el mouse, tocar o enfocar, se expande con el nombre completo y su (i)
    const cont = $("dial-hitos");
    const hs = D.hitos.hitos;
    hs.forEach((h, k) => {
      const [y, mo, d] = h.fecha.split("-").map(Number);
      const idx = clamp((y - CFG.anioInicial) + (mo - 1 + d / 30) / 12, 0, ULT);
      const tx = T.hitos[h.id] || {};
      const el = document.createElement("div");
      el.className = "hito";
      el.style.left = (idx / ULT) * 100 + "%";
      const pos = k === 0 ? "izq" : k === hs.length - 1 ? "der" : "";
      el.innerHTML = `<span class="hito-et ${pos}"><span class="corta">${tx.corta || tx.etiqueta || h.etiqueta}</span><span class="larga"><span>${tx.etiqueta || h.etiqueta}</span></span></span><span class="hito-hilo"></span><button type="button" class="hito-marca" aria-label="${tx.etiqueta || h.etiqueta}"></button>`;
      el.querySelector(".larga").appendChild(botonInfo("hito:" + h.id));
      el.querySelector(".hito-marca").addEventListener("click", (e) => {
        e.stopPropagation();
        const abrir = !el.classList.contains("abierto");
        cont.querySelectorAll(".hito.abierto").forEach((x) => x.classList.remove("abierto"));
        el.classList.toggle("abierto", abrir);
      });
      cont.appendChild(el);
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".hito")) cont.querySelectorAll(".hito.abierto").forEach((x) => x.classList.remove("abierto")); });
  }

  function actualizarDial() {
    document.querySelectorAll(".marca").forEach((m) => m.classList.toggle("activa", Number(m.dataset.i) === S.anio));
    if (S.sonando) rango.value = Math.min(ULT, S.t / 12); else rango.value = S.anio;
    const a = CFG.anioInicial + S.anio;
    $("exp-anio").innerHTML = S.anio === ULT ? `${a}<small>(${T.explorador.anioParcialNota})</small>` : String(a);
  }

  /* ============================================================ render y control */
  function render() {
    const anio = Math.min(Math.floor(S.t / 12), ULT);
    const cambio = anio !== S.anio;
    S.anio = anio;
    if (deckgl) deckgl.setProps({ layers: construirCapas() });
    else { agregarHexagonos(S.t); }
    actualizarDial();
    if (cambio) { actualizarPaneles(650); actualizarCabecera(650); }
  }

  function irAParada(i) {
    pausar();
    S.modoMes = false;
    S.t = tFinDeParada(i);
    render();
  }

  let ultimoCuadro = 0;
  function cuadro(ahora) {
    if (!S.sonando) return;
    const dt = Math.min(0.1, (ahora - ultimoCuadro) / 1000);
    ultimoCuadro = ahora;
    S.t = Math.min(S.t + dt * CFG.mesesPorSegundo, tFinDeParada(ULT));
    render();
    if (S.t >= tFinDeParada(ULT)) { pausar(); S.modoMes = false; render(); return; }
    requestAnimationFrame(cuadro);
  }
  function reproducir() {
    if (S.t >= tFinDeParada(ULT) - 0.01 || (!S.modoMes && S.anio >= ULT - 1)) S.t = 0.001;   // desde enero de 2010
    S.sonando = true; S.modoMes = true;
    $("btn-play").classList.add("sonando");
    $("btn-play").setAttribute("aria-label", T.dial.pausar);
    ultimoCuadro = performance.now();
    requestAnimationFrame(cuadro);
  }
  function pausar() {
    S.sonando = false;
    $("btn-play").classList.remove("sonando");
    $("btn-play").setAttribute("aria-label", T.dial.reproducir);
  }

  /* ============================================================ glosario y sistema de (i) de dos niveles */
  const pop = $("pop");
  const hoverOk = window.matchMedia("(hover: hover)").matches;
  let popEl = null, popCierre = null;

  function botonInfo(clave) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "i"; b.textContent = "i"; b.dataset.info = clave;
    b.setAttribute("aria-label", T.etiquetasInfo.masInfo); b.setAttribute("aria-expanded", "false");
    return b;
  }

  /** Nivel 2 de sismos: el cálculo del número del año + el contexto general (filtros, Zenodo, USGS, Observatorio). */
  function infoSismosN2() {
    const Q = T.sismos, G = Q.general, C = COB.contexto, U = C.usgs;
    const a = CFG.anioInicial + S.anio, v = D.sismos.anual[a];
    let detalle, como;
    if (a < sis0 || !v) {
      detalle = Q.infoQueAntes.replace("{año}", a); como = Q.infoComoAntes;
      // 2014-2018: conteo de Zenodo (misma magnitud, profundidad y área) como contexto; solo en el (i), nunca en el panel
      const z = (C.zenodo_por_anio || {})[a];
      if (z != null) como = Q.infoZenodo.replace("{año}", a).replace("{n}", nf.format(z)) + (a === 2014 ? Q.infoZenodoInicio2014 : "");
    }
    else {
      detalle = Q.infoQue.replace("{año}", a).replace("{n}", nf.format(v.m25));
      como = Q.infoComo + (a === sisN ? " " + Q.infoParcial.replace("{fecha}", fechaLarga(COB.corte || COB.datos_hasta)) : "");
    }
    const inpres = C.inpres_m25 === 0 ? G.inpresCero : G.inpresN.replace("{n}", nf.format(C.inpres_m25));
    const previo = G.previo.replace("{zenodo}", nf.format(C.zenodo_m25)).replace("{inpres}", inpres);
    const usgs = G.usgs.replace("{a}", nf.format(U.entre_2000_2014)).replace("{b}", nf.format(U.desde_2015));
    return {
      detalle, como,
      periodo: `Desde el 1/1/2019 hasta el 31/8/2026.`,
      fuente: [Q.fuenteInpres, { texto: "Schultz et al. (2024), catálogo de Zenodo (control y contexto)", url: "https://doi.org/10.5281/zenodo.14065345" },
        ...Q.fuentesRed,
        { texto: "USGS ComCat (contexto)", url: "https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=2000-01-01&minmagnitude=4&minlatitude=-39.5&maxlatitude=-36.5&minlongitude=-70.5&maxlongitude=-67.5&orderby=time" }],
      limite: Q.infoLimite,
      extra: `<ul class="pop-lista">${G.lineas.map((l) => `<li>${l}</li>`).join("")}</ul><p>${previo}</p><p>${usgs}</p><p>${G.cierre}</p>`,
      atribucion: ATRIBUCION_SISMOS,
    };
  }

  function datosInfo(clave) {
    if (clave.startsWith("hito:")) return T.hitos[clave.slice(5)];
    if (clave === "sismos") return { n1: T.info.sismos.n1, n2: infoSismosN2() };
    if (clave === "valor" || clave === "valor_gas") {
      const m = METRICAS.find((x) => x.info === clave), I = T.info[clave], a = CFG.anioInicial + S.anio, P = T.paneles;
      const nota = S.anio === ULT ? P.valorAnioParcial.replace("{mes}", T.meses[(serieAnual[ULT][m.parcialValor] || 8) - 1]) : "";
      return { n1: I.n1, n2: { ...I.n2, extra: `<p>${P.valorAnio.replace("{año}", a).replace("{v}", fmt(m.ser[S.anio], m.div))}${nota}</p>` } };
    }
    if (clave === "tarjeta_reservas" || clave === "tarjeta_iapg") {
      const I = T.info[clave], f = serieAnual[S.anio], a = CFG.anioInicial + S.anio, E = I.n2.enAnio;
      const n1d = nfd(1).format, nM = (v) => (v < 1 ? nfd(4) : nfd(1)).format(v), h = clave === "tarjeta_reservas" ? f.horizonte_reservas : f.horizonte_iapg;
      let t;
      if (!h || h.anios == null) t = E.noCalculable.replace("{año}", a);
      else if (clave === "tarjeta_reservas") t = E.texto.replace(/\{año\}/g, a).replace(/\{r\}/g, n1d(h.restante_m3 / 1e6)).replace(/\{p\}/g, nM(h.produccion_m3 / 1e6)).replace(/\{ritmo\}/g, h.anio_ritmo).replace("{h}", n1d(h.anios));
      else t = E.texto.replace(/\{año\}/g, a).replace("{r}", nf.format(Math.round(h.restante_mmbo.media))).replace("{rb}", nf.format(Math.round(h.restante_mmbo.p90))).replace("{ra}", nf.format(Math.round(h.restante_mmbo.p10)))
        .replace(/\{p\}/g, nM(h.produccion_mmbo)).replace(/\{ritmo\}/g, h.anio_ritmo).replace("{h}", n1d(h.anios.media)).replace("{hb}", n1d(h.anios.p90)).replace("{ha}", n1d(h.anios.p10));
      if (h && f.parcial) t += " " + E.parcial.replace("{mes}", T.meses[(f.ultimo_mes || 8) - 1]).replace(/\{año\}/g, a).replace(/\{ritmo\}/g, h.anio_ritmo);
      return { n1: I.n1, n2: { ...I.n2, extra: `<p>${t}</p>` } };
    }
    if (clave === "pozos") {
      const I = T.info.pozos, f = serieAnual[S.anio], a = CFG.anioInicial + S.anio;
      return { n1: I.n1, n2: { ...I.n2, extra: `<p>${I.n2.enAnio.replace("{año}", a).replace("{a}", nf.format(f.pozos_activos)).replace("{b}", nf.format(f.pozos_nuevos))}</p>` } };
    }
    return T.info[clave];
  }

  function htmlInfo(clave, expandido) {
    const d = datosInfo(clave);
    if (!d) return "";
    const E = T.etiquetasInfo, n2 = d.n2 || {};
    const hueco = (s) => String(s || "").replace("{arena}", nf.format(Math.round(ARENA.ser[S.anio] || 0))).replace(/\{año\}/g, CFG.anioInicial + S.anio).replace("{radio}", nfd(1).format(CFG.hexRadioM / 1000));
    const enlace = (f) => f.url ? `<a href="${f.url}" target="_blank" rel="noopener noreferrer">${f.texto}</a>` : `${f.texto || ""} <span class="pend">${E.linkPendiente}</span>`;
    const fuente = n2.fuente ? (Array.isArray(n2.fuente) ? n2.fuente.map(enlace).join("<br>") : enlace(n2.fuente)) : "";
    const bloque = (et, txt) => (txt ? `<p><b class="et">${et}</b>${txt}</p>` : "");
    const nivel2 = bloque(E.detalle, hueco(n2.detalle)) + bloque(E.como, hueco(n2.como)) + (n2.extra ? `<div>${n2.extra}</div>` : "") +
      bloque(E.periodo, hueco(n2.periodo)) + bloque(E.fuente, fuente) + bloque(E.limite, hueco(n2.limite)) + (n2.atribucion ? bloque(E.atribucion, n2.atribucion) : "");
    return `<p><b class="et">${E.n1}</b><span class="n1">${hueco(d.n1)}</span></p>` +
      `<button type="button" class="mas" aria-expanded="${expandido}">${expandido ? E.verMenos : E.verMas}</button>` +
      `<div class="n2"${expandido ? "" : " hidden"}>${nivel2}</div>`;
  }

  function ubicarPop(el) {
    const r = el.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    const x = clamp(r.left + r.width / 2 - w / 2, 8, window.innerWidth - w - 8);
    let y = r.bottom + 6;
    if (y + h > window.innerHeight - 8) y = Math.max(8, r.top - h - 6);
    pop.style.left = x + "px"; pop.style.top = y + "px";
  }
  function abrirPop(el) {
    clearTimeout(popCierre);
    if (popEl && popEl !== el && popEl.classList.contains("i")) popEl.setAttribute("aria-expanded", "false");
    if (el.classList.contains("gl")) {
      const g = T.glosario.terminos[el.dataset.gl];
      if (!g) return;
      pop.innerHTML = `<p class="gl-def"><b>${g.nombre}.</b> ${g.def}</p>`;
    } else {
      pop.innerHTML = htmlInfo(el.dataset.info, false);
      el.setAttribute("aria-expanded", "true");
    }
    pop.hidden = false;
    popEl = el;
    ubicarPop(el);
  }
  function cerrarPop() {
    pop.hidden = true;
    if (popEl && popEl.classList.contains("i")) popEl.setAttribute("aria-expanded", "false");
    popEl = null;
  }
  function iniciarInfo() {
    const objetivo = (e) => e.target.closest && e.target.closest(".i, .gl");
    document.addEventListener("mouseover", (e) => {
      if (!hoverOk) return;
      const b = objetivo(e);
      if (b && b.classList.contains("gl")) abrirPop(b);
      else if (!b && popEl && popEl.classList.contains("gl") && e.target.closest("#pop")) clearTimeout(popCierre);
    });
    document.addEventListener("mouseout", (e) => {
      if (!hoverOk) return;
      if (!popEl || !popEl.classList.contains("gl")) return; // los (i) solo se abren y cierran con click
      const b = objetivo(e);
      if ((b && b.classList.contains("gl")) || e.target.closest("#pop")) popCierre = setTimeout(cerrarPop, 250);
    });
    document.addEventListener("focusin", (e) => { const b = e.target.closest && e.target.closest(".gl"); if (b) abrirPop(b); });
    document.addEventListener("focusout", (e) => { if (e.target.closest && e.target.closest(".gl")) popCierre = setTimeout(cerrarPop, 150); });
    document.addEventListener("click", (e) => {
      const mas = e.target.closest(".mas");
      if (mas) {
        const n2 = pop.querySelector(".n2"), abierto = n2.hidden;
        n2.hidden = !abierto;
        mas.setAttribute("aria-expanded", String(abierto));
        mas.textContent = abierto ? T.etiquetasInfo.verMenos : T.etiquetasInfo.verMas;
        if (popEl) ubicarPop(popEl);
        return;
      }
      const b = objetivo(e);
      if (b) { e.preventDefault(); if (popEl === b && !pop.hidden && !b.classList.contains("gl")) cerrarPop(); else abrirPop(b); }
      else if (!e.target.closest("#pop")) cerrarPop();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { cerrarPop(); cerrarMetodo(); cerrarModulo(); } });
    window.addEventListener("scroll", (e) => { if (!(e.target && e.target.closest && e.target.closest("#pop"))) cerrarPop(); }, true);
  }

  /* ============================================================ números animados */
  function animar(est, hasta, ms, pintar) {
    cancelAnimationFrame(est.raf);
    const desde = est.v;
    if (!ms || desde === hasta) { est.v = hasta; pintar(hasta); return; }
    const t0 = performance.now();
    (function paso(ahora) {
      const x = clamp((ahora - t0) / ms, 0, 1), e = 1 - Math.pow(1 - x, 3);
      est.v = desde + (hasta - desde) * e;
      pintar(est.v);
      if (x < 1) est.raf = requestAnimationFrame(paso);
    })(t0);
  }

  /* ============================================================ paneles laterales */
  const serieAnual = D.serie.anios;
  /* dos secciones, cada una con lo extraído y su valor. `sec` agrupa; `graf` = true en la fila que dibuja el mini gráfico de la sección */
  const METRICAS = [
    { k: "petroleo",  sec: "petroleo", campo: "petroleo_bbl",       pozo: (p, i) => p.pet[i] * BBL,        pre: (p) => p.cumPet[0] * BBL, div: 1e6, info: "petroleo", graf: true },
    { k: "valor",     sec: "petroleo", campo: "valor_petroleo_usd", pozo: (p, i) => v0(p.usd, i) * 1000,   pre: (p) => p.usdPre * 1000,   div: 1e6, info: "valor", parcialValor: "valor_petroleo_usd_hasta_mes" },
    { k: "gas",       sec: "gas",      campo: "gas_miles_m3",       pozo: (p, i) => p.gas[i],              pre: (p) => p.cumGas[0],       div: 1e3, entero: true, info: "gas", graf: true },   // miles de m³ ÷ 1.000 = millones de m³
    { k: "valor_gas", sec: "gas",      campo: "valor_gas_usd",      pozo: (p, i) => v0(p.usdg, i) * 1000,  pre: (p) => p.usdgPre * 1000,  div: 1e6, info: "valor_gas", parcialValor: "valor_gas_usd_hasta_mes" },
  ];
  const SECCIONES = ["petroleo", "gas"];
  const FLUJOS = [
    { k: "entran",  campo: "agua_fractura_m3",  pozo: (p, i) => v0(p.aguaf, i), pre: () => 0,                 div: 1e6, info: "agua_entran",  equiv: CFG.piletaM3 },
    { k: "vuelven", campo: "agua_producida_m3", pozo: (p, i) => v0(p.aguap, i), pre: (p) => p.aguapPre,       div: 1e6, info: "agua_vuelven" },
  ];
  const ARENA = { campo: "arena_t", pozo: (p, i) => v0(p.arena, i), ser: new Array(NP).fill(0) };
  const SVG = (inner, vb) => `<svg viewBox="${vb}" preserveAspectRatio="none" aria-hidden="true">${inner}</svg>`;
  const trazo = (a) => (a.length ? "M" + a.map((p) => p[0].toFixed(2) + "," + p[1].toFixed(2)).join(" L") : "");

  let SIS_EL = null;

  /* ícono de columnas: pista de que el bloque se puede tocar para verlo en el mapa */
  const ICONO_COLUMNAS = `<svg class="ico-col" viewBox="0 0 16 16" aria-hidden="true"><title>${T.mapa.pistaColumnas}</title><rect x="1.5" y="9.5" width="3.4" height="5"/><rect x="6.3" y="3.5" width="3.4" height="11"/><rect x="11.1" y="6.5" width="3.4" height="8"/></svg>`;

  /* gráfico de barras anual (2010-2026): sin ejes ni números; hitos como puntos neutros sobre el eje */
  function htmlBarras(aria) {
    let barras = "";
    for (let i = 0; i < NP; i++) barras += `<div class="b-b${i === ULT ? " par" : ""}"><i></i></div>`;
    return `<div class="b-barras" role="img" aria-label="${aria}">${barras}</div>` +
      `<div class="b-ejes"><span>${CFG.anioInicial}</span><span>${CFG.anioInicial + ULT}</span></div>`;
  }
  function pintarBarras(el, ser, div, unidad, entero) {
    const P = T.paneles, max = Math.max(...ser, 1e-9);
    el.querySelectorAll(".b-b").forEach((b, i) => {
      b.firstChild.style.height = (ser[i] > 0 ? Math.max(ser[i] / max * 100, 3) : 0) + "%";
      b.classList.toggle("pas", i < S.anio); b.classList.toggle("act", i === S.anio); b.classList.toggle("fut", i > S.anio);
      b.title = (i === ULT ? P.barraTipParcial : P.barraTip).replace("{año}", CFG.anioInicial + i).replace("{v}", fmt(ser[i], div, entero) + " " + unidad);
    });
  }

  /** Minigráfico de sismos: barras 2019–2026 sobre el mismo eje 2010–2026 que los gráficos del agua. */
  function pintarSismos(anual) {
    const Q = T.sismos, n = (i) => ((anual[CFG.anioInicial + i] || {}).m25 || 0);
    let max = 1e-9;
    for (let i = 0; i < NP; i++) if (CFG.anioInicial + i >= sis0) max = Math.max(max, n(i));
    SIS_EL.querySelectorAll(".b-b").forEach((b, i) => {
      const a = CFG.anioInicial + i, nd = a < sis0;
      b.firstChild.style.height = nd ? "" : (n(i) > 0 ? Math.max(n(i) / max * 100, 3) : 0) + "%";
      b.classList.toggle("pas", i < S.anio); b.classList.toggle("act", i === S.anio); b.classList.toggle("fut", i > S.anio);
      b.title = nd ? Q.miniSinDato.replace("{año}", a) : (i === ULT ? Q.barraTituloParcial : Q.barraTitulo).replace("{año}", a).replace("{n}", nf.format(n(i)));
    });
  }

  /** Sección «Petróleo» o «Gas»: título, acumulado, valor del año, valor acumulado en USD y barras anuales. */
  function bloqueSeccion(k) {
    const tx = T.metricas[k], P = T.paneles;
    const pm = METRICAS.find((m) => m.sec === k && m.graf), vm = METRICAS.find((m) => m.sec === k && !m.graf);
    const el = document.createElement("section");
    el.className = "bloque seccion tocable sec-" + k;
    el.dataset.vista = k;
    el.tabIndex = 0; el.setAttribute("role", "button"); el.setAttribute("aria-label", tx.nombre + ": " + T.mapa.pistaColumnas);
    el.innerHTML = `<h3 class="sec-tit"><span>${tx.nombre}</span>${ICONO_COLUMNAS}</h3>` +
      `<div class="b-numfila"><div class="b-num"></div><div class="b-uni"></div></div><div class="b-sec"></div>` +
      `<div class="b-valor"><span></span></div>` + htmlBarras(T.metricas.graficoAria.replace("{nombre}", sinTags(tx.nombre)));
    el.querySelector(".sec-tit span").after(botonInfo(pm.info));
    el.querySelector(".b-valor").appendChild(botonInfo(vm.info));
    pm.el = el; vm.el = el;
    pm.est = { v: 0, raf: 0 }; pm.est2 = { v: 0, raf: 0 }; vm.est = { v: 0, raf: 0 };
    return el;
  }

  function construirPaneles() {
    const izq = $("panel-izq");
    izq.innerHTML = `<h2>${T.izquierda.titulo}</h2>`;
    for (const k of SECCIONES) izq.appendChild(bloqueSeccion(k));

    const der = $("panel-der");
    der.innerHTML = `<h2>${T.derecha.titulo}</h2>`;
    /* agua que entra / agua que vuelve (tocables: activan su vista en el mapa) */
    const A = T.agua, P = T.paneles;
    for (const f of FLUJOS) {
      const el = document.createElement("section");
      f.vista = f.k === "entran" ? "agua_entra" : "agua_vuelve";
      el.className = "bloque seccion tocable agua-" + (f.k === "entran" ? 1 : 2);
      el.dataset.vista = f.vista;
      el.tabIndex = 0; el.setAttribute("role", "button"); el.setAttribute("aria-label", A[f.k].nombre + ": " + T.mapa.pistaColumnas);
      el.innerHTML = `<h3 class="sec-tit"><span>${A[f.k].nombre}</span>${ICONO_COLUMNAS}</h3>` +
        `<div class="b-numfila"><div class="b-num"></div><div class="b-uni"></div></div><div class="b-sec"></div>` +
        (f.equiv ? `<div class="b-eq"></div>` : "") +
        htmlBarras(T.metricas.graficoAria.replace("{nombre}", A[f.k].nombre));
      el.querySelector(".sec-tit span").after(botonInfo(f.info));
      der.appendChild(el);
      f.el = el; f.est = { v: 0, raf: 0 }; f.est2 = { v: 0, raf: 0 };
    }

    /* sismos: número = sismos registrados en el año del dial (M >= 2,5); debajo, el total desde 2019 */
    const Q = T.sismos;
    const sis = document.createElement("section");
    sis.className = "bloque bloque-sismos tocable";
    sis.tabIndex = 0; sis.setAttribute("role", "button"); sis.setAttribute("aria-label", Q.titulo + ": " + T.mapa.pistaColumnas);
    sis.innerHTML = `<h3 class="sec-tit"><span>${Q.titulo}</span></h3>` +
      // zona de texto de alto fijo: las notas de 2019/2021 y los mensajes de años sin registro cambian aquí dentro, sin mover título ni gráfico
      `<div class="b-texto"><div class="b-numfila"><div class="b-num"><span class="num">0</span></div><div class="b-uni"></div></div><div class="b-sec"></div><div class="b-extra"></div></div>` +
      htmlBarras(Q.miniAria);
    // años sin registro comparable (antes de 2019): sin barra, solo una línea punteada
    sis.querySelectorAll(".b-b").forEach((b, i) => b.classList.toggle("nd", CFG.anioInicial + i < sis0));
    sis.querySelector(".sec-tit span").after(botonInfo("sismos"));
    der.appendChild(sis);
    SIS_EL = sis; SIS_EL.est = { v: 0, raf: 0 };

    /* clic o teclado sobre un bloque tocable: su vista en el mapa */
    for (const panel of [izq, der]) {
      panel.addEventListener("click", (e) => {
        const b = e.target.closest(".tocable");
        if (b && !e.target.closest(".i, .gl")) { if (b === SIS_EL) alternarSismos(); else cambiarVista(b.dataset.vista); }
      });
      panel.addEventListener("keydown", (e) => {
        const b = e.target.closest && e.target.closest(".tocable");
        if (b && e.target === b && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); if (b === SIS_EL) alternarSismos(); else cambiarVista(b.dataset.vista); }
      });
    }
  }

  const diasMes = (y, m) => new Date(y, m + 1, 0).getDate();

  /** Series anuales (la oficial sin filtros; con filtros, suma de los pozos que pasan) y sus acumulados (desde 2006). */
  function calcularSeries() {
    const sinFiltro = S.filtros.emp == null && S.filtros.tipo == null;
    const todas = [...METRICAS, ...FLUJOS, ARENA];
    if (sinFiltro) {
      for (const m of todas) m.ser = serieAnual.map((f) => f[m.campo] || 0);
    } else {
      for (const m of todas) m.ser = new Array(NP).fill(0);
      for (const p of pozos) {
        if (!pasaFiltros(p)) continue;
        for (const m of todas) for (let i = 0; i < NP; i++) m.ser[i] += m.pozo(p, i);
      }
    }
    for (const m of [...METRICAS, ...FLUJOS]) {
      let c = 0;
      for (const p of pozos) if (pasaFiltros(p)) c += m.pre(p);
      m.cum = m.ser.map((v) => (c += v));
    }
  }

  function actualizarPaneles(ms) {
    const P = T.paneles, mesParcial = T.meses[CFG.mesFinParcial - 1];
    const anioReal = CFG.anioInicial + S.anio;
    const parcial = S.anio === ULT;
    // hasta cuándo llega el acumulado: el año del dial (en 2026, hasta agosto)
    const hasta = parcial ? P.hastaParcial.replace("{mes}", mesParcial).replace("{año}", anioReal) : String(anioReal);
    const enAnio = (v, u) => (parcial ? P.enAnioParcial : P.enAnio).replace("{v}", v + " " + u).replace("{año}", anioReal);

    for (const k of SECCIONES) {
      const pm = METRICAS.find((m) => m.sec === k && m.graf), vm = METRICAS.find((m) => m.sec === k && !m.graf), el = pm.el, u = P.unidades[k];
      el.querySelector(".b-uni").textContent = P.unidadesAcum[k].replace("{hasta}", hasta);
      const num = el.querySelector(".b-num"), sec = el.querySelector(".b-sec"), val = el.querySelector(".b-valor span");
      animar(pm.est, pm.cum[S.anio], ms, (v) => { num.textContent = fmt(v, pm.div, pm.entero); });
      animar(pm.est2, pm.ser[S.anio], ms, (v) => { sec.textContent = enAnio(fmt(v, pm.div, pm.entero), u); });
      // 2026: el valor llega hasta el último mes con precio (agosto, con julio y agosto provisorios); se dice junto a la cifra
      const plantVal = parcial ? P.valorParcial.replace("{mes}", T.meses[(serieAnual[ULT][vm.parcialValor] || 8) - 1]) : P.valor;
      animar(vm.est, vm.cum[S.anio], ms, (v) => { val.textContent = plantVal.replace("{v}", fmt(v, vm.div)).replace("{año}", anioReal); });
      pintarBarras(el, pm.ser, pm.div, u, pm.entero);
    }

    const A = T.agua;
    for (const f of FLUJOS) {
      const tx = A[f.k], el = f.el, u = P.unidades[f.k];
      el.querySelector(".b-uni").textContent = P.unidadesAcum[f.k].replace("{hasta}", hasta);
      const num = el.querySelector(".b-num"), sec = el.querySelector(".b-sec"), eq = el.querySelector(".b-eq");
      animar(f.est, f.cum[S.anio], ms, (v) => { num.textContent = fmt(v, f.div); if (eq) eq.textContent = v / f.equiv >= 0.5 ? tx.equivalencia.replace("{n}", nf.format(Math.round(v / f.equiv))) : ""; });
      animar(f.est2, f.ser[S.anio], ms, (v) => { sec.textContent = enAnio(fmt(v, f.div), u); });
      pintarBarras(el, f.ser, f.div, u);
    }

    /* sismos: desde 2019 el número del año (registro comparable del INPRES); antes, un mensaje corto por tramo de años, sin número */
    const Q = T.sismos, anual = D.sismos.anual;
    const hay = anioReal >= sis0 && anioReal <= sisN;
    const num = SIS_EL.querySelector(".b-num"), numEl = SIS_EL.querySelector(".num"), extra = SIS_EL.querySelector(".b-extra");
    num.classList.toggle("sin-datos", !hay);
    pintarSismos(anual);
    if (hay) {
      let acum = 0;
      for (let a = sis0; a <= anioReal; a++) acum += (anual[a] || {}).m25 || 0;
      SIS_EL.querySelector(".b-uni").textContent = P.sismoUnidad.replace("{año}", anioReal);   // «parcial: hasta agosto» está en el (i) de sismos
      SIS_EL.querySelector(".b-sec").textContent = P.sismoDesde.replace("{v}", nf.format(acum));
      extra.textContent = Q.notas[anioReal] || "";
      animar(SIS_EL.est, (anual[anioReal] || {}).m25 || 0, ms, (v) => { numEl.textContent = nf.format(Math.round(v)); });
    } else {
      cancelAnimationFrame(SIS_EL.est.raf); SIS_EL.est.v = 0;
      // antes de 2019: sin número (no es «cero sismos»), con la aclaración del alcance y el contexto de la red
      const msj = Q.mensajes.find((x) => anioReal >= x.desde && anioReal <= x.hasta);
      numEl.textContent = Q.sinNumero.replace("{año}", anioReal);
      SIS_EL.querySelector(".b-uni").textContent = ""; SIS_EL.querySelector(".b-sec").textContent = ""; extra.textContent = msj ? msj.texto : "";
    }
    if (popEl && popEl.dataset && ["sismos", "agua_entran", "pozos", "valor", "valor_gas"].includes(popEl.dataset.info) && !pop.hidden) {
      const abierto = pop.querySelector(".n2") && !pop.querySelector(".n2").hidden;
      pop.innerHTML = htmlInfo(popEl.dataset.info, !!abierto);
    }
  }

  /* ============================================================ filtros */
  function construirFiltros() {
    const cuenta = new Map(), cuentaT = new Map();
    for (const p of pozos) { cuenta.set(p.emp, (cuenta.get(p.emp) || 0) + 1); cuentaT.set(p.tipo, (cuentaT.get(p.tipo) || 0) + 1); }
    const opciones = (sel, pares) => {
      sel.innerHTML = `<option value="">${T.filtros.todos}</option>` + pares.map(([id, nombre, n]) => `<option value="${id}">${nombre} (${nf.format(n)})</option>`).join("");
    };
    opciones($("f-emp"), [...cuenta].filter(([id]) => id != null).sort((a, b) => b[1] - a[1]).map(([id, n]) => [id, empresas[id], n]));
    opciones($("f-tipo"), [...cuentaT].filter(([id]) => id != null).sort((a, b) => b[1] - a[1]).map(([id, n]) => [id, tipos[id], n]));
    const aplicar = () => {
      const e = $("f-emp").value, t = $("f-tipo").value;
      S.filtros.emp = e === "" ? null : Number(e);
      S.filtros.tipo = t === "" ? null : Number(t);
      const n = (S.filtros.emp != null) + (S.filtros.tipo != null);
      $("btn-filtros").textContent = T.filtros.titulo + (n ? " · " + n : "");
      $("btn-filtros").classList.toggle("activo", n > 0);
      calcularSeries(); actualizarPaneles(500); render();
    };
    $("f-emp").addEventListener("change", aplicar);
    $("f-tipo").addEventListener("change", aplicar);
    $("f-limpiar").addEventListener("click", () => { $("f-emp").value = ""; $("f-tipo").value = ""; aplicar(); });
    $("btn-filtros").textContent = T.filtros.titulo;
    $("btn-filtros").addEventListener("click", (e) => {
      e.stopPropagation();
      const abrir = $("filtros-panel").hidden;
      $("filtros-panel").hidden = !abrir;
      $("btn-filtros").setAttribute("aria-expanded", String(abrir));
    });
    document.addEventListener("click", (e) => { if (!e.target.closest("#filtros") && !$("filtros-panel").hidden) { $("filtros-panel").hidden = true; $("btn-filtros").setAttribute("aria-expanded", "false"); } });
  }

  /* ============================================================ barra del mapa y leyenda */
  function construirBarraMapa() {
    $("vista-et").textContent = T.mapa.vista;
    const seg = $("seg-vista");
    for (const k of VISTAS) {
      const b = document.createElement("button");
      b.type = "button"; b.dataset.v = k; b.textContent = T.mapa.vistas[k];
      b.setAttribute("aria-pressed", String(S.vista === k));
      b.addEventListener("click", () => cambiarVista(k));
      seg.appendChild(b);
    }
    $("info-vista").appendChild(botonInfo("vista"));
    $("info-pozos").appendChild(botonInfo("pozos"));
    $("info-dial").appendChild(botonInfo("dial"));
    $("btn-sismos-txt").textContent = T.mapa.sismos;
    $("btn-sismos").addEventListener("click", alternarSismos);
    $("info-sismos-todos").appendChild(botonInfo("sismos_todos"));
    $("btn-vista").addEventListener("click", () => {
      if (!viewState) return;
      const aArriba = viewState.pitch >= 1;     // si hoy está inclinado, pasa a verse desde arriba
      S.preferArriba = aArriba;
      moverCamara(aArriba ? camara2d() : camara3d(), CFG.transicionCamaraMs);
    });
    $("mapa-atrib").textContent = T.mapa.atribucion;
    pintarVistaUI();
  }

  /* ============================================================ encabezado: las dos estimaciones */
  const CAB = [
    // horizonte del año del dial: H(t) = R(t) / P(t), calculado en scripts/indicadores_petroleo.py
    { k: "reservas", pct: "pct_extraido_reservas", horizonte: (f) => f.horizonte_reservas && f.horizonte_reservas.anios,              info: "tarjeta_reservas", cls: "" },
    { k: "iapg",     pct: "pct_extraido_iapg",     horizonte: (f) => f.horizonte_iapg && f.horizonte_iapg.anios && f.horizonte_iapg.anios.media, info: "tarjeta_iapg",     cls: " rec" },
  ];
  function construirCabecera() {
    const C = T.cabecera;
    $("btn-modulo").textContent = C.enlace;
    $("cab-nota").textContent = C.nota;
    $("cab-nota").hidden = !C.nota;
    for (const b of CAB) {
      const tx = C[b.k], el = document.createElement("article");
      el.className = "ct" + b.cls;
      el.innerHTML = `<div class="ct-fila1"><span class="ct-tag">${tx.etiqueta}</span><span class="ct-pct"></span></div>` +
        `<div class="ct-nombre"><span><b>${tx.nombre}</b> · ${tx.fuente}</span></div>` +
        `<div class="ct-barra" role="img" aria-label="${C.barraAria}"><div style="transform:scaleX(0)"></div></div><div class="ct-anios"></div>`;
      el.querySelector(".ct-nombre").appendChild(botonInfo(b.info));
      $("cab-tarjetas").appendChild(el);
      b.el = el; b.est = { v: 0, raf: 0 };
    }
    $("btn-modulo").addEventListener("click", abrirModulo);
  }
  // texto de la línea de años: redondeo solo al mostrar; el valor exacto está en el (i)
  function textoHorizonte(fila, a) {
    const C = T.cabecera, anio = CFG.anioInicial + S.anio;
    const ritmo = fila.horizonte_reservas ? fila.horizonte_reservas.anio_ritmo : anio;
    if (a == null || !isFinite(a)) return C.aniosNo.replace("{año}", anio);
    if (a > C.aniosTope) return C.aniosMas.replace("{año}", ritmo);
    return (fila.parcial ? C.aniosParcial : C.anios).replace("{n}", a >= 10 ? nf.format(Math.round(a)) : nf1.format(a)).replace("{año}", ritmo);
  }
  function actualizarCabecera(ms) {
    const fila = serieAnual[S.anio], C = T.cabecera;
    for (const b of CAB) {
      const pct = fila[b.pct] || 0;
      b.el.querySelector(".ct-barra div").style.transform = "scaleX(" + Math.max(0.008, clamp(pct, 0, 100) / 100) + ")";
      b.el.querySelector(".ct-barra").setAttribute("aria-label", C.barraAria + ": " + nfd(pct < 1 ? 2 : 1).format(pct) + " %");
      const dec = pct < 1 ? 2 : 1, out = b.el.querySelector(".ct-pct");
      animar(b.est, pct, ms, (v) => { out.innerHTML = nfd(dec).format(v) + "<small>% extraído</small>"; });
      b.el.querySelector(".ct-anios").textContent = textoHorizonte(fila, b.horizonte(fila));
    }
  }

  /* ============================================================ módulo «¿Por qué dos respuestas?» */
  function construirModulo() {
    const M = T.modulo;
    const links = (fs) => "<ul>" + fs.map((f) => `<li><a href="${f.url}" target="_blank" rel="noopener noreferrer">${f.texto}</a></li>`).join("") + "</ul>";
    $("modulo-contenido").innerHTML = `<h2 id="modulo-titulo">${M.titulo}</h2><p class="sub">${M.subtitulo}</p>` +
      `<div class="defs"><div><h3>${M.reserva.termino}</h3><p>${M.reserva.def}</p>${links(M.reserva.fuentes)}</div>` +
      `<div><h3>${M.recurso.termino}</h3><p>${M.recurso.def}</p>${links(M.recurso.fuentes)}</div></div><p class="cierre">${M.cierre}</p>`;
    $("modulo-cerrar").textContent = M.cerrar;
    $("modulo-cerrar").addEventListener("click", cerrarModulo);
    $("modulo-fondo").addEventListener("click", cerrarModulo);
  }
  function abrirModulo() { cerrarPop(); $("modulo").hidden = false; $("modulo-cerrar").focus(); }
  function cerrarModulo() { $("modulo").hidden = true; }

  /* ============================================================ intro: tarjetas de importancia */
  const ICONOS = {
    extraido: '<path d="M12 3.5c3 4 6 7.3 6 10.6a6 6 0 0 1-12 0c0-3.3 3-6.6 6-10.6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    ritmo: '<path d="M4 18l5-6 4 3 7-9M15 6h5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    agua: '<path d="M3 9c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0M3 15c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    queda: '<rect x="4" y="9" width="16" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="4" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/>',
  };
  /* Las cuatro tarjetas usan el último año de la serie (2026, hasta agosto). Cálculo y fuente: en el (i) de cada tarjeta. */
  function construirIntro() {
    const X = D.contexto, I = T.intro.tarjetas, fu = serieAnual[ULT], r = X.record_bpd;
    const aguaM3 = serieAnual.reduce((s, f) => s + (f.agua_fractura_m3 || 0), 0);
    const tarj = (k, num, et, et2) =>
      `<article class="itarj"><div class="i-cab"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[k]}</svg><span class="i-tag">${I[k].tag}</span></div>` +
      `<div class="i-num">${num}</div><div class="i-et">${et}</div>${et2 ? `<div class="i-et2">${et2}</div>` : ""}</article>`;
    $("intro-tarjetas").innerHTML =
      tarj("extraido", `${nf.format(Math.round(fu.petroleo_acumulado_bbl / 1e6))}<small class="suf">${I.extraido.unidad}</small>`, I.extraido.etiqueta) +
      tarj("ritmo", `${nf.format(Math.round(r.bpd / 1000))}<small class="suf">${I.ritmo.unidad}</small>`, I.ritmo.etiqueta.replace("{mes}", T.meses[r.mes - 1]).replace("{anio}", r.anio)) +
      tarj("agua", `${nfd(1).format(aguaM3 / 1e6)}<small class="suf">${I.agua.unidad}</small>`, I.agua.etiqueta, I.agua.equiv.replace("{n}", nf.format(Math.round(aguaM3 / CFG.piletaM3 / 100) * 100))) +
      tarj("queda", `${nf.format(Math.round(100 - fu.pct_extraido_reservas))} %`, I.queda.etiqueta, I.queda.etiqueta2.replace("{v}", nf.format(Math.round(100 - fu.pct_extraido_iapg))));
    const claves = ["intro_extraido", "intro_ritmo", "intro_agua", "intro_queda"];
    $("intro-tarjetas").querySelectorAll(".i-cab").forEach((c, i) => c.appendChild(botonInfo(claves[i])));
  }

  /* ============================================================ metodología y fuentes */
  function construirMetodo() {
    const M = T.metodologia;
    let h = `<h2>${M.titulo}</h2>` + M.introGeneral.map((p) => `<p class="general">${p}</p>`).join("");
    for (const s of M.secciones) {
      h += `<h3>${s.titulo}</h3>`;
      for (const p of s.parrafos || []) h += `<p${s.espacioIA ? ' class="espacio-ia"' : s.atribucion ? ' class="atribucion"' : ""}>${p}</p>`;
      if (s.fuentes) h += "<ul>" + s.fuentes.map((f) => `<li>${f.url ? `<a href="${f.url}" target="_blank" rel="noopener noreferrer">${f.texto}</a>` : `${f.texto} <span class="pend">${T.etiquetasInfo.linkPendiente}</span>`}</li>`).join("") + "</ul>";
      if (s.glosario) h += "<dl>" + Object.values(T.glosario.terminos).map((g) => `<dt>${g.nombre}</dt><dd>${g.def}</dd>`).join("") + "</dl>";
    }
    $("metodo-contenido").innerHTML = h;
    $("metodo-cerrar").textContent = M.cerrar;
    $("link-metodo").textContent = T.linkMetodo;
    $("link-metodo").addEventListener("click", (e) => { e.preventDefault(); $("metodo").hidden = false; $("metodo-caja").scrollTop = 0; });
    $("metodo-cerrar").addEventListener("click", cerrarMetodo);
    $("metodo-fondo").addEventListener("click", cerrarMetodo);
  }
  function cerrarMetodo() { $("metodo").hidden = true; }

  /* ============================================================ intro (capa) y arranque */
  function entrar(conAnimacion) {
    const intro = $("intro");
    if (deckgl) { S.preferArriba = false; moverCamara(camara3d(), 0); }   // al salir de la intro: toda el área de estudio
    intro.classList.add("oculto");
    setTimeout(() => (intro.style.display = "none"), conAnimacion ? 1000 : 0);
  }

  function iniciar() {
    aplicarTextos();
    $("exp-titulo").innerHTML = T.explorador.titulo;
    $("btn-play").setAttribute("aria-label", T.dial.reproducir);
    rango.setAttribute("aria-label", T.dial.aria);

    const anioQ = Number(QS.get("anio"));
    if (anioQ >= CFG.anioInicial && anioQ <= CFG.anioInicial + ULT) { S.anio = anioQ - CFG.anioInicial; S.t = tFinDeParada(S.anio); }

    construirDial();
    iniciarMapa();
    iniciarFondoIntro();
    actualizarBotonVista();
    iniciarInfo();
    construirPaneles();
    // en pantallas angostas los paneles laterales se pliegan desde su título (accesible con teclado)
    const mqAngosto = window.matchMedia("(max-width: 1000px)");
    const titulos = ["panel-izq", "panel-der"].map((id) => $(id).querySelector("h2"));
    const sincronizar = () => titulos.forEach((h) => {
      const panel = h.parentElement;
      if (mqAngosto.matches) { h.setAttribute("role", "button"); h.tabIndex = 0; h.setAttribute("aria-expanded", String(!panel.classList.contains("plegado"))); }
      else { panel.classList.remove("plegado"); h.removeAttribute("role"); h.removeAttribute("tabindex"); h.removeAttribute("aria-expanded"); }
    });
    const alternar = (h) => { if (!mqAngosto.matches) return; const p = h.parentElement; p.classList.toggle("plegado"); h.setAttribute("aria-expanded", String(!p.classList.contains("plegado"))); };
    titulos.forEach((h) => { h.addEventListener("click", () => alternar(h)); h.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); alternar(h); } }); });
    mqAngosto.addEventListener("change", sincronizar); sincronizar();
    construirFiltros();
    construirBarraMapa();
    construirCabecera();
    construirModulo();
    construirIntro();
    construirMetodo();

    $("intro-boton").addEventListener("click", () => entrar(true));
    $("intro-saltar").addEventListener("click", (e) => { e.preventDefault(); entrar(false); });
    $("btn-play").addEventListener("click", () => (S.sonando ? pausar() : reproducir()));
    // teclado: con step="any" el navegador no mueve el control con las flechas; se avanza de parada en parada
    rango.addEventListener("keydown", (e) => {
      const salto = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -3, PageUp: 3 }[e.key];
      let i = null;
      if (salto) i = clamp(Math.round(parseFloat(rango.value)) + salto, 0, ULT);
      else if (e.key === "Home") i = 0; else if (e.key === "End") i = ULT;
      if (i === null) return;
      e.preventDefault(); irAParada(i);
    });
    rango.addEventListener("input", () => {
      const i = Math.round(parseFloat(rango.value));
        if (S.sonando) pausar();
      if (i !== S.anio || S.modoMes) irAParada(i); else rango.value = i;
    });

    render();
    calcularSeries(); actualizarPaneles(0); actualizarCabecera(0);

    // pruebas: ?intro=0 salta la capa; ?vista=arriba deja el mapa cenital
    if (QS.get("mapa") && VISTAS.includes(QS.get("mapa"))) { S.preferArriba = QS.get("vista") === "arriba"; cambiarVista(QS.get("mapa"), 0); }
    if (QS.get("intro") === "0") $("intro").style.display = "none";
    if (QS.get("play")) reproducir();
  }

  window.addEventListener("DOMContentLoaded", iniciar);
})();
