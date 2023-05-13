import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import { NavLink } from '@remix-run/react';

import {
  ScrollArea,
  ScrollBar,
  ScrollCorner,
  ScrollViewport,
} from '~/components/elements/ScrollArea';

export const handle = {
  breadcrumb: () => (
    <NavLink to="/design-system/scroll-area" aria-label="Scroll Area Page">
      {({ isActive }) => (
        <Chip
          color="primary"
          variant="flat"
          size="sm"
          className={`${
            isActive ? 'opacity-100' : 'opacity-70'
          } duration-250 ease-in-out transition-opacity hover:opacity-80`}
        >
          Scroll Area
        </Chip>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Scroll Area',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const ScrollAreaPage = () => {
  return (
    <>
      <h2>Scroll Area</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://www.radix-ui.com/docs/primitives/components/scroll-area#api-reference"
      >
        API Reference
      </Link>
      <ScrollArea className="h-[200px] w-[350px] rounded-md border border-border p-4">
        <ScrollViewport>
          Jokester began sneaking into the castle in the middle of the night and leaving jokes all
          over the place: under the king's pillow, in his soup, even in the royal toilet. The king
          was furious, but he couldn't seem to stop Jokester. And then, one day, the people of the
          kingdom discovered that the jokes left by Jokester were so funny that they couldn't help
          but laugh. And once they started laughing, they couldn't stop.
        </ScrollViewport>
        <ScrollBar />
        <ScrollCorner />
      </ScrollArea>
    </>
  );
};

export default ScrollAreaPage;
