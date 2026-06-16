/**
 * Recipe 8: Async content states
 *
 * settle skeleton, EmptyState, dismiss on delete.
 * Shows how to model loading/empty/success states using QueryBoundary
 * and the settle transition pattern.
 */
import React, {useState, useCallback} from 'react';
import {QueryBoundary} from '../../src/components/QueryBoundary';
import {EmptyState} from '../../src/components/EmptyState';
import {Badge} from '../../src/components/Badge';
import {Button} from '../../src/components/Button';
import {useQuery} from '../../src/data/useQuery';
import {useMutation} from '../../src/data/useMutation';
import {createApiClient} from '../../src/data/client';

const api = createApiClient({
  baseUrl: '/api',
  retry: {attempts: 2},
});

interface ClinicalAlert extends Record<string, unknown> {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
}

function useAlerts() {
  return useQuery<ClinicalAlert[]>(['alerts'], (signal) =>
    api.get<ClinicalAlert[]>('/alerts', {signal}).then((r) => r.data),
  );
}

function AlertRow({alert, onDismiss}: {alert: ClinicalAlert; onDismiss: (id: string) => void}): React.JSX.Element {
  const mutation = useMutation((_id: string) =>
    api.delete<void>(`/alerts/${_id}`).then(() => _id),
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 0',
        borderBottom: '1px solid var(--smd-border-default)',
      }}
    >
      <Badge variant={alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'neutral'}>
        {alert.severity}
      </Badge>
      <span style={{flex: 1}}>{alert.title}</span>
      <Button
        variant="ghost"
        size="sm"
        loading={mutation.status === 'loading'}
        onClick={async () => {
          await mutation.mutate(alert.id);
          onDismiss(alert.id);
        }}
      >
        Dismiss
      </Button>
    </div>
  );
}

export function AsyncContentStates(): React.JSX.Element {
  const query = useAlerts();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const dismiss = useCallback((id: string) => {
    setDismissed((s) => new Set([...s, id]));
  }, []);

  const filteredData = query.data?.filter((a) => !dismissed.has(a.id));

  const boundaryQuery = {
    status: query.status,
    data: filteredData,
    error: query.error,
    refetch: query.refetch,
  };

  return (
    <QueryBoundary
      query={boundaryQuery}
      isEmpty={(data) => data.length === 0}
      emptyState={
        <EmptyState
          title="No active alerts"
          description="All alerts have been reviewed."
        />
      }
    >
      {(alerts) => (
        <div>
          {alerts.map((a) => (
            <AlertRow key={a.id} alert={a} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </QueryBoundary>
  );
}
