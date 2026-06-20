import {Stepper} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const steps = [
  {label: 'Intake', description: 'Patient details'},
  {label: 'Review', description: 'Clinical review'},
  {label: 'Approval', description: 'Sign-off'},
];

export default defineComponentFixtures(Stepper, {
  fixtures: {
    default: {steps, activeStep: 1},
    first: {steps, activeStep: 0},
    vertical: {steps, activeStep: 1, orientation: 'vertical'},
  },
});
