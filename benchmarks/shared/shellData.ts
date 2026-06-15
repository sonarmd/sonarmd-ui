// Framework-agnostic data for the benchmark dashboard shell. Every app
// (SonarMD, MUI, AntD, React Bootstrap) renders the same content from this,
// so the only variable measured is the UI library cost.

export interface PatientRow {
  id: string;
  patient: string;
  mrn: string;
  program: string;
  status: 'Active' | 'Pending' | 'Overdue';
  risk: number;
  updated: string;
}

export const navItems = [
  {key: 'overview', label: 'Overview'},
  {key: 'patients', label: 'Patients'},
  {key: 'programs', label: 'Programs'},
  {key: 'reports', label: 'Reports'},
  {key: 'settings', label: 'Settings'},
];

export const kpis = [
  {title: 'Active Patients', value: '1,284', delta: '+4.2%', direction: 'up' as const},
  {title: 'Care Gaps Closed', value: '312', delta: '+8.1%', direction: 'up' as const},
  {title: 'Avg Risk Score', value: '0.42', delta: '-2.0%', direction: 'down' as const},
  {title: 'Overdue Tasks', value: '27', delta: '+5', direction: 'up' as const},
];

export const tabs = [
  {key: 'roster', label: 'Roster'},
  {key: 'gaps', label: 'Care Gaps'},
  {key: 'activity', label: 'Activity'},
];

const STATUSES: PatientRow['status'][] = ['Active', 'Pending', 'Overdue'];
const PROGRAMS = ['CCM', 'RPM', 'BHI', 'TCM'];

export const rows: PatientRow[] = Array.from({length: 18}, (_, i) => ({
  id: `p-${i + 1}`,
  patient: `Patient ${String(i + 1).padStart(3, '0')}`,
  mrn: `MRN-${100000 + i * 37}`,
  program: PROGRAMS[i % PROGRAMS.length],
  status: STATUSES[i % STATUSES.length],
  risk: Number((0.1 + ((i * 7) % 90) / 100).toFixed(2)),
  updated: `2026-06-${String((i % 27) + 1).padStart(2, '0')}`,
}));

export const tableColumns = [
  {key: 'patient', header: 'Patient'},
  {key: 'mrn', header: 'MRN'},
  {key: 'program', header: 'Program'},
  {key: 'status', header: 'Status'},
  {key: 'risk', header: 'Risk'},
  {key: 'updated', header: 'Updated'},
];

export const statusTone = (status: PatientRow['status']): 'success' | 'warning' | 'danger' =>
  status === 'Active' ? 'success' : status === 'Pending' ? 'warning' : 'danger';
