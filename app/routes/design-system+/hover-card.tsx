import { Link } from '@nextui-org/link';
import { NavLink } from '@remix-run/react';
import { MimeType } from 'remix-image';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/elements/HoverCard';
import Image from '~/components/elements/Image';
import LogoFooter from '~/assets/images/logo_footer.png';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/hover-card" key="design-hover-card">
      Hover Card
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Hover Card',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const HoverCardPage = () => {
  return (
    <>
      <h2>Hover Card</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://www.radix-ui.com/docs/primitives/components/hover-card#api-reference"
      >
        API Reference
      </Link>
      <HoverCard>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent asChild>
          <div className="flex flex-col items-center justify-center">
            <Image
              alt="About Logo"
              title="About Logo"
              src={LogoFooter}
              loaderUrl="/api/image"
              width="76px"
              height="76px"
              radius="full"
              placeholder="empty"
              responsive={[
                {
                  size: {
                    width: 76,
                    height: 76,
                  },
                },
              ]}
              options={{
                contentType: MimeType.WEBP,
              }}
            />
            <NavLink
              to="/"
              arial-label="home-page"
              className="bg-gradient-to-tr from-secondary to-primary to-50% bg-clip-text text-3xl font-bold tracking-normal text-transparent md:text-4xl"
            >
              SORA
            </NavLink>
          </div>
        </HoverCardContent>
      </HoverCard>
    </>
  );
};

export default HoverCardPage;
