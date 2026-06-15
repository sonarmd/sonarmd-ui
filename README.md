# @sonarmd/ui

React component library and design system for SonarMD (HIPAA/SOC2 healthcare).

Zero runtime dependencies beyond echarts (peer). 27kB core, brotli.

---

## Install

```
npm install @sonarmd/ui
```

Add `echarts` as a peer if you use chart components:

```
npm install echarts
```

---

## Setup

Import tokens and styles once in your app entry (e.g. `main.tsx`):

```tsx
import '@sonarmd/ui/tokens.css';
import '@sonarmd/ui/style.css';
```

Then import components from the relevant subpath:

```tsx
import {Button, Card, Badge} from '@sonarmd/ui';
import {LineChart, BarChart} from '@sonarmd/ui/charts';
import {TransitionContainer} from '@sonarmd/ui/transitions';
import {createApiClient, useQuery} from '@sonarmd/ui/data';
import {useAnimate, Fade} from '@sonarmd/ui/motion';
```

---

## Theming

Tokens follow `prefers-color-scheme` by default. To override:

```ts
// Force dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Force light mode
document.documentElement.setAttribute('data-theme', 'light');

// Remove to follow OS preference
document.documentElement.removeAttribute('data-theme');
```

All component props and CSS modules use semantic tokens exclusively. Never hardcode
colors, spacing, or durations in your app code -- use the CSS custom properties:

```css
.myCard {
  background: var(--smd-bg-base);
  border: 1px solid var(--smd-border-default);
  color: var(--smd-text-primary);
}
```

---

## Transitions in 5 minutes

The transitions subpath provides router-agnostic page transitions via WAAPI.

**Without a router** (state-driven):

```tsx
import {TransitionContainer} from '@sonarmd/ui/transitions';

function App() {
  const [view, setView] = useState('list');
  return (
    <TransitionContainer locationKey={view} pattern="drill-in">
      {view === 'list' ? <PatientList onSelect={() => setView('detail')} /> : <PatientDetail />}
    </TransitionContainer>
  );
}
```

**With React Router** (adapter factory):

```tsx
import {createTransitionOutlet} from '@sonarmd/ui/transitions';
import {useLocation, useNavigationType, Outlet, useMatches} from 'react-router-dom';

const TransitionOutlet = createTransitionOutlet({
  useLocation,
  useNavigationType,
  Outlet,
  useMatches,
});

function Layout() {
  return <TransitionOutlet defaultPattern="nav-forward" />;
}
```

8 canonical patterns: `nav-forward`, `nav-back`, `drill-in`, `drill-out`,
`modal-enter`, `modal-exit`, `settle`, `cross-fade`.

All patterns fall back to cross-fade under `prefers-reduced-motion`.

---

## Subpath exports

| Import | Contents |
|--------|----------|
| `@sonarmd/ui` | Core components (Button, Card, DataTable, Form, etc.) |
| `@sonarmd/ui/charts` | Chart components (LineChart, BarChart, PieChart, etc.) |
| `@sonarmd/ui/transitions` | TransitionContainer, createTransitionOutlet |
| `@sonarmd/ui/motion` | useAnimate, Fade |
| `@sonarmd/ui/data` | createApiClient, useQuery, useMutation, usePaginatedQuery |
| `@sonarmd/ui/tokens` | injectTokens() runtime helper |
| `@sonarmd/ui/tokens.css` | CSS custom property definitions |
| `@sonarmd/ui/style.css` | Component base styles |
| `@sonarmd/ui/testing` | defineComponentFixtures (dev-only) |

---

## Cookbook

Runnable recipes for common tasks are in `docs/recipes/`. Each recipe is a
complete, type-checked, copy-paste composition:

| Recipe | Task |
|--------|------|
| `three-column-dashboard.tsx` | AppShell + KpiGrid + DataTable, compact density |
| `paginated-data-view.tsx` | usePaginatedQuery + QueryBoundary + FilterBar |
| `form-with-validation.tsx` | useForm + FormSection + FormErrorSummary + SecureField |
| `routed-app-transitions.tsx` | createTransitionOutlet + lazy routes |
| `themed-app-setup.tsx` | Tokens, dark mode toggle, ThemeProvider pattern |
| `error-handling-layers.tsx` | AppErrorBoundary + WidgetErrorBoundary |
| `drill-in-master-detail.tsx` | DataTable row -> detail with drill-in transition |
| `async-content-states.tsx` | QueryBoundary + skeleton + dismiss |
| `custom-chart.tsx` | Custom echarts chart on ChartCanvas |
| `testing-your-components.tsx` | defineComponentFixtures usage |

---

## PHI safety

- `AppErrorBoundary`: `showDetail={false}` by default. Raw error messages are never
  rendered to end users.
- `createApiClient`: Only path templates and status codes are logged. No request
  bodies, response payloads, or headers are ever surfaced.
- `SecureField`: Autofill, autocorrect, and spellcheck are disabled so PHI is
  never captured by browsers or password managers.

---

## Development

```sh
npm run dev         # Ladle dev workbench
npm test            # Vitest (includes static checks)
npm run typecheck   # tsc --noEmit
npm run build       # Vite library build
npm run size        # size-limit bundle budgets
```

Budget limits (brotli): core 80kB, charts 120kB, transitions 2.5kB, motion 2.5kB, data 4kB.

---

## License

MIT
