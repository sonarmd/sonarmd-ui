# Per-component runtime benchmark

Generated: 2026-06-21T02:36:27.096Z

Headless Chromium (Playwright). For each component, N instances are mounted
and then re-rendered per library; each number is the median over
25 measured iterations (after 8 warmup). Timing is taken in
useLayoutEffect after a forced synchronous layout, so render + commit +
style injection + layout are included (everything but async paint), at
sub-frame resolution. Lower is better; smallest mount median wins the row.

## Library boot (cold load, no component)

Boot = navigation start -> module evaluated + first commit (parse + framework
init). TBT = total blocking time (sum of longtask over 50 ms) during load.

| Library | Boot | TBT |
| --- | ---: | ---: |
| @sonarmd/ui | 15.50 ms | 0.00 ms |
| Material UI | 29.00 ms | 0.00 ms |
| Ant Design | 32.10 ms | 0.00 ms |
| React Bootstrap | 18.30 ms | 0.00 ms |

## Mount time (median, N instances)

Time to render N fresh instances of the component.

| Component | N | @sonarmd/ui | Material UI | Ant Design | React Bootstrap | Winner |
| --- | ---: | ---: | ---: | ---: | ---: | :--- |
| Button | 500 | 3.70 ms | 10.70 ms | 30.90 ms | **3.00 ms** | React Bootstrap |
| Card | 300 | 2.40 ms | 3.40 ms | 5.90 ms | **1.70 ms** | React Bootstrap |
| Badge | 500 | 2.00 ms | 5.90 ms | 12.60 ms | **1.80 ms** | React Bootstrap |
| TextInput | 500 | 4.40 ms | 40.30 ms | 24.10 ms | **2.80 ms** | React Bootstrap |
| Checkbox | 500 | 5.50 ms | 19.20 ms | 25.10 ms | **5.40 ms** | React Bootstrap |
| Radio | 500 | 5.20 ms | 26.50 ms | 27.40 ms | **4.70 ms** | React Bootstrap |
| Select | 200 | 5.10 ms | 24.00 ms | 43.50 ms | **4.80 ms** | React Bootstrap |
| Toggle | 500 | 6.00 ms | 21.60 ms | 24.60 ms | **4.90 ms** | React Bootstrap |
| Alert | 300 | 5.00 ms | 8.60 ms | 8.40 ms | **2.20 ms** | React Bootstrap |
| Avatar | 500 | **2.70 ms** | 3.20 ms | 15.30 ms | n/a | @sonarmd/ui |
| Progress | 500 | **2.70 ms** | 5.00 ms | 27.20 ms | 2.80 ms | @sonarmd/ui |
| Spinner | 500 | 4.90 ms | 9.40 ms | 33.20 ms | **4.00 ms** | React Bootstrap |
| Skeleton | 500 | **2.80 ms** | 4.20 ms | 16.20 ms | 3.40 ms | @sonarmd/ui |
| Separator | 500 | **1.10 ms** | 2.20 ms | 10.10 ms | n/a | @sonarmd/ui |
| Breadcrumbs | 300 | **5.90 ms** | 9.70 ms | 17.00 ms | 7.10 ms | @sonarmd/ui |
| Pagination | 200 | 12.70 ms | 48.70 ms | 86.60 ms | **10.20 ms** | React Bootstrap |
| Tabs | 150 | **2.60 ms** | 12.80 ms | 34.40 ms | 7.30 ms | @sonarmd/ui |
| Tooltip | 300 | **1.10 ms** | 5.00 ms | 17.70 ms | n/a | @sonarmd/ui |

Row wins (18 components): @sonarmd/ui 7, Material UI 0, Ant Design 0, React Bootstrap 11.

## Re-render time (median, N instances)

Time to re-render all N instances after a prop change.

| Component | N | @sonarmd/ui | Material UI | Ant Design | React Bootstrap | Winner |
| --- | ---: | ---: | ---: | ---: | ---: | :--- |
| Button | 500 | 2.60 ms | 10.80 ms | 9.40 ms | **1.80 ms** | React Bootstrap |
| Card | 300 | 1.20 ms | 2.60 ms | 2.50 ms | **1.10 ms** | React Bootstrap |
| Badge | 500 | **1.40 ms** | 5.60 ms | 5.40 ms | 1.50 ms | @sonarmd/ui |
| TextInput | 500 | 3.20 ms | 27.70 ms | 11.20 ms | **1.60 ms** | React Bootstrap |
| Checkbox | 500 | 10.90 ms | 21.40 ms | 28.40 ms | **1.90 ms** | React Bootstrap |
| Radio | 500 | 9.80 ms | 25.00 ms | 33.40 ms | **1.70 ms** | React Bootstrap |
| Select | 200 | 1.80 ms | 19.20 ms | 24.20 ms | **1.50 ms** | React Bootstrap |
| Toggle | 500 | 5.70 ms | 24.90 ms | 31.30 ms | **5.50 ms** | React Bootstrap |
| Alert | 300 | **1.50 ms** | 5.50 ms | 3.50 ms | 1.80 ms | @sonarmd/ui |
| Avatar | 500 | **1.90 ms** | 4.10 ms | 9.00 ms | n/a | @sonarmd/ui |
| Progress | 500 | 3.50 ms | 5.30 ms | 14.30 ms | **3.10 ms** | React Bootstrap |
| Spinner | 500 | **0.10 ms** | 3.40 ms | 7.00 ms | 0.30 ms | @sonarmd/ui |
| Skeleton | 500 | **0.10 ms** | 1.30 ms | 2.50 ms | 0.80 ms | @sonarmd/ui |
| Separator | 500 | **0.20 ms** | 1.10 ms | 2.20 ms | n/a | @sonarmd/ui |
| Breadcrumbs | 300 | **0.10 ms** | 3.80 ms | 2.70 ms | 1.20 ms | @sonarmd/ui |
| Pagination | 200 | **5.20 ms** | 46.00 ms | 41.00 ms | 6.00 ms | @sonarmd/ui |
| Tabs | 150 | **2.50 ms** | 12.20 ms | 31.70 ms | 12.20 ms | @sonarmd/ui |
| Tooltip | 300 | **0.30 ms** | 4.40 ms | 7.20 ms | n/a | @sonarmd/ui |

Row wins (18 components): @sonarmd/ui 10, Material UI 0, Ant Design 0, React Bootstrap 8.
