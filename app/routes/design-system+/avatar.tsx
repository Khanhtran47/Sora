import { Avatar } from '@nextui-org/avatar';
import { Link } from '@nextui-org/link';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/avatar" key="design-avatar">
      Avatar
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Avatar',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const AvatarPage = () => {
  return (
    <>
      <h2>Avatar</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://nextui-docs-v2.vercel.app/docs/components/avatar#api"
      >
        API Reference
      </Link>
      <div className="flex items-center gap-3">
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        <Avatar name="Junior" />
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
        <Avatar name="Jane" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
        <Avatar name="Joe" />
      </div>
    </>
  );
};

export default AvatarPage;
