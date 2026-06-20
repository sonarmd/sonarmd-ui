import {Accordion} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const items = [
  {key: 'eligibility', title: 'Eligibility', content: 'Coverage active through 2026.'},
  {key: 'history', title: 'Care history', content: 'Last visit 2026-05-02.'},
  {key: 'consent', title: 'Consent', content: 'Signed 2026-01-14.', disabled: true},
];

export default defineComponentFixtures(Accordion, {
  fixtures: {
    default: {items},
    expanded: {items, defaultExpandedKeys: ['eligibility']},
    multiple: {items, type: 'multiple', defaultExpandedKeys: ['eligibility', 'history']},
  },
});
