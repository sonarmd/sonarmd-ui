/**
 * Harness completeness gate (V1_SPEC 7.0.2). Every component must have a
 * *.fixtures.tsx. During the S7.0 migration, not-yet-converted components are
 * tracked in PENDING_MIGRATION (still covered by the monolithic
 * snapshots.test.tsx). The gate fails if a component is missing a fixture AND is
 * not tracked, or if a tracked component actually has a fixture (stale entry).
 * When PENDING_MIGRATION is empty the monolith is deleted.
 */
import {readdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {test, expect} from 'vitest';

const COMPONENTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'components');

const PENDING_MIGRATION = new Set<string>([
  'Alert', 'AreaChart', 'BarChart', 'BubbleChart', 'ChartCard', 'Checkbox',
  'CheckboxGroup', 'ConfirmDialog', 'DataTable', 'DatePicker', 'DateRangePicker',
  'Dropdown', 'EmptyState', 'Fade', 'FieldWrapper', 'FilterBar', 'Form',
  'FormActions', 'FormErrorSummary', 'FormGrid', 'FormSection', 'FunnelChart',
  'GapsBanner', 'GaugeChart', 'KpiCard', 'KpiGrid', 'LineChart', 'LoadingSpinner',
  'Modal', 'MultiSelect', 'PageHeader', 'PageSection', 'PieChart', 'Radio',
  'RadioGroup', 'SecureField', 'Select', 'Sidebar', 'Skeleton', 'StackedAreaChart',
  'StackedBarChart', 'Stagger', 'Tabs', 'TextArea', 'TextInput', 'Toast', 'Toggle',
  'Tooltip', 'Typeahead',
]);

const hasFixture = (dir: string): boolean =>
  readdirSync(join(COMPONENTS_DIR, dir)).some((f) => f.endsWith('.fixtures.tsx'));

const componentDirs = (): string[] =>
  readdirSync(COMPONENTS_DIR, {withFileTypes: true})
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

test('every component has a fixtures file (or is tracked in the migration backlog)', () => {
  const missing = componentDirs().filter((d) => !hasFixture(d));
  const untracked = missing.filter((d) => !PENDING_MIGRATION.has(d)).sort();
  expect(untracked).toEqual([]);
});

test('migration backlog has no stale entries (migrated components removed from PENDING)', () => {
  const stale = [...PENDING_MIGRATION].filter((d) => hasFixture(d)).sort();
  expect(stale).toEqual([]);
});
