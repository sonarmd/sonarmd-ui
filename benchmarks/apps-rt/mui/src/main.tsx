import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {mountHarness} from '../../_harness';

const OPTS = [
  {value: 'a', label: 'Alpha'},
  {value: 'b', label: 'Beta'},
  {value: 'c', label: 'Gamma'},
];
const TABS = ['Alpha', 'Beta', 'Gamma'];
const CRUMBS = ['Home', 'Reports', 'Detail'];
const noop = () => {};

mountHarness({
  Button: (_i, t) => <Button variant="contained">Go {t}</Button>,
  Card: (_i, t) => (
    <Card>
      <CardContent>Card {t}</CardContent>
    </Card>
  ),
  Badge: (_i, t) => <Chip label={`B${t}`} color="success" />,
  TextInput: (_i, t) => <TextField value={`v${t}`} onChange={noop} />,
  Checkbox: (_i, t) => <Checkbox checked={t % 2 === 0} onChange={noop} />,
  Radio: (_i, t) => <Radio checked={t % 2 === 0} onChange={noop} />,
  Select: (_i, t) => (
    <Select value={OPTS[t % 3].value} onChange={noop}>
      {OPTS.map((o) => (
        <MenuItem key={o.value} value={o.value}>
          {o.label}
        </MenuItem>
      ))}
    </Select>
  ),
  Toggle: (_i, t) => <Switch checked={t % 2 === 0} onChange={noop} />,
  Alert: (_i, t) => <Alert severity="info">Msg {t}</Alert>,
  Avatar: (_i, t) => <Avatar>{`U${t % 9}`}</Avatar>,
  Progress: (_i, t) => <LinearProgress variant="determinate" value={(t * 7) % 100} />,
  Spinner: () => <CircularProgress />,
  Skeleton: () => <Skeleton variant="text" width={120} />,
  Separator: () => <Divider />,
  Breadcrumbs: () => (
    <Breadcrumbs>
      {CRUMBS.map((c, k) => (
        <span key={k}>{c}</span>
      ))}
    </Breadcrumbs>
  ),
  Pagination: (_i, t) => <Pagination count={8} page={(t % 5) + 1} onChange={noop} />,
  Tabs: (_i, t) => (
    <Tabs value={t % 3}>
      {TABS.map((label, k) => (
        <Tab key={k} label={label} />
      ))}
    </Tabs>
  ),
  Tooltip: (_i, t) => (
    <Tooltip title={`tip ${t}`}>
      <span>hover</span>
    </Tooltip>
  ),
});
