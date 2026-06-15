import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@sonarmd/ui/tokens.css';
import '@sonarmd/ui/style.css';
import {
  Button,
  Card,
  Badge,
  TextInput,
  Modal,
  Sidebar,
  Tabs,
  KpiGrid,
  DataTable,
} from '@sonarmd/ui';
import {navItems, kpis, tabs, rows, tableColumns, statusTone, type PatientRow} from '../../../shared/shellData';

const badgeVariant = (tone: 'success' | 'warning' | 'danger') => tone;

function Shell(): JSX.Element {
  const [nav, setNav] = useState('overview');
  const [tab, setTab] = useState('roster');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const columns = tableColumns.map((c) => ({
    ...c,
    render:
      c.key === 'status'
        ? (_v: unknown, row: PatientRow) => (
            <Badge variant={badgeVariant(statusTone(row.status))}>{row.status}</Badge>
          )
        : undefined,
  }));

  return (
    <div style={{display: 'flex', minHeight: '100vh'}}>
      <Sidebar items={navItems} activeKey={nav} onNavigate={setNav} header={<strong>SonarMD</strong>} />
      <main style={{flex: 1, padding: 'var(--smd-space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--smd-space-5)'}}>
        <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <h1 style={{margin: 0, fontSize: 'var(--smd-font-size-2xl)'}}>Population Dashboard</h1>
          <Button variant="primary" onClick={() => setOpen(true)}>New patient</Button>
        </header>

        <KpiGrid
          items={kpis.map((k) => ({
            title: k.title,
            value: k.value,
            trend: {direction: k.direction, value: k.delta, sentiment: k.direction === 'up' ? 'positive' : 'negative'},
          }))}
        />

        <Card title="Care management" subtitle="Roster and open gaps">
          <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
          <DataTable columns={columns} data={rows} keyExtractor={(r) => r.id} />
        </Card>
      </main>

      <Modal open={open} onClose={() => setOpen(false)} title="New patient">
        <form
          style={{display: 'flex', flexDirection: 'column', gap: 'var(--smd-space-4)'}}
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          <TextInput label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextInput label="MRN" />
          <div style={{display: 'flex', gap: 'var(--smd-space-2)', justifyContent: 'flex-end'}}>
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Shell />
  </React.StrictMode>,
);
