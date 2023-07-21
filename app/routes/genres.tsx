import { Outlet } from '@remix-run/react';

import type { Handle } from '~/types/handle';
import { genrePages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
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
