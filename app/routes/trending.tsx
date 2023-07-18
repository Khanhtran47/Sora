import { Outlet } from '@remix-run/react';

import { trendingPages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/trending" key="trending">
      Trending
    </BreadcrumbItem>
  ),
  showTabLink: true,
  tabLinkPages: trendingPages,
  tabLinkTo: () => '/trending',
};

const Trending = () => <Outlet />;

export default Trending;
