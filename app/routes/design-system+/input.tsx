import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/input" key="design-input">
      Input
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Input',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const InputPage = () => {
  return (
    <>
      <h2>Input</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://nextui-docs-v2.vercel.app/docs/components/input#api"
      >
        API Reference
      </Link>
      <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
        <Input type="email" label="Email" />
        <Input type="email" label="Email" placeholder="Enter your email" />
      </div>
    </>
  );
};

export default InputPage;
