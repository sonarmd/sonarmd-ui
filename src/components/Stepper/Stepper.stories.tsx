import {useState} from 'react';
import type {Story} from '@ladle/react';
import {Stepper} from './index';

export default {
  title: 'Components/Stepper',
};

const steps = [
  {label: 'Intake', description: 'Patient details'},
  {label: 'Review', description: 'Clinical review'},
  {label: 'Approval', description: 'Sign-off'},
];

/** Horizontal progress. Import: `import { Stepper } from '@sonarmd/ui'` */
export const Default: Story = () => (
  <div style={{width: 480}}>
    <Stepper steps={steps} activeStep={1} />
  </div>
);

export const Vertical: Story = () => (
  <Stepper steps={steps} activeStep={1} orientation="vertical" />
);

export const Navigable: Story = () => {
  const [active, setActive] = useState(2);
  return (
    <div style={{width: 480}}>
      <Stepper steps={steps} activeStep={active} onStepClick={setActive} />
    </div>
  );
};
