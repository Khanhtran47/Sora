import type { MetaFunction } from '@remix-run/node';
import { Outlet, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';

import { designSystemPages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta: MetaFunction = () => ({
  title: 'Design System',
  description: 'This page for testing the design system',
  'og:title': 'Design System',
  'og:description': 'This page for testing the design system',
});

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system" key="design-system">
      Design System
    </BreadcrumbItem>
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
