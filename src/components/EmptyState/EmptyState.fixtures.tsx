import {EmptyState} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(EmptyState, {
  fixtures: {
    titleDesc: {title: 'No results found', description: 'Try adjusting your search filters.'},
    withAction: {title: 'No data yet', action: {label: 'Add your first item', onClick: noop}},
  },
});
