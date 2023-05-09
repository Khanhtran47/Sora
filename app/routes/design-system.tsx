import { Badge } from '@nextui-org/react';
import type { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';

import { designSystemPages } from '~/constants/tabLinks';

export const meta: MetaFunction = () => ({
  title: 'Design System',
  description: 'This page for testing the design system',
  'og:title': 'Design System',
  'og:description': 'This page for testing the design system',
});

export const handle = {
  breadcrumb: () => (
    <NavLink to="/design-system" aria-label="Design system Page">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Design System
        </Badge>
      )}
    </NavLink>
  ),
  showTabLink: true,
  tabLinkPages: designSystemPages,
  tabLinkTo: () => '/design-system',
  miniTitle: () => ({
    title: 'Design System',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const DesignSystem = () => {
  const location = useLocation();
  return (
    <motion.div
      key={location.key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-start justify-center gap-y-4 px-3 sm:px-0"
    >
      <Outlet />
    </motion.div>
  );
};

export default DesignSystem;
