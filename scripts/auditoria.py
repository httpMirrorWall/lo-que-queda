"""
Auditoría de datos crudos - proyecto Vaca Muerta (Contar con Datos 2026).

SOLO LEE: no modifica ni crea datasets. Escribe un único reporte de texto:
    docs/auditoria_detalle.md   (secciones por archivo + evidencia de la Tarea 3)

Uso (desde la carpeta del proyecto):
    python scripts/auditoria.py

Requiere: duckdb, geopandas, pyogrio, openpyxl, pandas
"""
import re
import sys
import warnings
from pathlib import Path

import duckdb
import geopandas as gpd
import openpyxl
import pandas as pd

warnings.filterwarnings("ignore")
RAIZ = Path(__file__).resolve().parent.parent
RAW = RAIZ / "datos" / "raw"
SALIDA = RAIZ / "docs" / "auditoria_detalle.md"

CIV = RAW / "capitulo_iv"
F_NOCONV = CIV / "produccin-de-pozos-de-gas-y-petrleo-no-convencional.csv"
F_PADRON = CIV / "padrn-de-pozos-de-captulo-iv-con-fecha-de-primera-produccin.csv"
F_YAC = CIV / "produccin-de-petrleo-y-gas-captulo-iv-por-yacimiento-y-antigedad-de-pozo-productivo.csv"
F_SERIE_GAS = CIV / "serie-histrica-de-produccin-de-gas-natural-por-cuenca-y-sub-tipo-de-recurso-captulo-iv-.csv"
F_SERIE_PET = CIV / "serie-histrica-de-produccin-de-petrleo-por-cuenca-y-sub-tipo-de-recurso-captulo-iv-.csv"
F_SHP_POZOS = CIV / "shapefile_pozos" / "shapefile-de-pozos-shp.shp"
F_FRACT = RAW / "fractura" / "datos-de-fractura-de-pozos-de-hidrocarburos-adjunto-iv-actualizacin-diaria.csv"
F_CUENCAS = RAW / "cuencas" / "exploracin-hidrocarburos-cuencas-sedimentarias-shp.shp"
F_RESERVAS = RAW / "reservas" / "reservas al 31-12-2025.xlsx"
F_REGALIAS = {
    "crudo": RAW / "regalias" / "crudo" / "Informe Regalias CRUDO.xlsx",
    "gas": RAW / "regalias" / "gas" / "Informe Regalias GAS.xlsx",
    "gasolina": RAW / "regalias" / "gasolina" / "Informe Regalias GASOLINA-CONDENSADO.xlsx",
    "glp": RAW / "regalias" / "glp" / "Informe Regalias GLP.xlsx",
}

con = duckdb.connect()
OUT = []


def w(txt=""):
    OUT.append(str(txt))
    try:
        print(txt)
    except UnicodeEncodeError:
        print(str(txt).encode("ascii", "replace").decode())


def q(sql):
    return con.execute(sql).fetchall()


def qdf(sql):
    return con.execute(sql).df()


def md_tabla(df, max_rows=60):
    if df is None or len(df) == 0:
        return "_(vacío)_"
    df = df.head(max_rows)
    cols = [str(c) for c in df.columns]
    lineas = ["| " + " | ".join(cols) + " |", "|" + "|".join("---" for _ in cols) + "|"]
    for _, r in df.iterrows():
        lineas.append("| " + " | ".join(str(v).replace("|", "/").replace("\n", " ") for v in r.values) + " |")
    return "\n".join(lineas)


def ident(c):
    return '"' + c.replace('"', '""') + '"'


def mb(p):
    return f"{Path(p).stat().st_size / 1024 / 1024:.2f} MB"


# ---------------------------------------------------------------- encoding
def revisar_encoding(path):
    """Devuelve texto describiendo encoding / caracteres raros."""
    raw_bytes = Path(path).read_bytes()
    bom = raw_bytes.startswith(b"\xef\xbb\xbf")
    try:
        txt = raw_bytes.decode("utf-8")
        enc = "UTF-8" + (" con BOM" if bom else " (sin BOM)")
    except UnicodeDecodeError:
        txt = raw_bytes.decode("latin-1")
        enc = "NO es UTF-8 válido (se leyó como latin-1)"
    raros = sorted({c for c in txt if ord(c) > 127})
    moji = len(re.findall("Ã.|Â.|�", txt))
    crlf = raw_bytes.count(b"\r\n")
    s = f"{enc}; saltos de línea {'CRLF' if crlf else 'LF'}; caracteres no-ASCII distintos: {''.join(raros[:40]) or 'ninguno'}"
    if moji:
        ej = sorted({m for m in re.findall(r"\w{0,12}(?:Ã|Â|�)\S{0,8}", txt)})[:4]
        s += f"; ⚠️ {moji} secuencias tipo mojibake (Ã, Â, �), ej. {ej}"
    else:
        s += "; sin mojibake detectado"
    return s


# ---------------------------------------------------------------- CSV genérico
def audit_csv(path, etiqueta, extra_cat_max=3000):
    w(f"\n## {etiqueta}")
    w(f"- **Archivo:** `{Path(path).relative_to(RAIZ).as_posix()}`")
    w(f"- **Tamaño:** {mb(path)}")
    w("- **Formato:** CSV, separador `,`")
    w(f"- **Encoding:** {revisar_encoding(path)}")
    P = str(path).replace("\\", "/")
    con.execute(f"CREATE OR REPLACE VIEW t AS SELECT * FROM read_csv('{P}', header=true, sample_size=-1)")
    n = q("SELECT count(*) FROM t")[0][0]
    cols = qdf("DESCRIBE t")[["column_name", "column_type"]].values.tolist()
    w(f"- **Filas:** {n:,}")
    w(f"- **Columnas:** {len(cols)}")

    # una pasada para nulos (+ vacíos string)
    exprs = []
    for c, tp in cols:
        e = f"count(*) - count({ident(c)})"
        if tp == "VARCHAR":
            e = f"count(*) - count(NULLIF(trim({ident(c)}), ''))"
        exprs.append(e)
    nulos = con.execute("SELECT " + ", ".join(exprs) + " FROM t").fetchone()
    filas = []
    for (c, tp), nn in zip(cols, nulos):
        ej = con.execute(
            f"SELECT list(v) FROM (SELECT DISTINCT {ident(c)} AS v FROM t WHERE {ident(c)} IS NOT NULL LIMIT 3)"
        ).fetchone()[0]
        filas.append(
            {
                "columna": c,
                "tipo": tp,
                "% faltante": f"{100 * nn / n:.2f}" if n else "-",
                "ejemplos": "; ".join(str(x) for x in ej),
            }
        )
    w("\n### Columnas")
    w(md_tabla(pd.DataFrame(filas), 200))

    # duplicados exactos
    d = q("SELECT count(*) FROM (SELECT * FROM t) ") [0][0] - q("SELECT count(*) FROM (SELECT DISTINCT * FROM t)")[0][0]
    w(f"\n### Calidad")
    w(f"- Filas duplicadas exactas (todas las columnas iguales): **{d:,}**")

    # numéricas: min/max/negativos/ceros
    num = [c for c, tp in cols if tp in ("BIGINT", "INTEGER", "DOUBLE", "DECIMAL", "HUGEINT", "SMALLINT", "TINYINT", "FLOAT")
           or tp.startswith("DECIMAL")]
    if num:
        sel = []
        for c in num:
            sel += [f"min({ident(c)})", f"max({ident(c)})", f"count(*) FILTER (WHERE {ident(c)} < 0)", f"count(*) FILTER (WHERE {ident(c)} = 0)"]
        r = con.execute("SELECT " + ", ".join(sel) + " FROM t").fetchone()
        fn = []
        for i, c in enumerate(num):
            mn, mx, neg, zer = r[4 * i: 4 * i + 4]
            fn.append({"columna": c, "mín": mn, "máx": mx, "negativos": neg, "ceros": zer})
        w("\n**Rangos numéricos** (negativos / ceros):")
        w(md_tabla(pd.DataFrame(fn), 200))

    # fechas
    fechas = [(c, tp) for c, tp in cols if "fecha" in c.lower() or tp in ("DATE", "TIMESTAMP", "TIMESTAMP WITH TIME ZONE")]
    for c, tp in fechas:
        if tp == "VARCHAR":
            mn, mx, inval = con.execute(
                f"SELECT min(try_cast({ident(c)} AS TIMESTAMP)), max(try_cast({ident(c)} AS TIMESTAMP)), "
                f"count(*) FILTER (WHERE {ident(c)} IS NOT NULL AND try_cast({ident(c)} AS TIMESTAMP) IS NULL) FROM t"
            ).fetchone()
        else:
            mn, mx = con.execute(f"SELECT min({ident(c)}), max({ident(c)}) FROM t").fetchone()
            inval = 0
        w(f"- Fecha `{c}` ({tp}): primera **{mn}**, última **{mx}**, no parseables: {inval}")
    names = [c for c, _ in cols]
    if "anio" in names and "mes" in names:
        mn, mx, mmal, amal = con.execute(
            "SELECT min(anio*100+mes), max(anio*100+mes), count(*) FILTER (WHERE mes NOT BETWEEN 1 AND 12), "
            "count(*) FILTER (WHERE anio < 1900 OR anio > 2026) FROM t"
        ).fetchone()
        w(f"- Cobertura `anio`/`mes`: **{mn}** → **{mx}** (AAAAMM); meses fuera de 1-12: {mmal}; años fuera de 1900-2026: {amal}")

    # categóricas: variantes de escritura
    cat = [c for c, tp in cols if tp == "VARCHAR"]
    w("\n**Columnas de texto** (distintos / variantes por mayúsculas, tildes o espacios):")
    resumen = []
    variantes_txt = []
    for c in cat:
        nd = con.execute(f"SELECT count(DISTINCT {ident(c)}) FROM t").fetchone()[0]
        esp = con.execute(
            f"SELECT count(DISTINCT {ident(c)}) FROM t WHERE {ident(c)} <> trim({ident(c)})"
        ).fetchone()[0]
        nvar = 0
        if nd <= extra_cat_max:
            grp = con.execute(
                f"""SELECT norm, list(DISTINCT v) FROM (
                      SELECT {ident(c)} AS v, lower(strip_accents(regexp_replace(trim({ident(c)}), '\\s+', ' ', 'g'))) AS norm
                      FROM t WHERE {ident(c)} IS NOT NULL) GROUP BY norm HAVING count(DISTINCT v) > 1"""
            ).fetchall()
            nvar = len(grp)
            for norm, vs in grp[:6]:
                variantes_txt.append(f"  - `{c}`: " + " | ".join(repr(x) for x in vs[:5]))
        resumen.append({"columna": c, "valores distintos": nd, "con espacios extra": esp, "grupos con variantes": nvar})
    w(md_tabla(pd.DataFrame(resumen), 200))
    if variantes_txt:
        w("\nEjemplos de variantes (mismo valor escrito distinto):")
        for v in variantes_txt[:40]:
            w(v)
    return n, cols


def val_counts(tabla_sql, col, limit=60, where=""):
    return qdf(f"SELECT {ident(col)} AS valor, count(*) AS filas FROM {tabla_sql} {where} GROUP BY 1 ORDER BY 2 DESC LIMIT {limit}")


# ---------------------------------------------------------------- Shapefile
def audit_shp(path, etiqueta, col_cat_max=300, encoding=None):
    w(f"\n## {etiqueta}")
    w(f"- **Archivo:** `{Path(path).relative_to(RAIZ).as_posix()}`")
    comp = sorted(Path(path).parent.glob(Path(path).stem + ".*"))
    w("- **Componentes:** " + ", ".join(f"{p.suffix} ({p.stat().st_size/1024:.0f} KB)" for p in comp if p.suffix != ".zip"))
    cpg = Path(path).with_suffix(".cpg")
    w(f"- **Encoding declarado (.cpg):** {cpg.read_text().strip() if cpg.exists() else 'no hay .cpg'}")
    g = gpd.read_file(path)
    if encoding:
        malos = [v for v in g.select_dtypes("object").stack().astype(str) if re.search("Ã|Â", v)]
        g = gpd.read_file(path, encoding=encoding)
        w(f"- ⚠️ Lectura por defecto: {len(set(malos))} valores de texto con caracteres rotos (ej. {sorted(set(malos))[:3]}); "
          f"el .dbf declara cp1252 pero el contenido es UTF-8. Leyendo con `encoding='{encoding}'` se ve bien.")
    w(f"- **Elementos:** {len(g):,}")
    w(f"- **CRS:** {g.crs.to_string() if g.crs else 'SIN CRS'}" + (f" — {g.crs.name}" if g.crs else ""))
    w(f"- **Tipos de geometría:** {g.geom_type.value_counts().to_dict()}")
    w(f"- **Geometrías vacías/nulas:** {int(g.geometry.is_empty.sum() + g.geometry.isna().sum())}; inválidas: {int((~g.geometry.is_valid).sum())}")
    b = g.total_bounds
    w(f"- **Extensión (minx, miny, maxx, maxy):** {b.round(4).tolist()}")
    filas = []
    for c in g.columns:
        if c == "geometry":
            continue
        s = g[c]
        ej = [e[:60] for e in s.dropna().astype(str).drop_duplicates().head(3).tolist()]
        filas.append({"columna": c, "tipo": str(s.dtype), "% faltante": f"{100 * s.isna().mean():.2f}", "ejemplos": "; ".join(ej)})
    w("\n### Columnas de atributos")
    w(md_tabla(pd.DataFrame(filas), 100))
    w("\n### Calidad")
    attrs = g.drop(columns="geometry")
    dup = int(attrs.duplicated().sum())
    w(f"- Filas de atributos duplicadas: {dup:,}")
    for c in attrs.columns:
        if attrs[c].dtype == object:
            nd = attrs[c].nunique()
            if nd <= col_cat_max:
                norm = attrs[c].dropna().astype(str).map(lambda x: re.sub(r"\s+", " ", x.strip()).lower())
                grp = attrs[c].dropna().astype(str).groupby(norm).nunique()
                bad = grp[grp > 1]
                if len(bad):
                    ej = [attrs[c].dropna().astype(str)[norm == k].unique().tolist()[:4] for k in bad.index[:3]]
                    w(f"- `{c}`: {len(bad)} grupos con variantes de escritura, ej. {ej}")
    return g


# ---------------------------------------------------------------- Excel
def leer_pivot(ws, hdr_marker="AÑO"):
    """Lee tablas dinámicas de regalías: devuelve (df, unidad, notas)."""
    rows = list(ws.iter_rows(values_only=True))
    unidad = None
    notas = []
    hdr_i = None
    for i, r in enumerate(rows):
        if r and r[0] and str(r[0]).startswith("Suma de"):
            unidad = str(r[0])
        if r and r[0] == hdr_marker:
            hdr_i = i
            break
    for r in rows[:5]:
        for c in r:
            if isinstance(c, str) and ("Nota" in c or "información" in c or "tipo de cambio" in c):
                notas.append(c.strip())
    hdr = [str(c).strip() if c is not None else None for c in rows[hdr_i]]
    keep = [j for j, h in enumerate(hdr) if h]  # la hoja declara cientos de columnas vacías
    data = []
    anio = None
    for r in rows[hdr_i + 1:]:
        if all(c is None for c in r):
            continue
        if r[0] is not None:
            anio = r[0]  # el año aparece solo en la primera fila de cada año
        if r[1] is None:
            continue
        data.append([anio] + [r[j] for j in keep[1:]])
    df = pd.DataFrame(data, columns=[hdr[j] for j in keep])
    df["AÑO"] = pd.to_numeric(df["AÑO"], errors="coerce")
    df["MES"] = pd.to_numeric(df["MES"], errors="coerce")
    df = df.dropna(subset=["AÑO", "MES"]).reset_index(drop=True)
    return df, unidad, notas, hdr_i + 1


def audit_regalias(nombre, path):
    w(f"\n## Regalías — {nombre.upper()}")
    w(f"- **Archivo:** `{Path(path).relative_to(RAIZ).as_posix()}`")
    w(f"- **Tamaño:** {mb(path)}; formato Excel (.xlsx)")
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    w(f"- **Hojas:** {[ws.title for ws in wb.worksheets]}")
    res = {}
    for ws in wb.worksheets:
        if ws.title.lower().startswith("detalle"):
            w(f"\n### Hoja `{ws.title}`")
            for r in ws.iter_rows(values_only=True):
                v = [str(c).strip() for c in r if c is not None]
                if v:
                    w("- " + " | ".join(v))
            continue
        df, unidad, notas, hdr_row = leer_pivot(ws)
        res[ws.title] = df
        valcols = [c for c in df.columns if c not in ("AÑO", "MES")]
        num = df[valcols].apply(pd.to_numeric, errors="coerce")
        w(f"\n### Hoja `{ws.title}`")
        w(f"- Unidad en celda de la tabla dinámica: **{unidad}**")
        for nt in notas:
            w(f"- Nota en la hoja: _{nt}_")
        w(f"- Fila de encabezado: {hdr_row}; filas de datos (año-mes): {len(df)}; columnas: {list(df.columns)}")
        w(f"- Valores no numéricos en columnas de datos: {int(num.isna().sum().sum() - df[valcols].isna().sum().sum())}; vacíos: {int(df[valcols].isna().sum().sum())}")
        w(f"- Valores negativos: {int((num < 0).sum().sum())}")
        # periodos con datos
        tot = [c for c in valcols if "TOTAL" in c.upper()][0]
        pos = df[pd.to_numeric(df[tot], errors="coerce") > 0]
        f0 = pos.iloc[0]; f1 = pos.iloc[-1]
        w(f"- Primer período con total > 0: **{int(f0['AÑO'])}-{int(f0['MES']):02d}**; último período con total > 0: **{int(f1['AÑO'])}-{int(f1['MES']):02d}**")
        w(f"- Último período listado en la hoja: {int(df.iloc[-1]['AÑO'])}-{int(df.iloc[-1]['MES']):02d} (los meses posteriores al último con datos vienen en 0)")
        ult2 = pos.tail(2)
        w(f"- **Últimos dos períodos con datos (los marcados como provisorios):** " + ", ".join(f"{int(a)}-{int(m):02d}" for a, m in zip(ult2['AÑO'], ult2['MES'])))
        # consistencia suma provincias vs total (no aplica a precios: no son aditivos)
        if "precios" not in ws.title.lower():
            parts = [c for c in valcols if c != tot]
            dif = (num[parts].sum(axis=1) - num[tot]).abs()
            mal = dif > 0.01 * num[tot].abs().clip(lower=1)
            w(f"- Consistencia: suma de columnas vs `{tot}` — filas con diferencia > 1%: {int(mal.sum())}")
            for i in df.index[mal][:8]:
                w(f"  - {int(df.at[i,'AÑO'])}-{int(df.at[i,'MES']):02d}: suma columnas = {num.loc[i, parts].sum():,.1f}, `{tot}` = {num.at[i, tot]:,.1f}")
        else:
            w("- (precios: no se verifica suma de columnas, no es aditivo; `TOTAL` es un promedio)")
        # ceros en meses intermedios
        mid = df[(df['AÑO'] * 100 + df['MES'] >= int(f0['AÑO']) * 100 + int(f0['MES'])) & (df['AÑO'] * 100 + df['MES'] <= int(f1['AÑO']) * 100 + int(f1['MES']))]
        z = mid[pd.to_numeric(mid[tot], errors="coerce") == 0]
        w(f"- Meses con total = 0 *dentro* del rango con datos: {len(z)}")
    return res


def audit_reservas(path):
    w("\n## Reservas al 31/12/2025")
    w(f"- **Archivo:** `{Path(path).relative_to(RAIZ).as_posix()}`")
    w(f"- **Tamaño:** {mb(path)}; formato Excel (.xlsx)")
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    w(f"- **Hojas:** {[ws.title for ws in wb.worksheets]}")
    out = {}
    for ws in wb.worksheets:
        rows = list(ws.iter_rows(values_only=True))
        titulo = [str(c) for c in rows[0] if c][0]
        # encabezados multinivel (filas 3-6) -> nombres de columna
        h3, h4, h5, h6 = rows[2], rows[3], rows[4], rows[5]
        nombres = []
        a3 = a4 = a5 = None
        for j in range(len(rows[6])):
            if h3[j]:
                a3, a4, a5 = h3[j], None, None
            if h4[j]:
                a4, a5 = h4[j], None
            if h5[j]:
                a5 = h5[j]
            if j < 5:
                nombres.append(str(rows[6][j]).strip())
            else:
                nombres.append(f"{a3}|{a4}|{a5}|{h6[j]}")
        # tomar las filas 6(unidades) = rows[6]
        data = [r for r in rows[7:] if any(c is not None for c in r)]
        df = pd.DataFrame(data, columns=nombres)
        es_total = df.iloc[:, 0].astype(str).str.strip().str.upper() == "TOTAL"
        fila_total = df[es_total]
        df = df[~es_total].reset_index(drop=True)
        out[ws.title] = df
        w(f"\n### Hoja `{ws.title}` — «{titulo}»")
        w(f"- Filas de datos: {len(df)} (más {len(fila_total)} fila 'TOTAL' al final de la hoja, que se excluye de los cálculos para no duplicar); columnas: {len(df.columns)}")
        if len(fila_total):
            s_calc = df.iloc[:, 5:].apply(pd.to_numeric, errors="coerce").sum()
            s_tot = fila_total.iloc[0, 5:].astype(float)
            w(f"- Suma de filas vs fila TOTAL: columnas con diferencia > 1: {int(((s_calc - s_tot).abs() > 1).sum())} de {len(s_tot)}")
        w(f"- Unidades (fila 7 de la hoja): petróleo `{rows[6][5]}`, gas `{rows[6][6]}`")
        w("- Estructura de columnas numéricas (bloque|tipo|categoría|PET/GAS): " + "; ".join(nombres[5:11]) + " ...")
        w(f"- Columnas de texto: {nombres[:5]}")
        num = df.iloc[:, 5:].apply(pd.to_numeric, errors="coerce")
        w(f"- Valores no numéricos: {int(num.isna().sum().sum() - df.iloc[:, 5:].isna().sum().sum())}; vacíos: {int(df.iloc[:, 5:].isna().sum().sum())}; negativos: {int((num < 0).sum().sum())}")
        w(f"- Filas de texto vacías (operador/yacimiento): {int(df.iloc[:, :5].isna().any(axis=1).sum())}")
        for c in nombres[:5]:
            nd = df[c].nunique()
            w(f"- `{c}`: {nd} valores distintos; ej. {df[c].dropna().astype(str).str.strip().unique()[:3].tolist()}")
        for c in nombres[:5]:
            s = df[c].dropna().astype(str)
            norm = s.map(lambda x: re.sub(r"\s+", " ", x.strip()).lower())
            grp = s.groupby(norm).nunique()
            bad = grp[grp > 1]
            esp = int((s != s.str.strip()).sum())
            w(f"  - `{c}`: espacios sobrantes en {esp} filas; {len(bad)} grupos con variantes de escritura" + (f" ej. {[s[norm==k].unique().tolist()[:4] for k in bad.index[:2]]}" if len(bad) else ""))
        dups = df.duplicated(subset=nombres[:5], keep=False).sum()
        w(f"- Filas con clave (operador, cuenca, provincia, concesión, yacimiento) repetida: {int(dups)}")
        w(f"- Columnas numéricas completas: {nombres[5:]}")
        # negativos: dónde
        neg = num.lt(0)
        for i, j in zip(*neg.values.nonzero()):
            w(f"  - ⚠️ valor negativo: {df.iloc[i, 3]} / {df.iloc[i, 4]} ({df.iloc[i, 0]}), columna `{nombres[5 + j]}` = {num.iat[i, j]}")
        # fila de texto vacía
        vac = df[df.iloc[:, :5].isna().any(axis=1)]
        for i in vac.index[:3]:
            w(f"  - fila con texto faltante (índice {i}): {df.loc[i].iloc[:5].tolist()}")
        # coherencia: conv + no conv = total
        cols = nombres[5:]
        pares = [(c, c.replace("CONVENCIONAL|", "NO CONVENCIONAL|", 1), c.replace("CONVENCIONAL|", "CONVENCIONAL + NO CONVENCIONAL|", 1))
                 for c in cols if c.startswith("CONVENCIONAL|")]
        malos = 0
        for c_conv, c_nc, c_tot in pares:
            if c_nc in df.columns and c_tot in df.columns:
                d = (num[c_conv] + num[c_nc] - num[c_tot]).abs()
                malos += int((d > 0.5).sum())
        w(f"- Coherencia convencional + no convencional = total (celdas con diferencia > 0.5): {malos}")
        nc_c = [c for c in cols if c.startswith("NO CONVENCIONAL|RESERVAS|COMPROBADAS")]
        g = df.assign(**{c: num[c] for c in nc_c}).groupby("CUENCA")[nc_c].sum().round(1)
        w(f"- Suma NO CONVENCIONAL reservas COMPROBADAS por cuenca (PET en Mm3, GAS en MMm3):")
        w(md_tabla(g.reset_index()))
        nco = df[num[nc_c[0]] > 0]
        w(f"- Filas con NO CONVENCIONAL comprobadas PET > 0: {len(nco)}; provincias: {nco['PROVINCIA'].value_counts().to_dict()}")
        w(f"- Mayores yacimientos NC por reserva comprobada de petróleo:")
        top = df.assign(nc_pet=num[nc_c[0]], nc_gas=num[nc_c[1]]).sort_values("nc_pet", ascending=False).head(8)
        w(md_tabla(top[["OPERADOR", "CUENCA", "PROVINCIA", "CONCESIÓN O PERMISO", "YACIMIENTO", "nc_pet", "nc_gas"]]))
    if len(out) == 2:
        a, b = out.values()
        k = ["OPERADOR", "CUENCA", "PROVINCIA", "CONCESIÓN O PERMISO", "YACIMIENTO"]
        m = a.merge(b, on=k, suffixes=("_conc", "_vida"))
        c = [x for x in a.columns[5:]]
        nconc = pd.to_numeric(m[c[0] + "_conc"], errors="coerce"); nvida = pd.to_numeric(m[c[0] + "_vida"], errors="coerce")
        w(f"\n- Comparación hojas (mismas filas): {len(m)} filas emparejadas por clave; "
          f"CONV comprobadas PET: filas donde vida útil > concesión: {int((nvida > nconc + 1e-9).sum())}, menor: {int((nvida < nconc - 1e-9).sum())}, igual: {int((nvida == nconc).sum())}")
        w(f"- Total CONV+NC comprobadas PET — fin de concesión: {pd.to_numeric(a[c[16]], errors='coerce').sum():,.0f} Mm3 | fin de vida útil: {pd.to_numeric(b[c[16]], errors='coerce').sum():,.0f} Mm3")
    return out


# =====================================================================
def tarea3():
    w("\n\n# EVIDENCIA PARA LAS VERIFICACIONES ESPECÍFICAS (Tarea 3)")
    P = lambda p: str(p).replace("\\", "/")
    con.execute(f"CREATE OR REPLACE VIEW nc AS SELECT * FROM read_csv('{P(F_NOCONV)}', header=true, sample_size=-1)")
    con.execute(f"CREATE OR REPLACE VIEW pad AS SELECT * FROM read_csv('{P(F_PADRON)}', header=true, sample_size=-1)")
    con.execute(f"CREATE OR REPLACE VIEW yac AS SELECT * FROM read_csv('{P(F_YAC)}', header=true, sample_size=-1)")
    con.execute(f"CREATE OR REPLACE VIEW fr AS SELECT * FROM read_csv('{P(F_FRACT)}', header=true, sample_size=-1)")

    w("\n## C-IV · Valores distintos de columnas de formación / recurso (no convencional)")
    for c in ["formacion", "formprod", "tipo_de_recurso", "sub_tipo_recurso", "clasificacion", "subclasificacion", "proyecto", "cuenca", "provincia", "tipopozo", "tipoestado", "tipoextraccion"]:
        w(f"\n**nc.`{c}`**")
        w(md_tabla(val_counts("nc", c, 80)))
    w("\n## C-IV · Valores distintos en yacimiento (yac)")
    for c in ["tipo_de_recurso", "cuenca", "provincia"]:
        w(f"\n**yac.`{c}`**")
        w(md_tabla(val_counts("yac", c, 40)))
    w("\n**yac.`formacion`** (top 80 por filas)")
    w(md_tabla(val_counts("yac", "formacion", 80)))
    w("\nVariantes de 'vaca muerta' en yac.formacion:")
    w(md_tabla(qdf("SELECT formacion, tipo_de_recurso, count(*) filas FROM yac WHERE lower(formacion) LIKE '%vaca%' GROUP BY 1,2 ORDER BY 3 DESC")))
    w("\nVariantes de 'vaca muerta' en nc.formacion / formprod:")
    w(md_tabla(qdf("SELECT formacion, formprod, sub_tipo_recurso, count(*) filas, count(DISTINCT idpozo) pozos FROM nc WHERE lower(formacion) LIKE '%vaca%' OR lower(formprod) LIKE '%vaca%' OR upper(formprod) IN ('VMUT','VM') GROUP BY 1,2,3 ORDER BY 4 DESC")))
    w("\nRelación formprod (sigla) ↔ formacion (nombre) en nc, top 60:")
    w(md_tabla(qdf("SELECT formprod, formacion, count(*) filas FROM nc GROUP BY 1,2 ORDER BY 3 DESC LIMIT 60")))

    w("\n## C-IV · Unidades (no hay metadatos en el CSV: se infieren de la serie histórica)")
    w("Comparación producción nc (suma mensual, todos los pozos NO CONVENCIONAL cuenca NEUQUINA) vs serie histórica:")
    w(md_tabla(qdf("""SELECT anio, mes, round(sum(prod_pet),1) nc_prod_pet, round(sum(prod_gas),1) nc_prod_gas, count(DISTINCT idpozo) pozos
                      FROM nc WHERE anio=2024 AND mes IN (1,6,12) GROUP BY 1,2 ORDER BY 1,2""")))
    w("Serie histórica petróleo (2024-01, 2024-06, 2024-12):")
    w(md_tabla(qdf(f"SELECT * FROM read_csv('{P(F_SERIE_PET)}') WHERE indice_tiempo IN ('2024-01','2024-06','2024-12')")))
    w("Serie histórica gas (2024-01, 2024-06, 2024-12):")
    w(md_tabla(qdf(f"SELECT * FROM read_csv('{P(F_SERIE_GAS)}') WHERE indice_tiempo IN ('2024-01','2024-06','2024-12')")))

    w("\n## C-IV · Agua")
    w("Columnas con 'agua' en nc: prod_agua, iny_agua; en yac: suma_prod_agua, suma_iny_agua; en fractura: agua_inyectada_m3")
    w(md_tabla(qdf("""SELECT min(prod_agua) mn, max(prod_agua) mx, round(avg(prod_agua),2) prom, count(*) FILTER (WHERE prod_agua<0) neg,
                      count(*) FILTER (WHERE prod_agua IS NULL) nulos, count(*) FILTER (WHERE prod_agua=0) ceros FROM nc""")))

    w("\n## C-IV · Pozos únicos de Vaca Muerta (por formación 'vaca muerta' en formacion o formprod)")
    vm = "(lower(formacion) LIKE '%vaca%muerta%' OR upper(formprod) = 'VMUT')"
    w(md_tabla(qdf(f"SELECT count(DISTINCT idpozo) pozos_VM, min(anio) desde, max(anio) hasta, count(*) filas FROM nc WHERE {vm}")))
    w("Pozos VM por año (distintos con registro ese año):")
    w(md_tabla(qdf(f"SELECT anio, count(DISTINCT idpozo) pozos, round(sum(prod_pet),0) pet, round(sum(prod_gas),0) gas FROM nc WHERE {vm} GROUP BY 1 ORDER BY 1")))
    w("Pozos con filas VM y no-VM a la vez:")
    w(md_tabla(qdf(f"SELECT count(*) FROM (SELECT idpozo FROM nc GROUP BY 1 HAVING bool_or({vm}) AND NOT bool_and({vm}))")))
    w("Pozos únicos total en nc:")
    w(md_tabla(qdf("SELECT count(DISTINCT idpozo) pozos_total_nc, count(DISTINCT idpozo) FILTER (WHERE tipo_de_recurso='NO CONVENCIONAL') pozos_NC FROM nc")))

    w("\n## C-IV · Cruce producción ↔ coordenadas")
    w("Coordenadas dentro de nc: coordenadax, coordenaday (columnas del propio CSV)")
    w(md_tabla(qdf("""SELECT count(*) filas, count(*) FILTER (WHERE coordenadax IS NULL OR coordenaday IS NULL) sin_coord,
                      count(*) FILTER (WHERE coordenadax=0 OR coordenaday=0) coord_cero,
                      min(coordenadax) minx, max(coordenadax) maxx, min(coordenaday) miny, max(coordenaday) maxy FROM nc""")))
    w("Pozos con coordenadas distintas según el mes (ubicación inconsistente):")
    w(md_tabla(qdf("SELECT count(*) pozos_con_mas_de_1_coord FROM (SELECT idpozo FROM nc GROUP BY 1 HAVING count(DISTINCT (coordenadax, coordenaday)) > 1)")))
    return P


def tarea3_shp(g):
    w("\n## C-IV · Cruce con shapefile de pozos")
    w(f"Columnas del shapefile: {list(g.columns)}")
    cand = [c for c in g.columns if c.lower() in ("idpozo", "id_pozo", "pozo_id", "idpozo_", "identifica")]
    w(f"Columna candidata de unión con `idpozo`: {cand} (el nombre NO es explícito: se valida por coincidencia de valores)")
    return cand


def tarea3_cruce(g, cand):
    if not cand:
        return
    k = cand[0]
    ids_shp = pd.to_numeric(g[k], errors="coerce").dropna().astype("int64")
    con.register("shp_ids", pd.DataFrame({"idpozo": ids_shp.unique()}))
    w(f"\n`{k}` en shapefile: {len(g):,} filas, {ids_shp.nunique():,} ids únicos, nulos/no numéricos {int(g[k].isna().sum() + (len(g)-len(ids_shp)-g[k].isna().sum()))}, duplicados {int(ids_shp.duplicated().sum())}")
    w(md_tabla(qdf("""SELECT
        (SELECT count(DISTINCT idpozo) FROM nc) AS pozos_nc,
        (SELECT count(DISTINCT idpozo) FROM nc WHERE idpozo IN (SELECT idpozo FROM shp_ids)) AS nc_con_shp,
        (SELECT count(DISTINCT idpozo) FROM nc WHERE idpozo NOT IN (SELECT idpozo FROM shp_ids)) AS nc_SIN_shp,
        (SELECT count(*) FROM shp_ids WHERE idpozo NOT IN (SELECT DISTINCT idpozo FROM nc)) AS shp_sin_prod_nc""")))
    vm = "(lower(formacion) LIKE '%vaca%muerta%' OR upper(formprod) = 'VMUT')"
    w("Pozos Vaca Muerta (nc) sin geometría en shapefile / con coordenadas propias en el CSV:")
    w(md_tabla(qdf(f"""SELECT count(DISTINCT idpozo) pozos_VM,
        count(DISTINCT idpozo) FILTER (WHERE idpozo NOT IN (SELECT idpozo FROM shp_ids)) VM_sin_shp,
        count(DISTINCT idpozo) FILTER (WHERE coordenadax IS NULL OR coordenaday IS NULL) VM_sin_coord_csv FROM nc WHERE {vm}""")))
    w("Padrón (pad) vs shapefile vs nc:")
    w(md_tabla(qdf("""SELECT (SELECT count(DISTINCT idpozo) FROM pad) pad_ids, (SELECT count(*) FROM pad) pad_filas,
        (SELECT count(DISTINCT idpozo) FROM pad WHERE idpozo IN (SELECT idpozo FROM shp_ids)) pad_en_shp,
        (SELECT count(DISTINCT idpozo) FROM pad WHERE idpozo IN (SELECT idpozo FROM nc)) pad_en_nc,
        (SELECT count(DISTINCT idpozo) FROM nc WHERE idpozo IN (SELECT idpozo FROM pad)) nc_en_pad""")))


def tarea3_fractura():
    w("\n## Fractura · evidencia")
    w(md_tabla(qdf("""SELECT count(*) etapas_filas, count(DISTINCT idpozo) pozos, min(fecha_inicio_fractura) ini_min, max(fecha_inicio_fractura) ini_max,
        min(anio_if) anio_min, max(anio_if) anio_max FROM fr""")))
    w("Valores de tipo_reservorio / subtipo_reservorio / formacion_productiva / cuenca:")
    for c in ["tipo_reservorio", "subtipo_reservorio", "cuenca", "tipo_terminacion"]:
        w(f"\n**fr.`{c}`**")
        w(md_tabla(val_counts("fr", c, 30)))
    w("\n**fr.`formacion_productiva`** (top 40)")
    w(md_tabla(val_counts("fr", "formacion_productiva", 40)))
    w("\nAgua / arena / CO2 (resumen):")
    w(md_tabla(qdf("""SELECT round(min(agua_inyectada_m3),1) agua_min, round(max(agua_inyectada_m3),1) agua_max, round(median(agua_inyectada_m3),1) agua_mediana,
        count(*) FILTER (WHERE agua_inyectada_m3 <= 0 OR agua_inyectada_m3 IS NULL) agua_cero_o_nula,
        round(max(arena_bombeada_nacional_tn + arena_bombeada_importada_tn),1) arena_max_tn,
        count(*) FILTER (WHERE arena_bombeada_nacional_tn + arena_bombeada_importada_tn = 0) arena_cero FROM fr""")))
    w("Filas por año de inicio de fractura:")
    w(md_tabla(qdf("SELECT anio_if, count(*) etapas_filas, count(DISTINCT idpozo) pozos, round(sum(agua_inyectada_m3)) agua_m3, round(sum(arena_bombeada_nacional_tn+arena_bombeada_importada_tn)) arena_tn FROM fr GROUP BY 1 ORDER BY 1")))
    w("Unión con Capítulo IV (idpozo):")
    w(md_tabla(qdf("""SELECT count(DISTINCT idpozo) pozos_fractura,
        count(DISTINCT idpozo) FILTER (WHERE idpozo IN (SELECT idpozo FROM nc)) en_nc,
        count(DISTINCT idpozo) FILTER (WHERE idpozo IN (SELECT idpozo FROM pad)) en_padron,
        count(DISTINCT idpozo) FILTER (WHERE idpozo IN (SELECT idpozo FROM shp_ids)) en_shapefile FROM fr""")))
    vm = "(lower(formacion) LIKE '%vaca%muerta%' OR upper(formprod) = 'VMUT')"
    w("Pozos de fractura que son Vaca Muerta según nc:")
    w(md_tabla(qdf(f"SELECT count(DISTINCT idpozo) FROM fr WHERE idpozo IN (SELECT idpozo FROM nc WHERE {vm})")))
    w("Pozos VM (nc) que tienen datos de fractura:")
    w(md_tabla(qdf(f"SELECT count(DISTINCT idpozo) VM_pozos, count(DISTINCT idpozo) FILTER (WHERE idpozo IN (SELECT idpozo FROM fr)) VM_con_fractura FROM nc WHERE {vm}")))
    w("Duplicados de etapas (mismo pozo+fechas+agua):")
    w(md_tabla(qdf("""SELECT count(*) filas, count(*) - count(DISTINCT (idpozo, fecha_inicio_fractura, fecha_fin_fractura, agua_inyectada_m3, arena_bombeada_nacional_tn, cantidad_fracturas)) dup FROM fr""")))
    w("Fracturas con fecha_fin < fecha_inicio:")
    w(md_tabla(qdf("SELECT count(*) FROM fr WHERE fecha_fin_fractura < fecha_inicio_fractura")))


def extras(g, regalias):
    w("\n\n# HALLAZGOS ADICIONALES (chequeos cruzados)")
    vm = "(lower(formacion) LIKE '%vaca%muerta%' OR upper(formprod) = 'VMUT')"

    w("\n## Clave única en producción no convencional")
    w(md_tabla(qdf("SELECT count(*) filas, count(DISTINCT (idpozo, anio, mes)) combinaciones_pozo_mes FROM nc")))

    w("\n## Vaca Muerta: cuenca/provincia/tipo de pozo/empresa (por pozo)")
    for c in ["cuenca", "provincia", "tipopozo", "sub_tipo_recurso"]:
        w(f"\n**VM por `{c}`** (pozos distintos)")
        w(md_tabla(qdf(f"SELECT {c} AS valor, count(DISTINCT idpozo) pozos FROM nc WHERE {vm} GROUP BY 1 ORDER BY 2 DESC")))
    w("\n**VM por empresa (top 15, pozos distintos en el último mes con dato de cada pozo)**")
    w(md_tabla(qdf(f"""SELECT empresa, count(*) pozos FROM (SELECT idpozo, arg_max(empresa, anio*100+mes) empresa FROM nc WHERE {vm} GROUP BY 1)
                      GROUP BY 1 ORDER BY 2 DESC LIMIT 15""")))
    w("Pozos VM cuya empresa o tipo de pozo cambia a lo largo del tiempo:")
    w(md_tabla(qdf(f"""SELECT count(*) FILTER (WHERE ne > 1) cambian_empresa, count(*) FILTER (WHERE nt > 1) cambian_tipopozo, count(*) total
                      FROM (SELECT idpozo, count(DISTINCT empresa) ne, count(DISTINCT tipopozo) nt FROM nc WHERE {vm} GROUP BY 1)""")))

    w("\n## Vaca Muerta: año de primera producción según padrón (más fiable que el primer año en el CSV)")
    w(md_tabla(qdf(f"""SELECT p.anio, count(*) pozos_VM_primera_prod FROM pad p WHERE p.idpozo IN (SELECT DISTINCT idpozo FROM nc WHERE {vm}) GROUP BY 1 ORDER BY 1""")))
    w("Pozos del padrón con primera producción en 2006-01 (posible corte de la serie en el inicio):")
    w(md_tabla(qdf("SELECT count(*) FILTER (WHERE anio=2006 AND mes=1) en_2006_01, count(*) FILTER (WHERE anio=2006) en_2006, count(*) total FROM pad")))
    w("Pozos NC (nc) que NO están en el padrón:")
    w(md_tabla(qdf("SELECT count(DISTINCT idpozo) FROM nc WHERE idpozo NOT IN (SELECT idpozo FROM pad)")))
    w("Pozos con producción de VM antes de su fecha de primera producción del padrón:")
    w(md_tabla(qdf(f"""SELECT count(DISTINCT n.idpozo) FROM nc n JOIN pad p USING (idpozo) WHERE {vm.replace('formacion','n.formacion').replace('formprod','n.formprod')} AND n.anio*100+n.mes < p.anio*100+p.mes""")))

    w("\n## Coherencia de unidades y valores de la producción")
    w("Días de operación `tef` > 31 y otros valores raros:")
    w(md_tabla(qdf("""SELECT count(*) FILTER (WHERE tef > 31) tef_mayor_31, count(*) FILTER (WHERE prod_pet < 0 OR prod_gas < 0) negativos,
                      count(*) FILTER (WHERE profundidad > 8000) prof_mayor_8000m, count(*) FILTER (WHERE profundidad = 0) prof_cero,
                      count(*) FILTER (WHERE prod_pet > 0 AND tef = 0) prod_con_tef_cero FROM nc""")))
    w("Valores negativos de producción:")
    w(md_tabla(qdf("SELECT idpozo, anio, mes, prod_pet, prod_gas FROM nc WHERE prod_pet < 0 OR prod_gas < 0")))
    w("Comparación con la serie histórica (cuenca neuquina+resto, total no convencional): nc vs shale+tight")
    w(md_tabla(qdf(f"""SELECT t.indice_tiempo, round(n.pet,1) nc_pet, round(s.shale+s.tight,1) serie_pet_shale_mas_tight,
                      round(n.gas,1) nc_gas, round(g.produccion_shale_gas+g.produccion_tight_gas,1) serie_gas_shale_mas_tight
                      FROM (SELECT '2024-01' AS indice_tiempo UNION ALL SELECT '2020-06' UNION ALL SELECT '2025-12') t
                      JOIN (SELECT printf('%04d-%02d', anio, mes) k, sum(prod_pet) pet, sum(prod_gas) gas FROM nc GROUP BY 1) n ON n.k = t.indice_tiempo
                      JOIN read_csv('{str(F_SERIE_PET).replace(chr(92), '/')}') s ON s.indice_tiempo = t.indice_tiempo
                      JOIN read_csv('{str(F_SERIE_GAS).replace(chr(92), '/')}') g ON g.indice_tiempo = t.indice_tiempo""")))
    w("Consistencia kbbl_diario: total*6.2898/días/1000 vs columna (2024-01):")
    w(md_tabla(qdf(f"SELECT indice_tiempo, total, kbbl_diario, round(total*6.28981/31/1000,2) calculado FROM read_csv('{str(F_SERIE_PET).replace(chr(92), '/')}') WHERE indice_tiempo='2024-01'")))
    w("Última fila de las series históricas:")
    w(md_tabla(qdf(f"SELECT * FROM read_csv('{str(F_SERIE_PET).replace(chr(92), '/')}') ORDER BY indice_tiempo DESC LIMIT 2")))
    w(md_tabla(qdf(f"SELECT indice_tiempo, produccion_gas_natural_total, produccion_shale_gas, produccion_tight_gas, participacion_no_convencional FROM read_csv('{str(F_SERIE_GAS).replace(chr(92), '/')}') ORDER BY indice_tiempo DESC LIMIT 2")))
    w("Producción NC en yacimiento (yac, redondeada a enteros) vs nc, 2024-01:")
    w(md_tabla(qdf("""SELECT (SELECT sum(suma_prod_pet) FROM yac WHERE anio=2024 AND mes=1 AND tipo_de_recurso='NO CONVENCIONAL') yac_nc_pet,
                      (SELECT sum(prod_pet) FROM nc WHERE anio=2024 AND mes=1) nc_pet,
                      (SELECT sum(suma_prod_gas) FROM yac WHERE anio=2024 AND mes=1 AND tipo_de_recurso='NO CONVENCIONAL') yac_nc_gas,
                      (SELECT sum(prod_gas) FROM nc WHERE anio=2024 AND mes=1) nc_gas""")))
    w("yac: último período y cobertura de `anio_primera_prod`:")
    w(md_tabla(qdf("SELECT max(anio*100+mes) ultimo, min(anio_primera_prod) primera_min, count(*) FILTER (WHERE anio_primera_prod*100+mes_primera_prod > anio*100+mes) primera_posterior_a_produccion FROM yac")))
    w("yac: el campo `cuenca` tiene el valor 'NORESTE' (probable error de tipeo de 'NOROESTE'):")
    w(md_tabla(qdf("SELECT provincia, areayacimiento, count(*) filas FROM yac WHERE cuenca='NORESTE' GROUP BY 1,2 ORDER BY 3 DESC LIMIT 5")))

    w("\n## Coordenadas: ejes invertidos (longitud/latitud intercambiadas)")
    w("En Argentina continental: longitud ≈ -74 a -53, latitud ≈ -55 a -21. Se considera 'invertido' si x > -53 (parece latitud) y y < -55 (parece longitud) o si x > -45.")
    w(md_tabla(qdf("""SELECT count(DISTINCT idpozo) pozos, count(DISTINCT idpozo) FILTER (WHERE coordenadax > -45 AND coordenaday < -55) pozos_con_x_y_invertidos,
                      count(DISTINCT idpozo) FILTER (WHERE coordenadax < -80 OR coordenadax > -20 OR coordenaday < -80 OR coordenaday > -20) fuera_de_rango FROM nc""")))
    w("Pozos VM con ejes invertidos:")
    w(md_tabla(qdf(f"SELECT count(DISTINCT idpozo) FROM nc WHERE {vm} AND coordenadax > -45 AND coordenaday < -55")))
    w("Ejemplos de pozos invertidos (nc):")
    w(md_tabla(qdf("SELECT DISTINCT idpozo, sigla, provincia, coordenadax, coordenaday FROM nc WHERE coordenadax > -45 AND coordenaday < -55 LIMIT 5")))
    xs, ys = g.geometry.x, g.geometry.y
    inv = (xs > -45) & (ys < -55)
    w(f"\nShapefile de pozos: {int(inv.sum()):,} de {len(g):,} puntos con x/y invertidos ({100*inv.mean():.2f}%); "
      f"x en [{xs.min():.3f}, {xs.max():.3f}], y en [{ys.min():.3f}, {ys.max():.3f}]")
    w("Por provincia (shapefile, puntos invertidos):")
    w(md_tabla(g[inv].groupby("PROVINCIA").size().reset_index(name="puntos")))
    # nc vs shp: ¿coinciden las coordenadas?
    shp = pd.DataFrame({"idpozo": g["IDENTIFICA"].astype("int64"), "sx": xs, "sy": ys})
    con.register("shp_xy", shp)
    w("Coordenadas del CSV (nc) vs geometría del shapefile (por pozo):")
    w(md_tabla(qdf("""SELECT count(*) pozos,
        count(*) FILTER (WHERE abs(n.x - s.sx) < 1e-4 AND abs(n.y - s.sy) < 1e-4) iguales,
        count(*) FILTER (WHERE abs(n.x - s.sy) < 1e-4 AND abs(n.y - s.sx) < 1e-4) iguales_pero_invertidas,
        count(*) FILTER (WHERE abs(n.x - s.sx) >= 1e-4 OR abs(n.y - s.sy) >= 1e-4) distintas
        FROM (SELECT idpozo, any_value(coordenadax) x, any_value(coordenaday) y FROM nc GROUP BY 1) n JOIN shp_xy s USING (idpozo)""")))

    w("\n## Fractura: valores extremos y calidad")
    w("Mayores valores de agua / presión / potencia (posibles errores de carga):")
    w(md_tabla(qdf("""SELECT idpozo, sigla, anio_if, cantidad_fracturas etapas, agua_inyectada_m3, arena_bombeada_nacional_tn + arena_bombeada_importada_tn arena_tn,
                      presion_maxima_psi, potencia_equipos_fractura_hp FROM fr ORDER BY agua_inyectada_m3 DESC LIMIT 5""")))
    w(md_tabla(qdf("""SELECT count(*) FILTER (WHERE presion_maxima_psi > 25000) presion_gt_25000psi, count(*) FILTER (WHERE potencia_equipos_fractura_hp > 100000) potencia_gt_100000hp,
                      count(*) FILTER (WHERE agua_inyectada_m3 > 100000) agua_gt_100000m3, count(*) FILTER (WHERE fecha_inicio_fractura > current_date) inicio_en_el_futuro,
                      count(*) FILTER (WHERE agua_inyectada_m3 = 0) agua_cero, count(*) FILTER (WHERE agua_inyectada_m3 > 0 AND cantidad_fracturas > 0 AND agua_inyectada_m3/cantidad_fracturas > 5000) agua_por_etapa_gt_5000m3 FROM fr""")))
    w("Fechas de inicio en el futuro (hoy = " + str(pd.Timestamp.today().date()) + "):")
    w(md_tabla(qdf("SELECT idpozo, sigla, fecha_inicio_fractura, fecha_fin_fractura, fecha_data FROM fr WHERE fecha_inicio_fractura > current_date LIMIT 8")))
    w("Pozos con más de una fila de fractura:")
    w(md_tabla(qdf("SELECT count(*) pozos_con_mas_de_una, max(n) max_filas FROM (SELECT idpozo, count(*) n FROM fr GROUP BY 1 HAVING count(*) > 1)")))
    w("¿`anio`/`mes` coinciden con anio_if/mes_if o con fecha de carga?")
    w(md_tabla(qdf("""SELECT count(*) FILTER (WHERE anio=anio_if AND mes=mes_if) igual_inicio, count(*) FILTER (WHERE anio=anio_ff AND mes=mes_ff) igual_fin,
                      count(*) FILTER (WHERE anio=anio_carga AND mes=mes_carga) igual_carga, count(*) total FROM fr""")))
    w("Fractura VM: agua por año (solo pozos VM en nc) y cobertura:")
    w(md_tabla(qdf(f"""SELECT f.anio_if anio, count(DISTINCT f.idpozo) pozos, round(sum(f.agua_inyectada_m3)) agua_m3, round(sum(f.arena_bombeada_nacional_tn+f.arena_bombeada_importada_tn)) arena_tn
                      FROM fr f WHERE f.idpozo IN (SELECT idpozo FROM nc WHERE {vm}) GROUP BY 1 ORDER BY 1""")))
    w("Pozos con fractura según tipo_reservorio, pero que NO están en nc (producción NC):")
    w(md_tabla(qdf("""SELECT tipo_reservorio, subtipo_reservorio, count(DISTINCT idpozo) pozos FROM fr WHERE idpozo NOT IN (SELECT idpozo FROM nc) GROUP BY 1,2 ORDER BY 3 DESC""")))

    w("\n## Regalías: peso de cada producto (últimos 12 meses con datos y 2025)")
    tot = {}
    for k, hojas in regalias.items():
        reg = [v for n, v in hojas.items() if "regal" in n.lower()][0]
        prod = [v for n, v in hojas.items() if "prod" in n.lower()][0]
        pre = [v for n, v in hojas.items() if "prec" in n.lower()][0]
        tcol = [c for c in reg.columns if "TOTAL" in c.upper()][0]
        pcol = [c for c in prod.columns if "TOTAL" in c.upper()][0]
        r = reg[reg[tcol] > 0]
        u12 = r.tail(14).head(12)  # evita los 2 provisorios
        a25 = reg[reg["AÑO"] == 2025]
        tot[k] = {
            "ult12_sin_provisorios": float(u12[tcol].sum()), "2025": float(a25[tcol].sum()),
            "vol_2025": float(prod[prod["AÑO"] == 2025][pcol].sum()),
            "neuquen_2025": float(a25["NEUQUEN"].sum()) if "NEUQUEN" in a25 else float("nan"),
            "periodos": f"{int(u12.iloc[0]['AÑO'])}-{int(u12.iloc[0]['MES']):02d} a {int(u12.iloc[-1]['AÑO'])}-{int(u12.iloc[-1]['MES']):02d}",
        }
    d = pd.DataFrame(tot).T
    d["moneda"] = {"crudo": "USD", "gas": "ARS", "gasolina": "USD", "glp": "ARS"}
    w(md_tabla(d.reset_index().rename(columns={"index": "producto"})))
    usd = d[d.moneda == "USD"]; ars = d[d.moneda == "ARS"]
    w(f"- En USD: gasolina/condensado = {100*usd.loc['gasolina','2025']/usd['2025'].sum():.2f}% de (crudo + gasolina) en 2025")
    w(f"- En ARS: GLP = {100*ars.loc['glp','2025']/ars['2025'].sum():.2f}% de (gas + GLP) en 2025")
    w("- Sumar USD con ARS requiere un tipo de cambio que NO viene en los archivos.")
    # GLP / gasolina Neuquén
    w("- Meses cubiertos por cada archivo y último con datos coincide en 2026-08 (los 4 archivos).")


def main():
    w("# Auditoría automática — detalle por archivo")
    w(f"_Generado por `scripts/auditoria.py`. Raíz del proyecto: `{RAIZ.name}`_")
    w("\n# PARTE A — Capítulo IV (CSV)")
    audit_csv(F_NOCONV, "Producción de pozos de gas y petróleo NO CONVENCIONAL")
    audit_csv(F_PADRON, "Padrón de pozos Capítulo IV (fecha de primera producción)")
    audit_csv(F_YAC, "Producción de petróleo y gas por yacimiento y antigüedad de pozo productivo")
    audit_csv(F_SERIE_GAS, "Serie histórica de gas natural por cuenca y subtipo de recurso")
    audit_csv(F_SERIE_PET, "Serie histórica de petróleo por cuenca y subtipo de recurso")
    w("\n# PARTE B — Fractura (Adjunto IV)")
    audit_csv(F_FRACT, "Datos de fractura de pozos (Adjunto IV)")
    w("\n# PARTE C — Shapefiles")
    g = audit_shp(F_SHP_POZOS, "Shapefile de pozos")
    gc = audit_shp(F_CUENCAS, "Cuencas sedimentarias (exploración de hidrocarburos)", encoding="utf-8")
    w("\n# PARTE D — Regalías (Excel)")
    regalias = {}
    for k, p in F_REGALIAS.items():
        regalias[k] = audit_regalias(k, p)
    w("\n# PARTE E — Reservas (Excel)")
    audit_reservas(F_RESERVAS)

    tarea3()
    cand = tarea3_shp(g)
    tarea3_cruce(g, cand)
    tarea3_fractura()
    extras(g, regalias)
    w("\n## Cuencas — nombres")
    campos = [c for c in gc.columns if c not in ("geometry", "GEOJSON")]
    w(md_tabla(gc[campos]))

    SALIDA.parent.mkdir(exist_ok=True)
    SALIDA.write_text("\n".join(OUT), encoding="utf-8")
    print(f"\n[OK] Escrito {SALIDA}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
