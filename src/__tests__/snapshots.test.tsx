/**
 * Snapshot tests for all 42 @sonarmd/ui components.
 *
 * Each test renders the component with minimal valid props and snapshots the
 * output. Run `vitest --update-snapshots` after intentional structural changes.
 *
 * Mocks:
 *   - echarts-for-react  → <div data-testid="echarts-chart" />
 *   - react-window List  → renders first 3 rows inline (no real DOM dimensions needed)
 */
import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {vi} from 'vitest';

// ── Mocks (hoisted by vitest) ─────────────────────────────────────────────────

vi.mock('../charts/ChartCanvas', () => ({
  ChartCanvas: () => <div data-testid="echarts-chart" />,
}));

vi.mock('react-window', () => ({
  List: ({
    rowComponent: Row,
    rowCount,
    rowProps,
  }: {
    rowComponent: React.ComponentType<{
      ariaAttributes: Record<string, string>;
      index: number;
      style: React.CSSProperties;
      [key: string]: unknown;
    }>;
    rowCount: number;
    rowProps?: Record<string, unknown>;
  }) => (
    <div data-testid="virtual-list">
      {Array.from({length: Math.min(rowCount, 3)}, (_, i) => (
        <Row key={i} ariaAttributes={{}} index={i} style={{}} {...(rowProps ?? {})} />
      ))}
    </div>
  ),
}));

// ── Imports ───────────────────────────────────────────────────────────────────

import {
  // Phase 0 - Action & Surface Primitives
  Button,
  Card,
  // Phase 1 - Form Primitives
  FieldWrapper,
  FormGrid,
  FormSection,
  FormActions,
  Fade,
  SecureField,
  TextInput,
  TextArea,
  Select,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Toggle,
  // Phase 2 — Complex Inputs
  Dropdown,
  Typeahead,
  MultiSelect,
  DatePicker,
  DateRangePicker,
  // Phase 3 — Feedback
  Badge,
  Alert,
  ToastProvider,
  Tooltip,
  Modal,
  ConfirmDialog,
  // Phase 4 — Data Display
  Skeleton,
  LoadingSpinner,
  EmptyState,
  KpiCard,
  KpiGrid,
  DataTable,
  // Phase 6 - Layout
  FilterBar,
  PageHeader,
  PageSection,
  Tabs,
  Sidebar,
  GapsBanner,
} from '../index';
import {
  // Phase 5 - Charts (now behind the ./charts subpath entry)
  BarChart,
  StackedBarChart,
  LineChart,
  AreaChart,
  StackedAreaChart,
  PieChart,
  GaugeChart,
  FunnelChart,
  BubbleChart,
  ChartCard,
} from '../charts';

// ── Shared fixtures ───────────────────────────────────────────────────────────

const noop = () => {};

const OPTIONS_2 = [
  {label: 'Option A', value: 'a'},
  {label: 'Option B', value: 'b'},
];

const SERIES_2 = [
  {key: 'a', name: 'Series A'},
  {key: 'b', name: 'Series B'},
];

const TIME_DATA = [
  {month: 'Jan', a: 100, b: 50},
  {month: 'Feb', a: 140, b: 60},
  {month: 'Mar', a: 120, b: 80},
];

// -- Phase 0: Action & Surface Primitives --------------------------------------

describe('Button', () => {
  it('renders primary md', () => {
    const {asFragment} = render(<Button>Save</Button>);
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders loading state', () => {
    const {asFragment} = render(<Button loading>Save</Button>);
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders ghost compact', () => {
    const {asFragment} = render(
      <Button variant="ghost" size="sm" density="compact">
        Cancel
      </Button>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Card', () => {
  it('renders with header and body', () => {
    const {asFragment} = render(
      <Card title="Revenue" subtitle="Last 30 days">
        <p>Body</p>
      </Card>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders elevated compact', () => {
    const {asFragment} = render(
      <Card variant="elevated" density="compact">
        <p>Body</p>
      </Card>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

// -- Phase 1: Form Primitives --------------------------------------------------

describe('FieldWrapper', () => {
  it('renders with label and child input', () => {
    const {asFragment} = render(
      <FieldWrapper label="Email" htmlFor="email">
        <input id="email" type="text" />
      </FieldWrapper>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('TextInput', () => {
  it('renders default state', () => {
    const {asFragment} = render(<TextInput name="email" placeholder="Enter email" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders error state', () => {
    const {asFragment} = render(
      <TextInput name="email" label="Email" error="Required" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('TextArea', () => {
  it('renders default state', () => {
    const {asFragment} = render(<TextArea name="notes" placeholder="Enter notes" />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Select', () => {
  it('renders with options', () => {
    const {asFragment} = render(
      <Select name="size" label="Size" options={OPTIONS_2} placeholder="Choose…" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Checkbox', () => {
  it('renders unchecked', () => {
    const {asFragment} = render(<Checkbox label="I agree to the terms" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders checked', () => {
    const {asFragment} = render(
      <Checkbox label="I agree to the terms" defaultChecked />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('CheckboxGroup', () => {
  it('renders with one option selected', () => {
    const {asFragment} = render(
      <CheckboxGroup
        label="Sizes"
        options={OPTIONS_2}
        value={['a']}
        onChange={noop}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Radio', () => {
  it('renders unchecked', () => {
    const {asFragment} = render(
      <Radio label="Option A" name="choice" value="a" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('RadioGroup', () => {
  it('renders with selection', () => {
    const {asFragment} = render(
      <RadioGroup
        label="Choice"
        name="choice"
        options={OPTIONS_2}
        value="a"
        onChange={noop}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Toggle', () => {
  it('renders off', () => {
    const {asFragment} = render(
      <Toggle label="Dark mode" checked={false} onChange={noop} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders on', () => {
    const {asFragment} = render(
      <Toggle label="Dark mode" checked={true} onChange={noop} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

// ── Phase 2: Complex Inputs ───────────────────────────────────────────────────

describe('Dropdown', () => {
  it('renders closed with placeholder', () => {
    const {asFragment} = render(
      <Dropdown
        label="Category"
        options={OPTIONS_2}
        value={null}
        onChange={noop}
        placeholder="Select…"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with selected value', () => {
    const {asFragment} = render(
      <Dropdown options={OPTIONS_2} value="a" onChange={noop} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Typeahead', () => {
  it('renders empty state', () => {
    const {asFragment} = render(
      <Typeahead
        label="Search"
        value={null}
        onChange={noop}
        loadOptions={async () => []}
        placeholder="Type to search…"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('MultiSelect', () => {
  it('renders with no selection', () => {
    const {asFragment} = render(
      <MultiSelect
        label="Tags"
        options={OPTIONS_2}
        value={[]}
        onChange={noop}
        placeholder="Select tags…"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with selections', () => {
    const {asFragment} = render(
      <MultiSelect options={OPTIONS_2} value={['a', 'b']} onChange={noop} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DatePicker', () => {
  it('renders with no value', () => {
    const {asFragment} = render(<DatePicker value={null} onChange={noop} label="Date" />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DateRangePicker', () => {
  it('renders with no value', () => {
    const {asFragment} = render(
      <DateRangePicker value={null} onChange={noop} label="Date range" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

// ── Phase 3: Feedback ─────────────────────────────────────────────────────────

describe('Badge', () => {
  it('renders primary variant', () => {
    const {asFragment} = render(<Badge variant="primary">New</Badge>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders danger variant', () => {
    const {asFragment} = render(<Badge variant="danger">Error</Badge>);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Alert', () => {
  it('renders info variant', () => {
    const {asFragment} = render(
      <Alert variant="info">This is an informational message.</Alert>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders error variant with title', () => {
    const {asFragment} = render(
      <Alert variant="error" title="Something went wrong">
        Please try again later.
      </Alert>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('ToastProvider', () => {
  it('renders children without crashing', () => {
    const {asFragment} = render(
      <ToastProvider>
        <div data-testid="app">Application content</div>
      </ToastProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Tooltip', () => {
  it('renders trigger (tooltip hidden by default)', () => {
    const {asFragment} = render(
      <Tooltip content="Helpful tip" placement="top">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Modal', () => {
  it('renders open state', () => {
    const {baseElement} = render(
      <Modal open title="Confirmation" onClose={noop}>
        <p>Are you sure you want to proceed?</p>
      </Modal>,
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('renders closed (null)', () => {
    const {asFragment} = render(
      <Modal open={false} title="Confirmation" onClose={noop}>
        <p>Content</p>
      </Modal>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('ConfirmDialog', () => {
  it('renders open state', () => {
    const {baseElement} = render(
      <ConfirmDialog
        open
        title="Delete item?"
        message="This action cannot be undone."
        onConfirm={noop}
        onCancel={noop}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('renders danger variant', () => {
    const {baseElement} = render(
      <ConfirmDialog
        open
        title="Delete account?"
        message="All data will be permanently removed."
        variant="danger"
        confirmLabel="Delete"
        onConfirm={noop}
        onCancel={noop}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });
});

// ── Phase 4: Data Display ─────────────────────────────────────────────────────

describe('Skeleton', () => {
  it('renders text variant', () => {
    const {asFragment} = render(<Skeleton variant="text" width={200} height={16} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders circle variant', () => {
    const {asFragment} = render(<Skeleton variant="circle" width={40} height={40} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders multi-line text', () => {
    const {asFragment} = render(<Skeleton variant="text" lines={3} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('LoadingSpinner', () => {
  it('renders md size', () => {
    const {asFragment} = render(<LoadingSpinner size="md" />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('EmptyState', () => {
  it('renders with title and description', () => {
    const {asFragment} = render(
      <EmptyState title="No results found" description="Try adjusting your search filters." />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with action button', () => {
    const {asFragment} = render(
      <EmptyState
        title="No data yet"
        action={{label: 'Add your first item', onClick: noop}}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('KpiCard', () => {
  it('renders basic metric', () => {
    const {asFragment} = render(<KpiCard title="Revenue" value="$42,000" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with trend up', () => {
    const {asFragment} = render(
      <KpiCard
        title="Active users"
        value={1_234}
        trend={{direction: 'up', value: '+12%', sentiment: 'positive'}}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders loading state', () => {
    const {asFragment} = render(<KpiCard title="Revenue" value="—" isLoading />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('KpiGrid', () => {
  it('renders 4-column grid', () => {
    const {asFragment} = render(
      <KpiGrid
        items={[
          {title: 'Revenue', value: '$42K'},
          {title: 'Users', value: '1,234'},
          {title: 'Conversion', value: '3.4%'},
          {title: 'Churn', value: '0.8%'},
        ]}
        columns={4}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('DataTable', () => {
  const columns = [
    {key: 'name', header: 'Name'},
    {key: 'score', header: 'Score'},
  ];
  const data = [
    {name: 'Alpha', score: 95},
    {name: 'Beta', score: 87},
    {name: 'Gamma', score: 72},
  ];

  it('renders with data', () => {
    const {asFragment} = render(
      <DataTable columns={columns} data={data} keyExtractor={(r) => r.name} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders loading state', () => {
    const {asFragment} = render(
      <DataTable columns={columns} data={[]} keyExtractor={(r) => r.name} isLoading />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty state', () => {
    const {asFragment} = render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={(r) => r.name}
        emptyMessage="No records found"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

// ── Phase 5: Charts ───────────────────────────────────────────────────────────

describe('BarChart', () => {
  it('renders with data', () => {
    const {asFragment} = render(
      <BarChart data={TIME_DATA} xKey="month" yKey="a" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('StackedBarChart', () => {
  it('renders with series', () => {
    const {asFragment} = render(
      <StackedBarChart data={TIME_DATA} xKey="month" series={SERIES_2} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('LineChart', () => {
  it('renders with series', () => {
    const {asFragment} = render(
      <LineChart data={TIME_DATA} xKey="month" series={SERIES_2} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('AreaChart', () => {
  it('renders with data', () => {
    const {asFragment} = render(
      <AreaChart data={TIME_DATA} xKey="month" yKey="a" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('StackedAreaChart', () => {
  it('renders with series', () => {
    const {asFragment} = render(
      <StackedAreaChart data={TIME_DATA} xKey="month" series={SERIES_2} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('PieChart', () => {
  it('renders pie', () => {
    const {asFragment} = render(
      <PieChart
        data={[
          {name: 'Category A', value: 60},
          {name: 'Category B', value: 40},
        ]}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders donut', () => {
    const {asFragment} = render(
      <PieChart
        donut
        data={[
          {name: 'Category A', value: 60},
          {name: 'Category B', value: 40},
        ]}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('GaugeChart', () => {
  it('renders at 75%', () => {
    const {asFragment} = render(<GaugeChart value={0.75} label="Performance" />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('FunnelChart', () => {
  it('renders stages', () => {
    const {asFragment} = render(
      <FunnelChart
        stages={[
          {name: 'Visited', value: 1000},
          {name: 'Signed up', value: 500},
          {name: 'Activated', value: 200},
        ]}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('BubbleChart', () => {
  it('renders data points', () => {
    const {asFragment} = render(
      <BubbleChart
        data={[
          {name: 'A', x: 10, y: 20, size: 5},
          {name: 'B', x: 30, y: 15, size: 10},
        ]}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

// ── Phase 6: Layout ───────────────────────────────────────────────────────────

describe('ChartCard', () => {
  it('renders with content', () => {
    const {asFragment} = render(
      <ChartCard title="Revenue Over Time" subtitle="Last 30 days">
        <div data-testid="chart-stub" />
      </ChartCard>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders loading state', () => {
    const {asFragment} = render(
      <ChartCard title="Revenue" isLoading>
        <div />
      </ChartCard>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty state', () => {
    const {asFragment} = render(
      <ChartCard title="Revenue" isEmpty emptyMessage="No data for this period">
        <div />
      </ChartCard>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('FilterBar', () => {
  it('renders with active filters', () => {
    const {asFragment} = render(
      <FilterBar onClear={noop} activeFilterCount={3}>
        <span>Status: Active</span>
      </FilterBar>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('PageHeader', () => {
  it('renders title and subtitle', () => {
    const {asFragment} = render(
      <PageHeader title="Analytics Dashboard" subtitle="Monitor your key metrics" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with back link', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <PageHeader title="Report Detail" backTo="/reports" backLabel="Reports" />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('PageSection', () => {
  it('renders with title and children', () => {
    const {asFragment} = render(
      <PageSection title="Overview" subtitle="Key performance indicators">
        <p>Section content here.</p>
      </PageSection>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Tabs', () => {
  it('renders underline variant', () => {
    const {asFragment} = render(
      <Tabs
        tabs={[
          {key: 'overview', label: 'Overview'},
          {key: 'details', label: 'Details'},
          {key: 'history', label: 'History'},
        ]}
        activeTab="overview"
        onChange={noop}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders pills variant', () => {
    const {asFragment} = render(
      <Tabs
        tabs={[
          {key: 'week', label: 'Week'},
          {key: 'month', label: 'Month'},
          {key: 'year', label: 'Year'},
        ]}
        activeTab="month"
        onChange={noop}
        variant="pills"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Sidebar', () => {
  it('renders nav items', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <Sidebar
          items={[
            {key: 'dashboard', label: 'Dashboard', to: '/'},
            {key: 'analytics', label: 'Analytics', to: '/analytics'},
            {key: 'settings', label: 'Settings', to: '/settings'},
          ]}
          activeKey="dashboard"
          onNavigate={noop}
        />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders collapsed', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <Sidebar
          items={[
            {key: 'dashboard', label: 'Dashboard', to: '/'},
            {key: 'analytics', label: 'Analytics', to: '/analytics'},
          ]}
          activeKey="analytics"
          onNavigate={noop}
          collapsed
        />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('GapsBanner', () => {
  it('renders info variant', () => {
    const {asFragment} = render(
      <GapsBanner
        title="Update available"
        description="A new version is ready to install."
        variant="info"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders warning with action', () => {
    const {asFragment} = render(
      <GapsBanner
        title="Maintenance scheduled"
        description="Downtime expected at 2 AM UTC."
        variant="warning"
        action={{label: 'View details', onClick: noop}}
        dismissible
        onDismiss={noop}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('FormGrid', () => {
  it('renders a two-column grid', () => {
    const {asFragment} = render(
      <FormGrid columns={2} gap="md">
        <TextInput name="first" label="First name" />
        <TextInput name="last" label="Last name" />
      </FormGrid>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders staggered', () => {
    const {asFragment} = render(
      <FormGrid columns={2} stagger>
        <TextInput name="a" label="A" />
        <TextInput name="b" label="B" />
      </FormGrid>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('FormSection', () => {
  it('renders fieldset with legend and description', () => {
    const {asFragment} = render(
      <FormSection title="Demographics" description="Used to personalize care.">
        <TextInput name="dob" label="Date of birth" />
      </FormSection>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('FormActions', () => {
  it('renders end-aligned actions', () => {
    const {asFragment} = render(
      <FormActions>
        <button type="button">Cancel</button>
        <button type="submit">Save</button>
      </FormActions>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Fade', () => {
  it('renders children with entrance class', () => {
    const {asFragment} = render(
      <Fade delay={60}>
        <p>Loaded</p>
      </Fade>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('SecureField', () => {
  it('renders masked with reveal toggle', () => {
    const {asFragment} = render(
      <SecureField name="ssn" label="Social Security Number" placeholder="000-00-0000" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders error state', () => {
    const {asFragment} = render(
      <SecureField name="mrn" label="MRN" error="Required" revealable={false} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
