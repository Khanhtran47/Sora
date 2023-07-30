import { Card } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import { Skeleton } from '@nextui-org/skeleton';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
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
      <Card className="w-[200px] space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-medium">
          <div className="h-24 rounded-medium bg-default-300"></div>
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-medium">
            <div className="h-3 w-3/5 rounded-medium bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-medium">
            <div className="h-3 w-4/5 rounded-medium bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-medium">
            <div className="h-3 w-2/5 rounded-medium bg-default-300"></div>
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default SkeletonPage;
