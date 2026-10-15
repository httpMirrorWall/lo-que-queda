# Auditoría del catálogo de sismos (INPRES desde 2019)

Generado por `scripts/procesar_sismos.py`. Fuente única de la capa y el panel: INPRES, 01/01/2019 en adelante. Zenodo es solo control y contexto; el USGS, solo contexto. Ninguno se dibuja ni se suma. No hay deduplicación entre catálogos.

## 0. Archivos de partida

- **INPRES:** `datos/raw/sismos/inpres/Instituto Nacional de Prevención Sísmica _ Argentina.gob.ar.html`. Consulta del 2026-10-08, descarga manual. Criterios: fechas 01/01/2000 a 08/10/2026; cuadrante lat −36,5 a −39,5 y long −70,5 a −67,5; provincia: todas; magnitud 0 a 9; intensidad: valor por defecto (no filtró). 473 eventos (igual al total que declara la página). **Corte al 31/08/2026**, igual que el resto de los datos: se excluyen 25 eventos posteriores; quedan 448, del 21/06/2014 al 30/08/2026. Los 12 anteriores a 2019 quedan fuera de la capa.
- **Zenodo:** `datos/raw/sismos/extraido/RyanJamesSchultz-VM-ID-b9fc43d/data/CAT.mat` (545 eventos; 1 copia exacta quitada → 544), del 09/11/2014 al 03/03/2024.
- **USGS:** `datos/raw/sismos/usgs/query.csv`, 16 eventos de magnitud ≥ 4 desde 2000 (consulta equivalente a https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=2000-01-01&minmagnitude=4&minlatitude=-39.5&maxlatitude=-36.5&minlongitude=-70.5&maxlongitude=-67.5&orderby=time).

## 1. Filtros sobre el INPRES (iguales para todos los eventos)

Orden: fecha ≥ 2019-01-01, magnitud ≥ 2.0, profundidad ≤ 30 km, área de estudio (`area_estudio.geojson`, sin modificar). Cada fila cuenta lo que no excluyó la anterior; entre paréntesis, lo que excluiría el filtro por sí solo sobre los 436 eventos desde 2019.

| Paso | Eventos |
|---|---|
| INPRES bruto (consulta del 8/10/2026) | 473 |
| Excluidos por el corte (posteriores al 31/08/2026) | 25 |
| INPRES hasta el 31/08/2026 | 448 |
| Excluidos por fecha (antes de 2019) | 12 |
| Desde 2019 | 436 |
| Excluidos por magnitud < 2.0 | 0 (0) |
| Excluidos por profundidad > 30 km | 10 (10) |
| Excluidos por estar fuera del área | 6 (12) |
| **Quedan (mapa, M ≥ 2,0)** | **420** |
| **Del panel (M ≥ 2,5)** | **414** |

## 2. Conteo por año

| Año | M ≥ 2,0 (mapa) | M ≥ 2,5 (panel) |
|---|---|---|
| 2019 | 37 | 37 |
| 2020 | 40 | 40 |
| 2021 | 32 | 32 |
| 2022 | 22 | 22 |
| 2023 | 67 | 65 |
| 2024 | 59 | 59 |
| 2025 | 102 | 102 |
| 2026 | 61 | 57 |
| **Total** | **420** | **414** |

2026 es parcial: datos del INPRES hasta el 30/08/2026; último evento del panel (M ≥ 2,5): 30/08/2026; último del mapa: 30/08/2026.

## 3. USGS (solo contexto)

Mismos filtros de área y profundidad (≤ 30 km). De 16 eventos quedan **9**.

| Fecha (UTC) | M | Prof. (km) | Lat, lon | Ubicación (USGS) | En el área | Prof. ≤ 30 km | Resultado |
|---|---|---|---|---|---|---|---|
| 2000-10-23 | 4.0 | 200.0 | -36.691, -70.478 | 40 km NE of Las Ovejas, Argentina | no | no | se excluye |
| 2002-04-08 | 4.7 | 144.8 | -36.924, -70.490 | 24 km ENE of Las Ovejas, Argentina | no | no | se excluye |
| 2009-08-08 | 4.2 | 29.2 | -36.765, -69.787 | 13 km ENE of Barrancas, Argentina | sí | sí | **queda** |
| 2009-08-08 | 4.1 | 10.3 | -36.817, -69.902 | 1 km ENE of Barrancas, Argentina | sí | sí | **queda** |
| 2011-06-23 | 4.7 | 167.5 | -37.582, -70.482 | 11 km NE of El Huecú, Argentina | no | no | se excluye |
| 2012-05-24 | 5.4 | 150.4 | -36.912, -70.467 | 26 km ENE of Las Ovejas, Argentina | no | no | se excluye |
| 2015-11-19 | 4.2 | 14.6 | -38.905, -68.959 | 21 km E of Plaza Huincul, Argentina | sí | sí | **queda** |
| 2017-09-26 | 4.4 | 19.7 | -38.251, -68.273 | 46 km ENE of Añelo, Argentina | sí | sí | **queda** |
| 2019-03-07 | 5.0 | 13.8 | -38.523, -68.857 | 19 km SSW of Añelo, Argentina | sí | sí | **queda** |
| 2020-10-27 | 4.1 | 11.9 | -38.634, -68.984 | 35 km SSW of Añelo, Argentina | sí | sí | **queda** |
| 2021-07-18 | 4.3 | 13.9 | -37.906, -68.582 | 52 km NNE of Añelo, Argentina | sí | sí | **queda** |
| 2022-05-09 | 4.5 | 10.0 | -38.591, -68.997 | 31 km SW of Añelo, Argentina | sí | sí | **queda** |
| 2023-03-23 | 4.5 | 159.0 | -36.693, -70.353 | 41 km WNW of Barrancas, Argentina | no | no | se excluye |
| 2023-07-17 | 6.6 | 186.0 | -38.186, -70.443 | 19 km SE of Loncopué, Argentina | no | no | se excluye |
| 2023-09-08 | 4.0 | 10.0 | -38.589, -69.020 | 32 km SW of Añelo, Argentina | sí | sí | **queda** |
| 2025-11-10 | 4.9 | 212.4 | -37.595, -69.999 | 34 km SE of Chos Malal, Argentina | sí | no | se excluye |

Entre 2000 y 2014 quedan **2**; desde 2015, **7**.

## 4. Zenodo (control y contexto)

- **Control:** conteos anuales con M ≥ 2,5 (mismos filtros de profundidad y área) entre INPRES y Zenodo de 2021 a marzo de 2024. Diferencia máxima: **4**.

| Año | INPRES | Zenodo | Diferencia |
|---|---|---|---|
| 2021 | 32 | 33 | 1 |
| 2022 | 22 | 22 | 0 |
| 2023 | 65 | 61 | 4 |
| 2024 (ene–mar) | 15 | 14 | 1 |

- **Contexto 2017 (M ≥ 2,5, mismos filtros):** Zenodo 22, INPRES 0. Redes distintas: no comparables con la serie desde 2019.
