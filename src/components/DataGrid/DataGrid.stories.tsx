import React, {useCallback, useMemo, useState} from 'react';
import type {Story} from '@ladle/react';
import {DataGrid} from './index';
import type {DataGridColumn} from './index';
import {Badge} from '../Badge';

interface Claim extends Record<string, unknown> {
  id: string;
  patient: string;
  status: string;
  amount: number;
  serviceDate: string;
}

function makeClaims(offset: number, count: number): Claim[] {
  return Array.from({length: count}, (_, i) => {
    const n = offset + i + 1;
    return {
      id: String(n),
      patient: `Patient ${n}`,
      status: n % 5 === 0 ? 'Denied' : n % 3 === 0 ? 'Pending' : 'Paid',
      amount: Math.round((n * 137.5) % 4000) / 10,
      serviceDate: `2026-0${(n % 6) + 1}-15`,
    };
  });
}

const columns: DataGridColumn<Claim>[] = [
  {key: 'patient', header: 'Patient', sortable: true},
  {
    key: 'status',
    header: 'Status',
    width: 120,
    render: (v) => (
      <Badge variant={v === 'Paid' ? 'success' : v === 'Pending' ? 'warning' : 'danger'}>
        {String(v)}
      </Badge>
    ),
  },
  {key: 'amount', header: 'Amount', width: 120, align: 'right', sortable: true},
  {key: 'serviceDate', header: 'Service Date', width: 140},
];

const keyExtractor = (r: Claim): string => r.id;

export const InfiniteScroll: Story = () => {
  const [claims, setClaims] = useState<Claim[]>(() => makeClaims(0, 50));
  const [isLoadingNext, setLoadingNext] = useState(false);
  const hasNext = claims.length < 500;

  const onLoadMore = useCallback(() => {
    setLoadingNext(true);
    setTimeout(() => {
      setClaims((prev) => [...prev, ...makeClaims(prev.length, 50)]);
      setLoadingNext(false);
    }, 600);
  }, []);

  return (
    <DataGrid
      columns={columns}
      rows={claims}
      keyExtractor={keyExtractor}
      ariaLabel="Claims"
      height={420}
      infinite={{hasNext, isLoadingNext, onLoadMore}}
    />
  );
};

export const Paginated: Story = () => {
  const all = useMemo(() => makeClaims(0, 240), []);
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const pageRows = all.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DataGrid
      columns={columns}
      rows={pageRows}
      keyExtractor={keyExtractor}
      ariaLabel="Claims"
      height={420}
      pagination={{page, pageCount: Math.ceil(all.length / pageSize), onPageChange: setPage}}
    />
  );
};

export const SortedAndClickable: Story = () => {
  const [sortColumn, setSortColumn] = useState('patient');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string | null>(null);
  const rows = useMemo(() => {
    const base = makeClaims(0, 200);
    const dir = sortDirection === 'asc' ? 1 : -1;
    return [...base].sort((a, b) => {
      const av = a[sortColumn];
      const bv = b[sortColumn];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [sortColumn, sortDirection]);

  return (
    <div>
      <DataGrid
        columns={columns}
        rows={rows}
        keyExtractor={keyExtractor}
        ariaLabel="Claims"
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={(c, d) => {
          setSortColumn(c);
          setSortDirection(d);
        }}
        onRowClick={(row) => setSelected(row.id)}
      />
      {selected && <p style={{color: 'var(--smd-text-secondary)'}}>Selected claim: {selected}</p>}
    </div>
  );
};

export const Empty: Story = () => (
  <DataGrid
    columns={columns}
    rows={[]}
    keyExtractor={keyExtractor}
    ariaLabel="Claims"
    emptyState="No claims match the current filters"
  />
);
