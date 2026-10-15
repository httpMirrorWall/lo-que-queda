"""
Investigación (solo lectura, no corrige nada): ¿por qué valor VM x tasa efectiva > regalías de TODO Neuquén?
Compara la producción de crudo de NEUQUEN del Excel de regalías con la del Capítulo IV.
Uso: python scripts/investigar_regalias.py   ->  imprime tablas y escribe docs/investigacion_regalias.md
"""
import sys
from pathlib import Path
import duckdb, openpyxl, pandas as pd
sys.path.insert(0, str(Path(__file__).resolve().parent))
import procesar as pr

P = pr.P
con = duckdb.connect()
wb = openpyxl.load_workbook(pr.F_CRUDO, read_only=True, data_only=True)
hojas = {k: pr.leer_pivot(wb[h]) for k, h in (("precio", "Tabla precios"), ("prod", "Tabla producción"), ("reg", "Tabla regalías"))}
nc = f"read_csv('{P(pr.F_NOCONV)}', header=true, sample_size=-1)"
YAC = pr.RAW / "capitulo_iv" / "produccin-de-petrleo-y-gas-captulo-iv-por-yacimiento-y-antigedad-de-pozo-productivo.csv"
yac = f"read_csv('{P(YAC)}', header=true, sample_size=-1)"
gas = pr.RAW / "regalias" / "gasolina" / "Informe Regalias GASOLINA-CONDENSADO.xlsx"
gwb = openpyxl.load_workbook(gas, read_only=True, data_only=True)
gprod = pr.leer_pivot(gwb["Tabla producción"])

out = []
def w(s=""):
    out.append(s); print(s)
def tabla(df):
    return "| " + " | ".join(df.columns) + " |\n|" + "---|" * len(df.columns) + "\n" + "\n".join("| " + " | ".join(str(v) for v in r) + " |" for r in df.values.tolist())

# anual
ex = hojas["prod"].groupby("AÑO").NEUQUEN.sum().rename("excel_crudo_neq")
exp = hojas["prod"].groupby("AÑO")["TOTAL PROVINCIA"].sum().rename("excel_crudo_pais")
reg = hojas["reg"].groupby("AÑO").NEUQUEN.sum().rename("regalias_usd_neq")
gs = gprod.groupby("AÑO").NEUQUEN.sum().rename("excel_gasolina_neq")
a = con.execute(f"""SELECT anio, sum(prod_pet) nc_neq, sum(prod_pet) FILTER (lower(formacion)='vaca muerta') nc_vm_neq,
    sum(prod_pet) FILTER (lower(formacion)='vaca muerta' AND provincia='Neuquén') nc_vm_en_neq FROM {nc} WHERE provincia='Neuquén' GROUP BY 1""").df().set_index("anio")
b = con.execute(f"""SELECT anio, sum(suma_prod_pet) yac_neq_total, sum(suma_prod_pet) FILTER (tipo_de_recurso='NO CONVENCIONAL') yac_neq_nc,
    sum(suma_prod_pet) FILTER (tipo_de_recurso='CONVENCIONAL') yac_neq_conv FROM {yac} WHERE provincia='Neuquén' GROUP BY 1""").df().set_index("anio")
c = con.execute(f"SELECT anio, sum(suma_prod_pet) yac_pais FROM {yac} GROUP BY 1").df().set_index("anio")
df = pd.concat([ex, exp, gs, reg], axis=1).join(a).join(b).join(c)
df = df.loc[2012:2025]
df["excel/yac_neq"] = (df.excel_crudo_neq / df.yac_neq_total).round(3)
df["excel/nc_neq"] = (df.excel_crudo_neq / df.nc_neq).round(3)
df["excel_pais/yac_pais"] = (df.excel_crudo_pais / df.yac_pais).round(3)
df["(excel+gasolina)/yac_neq"] = ((df.excel_crudo_neq + df.excel_gasolina_neq) / df.yac_neq_total).round(3)
w("# Investigación: producción de crudo de Neuquén (Excel de regalías) vs Capítulo IV")
w("_Generado por `scripts/investigar_regalias.py`. Solo diagnóstico: no se corrigió nada._\n")
w("Unidades: m³ (producción), USD (regalías). `nc_*` = CSV no convencional (solo no convencional); `yac_*` = CSV por yacimiento (todos los recursos; llega a 2026-01).\n")
w(tabla(df[["excel_crudo_neq", "nc_neq", "nc_vm_en_neq", "yac_neq_total", "yac_neq_nc", "yac_neq_conv", "excel/yac_neq", "excel/nc_neq"]].round(0).astype("float").assign(**{"excel/yac_neq": df["excel/yac_neq"], "excel/nc_neq": df["excel/nc_neq"]}).reset_index().rename(columns={"index": "año"}).astype(object).round(3)))
w("\n**País (control de la comparación):**\n")
w(tabla(df[["excel_crudo_pais", "yac_pais", "excel_pais/yac_pais"]].round(3).reset_index().rename(columns={"index": "año"}).astype(object)))
w("\n**Gasolina/condensado de Neuquén (Excel) y cociente sumándola al crudo:**\n")
w(tabla(df[["excel_gasolina_neq", "(excel+gasolina)/yac_neq"]].round(3).reset_index().rename(columns={"index": "año"}).astype(object)))
d25 = df.loc[2025]
w("\n## Cifras 2025")
w(f"- Excel, crudo NEUQUEN: **{d25.excel_crudo_neq:,.0f} m³**")
w(f"- CSV no convencional, provincia Neuquén (todo no convencional): **{d25.nc_neq:,.0f} m³**; de ellos VM: {d25.nc_vm_en_neq:,.0f} m³")
w(f"- CSV por yacimiento, provincia Neuquén (convencional + no convencional): **{d25.yac_neq_total:,.0f} m³** (conv. {d25.yac_neq_conv:,.0f}; no conv. {d25.yac_neq_nc:,.0f})")
w(f"- Diferencia Excel − yacimiento: **{d25.excel_crudo_neq - d25.yac_neq_total:,.0f} m³ ({(d25.excel_crudo_neq / d25.yac_neq_total - 1) * 100:.1f}%)**")
w(f"- Diferencia Excel − no convencional: **{d25.excel_crudo_neq - d25.nc_neq:,.0f} m³ ({(d25.excel_crudo_neq / d25.nc_neq - 1) * 100:.1f}%)**")
pr25 = hojas["precio"].query("`AÑO`==2025").NEUQUEN.mean()
w(f"- Precio medio NEUQUEN 2025 (simple): {pr25:,.1f} USD/m³; regalías Excel 2025: USD {d25.regalias_usd_neq:,.0f}")
w(f"- Tasa efectiva 2025 con producción del Excel: 11,61%. Con producción del CSV por yacimiento: {d25.regalias_usd_neq / (d25.yac_neq_total * pr25) * 100:.2f}% (aprox., precio medio simple)")
w("\n## Lectura (sin corregir nada)")
w("Ver `docs/metodologia_procesamiento.md`, sección 8, para la lectura y las explicaciones posibles.")
Path(pr.RAIZ / "docs" / "investigacion_regalias.md").write_text("\n".join(out), encoding="utf-8")
