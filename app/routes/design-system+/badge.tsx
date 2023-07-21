import { Avatar } from '@nextui-org/avatar';
import { Badge } from '@nextui-org/badge';
import { Link } from '@nextui-org/link';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/badge" key="design-badge">
      Badge
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Badge',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const BadgePage = () => {
  return (
    <>
      <h2>Badge</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://nextui-docs-v2.vercel.app/docs/components/badge#api"
      >
        API Reference
      </Link>
      <Badge content="5" color="primary">
        <Avatar radius="lg" src="https://i.pravatar.cc/300?u=a042581f4e29026709d" />
      </Badge>
    </>
  );
};

export default BadgePage;
