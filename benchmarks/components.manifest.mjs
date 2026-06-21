// Per-component benchmark manifest. For each component, the import + a minimal
// JSX reference per library so esbuild keeps the module graph. CSS is NOT listed
// here: it is a per-library floor applied by the runner (sonarmd -> tokens.css +
// style.css, bootstrap -> bootstrap.min.css, mui/antd -> CSS-in-JS, no file).
//
// jsx only needs to REFERENCE the imported symbol; the production build is static
// (never executed), so props need not be valid - they just prevent tree-shaking.
// `null` for a library means no direct equivalent ships in that library.

const s = (imp, jsx) => ({imp, jsx});

export const COMPONENTS = [
  {
    name: 'Button',
    libs: {
      sonarmd: s("import {Button} from '@sonarmd/ui';", '<Button>x</Button>'),
      mui: s("import Button from '@mui/material/Button';", '<Button>x</Button>'),
      antd: s("import {Button} from 'antd';", '<Button>x</Button>'),
      bootstrap: s("import Button from 'react-bootstrap/Button';", '<Button>x</Button>'),
    },
  },
  {
    name: 'Card',
    libs: {
      sonarmd: s("import {Card} from '@sonarmd/ui';", '<Card>x</Card>'),
      mui: s("import Card from '@mui/material/Card';", '<Card>x</Card>'),
      antd: s("import {Card} from 'antd';", '<Card>x</Card>'),
      bootstrap: s("import Card from 'react-bootstrap/Card';", '<Card>x</Card>'),
    },
  },
  {
    name: 'Badge / Chip / Tag',
    libs: {
      sonarmd: s("import {Badge} from '@sonarmd/ui';", '<Badge>x</Badge>'),
      mui: s("import Chip from '@mui/material/Chip';", '<Chip label="x" />'),
      antd: s("import {Tag} from 'antd';", '<Tag>x</Tag>'),
      bootstrap: s("import Badge from 'react-bootstrap/Badge';", '<Badge>x</Badge>'),
    },
  },
  {
    name: 'TextInput',
    libs: {
      sonarmd: s("import {TextInput} from '@sonarmd/ui';", '<TextInput />'),
      mui: s("import TextField from '@mui/material/TextField';", '<TextField />'),
      antd: s("import {Input} from 'antd';", '<Input />'),
      bootstrap: s("import FormControl from 'react-bootstrap/FormControl';", '<FormControl />'),
    },
  },
  {
    name: 'Checkbox',
    libs: {
      sonarmd: s("import {Checkbox} from '@sonarmd/ui';", '<Checkbox />'),
      mui: s("import Checkbox from '@mui/material/Checkbox';", '<Checkbox />'),
      antd: s("import {Checkbox} from 'antd';", '<Checkbox />'),
      bootstrap: s("import FormCheck from 'react-bootstrap/FormCheck';", '<FormCheck />'),
    },
  },
  {
    name: 'Radio group',
    libs: {
      sonarmd: s("import {RadioGroup} from '@sonarmd/ui';", '<RadioGroup options={[]} />'),
      mui: s("import RadioGroup from '@mui/material/RadioGroup';\nimport Radio from '@mui/material/Radio';", '<RadioGroup><Radio /></RadioGroup>'),
      antd: s("import {Radio} from 'antd';", '<Radio.Group />'),
      bootstrap: s("import FormCheck from 'react-bootstrap/FormCheck';", '<FormCheck type="radio" />'),
    },
  },
  {
    name: 'Select',
    libs: {
      sonarmd: s("import {Select} from '@sonarmd/ui';", '<Select options={[]} />'),
      mui: s("import Select from '@mui/material/Select';\nimport MenuItem from '@mui/material/MenuItem';", '<Select><MenuItem /></Select>'),
      antd: s("import {Select} from 'antd';", '<Select />'),
      bootstrap: s("import FormSelect from 'react-bootstrap/FormSelect';", '<FormSelect />'),
    },
  },
  {
    name: 'Toggle / Switch',
    libs: {
      sonarmd: s("import {Toggle} from '@sonarmd/ui';", '<Toggle />'),
      mui: s("import Switch from '@mui/material/Switch';", '<Switch />'),
      antd: s("import {Switch} from 'antd';", '<Switch />'),
      bootstrap: s("import FormCheck from 'react-bootstrap/FormCheck';", '<FormCheck type="switch" />'),
    },
  },
  {
    name: 'Modal / Dialog',
    libs: {
      sonarmd: s("import {Modal} from '@sonarmd/ui';", '<Modal open={false} onClose={()=>{}} />'),
      mui: s("import Dialog from '@mui/material/Dialog';", '<Dialog open={false} />'),
      antd: s("import {Modal} from 'antd';", '<Modal open={false} />'),
      bootstrap: s("import Modal from 'react-bootstrap/Modal';", '<Modal show={false} />'),
    },
  },
  {
    name: 'Tooltip',
    libs: {
      sonarmd: s("import {Tooltip} from '@sonarmd/ui';", '<Tooltip label="x"><span/></Tooltip>'),
      mui: s("import Tooltip from '@mui/material/Tooltip';", '<Tooltip title="x"><span/></Tooltip>'),
      antd: s("import {Tooltip} from 'antd';", '<Tooltip title="x"><span/></Tooltip>'),
      bootstrap: s("import Tooltip from 'react-bootstrap/Tooltip';", '<Tooltip>x</Tooltip>'),
    },
  },
  {
    name: 'Tabs',
    libs: {
      sonarmd: s("import {Tabs} from '@sonarmd/ui';", '<Tabs tabs={[]} activeTab="" onChange={()=>{}} />'),
      mui: s("import Tabs from '@mui/material/Tabs';\nimport Tab from '@mui/material/Tab';", '<Tabs><Tab /></Tabs>'),
      antd: s("import {Tabs} from 'antd';", '<Tabs items={[]} />'),
      bootstrap: s("import Tabs from 'react-bootstrap/Tabs';\nimport Tab from 'react-bootstrap/Tab';", '<Tabs><Tab eventKey="a" /></Tabs>'),
    },
  },
  {
    name: 'Alert',
    libs: {
      sonarmd: s("import {Alert} from '@sonarmd/ui';", '<Alert>x</Alert>'),
      mui: s("import Alert from '@mui/material/Alert';", '<Alert>x</Alert>'),
      antd: s("import {Alert} from 'antd';", '<Alert message="x" />'),
      bootstrap: s("import Alert from 'react-bootstrap/Alert';", '<Alert>x</Alert>'),
    },
  },
  {
    name: 'Accordion / Collapse',
    libs: {
      sonarmd: s("import {Accordion} from '@sonarmd/ui';", '<Accordion items={[]} />'),
      mui: s("import Accordion from '@mui/material/Accordion';", '<Accordion />'),
      antd: s("import {Collapse} from 'antd';", '<Collapse items={[]} />'),
      bootstrap: s("import Accordion from 'react-bootstrap/Accordion';", '<Accordion />'),
    },
  },
  {
    name: 'Avatar',
    libs: {
      sonarmd: s("import {Avatar} from '@sonarmd/ui';", '<Avatar name="x" />'),
      mui: s("import Avatar from '@mui/material/Avatar';", '<Avatar>x</Avatar>'),
      antd: s("import {Avatar} from 'antd';", '<Avatar>x</Avatar>'),
      bootstrap: null,
    },
  },
  {
    name: 'Progress bar',
    libs: {
      sonarmd: s("import {Progress} from '@sonarmd/ui';", '<Progress value={50} />'),
      mui: s("import LinearProgress from '@mui/material/LinearProgress';", '<LinearProgress value={50} />'),
      antd: s("import {Progress} from 'antd';", '<Progress percent={50} />'),
      bootstrap: s("import ProgressBar from 'react-bootstrap/ProgressBar';", '<ProgressBar now={50} />'),
    },
  },
  {
    name: 'Spinner',
    libs: {
      sonarmd: s("import {LoadingSpinner} from '@sonarmd/ui';", '<LoadingSpinner />'),
      mui: s("import CircularProgress from '@mui/material/CircularProgress';", '<CircularProgress />'),
      antd: s("import {Spin} from 'antd';", '<Spin />'),
      bootstrap: s("import Spinner from 'react-bootstrap/Spinner';", '<Spinner animation="border" />'),
    },
  },
  {
    name: 'Breadcrumbs',
    libs: {
      sonarmd: s("import {Breadcrumbs} from '@sonarmd/ui';", '<Breadcrumbs items={[]} />'),
      mui: s("import Breadcrumbs from '@mui/material/Breadcrumbs';", '<Breadcrumbs />'),
      antd: s("import {Breadcrumb} from 'antd';", '<Breadcrumb items={[]} />'),
      bootstrap: s("import Breadcrumb from 'react-bootstrap/Breadcrumb';", '<Breadcrumb />'),
    },
  },
  {
    name: 'Pagination',
    libs: {
      sonarmd: s("import {Pagination} from '@sonarmd/ui';", '<Pagination page={1} pageCount={5} onPageChange={()=>{}} />'),
      mui: s("import Pagination from '@mui/material/Pagination';", '<Pagination count={5} />'),
      antd: s("import {Pagination} from 'antd';", '<Pagination total={50} />'),
      bootstrap: s("import Pagination from 'react-bootstrap/Pagination';", '<Pagination />'),
    },
  },
  {
    name: 'Drawer / Offcanvas',
    libs: {
      sonarmd: s("import {Drawer} from '@sonarmd/ui';", '<Drawer open={false} onClose={()=>{}} />'),
      mui: s("import Drawer from '@mui/material/Drawer';", '<Drawer open={false} />'),
      antd: s("import {Drawer} from 'antd';", '<Drawer open={false} />'),
      bootstrap: s("import Offcanvas from 'react-bootstrap/Offcanvas';", '<Offcanvas show={false} />'),
    },
  },
  {
    name: 'Popover',
    libs: {
      sonarmd: s("import {Popover} from '@sonarmd/ui';", '<Popover content="x"><span/></Popover>'),
      mui: s("import Popover from '@mui/material/Popover';", '<Popover open={false} />'),
      antd: s("import {Popover} from 'antd';", '<Popover content="x"><span/></Popover>'),
      bootstrap: s("import Popover from 'react-bootstrap/Popover';", '<Popover>x</Popover>'),
    },
  },
  {
    name: 'Data table',
    libs: {
      sonarmd: s("import {DataTable} from '@sonarmd/ui';", '<DataTable columns={[]} data={[]} keyExtractor={(r)=>r} />'),
      mui: s("import Table from '@mui/material/Table';\nimport TableHead from '@mui/material/TableHead';\nimport TableBody from '@mui/material/TableBody';\nimport TableRow from '@mui/material/TableRow';\nimport TableCell from '@mui/material/TableCell';", '<Table><TableHead><TableRow><TableCell /></TableRow></TableHead><TableBody /></Table>'),
      antd: s("import {Table} from 'antd';", '<Table columns={[]} dataSource={[]} />'),
      bootstrap: s("import Table from 'react-bootstrap/Table';", '<Table />'),
    },
  },
  {
    name: 'Stepper / Steps',
    libs: {
      sonarmd: s("import {Stepper} from '@sonarmd/ui';", '<Stepper steps={[]} activeStep={0} />'),
      mui: s("import Stepper from '@mui/material/Stepper';\nimport Step from '@mui/material/Step';\nimport StepLabel from '@mui/material/StepLabel';", '<Stepper><Step><StepLabel /></Step></Stepper>'),
      antd: s("import {Steps} from 'antd';", '<Steps items={[]} />'),
      bootstrap: null,
    },
  },
  {
    name: 'Segmented control',
    libs: {
      sonarmd: s("import {SegmentedControl} from '@sonarmd/ui';", '<SegmentedControl options={[]} value="" onChange={()=>{}} />'),
      mui: s("import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';\nimport ToggleButton from '@mui/material/ToggleButton';", '<ToggleButtonGroup><ToggleButton value="a" /></ToggleButtonGroup>'),
      antd: s("import {Segmented} from 'antd';", '<Segmented options={[]} />'),
      bootstrap: s("import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';", '<ToggleButtonGroup type="radio" name="a" />'),
    },
  },
  {
    name: 'Skeleton',
    libs: {
      sonarmd: s("import {Skeleton} from '@sonarmd/ui';", '<Skeleton />'),
      mui: s("import Skeleton from '@mui/material/Skeleton';", '<Skeleton />'),
      antd: s("import {Skeleton} from 'antd';", '<Skeleton />'),
      bootstrap: s("import Placeholder from 'react-bootstrap/Placeholder';", '<Placeholder xs={6} />'),
    },
  },
  {
    name: 'Separator / Divider',
    libs: {
      sonarmd: s("import {Separator} from '@sonarmd/ui';", '<Separator />'),
      mui: s("import Divider from '@mui/material/Divider';", '<Divider />'),
      antd: s("import {Divider} from 'antd';", '<Divider />'),
      bootstrap: null,
    },
  },
];

// Library-level CSS floor applied to every entry for that library. Empty array
// means the library ships its CSS inside JS (emotion / cssinjs) with no file.
export const CSS_FLOOR = {
  sonarmd: ["import '@sonarmd/ui/tokens.css';", "import '@sonarmd/ui/style.css';"],
  mui: [],
  antd: [],
  bootstrap: ["import 'bootstrap/dist/css/bootstrap.min.css';"],
};

export const LIBS = ['sonarmd', 'mui', 'antd', 'bootstrap'];
export const LIB_LABELS = {
  sonarmd: '@sonarmd/ui',
  mui: 'Material UI',
  antd: 'Ant Design',
  bootstrap: 'React Bootstrap',
};
