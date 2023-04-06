import { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet } from '@remix-run/react';
import { Container, Badge } from '@nextui-org/react';

import { tvPages } from '~/constants/tabLinks';

export const meta: MetaFunction = () => ({
  title: 'Free Series HD - Watch Series and Movies HD Online on Sora',
  description:
    'Watch latest Tv series online in HD Quality. Unlimited streaming series for free now',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, hd movies, stream movies, movies to stream, watch movies free',
  'og:url': 'https://sora-anime.vercel.app/tv-shows',
  'og:title': 'Free Series HD - Watch Series and Movies HD Online on Sora',
  'og:image': 'https://sora-anime.vercel.app/api/ogimage?it=tvshows',
  'og:description':
    'Watch latest Tv series online in HD Quality. Unlimited streaming series for free now',
});

export const handle = {
  breadcrumb: () => (
    <NavLink to="/tv-shows" aria-label="Tv Series Page">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Tv Shows
        </Badge>
      )}
    </NavLink>
  ),
  showTabLink: true,
  tabLinkPages: tvPages,
  tabLinkTo: () => '/tv-shows',
  hideTabLinkWithLocation: (locationPathname: string) => {
    if (locationPathname.split('/')[2]?.match(/^\d+$/) || locationPathname === '/tv-shows')
      return true;
    return false;
  },
};

const TvPage = () => (
  <Container fluid responsive={false} css={{ m: 0, p: 0 }}>
    <Outlet />
  </Container>
);

export default TvPage;
