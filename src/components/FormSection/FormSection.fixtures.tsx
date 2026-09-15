import {FormSection} from './FormSection';
import {TextInput} from '../TextInput/TextInput';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(FormSection, {
  fixtures: {
    fieldset: {
      title: 'Demographics',
      description: 'Used to personalize care.',
      children: <TextInput name="dob" label="Date of birth" />,
    },
  },
});
