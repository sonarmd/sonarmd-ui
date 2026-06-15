# Benchmark results

Generated: 2026-06-15T02:45:31.309Z

Same dashboard shell (sidebar, header, KPI cards, tabs, table, form, modal),
built per library, production build. Sizes are summed JS/CSS assets.

| Library | JS (br) | JS (gz) | CSS (br) | CSS (gz) | Total (br) | Total (raw) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| ** @sonarmd/ui** | 52.06 kB | 59.31 kB | 8.54 kB | 10.06 kB | 60.59 kB | 243.01 kB |
| React Bootstrap | 53.53 kB | 61.24 kB | 22.12 kB | 29.97 kB | 75.65 kB | 414.60 kB |
| Material UI | 98.50 kB | 114.23 kB | 0.00 kB | 0.00 kB | 98.50 kB | 368.13 kB |
| Ant Design | 241.95 kB | 295.49 kB | 0.00 kB | 0.00 kB | 241.95 kB | 933.92 kB |

## SonarMD vs each competitor (total brotli)

- vs React Bootstrap: 1.25x larger (19.9% smaller with @sonarmd/ui)
- vs Material UI: 1.63x larger (38.5% smaller with @sonarmd/ui)
- vs Ant Design: 3.99x larger (75.0% smaller with @sonarmd/ui)

Runtime metrics (FCP/LCP/TBT/TTI/hydration): not yet collected in this run
(headless browser pending). Size metrics above are authoritative.
