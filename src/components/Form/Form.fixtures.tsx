import {Form} from './index';
import {Button} from '../Button';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Form, {
  fixtures: {
    default: {children: <Button type="submit">Submit</Button>},
  },
});
