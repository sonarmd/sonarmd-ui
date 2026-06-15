import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Button, Card, Tag, Input, Modal, Tabs, Table, Menu, Typography, Form} from 'antd';
import {navItems, kpis, tabs as tabData, rows, tableColumns, statusTone} from '../../../shared/shellData';

const tagColor = (tone: 'success' | 'warning' | 'danger') =>
  tone === 'success' ? 'green' : tone === 'warning' ? 'gold' : 'red';

const columns = tableColumns.map((c) =>
  c.key === 'status'
    ? {
        title: c.header,
        dataIndex: c.key,
        key: c.key,
        render: (status: 'Active' | 'Pending' | 'Overdue') => (
          <Tag color={tagColor(statusTone(status))}>{status}</Tag>
        ),
      }
    : {title: c.header, dataIndex: c.key, key: c.key},
);

function Shell(): JSX.Element {
  const [nav, setNav] = useState('overview');
  const [tab, setTab] = useState('roster');
  const [open, setOpen] = useState(false);

  return (
    <div style={{display: 'flex', minHeight: '100vh'}}>
      <nav style={{width: 240, borderRight: '1px solid #f0f0f0'}}>
        <Typography.Title level={4} style={{padding: '12px 16px', margin: 0}}>SonarMD</Typography.Title>
        <Menu
          mode="inline"
          selectedKeys={[nav]}
          onClick={(e) => setNav(e.key)}
          items={navItems.map((n) => ({key: n.key, label: n.label}))}
        />
      </nav>
      <main style={{flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 20}}>
        <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography.Title level={2} style={{margin: 0}}>Population Dashboard</Typography.Title>
          <Button type="primary" onClick={() => setOpen(true)}>New patient</Button>
        </header>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16}}>
          {kpis.map((k) => (
            <Card key={k.title} size="small">
              <Typography.Text type="secondary">{k.title}</Typography.Text>
              <Typography.Title level={3} style={{margin: '4px 0'}}>{k.value}</Typography.Title>
              <Typography.Text type={k.direction === 'up' ? 'success' : 'danger'}>{k.delta}</Typography.Text>
            </Card>
          ))}
        </div>

        <Card title="Care management">
          <Tabs
            activeKey={tab}
            onChange={setTab}
            items={tabData.map((t) => ({key: t.key, label: t.label}))}
          />
          <Table rowKey="id" columns={columns} dataSource={rows} pagination={false} size="small" />
        </Card>
      </main>

      <Modal open={open} onCancel={() => setOpen(false)} onOk={() => setOpen(false)} title="New patient">
        <Form layout="vertical">
          <Form.Item label="Full name">
            <Input />
          </Form.Item>
          <Form.Item label="MRN">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Shell />
  </React.StrictMode>,
);
