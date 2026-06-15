import {defineComponentFixtures} from '../../testing/defineComponentFixtures';
import {AppShell} from './index';

const Nav = () => <nav style={{width: 200, padding: '16px', background: '#f5f5fa'}}>Nav</nav>;
const Rail = () => <div style={{width: 240, padding: '16px', background: '#ededf3'}}>Rail</div>;
const Content = () => <div style={{padding: '16px'}}>Main content area</div>;

export default defineComponentFixtures(AppShell, {
  fixtures: {
    twoColumn: {
      sidebar: <Nav />,
      children: <Content />,
    },
    threeColumn: {
      sidebar: <Nav />,
      contextRail: <Rail />,
      children: <Content />,
    },
  },
});
