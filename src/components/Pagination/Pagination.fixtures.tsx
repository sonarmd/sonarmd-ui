import {Pagination} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(Pagination, {
  fixtures: {
    default: {page: 1, pageCount: 5, onPageChange: noop},
    middle: {page: 6, pageCount: 20, onPageChange: noop},
    last: {page: 20, pageCount: 20, onPageChange: noop},
    small: {page: 3, pageCount: 8, size: 'sm', onPageChange: noop},
  },
});
