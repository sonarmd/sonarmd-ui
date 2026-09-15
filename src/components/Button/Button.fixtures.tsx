import {Button} from './Button';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Button, {
  fixtures: {
    primary: {children: 'Save'},
    ghostCompact: {children: 'Cancel', variant: 'ghost', size: 'sm', density: 'compact'},
    loading: {children: 'Save', loading: true},
  },
});
