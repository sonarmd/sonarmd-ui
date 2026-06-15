---
plan: s6-architectural-components
created: 2026-06-15-202305
status: in_progress
workstream: S6
---

# S6: Architectural Components

Delivers: AppErrorBoundary, WidgetErrorBoundary, createApiClient, useQuery,
usePaginatedQuery, useMutation, QueryBoundary. All zero new runtime deps.

## Files to create

### Error boundaries (core entry, src/components/)

- src/components/AppErrorBoundary/index.tsx
  - Class component: catches render errors
  - Props: children, fallback?, onError?, resetKeys?, showDetail?
  - Renders generic user message (never raw error) unless showDetail=true (PHI 6.2)
  - Auto-resets when any resetKey changes (componentDidUpdate compare)
  - onError(error, info) - Sentry-compatible signature
  - forwardRef not needed (class component)

- src/components/AppErrorBoundary/AppErrorBoundary.module.css
  - Full-page centered fallback layout using semantic tokens

- src/components/AppErrorBoundary/AppErrorBoundary.fixtures.tsx
  - Fixtures: withError (forced error via errorProp), recovered (after retry)

- src/components/WidgetErrorBoundary/index.tsx
  - Shares same ErrorBoundaryBase class; widget-sized fallback
  - Small EmptyState-like layout with retry button

- src/components/WidgetErrorBoundary/WidgetErrorBoundary.module.css
- src/components/WidgetErrorBoundary/WidgetErrorBoundary.fixtures.tsx

### Data layer (./data subpath, src/data/)

- src/data/client.ts
  - createApiClient({ baseUrl, getHeaders, onUnauthorized, retry, fetch })
  - Returns: { get, post, put, patch, delete } typed methods
  - PHI-safe: sanitizeUrl() strips path values (replaces /123/ with /:id/)
  - Retry policy: exponential backoff + full jitter, honor Retry-After header
  - Never retries non-idempotent (POST/DELETE) unless retryMutation: true

- src/data/useQuery.ts
  - State machine: idle -> loading -> success/error
  - Deduplication: shared in-flight map keyed by serialized key
  - AbortController per fetch; cancel on unmount or key change
  - staleTime (default 0): if data is fresh, skip refetch on remount

- src/data/useMutation.ts
  - Simple: mutate(vars) -> Promise, exposes { status, data, error, reset }
  - No dedup (mutations are side-effectful)

- src/data/usePaginatedQuery.ts
  - fetchNext() appends to accumulated pages
  - hasNext derived from configurable extractor fn
  - Stable identity: new pages appended, not full re-render

- src/data/index.ts - barrel

### QueryBoundary (core entry, src/components/)

- src/components/QueryBoundary/index.tsx
  - Props: query (useQuery result), children, emptyState?, skeleton?
  - loading -> skeleton (settle pattern)
  - error -> WidgetErrorBoundary-style fallback with retry = query.refetch
  - empty (data but empty array/null) -> emptyState or default EmptyState
  - success with data -> children

- src/components/QueryBoundary/QueryBoundary.fixtures.tsx

## Files to modify

- src/index.ts: add AppErrorBoundary, WidgetErrorBoundary, QueryBoundary exports
- package.json: add ./data subpath
- vite.config.ts: add src/data/index.ts to rollup input
- .size-limit.cjs: add data entry budget (<=4 kB combined with motion+transitions)

## Acceptance criteria mapping

- 6.1: AppErrorBoundary + WidgetErrorBoundary render independently
- 6.2: onError called once with component stack; raw message not shown
- 6.3: useQuery idle->loading->success/error; dedup; abort on unmount; staleTime
- 6.4: retry with exponential backoff + full jitter; honor Retry-After; no non-idempotent retry
- 6.5: usePaginatedQuery fetchNext() appends; hasNext; stable identity
- 6.6: QueryBoundary renders skeleton/fallback/empty from props
- 6.7: PHI-safe - sanitized URL only, no bodies or headers logged

## Implementation order

1. src/data/client.ts (foundation; useQuery depends on it)
2. src/data/useQuery.ts
3. src/data/useMutation.ts
4. src/data/usePaginatedQuery.ts
5. src/data/index.ts
6. src/components/AppErrorBoundary/
7. src/components/WidgetErrorBoundary/
8. src/components/QueryBoundary/
9. Wire subpath + budgets
10. Update src/index.ts
11. Typecheck, tests, build, size-limit
12. IMPLEMENTATION_STATUS.md + commit + push
