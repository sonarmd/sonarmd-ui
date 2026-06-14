# Single-shot build prompt for Claude Code

Paste everything below the line into Claude Code from the repo root. Nothing else is needed.

---

Build @sonarmd/ui to v1.0 per the delivery contract in V1_SPEC.md, following all guardrails and resolved decisions in CLAUDE.md. Both files are complete and authoritative; every architectural decision has already been made. Do not ask me anything. If something is genuinely unspecified, decide it yourself by the priority order in CLAUDE.md (PHI safety > minimization > DX/UX) and log the decision in IMPLEMENTATION_STATUS.md.

Execute workstreams in this order, finishing each fully (criteria met, typecheck + tests + build green, committed) before starting the next:

1. S1 packaging: tokens.css codegen, externalize echarts via echarts/core wrapper (delete echarts-for-react), preserveModules + sideEffects, subpath entries, size-limit budgets.
2. S2 theming: semantic token layer, light + dark maps, data-theme switching, chart theme from the same map, contrast checks, fix hardcoded hex in GaugeChart and StackedBarChart.
3. S0 primitives: Button, IconButton, Breadcrumbs; adopt Button inside FormActions, ConfirmDialog, Modal, FilterBar, EmptyState.
4. S7.0 test harness + S8a dev workbench: defineComponentFixtures harness with auto-discovery, fixtures for all components, delete the monolithic snapshot file; dev/ workbench with zone auto-discovery, theme/density/viewport chrome built from library components.
5. S3 layout: AppShell, Columns, Stack, Cluster, Spacer, responsive collapse, density.
6. S4 motion: tokens, useAnimate, usePresence, useFlip, central reduced-motion handling.
7. S5 transitions: TransitionContainer core (no router imports), createTransitionOutlet react-router adapter, all 8 canonical patterns, focus + live-region handling, fake-history test suite.
8. S6 architectural: AppErrorBoundary, WidgetErrorBoundary, createApiClient, useQuery, usePaginatedQuery, useMutation, QueryBoundary, PHI-safe error shapes.
9. S7.1 CI: GitHub Actions with the full gate list and React 18/19 matrix.
10. S8b docs: Ladle site, props tables from types, the 10 cookbook recipes as compiled files, motion and theming guides, README.

Rules of engagement: every component gets a fixtures file and a dev zone; no repeated setup code anywhere; zero new runtime dependencies; compositor-only animations; semantic tokens only; budgets are merge gates. Maintain IMPLEMENTATION_STATUS.md as you go: per workstream, list criteria passed, files touched, and any self-made decisions. If a criterion is unreachable, implement the closest compliant behavior and flag it at the top of that file rather than stopping.

When all ten are done, verify the Definition of Done in V1_SPEC.md end to end (including the fixture app) and produce a final summary in IMPLEMENTATION_STATUS.md.
