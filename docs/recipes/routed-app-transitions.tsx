/**
 * Recipe 4: Routed app with transitions
 *
 * createTransitionOutlet, lazy routes, resolve + nav patterns.
 * Import: `import { createTransitionOutlet } from '@sonarmd/ui/transitions'`
 */
import React, {lazy, Suspense} from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigationType,
  useMatches,
  Outlet,
} from 'react-router-dom';
import {createTransitionOutlet} from '../../src/transitions/createTransitionOutlet';
import type {RouterAdapterDeps} from '../../src/transitions/createTransitionOutlet';

// Adapt react-router's useMatches to the RouterAdapterDeps interface.
// useMatches returns UIMatch<unknown, unknown>[] - cast to the shape the adapter expects.
const adaptedUseMatches: RouterAdapterDeps['useMatches'] = () => {
  const matches = useMatches();
  return matches.map((m) => ({handle: m.handle as {transition?: string} | undefined}));
};

// Create the outlet once at app setup by providing react-router hooks.
const TransitionOutlet = createTransitionOutlet({
  useLocation,
  useNavigationType,
  Outlet,
  useMatches: adaptedUseMatches,
});

const PatientList = lazy(() =>
  import('./page-stubs').then((m) => ({default: m.PatientList})),
);
const PatientDetail = lazy(() =>
  import('./page-stubs').then((m) => ({default: m.PatientDetail})),
);

function Layout(): React.JSX.Element {
  return (
    <div>
      <nav aria-label="App navigation" style={{padding: '8px 16px', borderBottom: '1px solid var(--smd-border-default)'}}>
        <strong>SonarMD</strong>
      </nav>
      {/* TransitionOutlet replaces <Outlet /> and plays canonical patterns. */}
      <TransitionOutlet defaultPattern="nav-forward" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PatientList />
          </Suspense>
        ),
      },
      {
        path: 'patients/:id',
        // Per-route override: entering a patient detail uses drill-in.
        handle: {transition: 'drill-in'},
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PatientDetail />
          </Suspense>
        ),
      },
    ],
  },
]);

export function RoutedApp(): React.JSX.Element {
  return <RouterProvider router={router} />;
}
