import { Outlet } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import { moviePages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  {
    name: 'keywords',
    content:
      'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, hd movies, stream movies, movies to stream, watch movies free',
  },
  { property: 'og:image', content: 'https://sorachill.vercel.app/api/ogimage?it=movies' },
  { name: 'twitter:image', content: 'https://sorachill.vercel.app/api/ogimage?it=movies' },
]);

export const handle: Handle = {
  breadcrumb: ({ t }) => (
    <BreadcrumbItem to="/movies" key="movies">
      {t('movies')}
    </BreadcrumbItem>
  ),
  showTabLink: true,
  tabLinkPages: moviePages,
  tabLinkTo: () => '/movies',
  hideTabLinkWithLocation: (locationPathname: string) => {
    if (locationPathname.split('/')[2]?.match(/^\d+$/) || locationPathname === '/movies')
      return true;
    return false;
  },
};

const MoviePage = () => <Outlet />;

export default MoviePage;
