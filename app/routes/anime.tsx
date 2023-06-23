import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { animePages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta: MetaFunction = () => ({
  title: 'Free Anime HD - Watch Anime HD Online on Sora',
  description: 'Watch latest anime online in HD Quality. Unlimited streaming anime for free now',
  keywords:
    'watch free anime, free anime to watch online, watch anime online free, free anime streaming, free anime full, free anime download, watch anime hd, anime to watch, hd anime, stream anime, anime to stream, watch anime free',
  'og:url': 'https://sora-anime.vercel.app/anime',
  'og:title': 'Free Anime HD - Watch Anime HD Online on Sora',
  'og:image': 'https://sora-anime.vercel.app/api/ogimage?it=anime',
  'og:description':
    'Watch latest anime online in HD Quality. Unlimited streaming anime for free now',
});

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/anime" key="anime-index">
      Anime
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
