import {useMemo, useState} from 'react';
import {MemoryRouter} from 'react-router-dom';
import {AppShell, Sidebar, Tabs, Toggle, useTheme} from '../src/index';
import type {ComponentFixtures} from '../src/testing/defineComponentFixtures';

// Zone auto-discovery: the workbench is driven by the same *.fixtures.tsx the
// test harness uses, so a new component shows up here with zero registration and
// no duplicated render code (see DECISIONS.md).
const modules = import.meta.glob<{default: ComponentFixtures}>(
  '../src/components/**/*.fixtures.tsx',
  {eager: true},
);

interface Zone {
  name: string;
  entry: ComponentFixtures;
}

const ZONES: Zone[] = Object.entries(modules)
  .map(([path, mod]) => ({name: /components\/([^/]+)\//.exec(path)?.[1] ?? path, entry: mod.default}))
  .sort((a, b) => a.name.localeCompare(b.name));

const VIEWPORTS = [
  {key: 'sm', label: 'sm (375)', width: 375},
  {key: 'md', label: 'md (768)', width: 768},
  {key: 'desktop', label: '3-col desktop', width: 0},
];

const WorkbenchSidebar = ({active, onNavigate}: {active: string; onNavigate: (key: string) => void}) => (
  <Sidebar
    items={ZONES.map((z) => ({key: z.name, label: z.name}))}
    activeKey={active}
    onNavigate={onNavigate}
    header={<strong>@sonarmd/ui</strong>}
  />
);

export function Workbench(): JSX.Element {
  const {theme, toggle} = useTheme();
  const [active, setActive] = useState(ZONES[0]?.name ?? '');
  const [compact, setCompact] = useState(false);
  const [viewport, setViewport] = useState('desktop');

  const zone = useMemo(() => ZONES.find((z) => z.name === active), [active]);
  const width = VIEWPORTS.find((v) => v.key === viewport)?.width ?? 0;

  return (
    <AppShell
      sidebar={<WorkbenchSidebar active={active} onNavigate={setActive} />}
      style={{minHeight: '100vh', background: 'var(--smd-bg-subtle)'}}
    >
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--smd-space-5)',
            flexWrap: 'wrap',
            padding: 'var(--smd-space-4) var(--smd-space-6)',
            borderBottom: '1px solid var(--smd-border-default)',
            background: 'var(--smd-bg-base)',
          }}
        >
          <h1 style={{margin: 0, fontSize: 'var(--smd-font-size-xl)'}}>{active}</h1>
          <div style={{flex: 1}} />
          <Toggle label="Dark" checked={theme === 'dark'} onChange={toggle} />
          <Toggle label="Compact" checked={compact} onChange={() => setCompact((c) => !c)} />
          <Tabs
            tabs={VIEWPORTS.map((v) => ({key: v.key, label: v.label}))}
            activeTab={viewport}
            onChange={setViewport}
            variant="pills"
            size="sm"
          />
        </header>

        <div
          data-density={compact ? 'compact' : 'comfortable'}
          style={{
            padding: 'var(--smd-space-6)',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--smd-space-6)',
            width: width ? width : '100%',
            maxWidth: '100%',
          }}
        >
          {zone &&
            Object.entries(zone.entry.config.fixtures).map(([name, props]) => {
              const element = <zone.entry.Component {...props} />;
              return (
                <section key={name} style={{display: 'flex', flexDirection: 'column', gap: 'var(--smd-space-2)'}}>
                  <span style={{fontSize: 'var(--smd-font-size-sm)', color: 'var(--smd-text-tertiary)'}}>
                    {name}
                  </span>
                  {zone.entry.config.router ? <MemoryRouter>{element}</MemoryRouter> : element}
                </section>
              );
            })}
        </div>
      </div>
    </AppShell>
  );
}
