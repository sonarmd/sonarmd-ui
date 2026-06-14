import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import {navItems, kpis, tabs as tabData, rows, tableColumns, statusTone} from '../../../shared/shellData';

const badgeBg = (tone: 'success' | 'warning' | 'danger') => tone;

function Shell(): JSX.Element {
  const [nav, setNav] = useState('overview');
  const [tab, setTab] = useState('roster');
  const [open, setOpen] = useState(false);

  return (
    <div style={{display: 'flex', minHeight: '100vh'}}>
      <Nav
        variant="pills"
        className="flex-column p-2"
        style={{width: 240, borderRight: '1px solid #dee2e6'}}
        activeKey={nav}
        onSelect={(k) => setNav(k ?? 'overview')}
      >
        <h5 className="px-2 py-1">SonarMD</h5>
        {navItems.map((item) => (
          <Nav.Item key={item.key}>
            <Nav.Link eventKey={item.key}>{item.label}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <main style={{flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 20}}>
        <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <h1 className="h3 m-0">Population Dashboard</h1>
          <Button variant="primary" onClick={() => setOpen(true)}>New patient</Button>
        </header>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16}}>
          {kpis.map((k) => (
            <Card key={k.title}>
              <Card.Body>
                <div className="text-secondary small">{k.title}</div>
                <div className="h4 mb-1">{k.value}</div>
                <span className={k.direction === 'up' ? 'text-success' : 'text-danger'}>{k.delta}</span>
              </Card.Body>
            </Card>
          ))}
        </div>

        <Card>
          <Card.Body>
            <Card.Title>Care management</Card.Title>
            <Tabs activeKey={tab} onSelect={(k) => setTab(k ?? 'roster')} className="mb-3">
              {tabData.map((t) => (
                <Tab key={t.key} eventKey={t.key} title={t.label} />
              ))}
            </Tabs>
            <Table size="sm" hover>
              <thead>
                <tr>
                  {tableColumns.map((c) => (
                    <th key={c.key}>{c.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.patient}</td>
                    <td>{r.mrn}</td>
                    <td>{r.program}</td>
                    <td>
                      <Badge bg={badgeBg(statusTone(r.status))}>{r.status}</Badge>
                    </td>
                    <td>{r.risk}</td>
                    <td>{r.updated}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </main>

      <Modal show={open} onHide={() => setOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group>
              <Form.Label>MRN</Form.Label>
              <Form.Control />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setOpen(false)}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Shell />
  </React.StrictMode>,
);
