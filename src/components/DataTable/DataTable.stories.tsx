import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {DataTable} from './index';
import type {Column} from './index';
import {Badge} from '../Badge';

interface Patient extends Record<string, unknown> {
  id: string;
  name: string;
  status: string;
  hccScore: number;
  lastVisit: string;
}

const data: Patient[] = [
  {id: '1', name: 'Jane Smith', status: 'Active', hccScore: 1.23, lastVisit: '2026-06-01'},
  {id: '2', name: 'Michael Chen', status: 'Review', hccScore: 0.87, lastVisit: '2026-05-28'},
  {id: '3', name: 'Alice Johnson', status: 'Active', hccScore: 2.01, lastVisit: '2026-06-10'},
  {id: '4', name: 'Robert Davis', status: 'Closed', hccScore: 0.45, lastVisit: '2026-04-15'},
];

const columns: Column<Patient>[] = [
  {key: 'name', header: 'Patient', width: 180},
  {key: 'status', header: 'Status', width: 100,
    render: (v) => <Badge variant={v === 'Active' ? 'success' : v === 'Review' ? 'warning' : 'neutral'}>{String(v)}</Badge>},
  {key: 'hccScore', header: 'HCC Score', width: 120},
  {key: 'lastVisit', header: 'Last Visit'},
];

export const Default: Story = () => (
  <DataTable data={data} columns={columns} keyExtractor={(r) => r.id} />
);

export const Clickable: Story = () => {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(r) => r.id}
        onRowClick={(row) => setSelected(row.id)}
      />
      {selected && <p style={{color: 'var(--smd-text-secondary)'}}>Selected: {selected}</p>}
    </div>
  );
};

export const Loading: Story = () => (
  <DataTable data={[]} columns={columns} keyExtractor={(r) => r.id} isLoading />
);

export const Empty: Story = () => (
  <DataTable data={[]} columns={columns} keyExtractor={(r) => r.id} />
);
