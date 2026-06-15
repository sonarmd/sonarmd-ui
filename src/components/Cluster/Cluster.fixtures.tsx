import {defineComponentFixtures} from '../../testing/defineComponentFixtures';
import {Cluster} from './index';

export default defineComponentFixtures(Cluster, {
  fixtures: {
    default:  {children: [<span key="a">Tag A</span>, <span key="b">Tag B</span>, <span key="c">Tag C</span>]},
    spaced:   {gap: '4', children: [<span key="a">Action 1</span>, <span key="b">Action 2</span>]},
    centered: {justify: 'center', children: [<span key="a">Left</span>, <span key="b">Right</span>]},
    nowrap:   {wrap: false, children: [<span key="a">No</span>, <span key="b">Wrap</span>, <span key="c">Here</span>]},
  },
});
