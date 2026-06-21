import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormSelect from 'react-bootstrap/FormSelect';
import Pagination from 'react-bootstrap/Pagination';
import Placeholder from 'react-bootstrap/Placeholder';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {mountHarness} from '../../_harness';

// React Bootstrap ships no Avatar, Divider, or standalone Tooltip-without-overlay
// primitive, so those rows are absent here and report as n/a in the matrix.

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
const CRUMBS = ['Home', 'Reports', 'Detail'];
const noop = () => {};

mountHarness({
  Button: (_i, t) => <Button variant="primary">Go {t}</Button>,
  Card: (_i, t) => (
    <Card>
      <Card.Body>Card {t}</Card.Body>
    </Card>
  ),
  Badge: (_i, t) => <Badge bg="success">{`B${t}`}</Badge>,
  TextInput: (_i, t) => <FormControl value={`v${t}`} onChange={noop} />,
  Checkbox: (_i, t) => <FormCheck type="checkbox" label="Opt" checked={t % 2 === 0} onChange={noop} />,
  Radio: (_i, t) => <FormCheck type="radio" label="Opt" checked={t % 2 === 0} onChange={noop} />,
  Select: (_i, t) => (
    <FormSelect value={OPTS[t % 3].value} onChange={noop}>
      {OPTS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </FormSelect>
  ),
  Toggle: (_i, t) => <FormCheck type="switch" label="On" checked={t % 2 === 0} onChange={noop} />,
  Alert: (_i, t) => <Alert variant="info">Msg {t}</Alert>,
  Progress: (_i, t) => <ProgressBar now={(t * 7) % 100} />,
  Spinner: () => <Spinner animation="border" />,
  Skeleton: () => (
    <Placeholder as="p" animation="glow">
      <Placeholder xs={6} />
    </Placeholder>
  ),
  Breadcrumbs: () => (
    <Breadcrumb>
      {CRUMBS.map((c, k) => (
        <Breadcrumb.Item key={k}>{c}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  ),
  Pagination: (_i, t) => (
    <Pagination>
      {Array.from({length: 8}, (_x, k) => (
        <Pagination.Item key={k} active={k === t % 5}>
          {k + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  ),
  Tabs: (_i, t) => (
    <Tabs activeKey={TABS[t % 3].key}>
      {TABS.map((tb) => (
        <Tab key={tb.key} eventKey={tb.key} title={tb.label} />
      ))}
    </Tabs>
  ),
});
