import {useState} from 'react';
import type {Story} from '@ladle/react';
import {Pagination} from './index';

export default {
  title: 'Components/Pagination',
};

/** Interactive paging. Import: `import { Pagination } from '@sonarmd/ui'` */
export const Default: Story = () => {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageCount={5} onPageChange={setPage} />;
};

export const ManyPages: Story = () => {
  const [page, setPage] = useState(6);
  return <Pagination page={page} pageCount={20} onPageChange={setPage} />;
};

export const Small: Story = () => {
  const [page, setPage] = useState(3);
  return <Pagination page={page} pageCount={8} size="sm" onPageChange={setPage} />;
};
