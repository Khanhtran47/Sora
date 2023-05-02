import { Outlet } from '@remix-run/react';

import { genrePages } from '~/constants/tabLinks';

export const handle = {
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
