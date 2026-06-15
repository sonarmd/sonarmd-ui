import {DataTable} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const columns = [
  {key: 'name', header: 'Name'},
  {key: 'score', header: 'Score'},
];
const data = [
  {name: 'Alpha', score: 95},
  {name: 'Beta', score: 87},
  {name: 'Gamma', score: 72},
];
const keyExtractor = (r: unknown): string => String((r as Record<string, unknown>).name);

export default defineComponentFixtures(DataTable, {
  fixtures: {
    withData: {columns, data, keyExtractor},
    loading: {columns, data: [], keyExtractor, isLoading: true},
    empty: {columns, data: [], keyExtractor, emptyMessage: 'No records found'},
  },
});
