import { Link } from '@nextui-org/link';
import { Switch } from '@nextui-org/switch';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/switch" key="design-switch">
      Switch
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Switch',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const SwitchPage = () => {
  return (
    <>
      <h2>Switch</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://nextui-docs-v2.vercel.app/docs/components/switch#api"
      >
        API Reference
      </Link>
      <Switch defaultSelected aria-label="Automatic updates" />
    </>
  );
};

export default SwitchPage;
