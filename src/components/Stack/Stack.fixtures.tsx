import {defineComponentFixtures} from '../../testing/defineComponentFixtures';
import {Stack} from './index';

export default defineComponentFixtures(Stack, {
  fixtures: {
    default: {children: [<div key="a">Item A</div>, <div key="b">Item B</div>, <div key="c">Item C</div>]},
    gapSm:   {gap: '2', children: [<div key="a">Tight A</div>, <div key="b">Tight B</div>]},
    centered: {align: 'center', children: [<div key="a">Centered</div>, <div key="b">Children</div>]},
  },
});
