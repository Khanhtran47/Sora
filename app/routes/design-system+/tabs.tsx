import { Link } from '@nextui-org/link';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/elements/tab/Tabs';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/tabs" key="design-tabs">
      Tabs
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Tabs',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const ScrollAreaPage = () => {
  return (
    <>
      <h2>Tabs</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://www.radix-ui.com/docs/primitives/components/tabs#api-reference"
      >
        API Reference
      </Link>
      <Tabs defaultValue="account" orientation="vertical">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="!min-h-fit">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password" className="!min-h-fit">
          Change your password here.
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="account" orientation="horizontal">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="!min-h-fit !px-0 !py-5">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password" className="!min-h-fit !px-0 !py-5">
          Change your password here.
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ScrollAreaPage;
