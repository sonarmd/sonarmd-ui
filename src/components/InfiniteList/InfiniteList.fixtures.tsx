import {InfiniteList} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const items = Array.from({length: 40}, (_, i) => ({id: i, label: `Row ${i + 1}`}));
const noop = (): void => {};
const renderRow = (item: unknown): string => (item as {label: string}).label;

export default defineComponentFixtures(InfiniteList, {
  fixtures: {
    default: {items, rowHeight: 40, hasNext: true, isLoadingNext: false, onLoadMore: noop, renderRow, ariaLabel: 'Results'},
    loadingMore: {items, rowHeight: 40, hasNext: true, isLoadingNext: true, onLoadMore: noop, renderRow, ariaLabel: 'Results'},
    end: {items, rowHeight: 40, hasNext: false, isLoadingNext: false, onLoadMore: noop, renderRow, ariaLabel: 'Results'},
  },
});
