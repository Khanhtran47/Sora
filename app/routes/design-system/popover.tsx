import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';

import { Popover, PopoverContent, PopoverTrigger } from '~/components/elements/Popover';

const PopoverPage = () => {
  const [openPopover, setOpenPopover] = useState(false);
  return (
    <>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
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
