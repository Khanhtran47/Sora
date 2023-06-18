import { Card } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import { Skeleton } from '@nextui-org/skeleton';

import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/skeleton" key="design-skeleton">
      Skeleton
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Skeleton',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const SkeletonPage = () => {
  return (
    <>
      <h2>Skeleton</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://nextui-docs-v2.vercel.app/docs/components/skeleton#api"
      >
        API Reference
      </Link>
      <Card className="w-[200px] space-y-5 p-4" radius="2xl">
        <Skeleton className="rounded-lg">
          <div className="bg-default-300 h-24 rounded-lg"></div>
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="bg-default-200 h-3 w-3/5 rounded-lg"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="bg-default-200 h-3 w-4/5 rounded-lg"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="bg-default-300 h-3 w-2/5 rounded-lg"></div>
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default SkeletonPage;
