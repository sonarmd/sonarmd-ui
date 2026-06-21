import '@sonarmd/ui/tokens.css';
import '@sonarmd/ui/style.css';
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  LoadingSpinner,
  Pagination,
  Progress,
  Radio,
  Select,
  Separator,
  Skeleton,
  Tabs,
  TextInput,
  Toggle,
  Tooltip,
} from '@sonarmd/ui';
import {mountHarness} from '../../_harness';

const OPTS = [
  {value: 'a', label: 'Alpha'},
  {value: 'b', label: 'Beta'},
  {value: 'c', label: 'Gamma'},
];
const TABS = [
  {key: 'a', label: 'Alpha'},
  {key: 'b', label: 'Beta'},
  {key: 'c', label: 'Gamma'},
];
const CRUMBS = [{label: 'Home', href: '#'}, {label: 'Reports', href: '#'}, {label: 'Detail'}];
const noop = () => {};

mountHarness({
  Button: (_i, t) => <Button>Go {t}</Button>,
  Card: (_i, t) => <Card title={`Card ${t}`}>body</Card>,
  Badge: (_i, t) => <Badge variant="success">{`B${t}`}</Badge>,
  TextInput: (_i, t) => <TextInput value={`v${t}`} onChange={noop} />,
  Checkbox: (_i, t) => <Checkbox label="Opt" checked={t % 2 === 0} onChange={noop} />,
  Radio: (_i, t) => <Radio label="Opt" checked={t % 2 === 0} onChange={noop} />,
  Select: (_i, t) => <Select options={OPTS} value={OPTS[t % 3].value} onChange={noop} />,
  Toggle: (_i, t) => <Toggle label="On" checked={t % 2 === 0} onChange={noop} />,
  Alert: (_i, t) => <Alert variant="info">Msg {t}</Alert>,
  Avatar: (_i, t) => <Avatar name={`U ${t % 9}`} />,
  Progress: (_i, t) => <Progress value={(t * 7) % 100} />,
  Spinner: () => <LoadingSpinner />,
  Skeleton: () => <Skeleton />,
  Separator: () => <Separator />,
  Breadcrumbs: () => <Breadcrumbs items={CRUMBS} />,
  Pagination: (_i, t) => <Pagination page={(t % 5) + 1} pageCount={8} onPageChange={noop} />,
  Tabs: (_i, t) => <Tabs tabs={TABS} activeTab={TABS[t % 3].key} onChange={noop} />,
  Tooltip: (_i, t) => (
    <Tooltip content={`tip ${t}`}>
      <span>hover</span>
    </Tooltip>
  ),
});
