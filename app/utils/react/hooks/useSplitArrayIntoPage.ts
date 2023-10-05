import { useMemo, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useSplitArrayIntoPage = (array: any[], pageSize: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(array.length / pageSize);

  const currentData = useMemo(() => {
    const begin = (currentPage - 1) * pageSize;
    const end = begin + pageSize;
    return array.slice(begin, end);
  }, [currentPage, pageSize, array]);

  const gotoPage = (page: number) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));
  };

  const nextPage = () => {
    gotoPage(currentPage + 1);
  };

  const previousPage = () => {
    gotoPage(currentPage - 1);
  };

  const canNextPage = currentPage < maxPage;
  const canPreviousPage = currentPage > 1;

  return {
    next: nextPage,
    previous: previousPage,
    canNext: canNextPage,
    canPrevious: canPreviousPage,
    gotoPage,
    currentPage,
    maxPage,
    currentData,
  };
};

export default useSplitArrayIntoPage;
