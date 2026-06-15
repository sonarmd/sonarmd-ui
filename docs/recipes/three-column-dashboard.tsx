/**
 * Recipe 1: 3-column dashboard
 *
 * AppShell + KpiGrid + DataTable, compact density.
 * All tokens, no hardcoded colors or px values in component code.
 */
import React from 'react';
import {AppShell} from '../../src/components/AppShell';
import {KpiGrid} from '../../src/components/KpiGrid';
import {DataTable, Column} from '../../src/components/DataTable';
import type {KpiCardProps} from '../../src/components/KpiCard';

const Nav = (): JSX.Element => (
  <nav aria-label="Main navigation" style={{padding: 16}}>
    <strong>SonarMD</strong>
  </nav>
);

interface Patient {
  id: string;
  name: string;
  status: string;
  lastVisit: string;
}

const columns: Column<Patient>[] = [
  {key: 'name', header: 'Patient', width: 200},
  {key: 'status', header: 'Status', width: 120},
  {key: 'lastVisit', header: 'Last Visit', width: 150},
];

const rows: Patient[] = [
  {id: '1', name: 'J. Smith', status: 'Active', lastVisit: '2026-06-01'},
  {id: '2', name: 'M. Chen', status: 'Review', lastVisit: '2026-05-28'},
];

const kpis: KpiCardProps[] = [
  {title: 'Active Patients', value: '1,240', trend: {direction: 'up', value: '3.2%', sentiment: 'positive'}},
  {title: 'Avg HCC Score', value: '0.87', trend: {direction: 'down', value: '0.04', sentiment: 'neutral'}},
  {title: 'Reviews Due', value: '23', trend: {direction: 'up', value: '5', sentiment: 'negative'}},
];

export function ThreeColumnDashboard(): JSX.Element {
  return (
    <div data-density="compact">
      <AppShell sidebar={<Nav />}>
        <div style={{padding: 24}}>
          <KpiGrid items={kpis} columns={3} />
          <DataTable
            data={rows}
            columns={columns}
            keyExtractor={(r) => r.id}
          />
        </div>
      </AppShell>
    </div>
  );
}
