"""
Cifras de contexto para las tarjetas de la intro. NO modifica ningún dato existente: lee el CSV por pozo no convencional
(formación «vaca muerta») y las series históricas nacionales de petróleo y gas (Capítulo IV) y escribe
datos/procesados/contexto_intro.json.

 - % del petróleo / gas nacional que salió de Vaca Muerta en 2025 = producción VM 2025 ÷ producción nacional 2025 (serie histórica, columna total)
 - récord de producción diaria de petróleo = mes de mayor (producción mensual VM ÷ días del mes) × 6,2898 bbl/m³
Uso:  python scripts/calcular_intro.py
"""
import calendar
import glob
import json
from pathlib import Path

import duckdb
import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent
CAP = RAIZ / "datos" / "raw" / "capitulo_iv"
F_NOCONV = CAP / "produccin-de-pozos-de-gas-y-petrleo-no-convencional.csv"
BBL = 6.2898
ANIO = 2025

m = duckdb.connect().execute(f"""select anio, mes, sum(greatest(prod_pet,0)) pet, sum(greatest(prod_gas,0)) gas
    from read_csv('{str(F_NOCONV).replace(chr(92), '/')}', header=true, sample_size=-1) where lower(formacion)='vaca muerta' group by 1,2 order by 1,2""").df()
po = pd.read_csv(glob.glob(str(CAP / "serie-hist*petr*.csv"))[0]); po["a"] = po.indice_tiempo.str[:4].astype(int)
pg = pd.read_csv(glob.glob(str(CAP / "serie-hist*gas*.csv"))[0]); pg["a"] = pg.indice_tiempo.str[:4].astype(int)
vm_pet, vm_gas = float(m[m.anio == ANIO].pet.sum()), float(m[m.anio == ANIO].gas.sum())
nac_pet, nac_gas = float(po[po.a == ANIO].total.sum()), float(pg[pg.a == ANIO].produccion_gas_natural_total.sum())
m["bpd"] = [p / calendar.monthrange(a, b)[1] * BBL for p, a, b in zip(m.pet, m.anio, m.mes)]
r = m.loc[m.bpd.idxmax()]
out = {
    "anio": ANIO,
    "vm_petroleo_m3": round(vm_pet), "nacional_petroleo_m3": round(nac_pet), "pct_petroleo": round(vm_pet / nac_pet * 100, 2),
    "vm_gas_miles_m3": round(vm_gas), "nacional_gas_miles_m3": round(nac_gas), "pct_gas": round(vm_gas / nac_gas * 100, 2),
    "referencia_iae": {"pct_petroleo": 62, "pct_gas": 53, "pct_inversiones_upstream": 73},
    "record_bpd": {"anio": int(r.anio), "mes": int(r.mes), "bpd": round(float(r.bpd))},
    "fuente": "Capítulo IV, Secretaría de Energía: CSV por pozo no convencional (formación vaca muerta) y series históricas de petróleo y gas (columna total)",
}
(RAIZ / "datos" / "procesados" / "contexto_intro.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(out, ensure_ascii=False, indent=1))
