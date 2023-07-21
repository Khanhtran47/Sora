import { Link } from '@nextui-org/link';
import { Progress } from '@nextui-org/progress';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/progress" key="design-progress">
      Progress
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Progress',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const ProgressPage = () => {
  return (
    <>
      <h2>Progress</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://nextui-docs-v2.vercel.app/docs/components/progress#api"
      >
        API Reference
      </Link>
      <Progress aria-label="Loading..." value={60} className="max-w-md" />
    </>
  );
};

export default ProgressPage;
