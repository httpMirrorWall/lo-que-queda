"""
Procesamiento de datos - Vaca Muerta (Contar con Datos 2026).

Lee SOLO desde datos/raw (nunca los modifica) y escribe en datos/procesados/:
    pozos_vm.json, serie_anual_vm.json, cuenca_neuquina.geojson
y un log de números/controles en docs/procesamiento_log.json (insumo de docs/metodologia_procesamiento.md).

Uso:  python scripts/procesar.py
Decisiones: ver docs/metodologia_procesamiento.md
"""
import datetime as dt
import json
import sys
from pathlib import Path

import duckdb
import geopandas as gpd
import numpy as np
import openpyxl
import pandas as pd
import shapely

RAIZ = Path(__file__).resolve().parent.parent
RAW = RAIZ / "datos" / "raw"
OUT = RAIZ / "datos" / "procesados"
LOG_PATH = RAIZ / "docs" / "procesamiento_log.json"

F_NOCONV = RAW / "capitulo_iv" / "produccin-de-pozos-de-gas-y-petrleo-no-convencional.csv"
F_SERIE_PET = RAW / "capitulo_iv" / "serie-histrica-de-produccin-de-petrleo-por-cuenca-y-sub-tipo-de-recurso-captulo-iv-.csv"
F_FRACT = RAW / "fractura" / "datos-de-fractura-de-pozos-de-hidrocarburos-adjunto-iv-actualizacin-diaria.csv"
F_CRUDO = RAW / "regalias" / "crudo" / "Informe Regalias CRUDO.xlsx"
F_GAS = RAW / "regalias" / "gas" / "Informe Regalias GAS.xlsx"
F_TC = RAW / "tipo_cambio" / "tc_bcra_a3500_mayorista_diario.csv"   # BCRA, tipo de cambio mayorista de referencia (Com. A 3500), ARS por USD
F_RESERVAS = RAW / "reservas" / "reservas al 31-12-2025.xlsx"
F_CUENCAS = RAW / "cuencas" / "exploracin-hidrocarburos-cuencas-sedimentarias-shp.shp"

# ---- parámetros fijados por la autora (decisiones 1-12) ----
FORMACION_VM = "vaca muerta"
ANIO_DESDE, ANIO_HASTA_COMPLETO = 2010, 2025
PROF_MIN_M, PROF_MAX_M = 1000, 8000   # rango válido de profundidad (m); fuera de rango o ausente -> mediana de VM
BBL_POR_M3 = 6.2898
# Reservas, IAPG y EIA: ver scripts/indicadores_petroleo.py (auditoría 14/10/2026)
IAE_ACUM_BBL_2025 = 722e6      # 722 millones de barriles (fuente externa)
ULTIMO_MES_DEFINITIVO = (2026, 8)   # último mes con precios/regalías que se usa en el cálculo (incluye provisorios)
ULTIMO_MES_PRECIOS_DEFINITIVOS = (2026, 6)   # el archivo de regalías marca como provisorios los dos últimos períodos (jul y ago 2026)
AGUA_EXCLUIDA_M3 = 537184.6

LOG = {}
P = lambda p: str(p).replace("\\", "/")


# ------------------------------------------------------------------ Excel
def leer_pivot(ws):
    """Tabla dinámica de regalías -> DataFrame año/mes/provincias (relleno del año hacia abajo)."""
    rows = list(ws.iter_rows(values_only=True))
    hdr_i = next(i for i, r in enumerate(rows) if r and r[0] == "AÑO")
    hdr = [str(c).strip() if c is not None else None for c in rows[hdr_i]]
    keep = [j for j, h in enumerate(hdr) if h]
    data, anio = [], None
    for r in rows[hdr_i + 1:]:
        if all(c is None for c in r):
            continue
        if r[0] is not None:
            anio = r[0]
        if r[1] is None:
            continue
        data.append([anio] + [r[j] for j in keep[1:]])
    df = pd.DataFrame(data, columns=[hdr[j] for j in keep])
    df["AÑO"] = pd.to_numeric(df["AÑO"], errors="coerce")
    df["MES"] = pd.to_numeric(df["MES"], errors="coerce")
    return df.dropna(subset=["AÑO", "MES"]).astype({"AÑO": int, "MES": int}).reset_index(drop=True)


def leer_crudo_neuquen():
    wb = openpyxl.load_workbook(F_CRUDO, read_only=True, data_only=True)
    d = {}
    for clave, hoja in (("precio", "Tabla precios"), ("produccion", "Tabla producción"), ("regalias", "Tabla regalías")):
        df = leer_pivot(wb[hoja])
        d[clave] = df[["AÑO", "MES", "NEUQUEN"]].rename(columns={"AÑO": "anio", "MES": "mes", "NEUQUEN": clave})
        d[clave][clave] = pd.to_numeric(d[clave][clave], errors="coerce")
    m = d["precio"].merge(d["produccion"], on=["anio", "mes"]).merge(d["regalias"], on=["anio", "mes"])
    return m


def leer_gas_neuquen_y_tc():
    """Precio mensual del gas de NEUQUEN (ARS por Mm3, hoja 'Tabla precios') y tipo de cambio mensual (promedio simple de los días informados)."""
    wb = openpyxl.load_workbook(F_GAS, read_only=True, data_only=True)
    df = leer_pivot(wb["Tabla precios"])[["AÑO", "MES", "NEUQUEN"]].rename(columns={"AÑO": "anio", "MES": "mes", "NEUQUEN": "precio_gas_ars"})
    df["precio_gas_ars"] = pd.to_numeric(df.precio_gas_ars, errors="coerce")
    tc = pd.read_csv(F_TC, parse_dates=["fecha"])
    tcm = tc.groupby([tc.fecha.dt.year.rename("anio"), tc.fecha.dt.month.rename("mes")]).ars_por_usd_mayorista_a3500.agg(["mean", "count"]).reset_index()
    tcm.columns = ["anio", "mes", "tc", "tc_dias"]
    return df.merge(tcm, on=["anio", "mes"], how="left")


# ------------------------------------------------------------------ main
def main():
    OUT.mkdir(parents=True, exist_ok=True)
    con = duckdb.connect()

    # ---------------- 1. Producción VM (decisión 1)
    nc = con.execute(f"""
        SELECT idpozo, anio, mes, prod_pet, prod_gas, prod_agua, empresa, tipopozo, sigla, profundidad prof, coordenadax lon, coordenaday lat
        FROM read_csv('{P(F_NOCONV)}', header=true, sample_size=-1)
        WHERE lower(formacion) = '{FORMACION_VM}'""").df()
    pozos_vm = nc.idpozo.nunique()
    LOG["pozos_vm"] = int(pozos_vm)
    LOG["filas_vm"] = int(len(nc))
    LOG["ultimo_periodo_datos"] = [int(nc.anio.max()), int(nc[nc.anio == nc.anio.max()].mes.max())]
    ult_anio, ult_mes = LOG["ultimo_periodo_datos"]

    # ---------------- 5. Negativos -> 0
    neg = {c: int((nc[c] < 0).sum()) for c in ("prod_pet", "prod_gas", "prod_agua")}
    LOG["negativos_corregidos_a_cero"] = {**neg, "detalle": nc[(nc.prod_pet < 0) | (nc.prod_gas < 0)][["idpozo", "anio", "mes", "prod_pet", "prod_gas"]].to_dict("records")}
    for c in ("prod_pet", "prod_gas", "prod_agua"):
        nc[c] = nc[c].clip(lower=0)

    nc["periodo"] = nc.anio * 100 + nc.mes
    nc["produce"] = (nc.prod_pet > 0) | (nc.prod_gas > 0)

    # ---------------- coordenadas
    coords = nc.groupby("idpozo").agg(lon=("lon", "first"), lat=("lat", "first"), nlon=("lon", "nunique"), nlat=("lat", "nunique"))
    LOG["coordenadas"] = {
        "pozos_sin_coordenadas": int(coords[["lon", "lat"]].isna().any(axis=1).sum()),
        "pozos_con_mas_de_una_coordenada": int(((coords.nlon > 1) | (coords.nlat > 1)).sum()),
    }

    # ---------------- 2. Aparición = primer mes con prod_pet>0 o prod_gas>0
    prim = nc[nc.produce].groupby("idpozo").periodo.min()
    # ---------------- 4. Empresa/tipo = último mes con producción (si nunca produjo: último mes registrado)
    ult_prod = nc[nc.produce].sort_values("periodo").groupby("idpozo").tail(1).set_index("idpozo")
    ult_any = nc.sort_values("periodo").groupby("idpozo").tail(1).set_index("idpozo")
    base = ult_any.copy()
    base.loc[ult_prod.index, ["empresa", "tipopozo", "sigla"]] = ult_prod[["empresa", "tipopozo", "sigla"]]
    sin_prod = sorted(set(base.index) - set(prim.index))
    LOG["pozos_vm_sin_ninguna_produccion_positiva"] = {
        "cantidad": len(sin_prod),
        "nota": "Sin fecha de aparición: excluidos de pozos_vm.json por decisión de la autora",
        "idpozo_todos": [int(x) for x in sin_prod],
        
    }
    cambian_emp = nc.groupby("idpozo").empresa.nunique()
    cambian_tipo = nc.groupby("idpozo").tipopozo.nunique()
    LOG["atributos_cambiantes"] = {"pozos_que_cambian_empresa": int((cambian_emp > 1).sum()), "pozos_que_cambian_tipopozo": int((cambian_tipo > 1).sum()),
                                   "pozos_con_tipopozo_nulo_en_ultimo_mes_con_prod": int(base.loc[prim.index, "tipopozo"].isna().sum())}

    # ---------------- Producción anual por pozo y acumulados
    anios_serie = list(range(ANIO_DESDE, ult_anio + 1))
    pa = nc.groupby(["idpozo", "anio"])[["prod_pet", "prod_gas"]].sum()
    pet_y = pa.prod_pet.unstack(fill_value=0).reindex(columns=anios_serie, fill_value=0)
    gas_y = pa.prod_gas.unstack(fill_value=0).reindex(columns=anios_serie, fill_value=0)
    pet_ac = nc.groupby("idpozo").prod_pet.sum()
    gas_ac = nc.groupby("idpozo").prod_gas.sum()

    # acumulado total (TODAS las campañas desde 2006) por año, para % extraído
    pet_anio_total = nc.groupby("anio").prod_pet.sum()
    acum_pet = pet_anio_total.sort_index().cumsum()
    # acumulado a fin de 2025
    acum_2025_m3 = float(acum_pet.loc[2025])
    acum_total_m3 = float(acum_pet.loc[ult_anio])

    # ---------------- Serie anual: básicos
    ser = pd.DataFrame(index=anios_serie)
    ser["pozos_activos"] = nc[nc.produce].groupby("anio").idpozo.nunique().reindex(anios_serie).fillna(0).astype(int)
    ser["pozos_nuevos"] = (prim // 100).value_counts().reindex(anios_serie).fillna(0).astype(int)
    nuevos_antes = int((prim // 100 < ANIO_DESDE).sum())
    ser["pet_m3"] = nc.groupby("anio").prod_pet.sum().reindex(anios_serie)
    ser["gas_miles_m3"] = nc.groupby("anio").prod_gas.sum().reindex(anios_serie)
    ser["agua_producida_m3"] = nc.groupby("anio").prod_agua.sum().reindex(anios_serie)
    ser["pet_acum_m3"] = acum_pet.reindex(anios_serie)

    # ---------------- 10-11. % extraído y horizontes: los calcula scripts/indicadores_petroleo.py (se llama al final)

    # ---------------- 8. Valor del petróleo (USD)
    cn = leer_crudo_neuquen()
    mensual = nc.groupby(["anio", "mes"]).prod_pet.sum().reset_index().merge(cn[["anio", "mes", "precio"]], on=["anio", "mes"], how="left")
    mensual["definitivo"] = (mensual.anio * 100 + mensual.mes) <= (ULTIMO_MES_DEFINITIVO[0] * 100 + ULTIMO_MES_DEFINITIVO[1])
    mensual["valor_usd"] = np.where(mensual.definitivo, mensual.prod_pet * mensual.precio, np.nan)
    sin_precio = mensual[mensual.definitivo & (mensual.precio.isna() | (mensual.precio <= 0))]
    LOG["meses_vm_definitivos_sin_precio_o_precio_cero"] = sin_precio[["anio", "mes"]].values.tolist()
    ser["valor_usd"] = mensual.groupby("anio").valor_usd.sum(min_count=1).reindex(anios_serie)
    # valor acumulado histórico desde 2006 (misma metodología mensual; lo anterior a ANIO_DESDE no tiene fila propia)
    valor_previo_usd = float(mensual[mensual.anio < ANIO_DESDE].valor_usd.sum())
    ser["valor_acum_usd"] = valor_previo_usd + ser.valor_usd.fillna(0).cumsum()
    _pre = mensual[mensual.anio < ANIO_DESDE]
    LOG["valor_previo_anio_desde"] = {"usd": round(valor_previo_usd), "m3_petroleo": round(float(_pre.prod_pet.sum())),
        "meses_con_produccion": int((_pre.prod_pet > 0).sum()), "meses_con_produccion_sin_precio": int(((_pre.prod_pet > 0) & (_pre.precio.isna() | (_pre.precio <= 0))).sum()),
        "por_anio_usd": {int(a): round(float(v)) for a, v in _pre.groupby("anio").valor_usd.sum().items()}}


    # ---------------- 10. Valor del gas (USD): prod_gas VM mensual (Mm3) x precio gas NEUQUEN del mes (ARS/Mm3) / tipo de cambio mensual (ARS/USD)
    gn = leer_gas_neuquen_y_tc()
    gm = nc.groupby(["anio", "mes"]).prod_gas.sum().reset_index().merge(gn, on=["anio", "mes"], how="left")
    gm["definitivo"] = (gm.anio * 100 + gm.mes) <= (ULTIMO_MES_DEFINITIVO[0] * 100 + ULTIMO_MES_DEFINITIVO[1])
    gm["valor_gas_usd"] = np.where(gm.definitivo, gm.prod_gas * gm.precio_gas_ars / gm.tc, np.nan)
    _sp = gm[gm.definitivo & (gm.prod_gas > 0) & (gm.precio_gas_ars.isna() | (gm.precio_gas_ars <= 0) | gm.tc.isna())]
    LOG["meses_vm_definitivos_gas_sin_precio_o_tc"] = _sp[["anio", "mes"]].values.tolist()
    ser["valor_gas_usd"] = gm.groupby("anio").valor_gas_usd.sum(min_count=1).reindex(anios_serie)
    valor_gas_previo_usd = float(gm[gm.anio < ANIO_DESDE].valor_gas_usd.sum())
    ser["valor_gas_acum_usd"] = valor_gas_previo_usd + ser.valor_gas_usd.fillna(0).cumsum()
    _r = gm[(gm.anio == 2025) & (gm.mes == 8)].iloc[0]
    LOG["valor_gas"] = {"valor_previo_anio_desde_usd": round(valor_gas_previo_usd), "tc_fuente": "BCRA, tipo de cambio mayorista de referencia (Com. A 3500), promedio simple mensual de los días informados",
        "ejemplo_2025_08": {"prod_gas_Mm3": round(float(_r.prod_gas), 1), "precio_ars_por_Mm3": round(float(_r.precio_gas_ars), 2), "tc_ars_por_usd": round(float(_r.tc), 4),
                            "tc_dias": int(_r.tc_dias), "valor_ars": round(float(_r.prod_gas * _r.precio_gas_ars)), "valor_usd": round(float(_r.valor_gas_usd))}}

    # ---------------- 9. Regalías de crudo de Neuquén (provincia) y tasa efectiva
    cn["definitivo"] = (cn.anio * 100 + cn.mes) <= (ULTIMO_MES_DEFINITIVO[0] * 100 + ULTIMO_MES_DEFINITIVO[1])
    cn["valor_teorico"] = cn.produccion * cn.precio
    c9 = cn[cn.definitivo & cn.anio.isin(anios_serie)]
    g = c9.groupby("anio")
    ser["regalias_crudo_neuquen_usd"] = g.regalias.sum().reindex(anios_serie)
    ser["tasa_efectiva_pct"] = (g.regalias.sum() / g.valor_teorico.sum() * 100).reindex(anios_serie)
    ser["prod_crudo_neuquen_m3"] = g.produccion.sum().reindex(anios_serie)

    # ---------------- 6. Fractura
    fr = con.execute(f"SELECT * FROM read_csv('{P(F_FRACT)}', header=true, sample_size=-1)").df()
    LOG["fractura"] = {"filas_originales": int(len(fr))}
    claves = [c for c in fr.columns if c not in ("id_base_fractura_adjiv", "fecha_data", "anio_carga", "mes_carga")]
    dup = fr.duplicated(subset=claves, keep="first")
    LOG["fractura"]["duplicados_exactos_eliminados"] = int(dup.sum())
    LOG["fractura"]["criterio_duplicado"] = "igualdad en todas las columnas excepto id_base_fractura_adjiv, fecha_data, anio_carga, mes_carga"
    LOG["fractura"]["duplicados_detalle_idpozo"] = sorted(fr[dup].idpozo.astype(int).unique().tolist())
    fr = fr[~dup]
    ex = fr[np.isclose(fr.agua_inyectada_m3, AGUA_EXCLUIDA_M3, atol=0.005)]
    LOG["fractura"]["excluidos_agua_537184_6"] = {"registros": int(len(ex)), "idpozo": ex.idpozo.astype(int).tolist(), "siglas": ex.sigla.str.strip().tolist()}
    fr = fr[~fr.index.isin(ex.index)]
    hoy = pd.Timestamp(dt.date.today())
    fut = fr.fecha_inicio_fractura > hoy.date() if fr.fecha_inicio_fractura.dtype == object else fr.fecha_inicio_fractura > hoy
    LOG["fractura"]["inicio_en_el_futuro_reemplazado_por_fecha_fin"] = {
        "registros": int(fut.sum()), "fecha_referencia": str(hoy.date()),
        "siglas": fr[fut].sigla.str.strip().tolist(), "fecha_inicio_original": fr[fut].fecha_inicio_fractura.astype(str).tolist(),
        "fecha_fin_usada": fr[fut].fecha_fin_fractura.astype(str).tolist()}
    f_ref = pd.to_datetime(fr.fecha_inicio_fractura.where(~fut, fr.fecha_fin_fractura))
    fr = fr.assign(anio_frac=f_ref.dt.year, arena_t=fr.arena_bombeada_nacional_tn + fr.arena_bombeada_importada_tn)
    vm_ids = set(nc.idpozo.unique())
    frv = fr[fr.idpozo.isin(vm_ids)]
    LOG["fractura"]["registros_tras_limpieza"] = int(len(fr))
    LOG["fractura"]["registros_en_pozos_vm"] = int(len(frv))
    _fs = frv[frv.idpozo.isin(sin_prod)]
    LOG["fractura"]["registros_de_los_pozos_vm_sin_produccion"] = {"registros": int(len(_fs)), "pozos": int(_fs.idpozo.nunique()),
        "agua_m3": round(float(_fs.agua_inyectada_m3.sum())), "nota": "se mantienen en la serie de fractura (no se indicó excluirlos de ella)"}
    LOG["fractura"]["pozos_vm_con_fractura"] = int(frv.idpozo.nunique())
    LOG["fractura"]["registros_vm_fuera_del_periodo_de_la_serie"] = int((frv.anio_frac < ANIO_DESDE).sum())
    LOG["fractura"]["registros_vm_con_agua_cero"] = int((frv.agua_inyectada_m3 <= 0).sum())
    fy = frv.groupby(["idpozo", "anio_frac"])[["agua_inyectada_m3", "arena_t"]].sum().reset_index()
    LOG["fractura"]["combinaciones_pozo_anio"] = int(len(fy))
    ser["agua_fractura_m3"] = fy.groupby("anio_frac").agua_inyectada_m3.sum().reindex(anios_serie).fillna(0)
    ser["arena_t"] = fy.groupby("anio_frac").arena_t.sum().reindex(anios_serie).fillna(0)
    ser["pozos_fracturados"] = fy.groupby("anio_frac").idpozo.nunique().reindex(anios_serie).fillna(0).astype(int)

    # ---------------- Profundidad (valores 1.000-8.000 m; si no, mediana VM)
    prof_raw = nc.groupby("idpozo").prof.max()
    valida = prof_raw.between(PROF_MIN_M, PROF_MAX_M)
    prof_mediana = float(prof_raw[valida].median())
    prof_final = prof_raw.where(valida, prof_mediana)
    prof_estimada = set(prof_raw.index[~valida])
    exp = [i for i in prof_estimada if i not in set(sin_prod)]
    LOG["profundidad"] = {"mediana_vm_m": round(prof_mediana, 1), "rango_valido_m": [PROF_MIN_M, PROF_MAX_M],
                          "pozos_vm_total": int(len(prof_raw)), "pozos_con_profundidad_estimada": int(len(prof_estimada)),
                          "pozos_estimados_exportados": int(len(exp)),
                          "de_los_cuales_valor_cero_o_nulo": int((prof_raw.isna() | (prof_raw == 0))[~valida].sum()),
                          "de_los_cuales_fuera_de_rango_no_nulo": int(((prof_raw.notna()) & (prof_raw != 0))[~valida].sum())}

    def arr_miles(df, idp, miles=True):
        """Lista alineada con anios_serie; None (omitido) si todo es cero."""
        if idp not in df.index:
            return None
        v = df.loc[idp].tolist()
        v = [int(round(x / 1000)) if miles else int(round(x)) for x in v]
        return v if any(v) else None

    # valor (USD) por pozo-año: prod_pet mensual x precio del mes (solo meses definitivos)
    nc = nc.merge(cn[["anio", "mes", "precio"]], on=["anio", "mes"], how="left")
    nc["definitivo"] = (nc.anio * 100 + nc.mes) <= (ULTIMO_MES_DEFINITIVO[0] * 100 + ULTIMO_MES_DEFINITIVO[1])
    nc["valor_usd"] = np.where(nc.definitivo, nc.prod_pet * nc.precio.fillna(0), 0.0)
    nc = nc.merge(gn[["anio", "mes", "precio_gas_ars", "tc"]], on=["anio", "mes"], how="left")
    nc["valor_gas_usd"] = np.where(nc.definitivo, nc.prod_gas * nc.precio_gas_ars.fillna(0) / nc.tc.fillna(np.inf), 0.0)
    valg_y = nc.groupby(["idpozo", "anio"]).valor_gas_usd.sum().unstack(fill_value=0).reindex(columns=anios_serie, fill_value=0)
    usdg_pre = nc[nc.anio < ANIO_DESDE].groupby("idpozo").valor_gas_usd.sum()
    val_y = nc.groupby(["idpozo", "anio"]).valor_usd.sum().unstack(fill_value=0).reindex(columns=anios_serie, fill_value=0)
    usd_pre = nc[nc.anio < ANIO_DESDE].groupby("idpozo").valor_usd.sum()   # USD, producción anterior a ANIO_DESDE
    agp_pre = nc[nc.anio < ANIO_DESDE].groupby("idpozo").prod_agua.sum()   # m3 de agua producida antes de ANIO_DESDE (para que el acumulado parta de 2006)
    agp_y = nc.groupby(["idpozo", "anio"]).prod_agua.sum().unstack(fill_value=0).reindex(columns=anios_serie, fill_value=0)
    agf_y = fy.pivot_table(index="idpozo", columns="anio_frac", values="agua_inyectada_m3", aggfunc="sum", fill_value=0).reindex(columns=anios_serie, fill_value=0)
    are_y = fy.pivot_table(index="idpozo", columns="anio_frac", values="arena_t", aggfunc="sum", fill_value=0).reindex(columns=anios_serie, fill_value=0)

    # ---------------- pozos_vm.json
    empresas = sorted(base.empresa.dropna().unique().tolist())
    tipos = sorted(base.tipopozo.dropna().unique().tolist())
    e_idx = {e: i for i, e in enumerate(empresas)}
    t_idx = {t: i for i, t in enumerate(tipos)}
    recs = []
    for idp in sorted(set(base.index) - set(sin_prod)):  # los pozos sin producción positiva se excluyen del JSON
        b = base.loc[idp]
        p = prim.get(idp)
        recs.append({
            "id": int(idp),
            "sigla": str(b.sigla).strip(),
            "lon": round(float(coords.at[idp, "lon"]), 5),
            "lat": round(float(coords.at[idp, "lat"]), 5),
            "emp": e_idx.get(b.empresa, None),
            "tipo": t_idx.get(b.tipopozo, None),
            "anio": int(p // 100) if p == p and p is not None else None,
            "mes": int(p % 100) if p == p and p is not None else None,
            "pet_ac": int(round(pet_ac[idp])),
            "gas_ac": int(round(gas_ac[idp])),
            "prof": int(round(prof_final[idp])),
            "pet": [int(round(v)) for v in pet_y.loc[idp].tolist()],
            "gas": [int(round(v)) for v in gas_y.loc[idp].tolist()],
            "usd": arr_miles(val_y, idp),
            "usdg": arr_miles(valg_y, idp),
            "aguaf": arr_miles(agf_y, idp, miles=False),
            "arena": arr_miles(are_y, idp, miles=False),
            "aguap": arr_miles(agp_y, idp, miles=False),
        })
        if usd_pre.get(idp, 0) > 0:
            recs[-1]["usd_pre"] = int(round(usd_pre[idp] / 1000))
        if usdg_pre.get(idp, 0) > 0:
            recs[-1]["usdg_pre"] = int(round(usdg_pre[idp] / 1000))
        if agp_pre.get(idp, 0) > 0:
            recs[-1]["aguap_pre"] = int(round(agp_pre[idp]))
        if idp in prof_estimada:
            recs[-1]["prof_est"] = True
    pozos_json = {
        "meta": {
            "descripcion": "Pozos de Vaca Muerta (formacion = 'vaca muerta' en el CSV de producción no convencional)",
            "campos": {"id": "idpozo", "sigla": "sigla", "lon/lat": "grados decimales WGS84, 5 decimales", "emp": "índice en `empresas` (empresa del último mes con producción)",
                       "tipo": "índice en `tipos` (tipopozo del último mes con producción; null si vacío)", "anio/mes": "primer mes con prod_pet>0 o prod_gas>0",
                       "pet_ac": "petróleo acumulado 2006→último mes (m3, entero)", "gas_ac": "gas acumulado 2006→último mes (miles de m3, entero)",
                       "pet/gas": "producción anual alineada con `anios` (m3 / miles de m3)",
                       "prof": "profundidad (m). Solo valores entre 1.000 y 8.000 m; si falta o es inválida, mediana de los pozos VM y `prof_est: true`",
                       "usd": "valor del petróleo por año alineado con `anios`, en MILES de USD (prod_pet mensual x precio crudo Neuquén; 2026 solo hasta junio). Omitido si todo es 0",
                       "usdg": "valor del gas por año alineado con `anios`, en MILES de USD (prod_gas mensual x precio gas Neuquén en ARS / tipo de cambio mayorista A 3500 del mes; 2026 solo hasta junio). Omitido si todo es 0",
                       "usdg_pre": "valor del gas producido ANTES de 2010 (2006-2009), en MILES de USD, misma metodología mensual. Omitido si es 0",
                       "aguaf": "agua de fractura por año (m3). Omitido si todo es 0", "arena": "arena bombeada por año (t). Omitido si todo es 0",
                       "aguap": "agua producida por año (m3, supuesto). Omitido si todo es 0",
                       "aguap_pre": "agua producida ANTES de 2010 (2006-2009), m3 (supuesto). Omitido si es 0",
                       "usd_pre": "valor del petróleo producido ANTES de 2010 (2006-2009), en MILES de USD, misma metodología mensual (prod_pet x precio crudo Neuquén). Omitido si es 0", },
            "excluidos": f"{len(sin_prod)} pozos VM sin ninguna producción positiva (de {pozos_vm}); no están en este archivo",
            "anios": anios_serie,
            "parcial": {"anio": ult_anio, "ultimo_mes": ult_mes},
            "empresas": empresas,
            "tipos": tipos,
        },
        "pozos": recs,
    }
    (OUT / "pozos_vm.json").write_text(json.dumps(pozos_json, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    # ---------------- Serie JSON
    ult_mes_val = ULTIMO_MES_DEFINITIVO[1]
    filas = []
    for a, r in ser.iterrows():
        parcial = a == ult_anio and ult_mes < 12
        def v(x, nd=0):
            if x is None or (isinstance(x, float) and np.isnan(x)):
                return None
            return int(round(x)) if nd == 0 else round(float(x), nd)
        fila = {
            "anio": int(a),
            "parcial": bool(parcial),
            "ultimo_mes": ult_mes if parcial else 12,
            "pozos_activos": int(r.pozos_activos),
            "pozos_nuevos": int(r.pozos_nuevos),
            "petroleo_m3": v(r.pet_m3),
            "petroleo_bbl": v(r.pet_m3 * BBL_POR_M3),
            "gas_miles_m3": v(r.gas_miles_m3),
            "petroleo_acumulado_m3": v(r.pet_acum_m3),
            "petroleo_acumulado_bbl": v(r.pet_acum_m3 * BBL_POR_M3),
            # pct_extraido_reservas / pct_extraido_iapg: los agrega scripts/indicadores_petroleo.py
            "valor_petroleo_usd": v(r.valor_usd),
            "valor_acumulado_usd": v(r.valor_acum_usd),
            "valor_petroleo_usd_hasta_mes": (ult_mes_val if parcial else 12),
            "valor_gas_usd": v(r.valor_gas_usd),
            "valor_acumulado_gas_usd": v(r.valor_gas_acum_usd),
            "valor_gas_usd_hasta_mes": (ult_mes_val if parcial else 12),
            "agua_fractura_m3": v(r.agua_fractura_m3),
            "arena_t": v(r.arena_t),
            "pozos_fracturados": int(r.pozos_fracturados),
            "agua_producida_m3": v(r.agua_producida_m3),
            "regalias_crudo_neuquen_usd": v(r.regalias_crudo_neuquen_usd),
            "tasa_efectiva_pct": v(r.tasa_efectiva_pct, 2),
            "tasa_efectiva_aplicable_a_vm": False,
            "regalias_hasta_mes": (ult_mes_val if parcial else 12),
        }
        filas.append(fila)
    serie_json = {
        "meta": {
            "descripcion": "Serie anual de Vaca Muerta (pozos con formacion = 'vaca muerta').",
            "ultimo_periodo_datos": f"{ult_anio}-{ult_mes:02d}",
            "ultimo_mes_definitivo_precios_regalias": f"{ULTIMO_MES_PRECIOS_DEFINITIVOS[0]}-{ULTIMO_MES_PRECIOS_DEFINITIVOS[1]:02d}",
            "ultimo_mes_precios_regalias_usado": f"{ULTIMO_MES_DEFINITIVO[0]}-{ULTIMO_MES_DEFINITIVO[1]:02d}",
            "precios_provisorios_desde": "2026-07",
            "unidades": {"petroleo_m3": "m3", "petroleo_bbl": "barriles (1 m3 = 6,2898 bbl)", "gas_miles_m3": "miles de m3 (inferido)", "agua_*": "m3 (supuesto)",
                         "valor_petroleo_usd": "USD = prod_pet VM mensual x precio crudo NEUQUEN del mes (USD/m3)",
                         "valor_gas_usd": "USD = prod_gas VM mensual (Mm3) x precio gas NEUQUEN del mes (ARS/Mm3) / tipo de cambio mayorista de referencia A 3500 del mes (ARS/USD, promedio simple). Nunca se suma al valor del petróleo", "arena_t": "toneladas",
                         "regalias_crudo_neuquen_usd": "regalías de crudo de la provincia de Neuquén (incluye convencional), USD",
                         "tasa_efectiva_pct": "regalías / (producción crudo Neuquén x precio Neuquén) x 100. NO APLICABLE A VM hasta resolver la inconsistencia (ver docs/investigacion_regalias.md)"},
            "regalias_rotulo": "Regalías de crudo de la provincia de Neuquén (incluye convencional)",
            "valor_previo_usd": round(valor_previo_usd),
            "valor_gas_previo_usd": round(valor_gas_previo_usd),
            "valor_acumulado": f"El valor acumulado incluye 2006-{ANIO_DESDE - 1} (USD {round(valor_previo_usd):,} en total), con la misma metodología mensual; las filas anuales de valor empiezan en {ANIO_DESDE}. Limitación: los precios históricos tienen particularidades de la fuente (p. ej. precio repetido en sep-dic de 2008) y son nominales.",
            "acumulado": f"Incluye toda la producción desde 2006 (primer dato del CSV), no solo desde {ANIO_DESDE}.",
            "parcial": f"{ult_anio} es parcial (hasta {ult_anio}-{ult_mes:02d}); valor del petróleo, del gas y regalías de {ult_anio} hasta {ULTIMO_MES_DEFINITIVO[0]}-{ULTIMO_MES_DEFINITIVO[1]:02d}, con precios provisorios desde 2026-07 (definitivos hasta {ULTIMO_MES_PRECIOS_DEFINITIVOS[0]}-{ULTIMO_MES_PRECIOS_DEFINITIVOS[1]:02d}); sin «años restantes» por año (ver meta.indicadores_petroleo).",
            "pozos_nuevos_antes_del_periodo": nuevos_antes,
        },
        "anios": filas,
    }
    (OUT / "serie_anual_vm.json").write_text(json.dumps(serie_json, ensure_ascii=False, indent=1), encoding="utf-8")

    # ---------------- Polígono de la cuenca
    cu = gpd.read_file(F_CUENCAS, encoding="utf-8")
    neu = cu[cu.CUENCA == "NEUQUINA"][["CUENCA", "TIPO", "UBICACION", "geometry"]].copy()
    geom_orig = neu.geometry.iloc[0]
    tol = 0.01
    simp = shapely.set_precision(geom_orig.simplify(tol, preserve_topology=True), 0.0001)
    neu["geometry"] = [simp]
    neu.to_file(OUT / "cuenca_neuquina.geojson", driver="GeoJSON", COORDINATE_PRECISION=4)
    # controles de polígono
    pts = gpd.GeoSeries(gpd.points_from_xy(coords.lon, coords.lat), index=coords.index, crs=4326)
    dentro_orig = pts.within(geom_orig)
    dentro_simp = pts.within(simp)
    LOG["poligono"] = {"vertices_original": int(shapely.get_num_coordinates(geom_orig)), "vertices_simplificado": int(shapely.get_num_coordinates(simp)),
                       "tolerancia_grados": tol, "pozos_vm_dentro_original": int(dentro_orig.sum()), "pozos_vm_dentro_simplificado": int(dentro_simp.sum()),
                       "pozos_vm_fuera_simplificado": [int(i) for i in coords.index[~dentro_simp]], "pozos_vm_total": int(len(coords)), "pozos_exportados_dentro_simplificado": int(dentro_simp.drop(index=sin_prod).sum()), "pozos_exportados": int(len(coords) - len(sin_prod)),
                       "tamano_geojson_kb": round((OUT / "cuenca_neuquina.geojson").stat().st_size / 1024, 1)}

    # ---------------- Controles de calidad
    # a) vs serie histórica shale
    sh = con.execute(f"SELECT substr(indice_tiempo,1,4)::INT anio, sum(shale) shale_m3, count(*) meses FROM read_csv('{P(F_SERIE_PET)}') GROUP BY 1 ORDER BY 1").df().set_index("anio")
    cmp = []
    for a in anios_serie:
        vm_m3 = float(ser.at[a, "pet_m3"]); s = float(sh.at[a, "shale_m3"])
        cmp.append({"anio": a, "meses_serie": int(sh.at[a, "meses"]), "vm_m3": round(vm_m3), "serie_shale_m3": round(s), "dif_m3": round(vm_m3 - s), "dif_pct": round((vm_m3 - s) / s * 100, 3)})
    LOG["control_vs_serie_shale"] = cmp
    # b) acumulado vs IAE
    acum_bbl = acum_2025_m3 * BBL_POR_M3
    LOG["control_vs_iae"] = {"acumulado_vm_2025_bbl": round(acum_bbl), "iae_bbl": IAE_ACUM_BBL_2025, "dif_bbl": round(acum_bbl - IAE_ACUM_BBL_2025),
                             "dif_pct": round((acum_bbl - IAE_ACUM_BBL_2025) / IAE_ACUM_BBL_2025 * 100, 2)}
    LOG["tamanos_kb"] = {f: round((OUT / f).stat().st_size / 1024, 1) for f in ("pozos_vm.json", "serie_anual_vm.json", "cuenca_neuquina.geojson")}
    LOG["serie_2025"] = next(f for f in filas if f["anio"] == 2025)
    LOG["serie_2026"] = next(f for f in filas if f["anio"] == 2026) if any(f["anio"] == 2026 for f in filas) else None
    LOG["generado"] = str(dt.datetime.now().replace(microsecond=0))
    LOG_PATH.write_text(json.dumps(LOG, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
    print(json.dumps(LOG, ensure_ascii=False, indent=1, default=str))

    # % extraído y horizontes de referencia (reservas e IAPG), con alcance y fecha compatibles
    import indicadores_petroleo
    indicadores_petroleo.main()


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
