import React from "react";
import {IconButton} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const GearIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <circle cx="8" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.3" fill="none" />
  </svg>
);

export default defineComponentFixtures(IconButton, {
  fixtures: {
    default: {label: 'Settings', children: <GearIcon />},
    primary: {label: 'Add', variant: 'primary', children: <GearIcon />},
  },
});
