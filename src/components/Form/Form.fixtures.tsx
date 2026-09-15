import {Form} from './Form';
import {Button} from '../Button/Button';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Form, {
  fixtures: {
    default: {children: <Button type="submit">Submit</Button>},
  },
});
