import {FormActions} from './FormActions';
import {Button} from '../Button/Button';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(FormActions, {
  fixtures: {
    endAligned: {
      children: (
        <>
          <Button variant="ghost">Cancel</Button>
          <Button type="submit">Save</Button>
        </>
      ),
    },
  },
});
