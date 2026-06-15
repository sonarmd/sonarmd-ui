import type {Story} from '@ladle/react';
import {Stack} from './index';
import {Badge} from '../Badge';

export default {
  title: 'Layout/Stack',
};

/** Vertical flex container. Import: `import { Stack } from '@sonarmd/ui'` */
export const Default: Story = () => (
  <Stack gap="3">
    <Badge>Item 1</Badge>
    <Badge>Item 2</Badge>
    <Badge>Item 3</Badge>
  </Stack>
);

export const HorizontalAlign: Story = () => (
  <Stack gap="3" align="center">
    <Badge variant="primary">Centered</Badge>
    <Badge variant="success">Also centered</Badge>
  </Stack>
);
