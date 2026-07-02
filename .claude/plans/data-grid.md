# DataGrid - virtualized, resizable, lazy-loading table

Owner ask (2026-07-02): "custom dynamic table: accessible, responsive, lazy
loading and infinite scroll with virtualization, automatic column resizing,
sticky header options and pagination as well."

Branch: cc-av/data-grid off main @ fa13661. PR base: main.

## Why a new component (vs DataTable / InfiniteList)

- DataTable: classic <table>, columns-as-config, sort, stickyHeader. No
  virtualization, no lazy load, no resizing, no pagination. Right for small
  static tables - unchanged.
- InfiniteList: virtualized lazy list (react-window v2 + useVirtualInfinite),
  but generic rows - no columns, header, sort, or resize.
- DataGrid composes both concepts: column model of DataTable + windowing of
  InfiniteList + Pagination, and adds column resizing. Distinct concept
  (large-dataset grid), industry-standard name.

## API (src/components/DataGrid/index.tsx)

```ts
export interface DataGridColumn<T> {
  key: string;
  header: string;
  width?: number;          // starting px width; unset -> share leftover space
  minWidth?: number;       // default 64
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  resizable?: boolean;     // default true when grid resizableColumns
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface DataGridProps<T> {
  columns: DataGridColumn<T>[];
  rows: T[];
  keyExtractor: (row: T) => string;
  rowHeight?: number;              // default 44 (windowing needs fixed height)
  height?: number;                 // viewport px, default 400
  // one render path, two data modes:
  pagination?: {page: number; pageCount: number; onPageChange: (p: number) => void};
  infinite?: {hasNext: boolean; isLoadingNext: boolean; onLoadMore: () => void};
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  resizableColumns?: boolean;      // default true
  emptyState?: React.ReactNode;
  loadingRow?: React.ReactNode;
  overscanCount?: number; thresholdRows?: number;
  ariaLabel?: string; className?: string;
}
```

- Both `pagination` and `infinite` omitted -> plain virtualized grid of `rows`.
- Both provided -> dev-time error (throw in dev, prefer pagination in prod? NO:
  throw always - invalid state must be impossible).

## Structure (one render path)

```
wrapper (role="group", aria-label, aria-busy)      <- horizontal scroller
  header row (div, flex; widths from state)        <- OUTSIDE vertical scroller
    per column: sort <button> (aria-label w/ state) + resize handle
      (role="separator", aria-orientation="vertical", aria-valuenow/min/max,
       tabIndex=0, ArrowLeft/Right resize; pointer drag via setPointerCapture)
  react-window <List> (rowComponent pattern from InfiniteList; loader row via
    useVirtualInfinite when infinite mode; hasNext=false otherwise)
  sr-only live region ("Loading more rows" / "N rows")
  <Pagination> below when pagination mode
```

Sticky header: pinned BY CONSTRUCTION - the header sits outside react-window's
vertical scroller, so it never scrolls away (how every virtualized grid works;
react-window owns its scroll container so an in-flow header is not possible).
No fake `stickyHeader` boolean. Decision recorded per repo CLAUDE.md protocol.

ARIA: house pattern from InfiniteList - role="group" wrapper (react-window's
sizing div cannot satisfy grid/row required-children, axe gates every fixture).
No half-grid roles. Sort buttons and resize separators are real focusable
controls; loading announced via polite live region.

## Column sizing

- State: Map<key, px>. Initial: column.width ?? proportional share of
  (containerWidth - fixed columns), floor minWidth (default 64).
- Responsive: ResizeObserver on wrapper re-distributes UNRESIZED auto columns
  on container resize; user-resized widths persist.
- Drag: pointerdown + setPointerCapture on the handle; keyboard: arrows +-16px
  (one spacing step), Home=min. Grid re-renders widths via a single
  gridTemplateColumns-style flex row; header and rows share the same width
  array so they never drift.
- totalWidth = max(sum(widths), containerWidth); wrapper overflow-x: auto.

## Files

- src/components/DataGrid/index.tsx
- src/components/DataGrid/DataGrid.module.css   (tokens only - rawPx suite)
- src/components/DataGrid/DataGrid.fixtures.tsx (withRows, empty, loading,
  paginated - snapshots + axe auto-generated)
- src/components/DataGrid/DataGrid.test.tsx     (behavior: renders cells,
  sort callback, resize keyboard changes width, loader row calls onLoadMore,
  pagination renders + page change, mode-conflict throw)
- src/components/DataGrid/DataGrid.stories.tsx  (Ladle)
- src/index.ts barrel export + package.json exports "./data-grid"
- size: covered by core 80 kB budget; add '{ DataGrid }' entry mirroring Badge
  only if cheap - check `npm run size` output.

## Constraints

- ASCII only (ascii.test.ts gates). Zero new deps (react-window existing).
- CSS: tokens only, smd- prefix via modules. No raw hex/px in CSS (dynamic
  widths are inline styles in TSX - allowed).
- forwardRef on the wrapper. JSDoc on every exported prop.
- npm, conventional commit: feat(components): DataGrid - virtualized ...

## Verify

npm run typecheck && npm test && npm run build && npm run size - all green.
Then draft PR to main. Follow-up (separate): bump AuraPlatform pin + use it
for the Phase 3 raw-table migration.
