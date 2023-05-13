import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import { NavLink } from '@remix-run/react';

import { Popover, PopoverContent, PopoverTrigger } from '~/components/elements/Popover';

export const handle = {
  breadcrumb: () => (
    <NavLink to="/design-system/popover" aria-label="Popover Page">
      {({ isActive }) => (
        <Chip
          color="primary"
          variant="flat"
          size="sm"
          className={`${
            isActive ? 'opacity-100' : 'opacity-70'
          } duration-250 ease-in-out transition-opacity hover:opacity-80`}
        >
          Popover
        </Chip>
      )}
    </NavLink>
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
        <PopoverContent>Place content for the popover here.</PopoverContent>
      </Popover>
    </>
  );
};

export default PopoverPage;
