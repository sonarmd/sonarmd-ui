/**
 * Recipe 7: Drill-in master/detail
 *
 * DataTable row to detail page with the drill-in transition pattern.
 * Uses TransitionContainer directly (no react-router) for clarity.
 */
import React, {useState} from 'react';
import {TransitionContainer} from '../../src/transitions/TransitionContainer';
import {DataTable, Column} from '../../src/components/DataTable';
import {Button} from '../../src/components/Button';

interface Patient extends Record<string, unknown> {
  id: string;
  name: string;
  hcc: number;
}

const patients: Patient[] = [
  {id: 'p1', name: 'J. Smith', hcc: 1.23},
  {id: 'p2', name: 'M. Chen', hcc: 0.87},
  {id: 'p3', name: 'A. Johnson', hcc: 2.01},
];

const columns: Column<Patient>[] = [
  {key: 'name', header: 'Patient'},
  {key: 'hcc', header: 'HCC Score'},
];

function PatientDetail({patient, onBack}: {patient: Patient; onBack: () => void}): JSX.Element {
  return (
    <div style={{padding: 24}}>
      <h2 data-autofocus tabIndex={-1}>{patient.name}</h2>
      <p>HCC Score: {patient.hcc}</p>
      <Button variant="ghost" onClick={onBack}>Back to list</Button>
    </div>
  );
}

export function DrillInMasterDetail(): JSX.Element {
  const [selected, setSelected] = useState<Patient | null>(null);

  const locationKey = selected ? `patient-${selected.id}` : 'list';
  const direction = selected ? 'forward' as const : 'back' as const;

  return (
    <TransitionContainer
      locationKey={locationKey}
      direction={direction}
      pattern="drill-in"
      style={{minHeight: 300}}
    >
      {selected ? (
        <PatientDetail patient={selected} onBack={() => setSelected(null)} />
      ) : (
        <div style={{padding: 24}}>
          <h2>Patients</h2>
          <DataTable
            data={patients}
            columns={columns}
            keyExtractor={(r) => r.id}
            onRowClick={(row) => setSelected(row)}
          />
        </div>
      )}
    </TransitionContainer>
  );
}
