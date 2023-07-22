import { Outlet } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import { animePages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  {
    name: 'keywords',
    content:
      'watch free anime, free anime to watch online, watch anime online free, free anime streaming, free anime full, free anime download, watch anime hd, anime to watch, hd anime, stream anime, anime to stream, watch anime free',
  },
  { property: 'og:image', content: 'https://sorachill.vercel.app/api/ogimage?it=anime' },
  { name: 'twitter:image', content: 'https://sorachill.vercel.app/api/ogimage?it=anime' },
]);

export const handle: Handle = {
  breadcrumb: ({ t }) => (
    <BreadcrumbItem to="/anime" key="anime-index">
      {t('anime')}
    </BreadcrumbItem>
  ),
  showTabLink: true,
  tabLinkPages: animePages,
  tabLinkTo: () => '/anime',
  hideTabLinkWithLocation: (locationPathname: string) => {
    if (locationPathname.split('/')[2]?.match(/^\d+$/) || locationPathname === '/anime')
      return true;
    return false;
  },
};

const AnimeIndexPage = () => <Outlet />;

export default AnimeIndexPage;
