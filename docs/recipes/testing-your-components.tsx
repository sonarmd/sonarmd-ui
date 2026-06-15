/**
 * Recipe 10: Testing your app's components with defineComponentFixtures
 *
 * defineComponentFixtures is available via @sonarmd/ui/testing (dev-only subpath).
 * The fixture file is the only file you need per component.
 * The harness generates light/dark snapshots + axe passes automatically.
 *
 * Example: adding tests for a custom PatientCard component.
 */
import React from 'react';
import {defineComponentFixtures} from '../../src/testing/defineComponentFixtures';
import {Badge} from '../../src/components/Badge';
import {Card} from '../../src/components/Card';

// --- Your component ---

interface PatientCardProps {
  name: string;
  hcc: number;
  status: 'active' | 'review' | 'inactive';
}

export function PatientCard({name, hcc, status}: PatientCardProps): JSX.Element {
  const variant = status === 'active' ? 'success' : status === 'review' ? 'warning' : 'neutral';
  return (
    <Card>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <strong>{name}</strong>
        <Badge variant={variant}>{status}</Badge>
      </div>
      <p style={{marginTop: 4, fontSize: 13}}>HCC Score: {hcc}</p>
    </Card>
  );
}

// --- Fixture file (place in PatientCard.fixtures.tsx beside the component) ---
//
// The harness (vitest) auto-discovers this file and generates:
//   - PatientCard > active - dom  (light snapshot)
//   - PatientCard > active - dom dark
//   - PatientCard > active - axe
//   - PatientCard > review - dom  (light snapshot)
//   ... (all three fixtures x3 checks = 9 auto-generated tests)
//
// You write ZERO render/provider/mock/expect boilerplate.

export const PatientCardFixtures = defineComponentFixtures(PatientCard, {
  fixtures: {
    active: {name: 'Jane Smith', hcc: 0.92, status: 'active'},
    review: {name: 'Marcus Chen', hcc: 1.67, status: 'review'},
    inactive: {name: 'Ada Johnson', hcc: 0.12, status: 'inactive'},
  },
});
