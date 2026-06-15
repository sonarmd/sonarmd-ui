# Benchmark results

Generated: 2026-06-15T01:16:48.707Z

Same dashboard shell (sidebar, header, KPI cards, tabs, table, form, modal),
built per library, production build. Sizes are summed JS/CSS assets.

| Library | JS (br) | JS (gz) | CSS (br) | CSS (gz) | Total (br) | Total (raw) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| ** @sonarmd/ui** | 51.93 kB | 59.29 kB | 8.53 kB | 10.06 kB | 60.46 kB | 243.56 kB |
| React Bootstrap | 53.53 kB | 61.24 kB | 22.12 kB | 29.97 kB | 75.65 kB | 414.60 kB |
| Material UI | 98.50 kB | 114.23 kB | 0.00 kB | 0.00 kB | 98.50 kB | 368.13 kB |
| Ant Design | 241.95 kB | 295.49 kB | 0.00 kB | 0.00 kB | 241.95 kB | 933.92 kB |

## SonarMD vs each competitor (total brotli)

- vs React Bootstrap: 1.25x larger (20.1% smaller with @sonarmd/ui)
- vs Material UI: 1.63x larger (38.6% smaller with @sonarmd/ui)
- vs Ant Design: 4.00x larger (75.0% smaller with @sonarmd/ui)

Runtime metrics (FCP/LCP/TBT/TTI/hydration): not yet collected in this run
(headless browser pending). Size metrics above are authoritative.
