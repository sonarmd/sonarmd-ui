# Per-component bundle benchmark

Generated: 2026-06-21T01:59:08.208Z

Each cell is the total brotli (JS + CSS) of a production app that imports
react + react-dom + that ONE component, plus the library CSS floor
(@sonarmd/ui and React Bootstrap ship a CSS file; Material UI and Ant Design
ship CSS inside JS). Smallest total wins the row. Lower is better.

## Library floor (react + react-dom + CSS floor, no component)

| Library | Floor (br) |
| --- | ---: |
| @sonarmd/ui | 62.09 kB |
| Material UI | 51.02 kB |
| Ant Design | 51.02 kB |
| React Bootstrap | 73.14 kB |

## Total shipped per component (brotli, JS + CSS)

| Component | @sonarmd/ui | Material UI | Ant Design | React Bootstrap | Winner |
| --- | ---: | ---: | ---: | ---: | :--- |
| Button | **62.71 kB** | 80.19 kB | 84.07 kB | 74.11 kB | @sonarmd/ui |
| Card | **62.56 kB** | 73.18 kB | 126.96 kB | 74.14 kB | @sonarmd/ui |
| Badge / Chip / Tag | **62.52 kB** | 80.16 kB | 85.35 kB | 73.77 kB | @sonarmd/ui |
| TextInput | **62.78 kB** | 94.19 kB | 115.93 kB | 74.35 kB | @sonarmd/ui |
| Checkbox | **62.49 kB** | 80.36 kB | 95.07 kB | 74.56 kB | @sonarmd/ui |
| Radio group | **63.37 kB** | 80.93 kB | 96.84 kB | 74.60 kB | @sonarmd/ui |
| Select | **62.70 kB** | 95.84 kB | 131.77 kB | 73.79 kB | @sonarmd/ui |
| Toggle / Switch | **62.68 kB** | 79.76 kB | 83.59 kB | 74.55 kB | @sonarmd/ui |
| Modal / Dialog | **63.77 kB** | 80.02 kB | 114.81 kB | 80.74 kB | @sonarmd/ui |
| Tooltip | **62.94 kB** | 85.37 kB | 104.92 kB | 73.99 kB | @sonarmd/ui |
| Tabs | **62.90 kB** | 83.23 kB | 108.25 kB | 80.10 kB | @sonarmd/ui |
| Alert | **62.92 kB** | 82.02 kB | 77.91 kB | 77.77 kB | @sonarmd/ui |
| Accordion / Collapse | **63.03 kB** | 76.75 kB | 82.39 kB | 77.38 kB | @sonarmd/ui |
| Avatar | **62.84 kB** | 74.64 kB | 110.88 kB | n/a | @sonarmd/ui |
| Progress bar | **62.64 kB** | 75.12 kB | 113.92 kB | 74.13 kB | @sonarmd/ui |
| Spinner | **62.52 kB** | 74.58 kB | 72.24 kB | 73.75 kB | @sonarmd/ui |
| Breadcrumbs | **62.95 kB** | 80.19 kB | 128.29 kB | 74.45 kB | @sonarmd/ui |
| Pagination | **62.98 kB** | 81.09 kB | 140.35 kB | 74.53 kB | @sonarmd/ui |
| Drawer / Offcanvas | **63.89 kB** | 80.66 kB | 99.70 kB | 80.72 kB | @sonarmd/ui |
| Popover | **63.07 kB** | 80.88 kB | 105.82 kB | 74.10 kB | @sonarmd/ui |
| Data table | **66.38 kB** | 73.98 kB | 212.57 kB | 73.83 kB | @sonarmd/ui |
| Stepper / Steps | **62.69 kB** | 75.87 kB | 116.44 kB | n/a | @sonarmd/ui |
| Segmented control | **62.78 kB** | 79.01 kB | 76.46 kB | 75.26 kB | @sonarmd/ui |
| Skeleton | **62.54 kB** | 74.57 kB | 72.14 kB | 74.43 kB | @sonarmd/ui |
| Separator / Divider | **62.41 kB** | 73.45 kB | 70.91 kB | n/a | @sonarmd/ui |

## Marginal cost over library floor (brotli)

The component-only delta: total minus the library floor above. Isolates the
per-component JS that tree-shaking actually adds.

| Component | @sonarmd/ui | Material UI | Ant Design | React Bootstrap |
| --- | ---: | ---: | ---: | ---: |
| Button | 0.62 kB | 29.17 kB | 33.05 kB | 0.97 kB |
| Card | 0.47 kB | 22.16 kB | 75.94 kB | 1.00 kB |
| Badge / Chip / Tag | 0.43 kB | 29.15 kB | 34.33 kB | 0.63 kB |
| TextInput | 0.69 kB | 43.17 kB | 64.92 kB | 1.21 kB |
| Checkbox | 0.40 kB | 29.35 kB | 44.05 kB | 1.42 kB |
| Radio group | 1.28 kB | 29.91 kB | 45.82 kB | 1.46 kB |
| Select | 0.61 kB | 44.82 kB | 80.76 kB | 0.65 kB |
| Toggle / Switch | 0.59 kB | 28.74 kB | 32.57 kB | 1.41 kB |
| Modal / Dialog | 1.68 kB | 29.00 kB | 63.79 kB | 7.60 kB |
| Tooltip | 0.85 kB | 34.35 kB | 53.90 kB | 0.85 kB |
| Tabs | 0.81 kB | 32.22 kB | 57.23 kB | 6.96 kB |
| Alert | 0.83 kB | 31.00 kB | 26.89 kB | 4.63 kB |
| Accordion / Collapse | 0.94 kB | 25.74 kB | 31.37 kB | 4.24 kB |
| Avatar | 0.75 kB | 23.62 kB | 59.86 kB | n/a |
| Progress bar | 0.55 kB | 24.10 kB | 62.91 kB | 0.99 kB |
| Spinner | 0.43 kB | 23.57 kB | 21.23 kB | 0.61 kB |
| Breadcrumbs | 0.86 kB | 29.17 kB | 77.28 kB | 1.31 kB |
| Pagination | 0.89 kB | 30.07 kB | 89.33 kB | 1.39 kB |
| Drawer / Offcanvas | 1.80 kB | 29.64 kB | 48.68 kB | 7.58 kB |
| Popover | 0.98 kB | 29.86 kB | 54.80 kB | 0.96 kB |
| Data table | 4.29 kB | 22.96 kB | 161.55 kB | 0.69 kB |
| Stepper / Steps | 0.60 kB | 24.86 kB | 65.42 kB | n/a |
| Segmented control | 0.69 kB | 27.99 kB | 25.44 kB | 2.12 kB |
| Skeleton | 0.45 kB | 23.55 kB | 21.12 kB | 1.29 kB |
| Separator / Divider | 0.32 kB | 22.43 kB | 19.89 kB | n/a |

## Summary

Components compared: 25. Row wins (smallest total shipped):

- @sonarmd/ui: 25
- Material UI: 0
- Ant Design: 0
- React Bootstrap: 0
