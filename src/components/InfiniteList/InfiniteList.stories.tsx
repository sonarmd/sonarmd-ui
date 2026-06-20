import {useCallback, useState} from 'react';
import type {Story} from '@ladle/react';
import {InfiniteList} from './index';

export default {
  title: 'Components/InfiniteList',
};

interface Row {
  id: number;
  label: string;
}

const PAGE = 25;
const TOTAL = 1000;

function makePage(from: number): Row[] {
  return Array.from({length: Math.min(PAGE, TOTAL - from)}, (_, i) => ({
    id: from + i,
    label: `Item ${from + i + 1}`,
  }));
}

/**
 * Virtualized + lazy: only the visible rows are in the DOM, and the next page
 * loads as you near the end. Import: `import { InfiniteList } from '@sonarmd/ui'`
 */
export const Default: Story = () => {
  const [items, setItems] = useState<Row[]>(() => makePage(0));
  const [loading, setLoading] = useState(false);
  const hasNext = items.length < TOTAL;

  const onLoadMore = useCallback(() => {
    setLoading(true);
    // Simulate a paged fetch.
    window.setTimeout(() => {
      setItems((prev) => [...prev, ...makePage(prev.length)]);
      setLoading(false);
    }, 400);
  }, []);

  return (
    <InfiniteList
      items={items}
      rowHeight={44}
      height={360}
      hasNext={hasNext}
      isLoadingNext={loading}
      onLoadMore={onLoadMore}
      ariaLabel="Demo results"
      renderRow={(item) => <span>{item.label}</span>}
      emptyState={<p style={{padding: 16}}>No results.</p>}
    />
  );
};
