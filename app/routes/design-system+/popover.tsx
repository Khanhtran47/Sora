import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/elements/Popover';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/popover" key="design-popover">
      Popover
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Popover',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const PopoverPage = () => {
  const [openPopover, setOpenPopover] = useState(false);
  return (
    <>
      <h2>Popover</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://www.radix-ui.com/docs/primitives/components/popover#api-reference"
      >
        API Reference
      </Link>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button variant={openPopover ? 'flat' : 'solid'}>Open</Button>
        </PopoverTrigger>
        <PopoverContent className="!p-3">Place content for the popover here.</PopoverContent>
      </Popover>
    </>
  );
};

export default PopoverPage;
