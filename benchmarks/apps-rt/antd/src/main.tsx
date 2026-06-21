import {
  Alert,
  Avatar,
  Badge as AntBadge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  Pagination,
  Progress,
  Radio,
  Select,
  Skeleton,
  Spin,
  Switch,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import {mountHarness} from '../../_harness';

// AntBadge imported to keep the named-export shape identical across files; the
// Badge row maps to antd Tag, the idiomatic status-label primitive.
void AntBadge;

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
const CRUMBS = [{title: 'Home'}, {title: 'Reports'}, {title: 'Detail'}];
const noop = () => {};

mountHarness({
  Button: (_i, t) => <Button type="primary">Go {t}</Button>,
  Card: (_i, t) => <Card size="small">Card {t}</Card>,
  Badge: (_i, t) => <Tag color="green">{`B${t}`}</Tag>,
  TextInput: (_i, t) => <Input value={`v${t}`} onChange={noop} />,
  Checkbox: (_i, t) => <Checkbox checked={t % 2 === 0} onChange={noop}>Opt</Checkbox>,
  Radio: (_i, t) => <Radio checked={t % 2 === 0} onChange={noop}>Opt</Radio>,
  Select: (_i, t) => <Select value={OPTS[t % 3].value} options={OPTS} onChange={noop} style={{width: 120}} />,
  Toggle: (_i, t) => <Switch checked={t % 2 === 0} onChange={noop} />,
  Alert: (_i, t) => <Alert type="info" message={`Msg ${t}`} />,
  Avatar: (_i, t) => <Avatar>{`U${t % 9}`}</Avatar>,
  Progress: (_i, t) => <Progress percent={(t * 7) % 100} />,
  Spinner: () => <Spin />,
  Skeleton: () => <Skeleton paragraph={false} />,
  Separator: () => <Divider />,
  Breadcrumbs: () => <Breadcrumb items={CRUMBS} />,
  Pagination: (_i, t) => <Pagination current={(t % 5) + 1} total={80} onChange={noop} />,
  Tabs: (_i, t) => <Tabs activeKey={TABS[t % 3].key} items={TABS} />,
  Tooltip: (_i, t) => (
    <Tooltip title={`tip ${t}`}>
      <span>hover</span>
    </Tooltip>
  ),
});
