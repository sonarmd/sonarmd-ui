import {DataGrid} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const columns = [
  {key: 'name', header: 'Name', sortable: true},
  {key: 'status', header: 'Status', width: 120},
  {key: 'score', header: 'Score', align: 'right' as const},
];
const rows = Array.from({length: 30}, (_, i) => ({
  id: String(i + 1),
  name: `Patient ${i + 1}`,
  status: i % 3 === 0 ? 'Review' : 'Active',
  score: (i % 10) / 10,
}));
const keyExtractor = (r: unknown): string => String((r as {id: string}).id);
const noop = (): void => {};

export default defineComponentFixtures(DataGrid, {
  fixtures: {
    withRows: {columns, rows, keyExtractor, ariaLabel: 'Patients', onSort: noop},
    empty: {columns, rows: [], keyExtractor, ariaLabel: 'Patients', emptyState: 'No patients found'},
    loadingMore: {
      columns,
      rows,
      keyExtractor,
      ariaLabel: 'Patients',
      infinite: {hasNext: true, isLoadingNext: true, onLoadMore: noop},
    },
    paginated: {
      columns,
      rows: rows.slice(0, 10),
      keyExtractor,
      ariaLabel: 'Patients',
      pagination: {page: 2, pageCount: 5, onPageChange: noop},
    },
  },
});
