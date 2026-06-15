import {FormGrid} from './index';
import {TextInput} from '../TextInput';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(FormGrid, {
  fixtures: {
    twoCol: {
      columns: 2,
      gap: 'md',
      children: (
        <>
          <TextInput name="first" label="First name" />
          <TextInput name="last" label="Last name" />
        </>
      ),
    },
    staggered: {
      columns: 2,
      stagger: true,
      children: (
        <>
          <TextInput name="a" label="A" />
          <TextInput name="b" label="B" />
        </>
      ),
    },
  },
});
