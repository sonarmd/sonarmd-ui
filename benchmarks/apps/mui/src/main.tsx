import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {navItems, kpis, tabs as tabData, rows, tableColumns, statusTone} from '../../../shared/shellData';

const chipColor = (tone: 'success' | 'warning' | 'danger') =>
  tone === 'success' ? 'success' : tone === 'warning' ? 'warning' : 'error';

function Shell(): JSX.Element {
  const [nav, setNav] = useState('overview');
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  return (
    <div style={{display: 'flex', minHeight: '100vh'}}>
      <nav style={{width: 240, borderRight: '1px solid #e0e0e0', padding: 8}}>
        <Typography variant="h6" sx={{px: 2, py: 1}}>SonarMD</Typography>
        <List>
          {navItems.map((item) => (
            <ListItemButton key={item.key} selected={nav === item.key} onClick={() => setNav(item.key)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </nav>
      <main style={{flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 20}}>
        <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography variant="h4">Population Dashboard</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>New patient</Button>
        </header>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16}}>
          {kpis.map((k) => (
            <Card key={k.title} variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">{k.title}</Typography>
                <Typography variant="h5">{k.value}</Typography>
                <Typography variant="caption" color={k.direction === 'up' ? 'success.main' : 'error.main'}>
                  {k.delta}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6">Care management</Typography>
            <Tabs value={tab} onChange={(_e, v) => setTab(v)}>
              {tabData.map((t) => (
                <Tab key={t.key} label={t.label} />
              ))}
            </Tabs>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {tableColumns.map((c) => (
                    <TableCell key={c.key}>{c.header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.patient}</TableCell>
                    <TableCell>{r.mrn}</TableCell>
                    <TableCell>{r.program}</TableCell>
                    <TableCell>
                      <Chip size="small" color={chipColor(statusTone(r.status))} label={r.status} />
                    </TableCell>
                    <TableCell>{r.risk}</TableCell>
                    <TableCell>{r.updated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New patient</DialogTitle>
        <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2, pt: 1}}>
          <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="MRN" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Shell />
  </React.StrictMode>,
);
