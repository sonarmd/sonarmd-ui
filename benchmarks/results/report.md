# Benchmark results

Generated: 2026-06-16T05:28:57.245Z

Same dashboard shell (sidebar, header, KPI cards, tabs, table, form, modal),
built per library, production build. Sizes are summed JS/CSS assets.

| Library | JS (br) | JS (gz) | CSS (br) | CSS (gz) | Total (br) | Total (raw) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| ** @sonarmd/ui** | 63.79 kB | 73.79 kB | 9.25 kB | 10.93 kB | 73.05 kB | 298.51 kB |
| React Bootstrap | 65.27 kB | 75.51 kB | 22.12 kB | 29.97 kB | 87.40 kB | 464.34 kB |
| Material UI | 110.19 kB | 128.71 kB | 0.00 kB | 0.00 kB | 110.19 kB | 417.92 kB |
| Ant Design | 253.68 kB | 309.90 kB | 0.00 kB | 0.00 kB | 253.68 kB | 983.85 kB |

## SonarMD vs each competitor (total brotli)

- vs React Bootstrap: 1.20x larger (16.4% smaller with @sonarmd/ui)
- vs Material UI: 1.51x larger (33.7% smaller with @sonarmd/ui)
- vs Ant Design: 3.47x larger (71.2% smaller with @sonarmd/ui)

Runtime metrics (FCP/LCP/TBT/TTI/hydration): not yet collected in this run
(headless browser pending). Size metrics above are authoritative.
