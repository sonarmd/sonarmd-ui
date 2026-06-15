/**
 * Recipe 2: Paginated data view
 *
 * usePaginatedQuery + QueryBoundary + DataTable + FilterBar
 */
import React from 'react';
import {usePaginatedQuery} from '../../src/data/usePaginatedQuery';
import {QueryBoundary} from '../../src/components/QueryBoundary';
import {DataTable, Column} from '../../src/components/DataTable';
import {FilterBar} from '../../src/components/FilterBar';

interface Patient {
  id: string;
  name: string;
  score: number;
}

const columns: Column<Patient>[] = [
  {key: 'name', header: 'Patient'},
  {key: 'score', header: 'HCC Score'},
];

function usePatients() {
  return usePaginatedQuery<Patient[]>({
    kind: 'page',
    hasNextPage: (page, idx) => page.length === 20 && idx < 4,
    fetcher: async (page, signal) => {
      const res = await fetch(`/api/patients?page=${page}`, {signal});
      return res.json() as Promise<Patient[]>;
    },
  });
}

export function PaginatedDataView(): JSX.Element {
  const query = usePatients();
  const allRows = query.pages.flat();

  const boundaryQuery = {
    status: query.status === 'fetching-next' ? ('success' as const) : (query.status as 'idle' | 'loading' | 'success' | 'error'),
    data: allRows.length > 0 ? allRows : undefined,
    error: query.error,
    refetch: query.refetch,
  };

  return (
    <div>
      <FilterBar>
        <span>Status: All</span>
      </FilterBar>
      <QueryBoundary query={boundaryQuery}>
        {(data) => (
          <DataTable
            data={data}
            columns={columns}
            keyExtractor={(r) => r.id}
          />
        )}
      </QueryBoundary>
      {query.hasNext && (
        <button
          type="button"
          onClick={query.fetchNext}
          disabled={query.status === 'fetching-next'}
        >
          Load more
        </button>
      )}
    </div>
  );
}
