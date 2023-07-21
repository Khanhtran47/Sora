import { Divider } from '@nextui-org/divider';
import { Link } from '@nextui-org/link';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/divider" key="design-divider">
      Divider
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Divider',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const DividerPage = () => {
  return (
    <>
      <h2>Divider</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://nextui-docs-v2.vercel.app/docs/components/divider#api"
      >
        API Reference
      </Link>
      <div className="max-w-md">
        <div className="space-y-1">
          <h4>NextUI Components</h4>
          <p className="opacity-70">Beautiful, fast and modern React UI library.</p>
        </div>
        <Divider className="my-4" />
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div>Blog</div>
          <Divider orientation="vertical" />
          <div>Docs</div>
          <Divider orientation="vertical" />
          <div>Source</div>
        </div>
      </div>
    </>
  );
};

export default DividerPage;
