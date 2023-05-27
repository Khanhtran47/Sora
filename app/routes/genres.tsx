import { Outlet } from '@remix-run/react';

import { genrePages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/genres" key="genres">
      Genres
    </BreadcrumbItem>
  ),
  showTabLink: true,
  tabLinkPages: genrePages,
  tabLinkTo: () => '/genres',
  miniTitle: () => ({
    title: 'Genres',
    showImage: false,
  }),
};

const GenresPage = () => <Outlet />;

export default GenresPage;
