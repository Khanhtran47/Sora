import { Link } from '@nextui-org/link';
import { Pagination } from '@nextui-org/pagination';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/pagination" key="design-pagination">
      Pagination
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Pagination',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const PaginationPage = () => {
  return (
    <>
      <h2>Pagination</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://nextui-docs-v2.vercel.app/docs/components/pagination#api"
      >
        API Reference
      </Link>
      <Pagination total={10} initialPage={1} />
    </>
  );
};

export default PaginationPage;
