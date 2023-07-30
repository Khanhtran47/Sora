import { Outlet, useLocation } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion } from 'framer-motion';

import type { Handle } from '~/types/handle';
import { designSystemPages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Design System' },
  { name: 'description', content: 'This page for testing the design system' },
  { 'og:title': 'Design System' },
  { 'og:description': 'This page for testing the design system' },
  { 'twitter:title': 'Design System' },
  { 'twitter:description': 'This page for testing the design system' },
]);

export const handle: Handle = {
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
  hideSidebar: true,
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
