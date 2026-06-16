/**
 * Recipe 6: Error handling layers
 *
 * AppErrorBoundary + WidgetErrorBoundary + retry wiring.
 * The app boundary catches uncaught errors at the route level.
 * Widget boundaries contain failures to individual widgets.
 */
import React, {useState} from 'react';
import {AppErrorBoundary} from '../../src/components/AppErrorBoundary';
import {WidgetErrorBoundary} from '../../src/components/WidgetErrorBoundary';

function BrokenChart(): React.JSX.Element {
  throw new Error('chart render failed');
}

function PatientChart({broken}: {broken: boolean}): React.JSX.Element {
  if (broken) return <BrokenChart />;
  return <div style={{height: 80, background: 'var(--smd-bg-subtle)', borderRadius: 4}} />;
}

export function ErrorHandlingDemo(): React.JSX.Element {
  const [chartBroken, setChartBroken] = useState(false);

  return (
    // AppErrorBoundary wraps the whole app or route subtree.
    <AppErrorBoundary
      onError={(error) => {
        // Report to Sentry/DataDog - error contains stack, info contains componentStack.
        // PHI-safe: report the structure, not user data.
        console.error('[AppErrorBoundary]', error.message);
      }}
    >
      <div style={{padding: 24}}>
        <h2>Dashboard</h2>

        {/* Widget boundaries isolate chart failures from the rest of the page. */}
        <WidgetErrorBoundary
          onError={() => console.error('[WidgetErrorBoundary] Chart failed')}
        >
          <PatientChart broken={chartBroken} />
        </WidgetErrorBoundary>

        <button
          type="button"
          onClick={() => setChartBroken((b) => !b)}
          style={{marginTop: 16}}
        >
          {chartBroken ? 'Fix chart' : 'Break chart'}
        </button>
      </div>
    </AppErrorBoundary>
  );
}
