import { Outlet } from '@remix-run/react';

import { genrePages } from '~/constants/tabLinks';

export const handle = {
  showTabLink: true,
  tabLinkPages: genrePages,
  tabLinkTo: () => '/genres',
};

const GenresPage = () => (
  <div className="w-full">
    <Outlet />
  </div>
);

export default GenresPage;
