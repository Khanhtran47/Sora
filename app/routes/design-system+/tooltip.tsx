import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import { Tooltip } from '@nextui-org/tooltip';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/tooltip" key="design-tooltip">
      Tooltip
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Tooltip',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const TooltipPage = () => {
  return (
    <>
      <h2>Tooltip</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://nextui-docs-v2.vercel.app/docs/components/tooltip#api"
      >
        API Reference
      </Link>
      <Tooltip content="I am a tooltip">
        <Button variant="flat">Hover me</Button>
      </Tooltip>
    </>
  );
};

export default TooltipPage;
