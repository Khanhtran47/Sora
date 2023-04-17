import { Badge, Container } from '@nextui-org/react';
import type { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet } from '@remix-run/react';

import { moviePages } from '~/constants/tabLinks';

export const meta: MetaFunction = () => ({
  title: 'Free Movies HD - Watch Movies and Tv Series HD Online on Sora',
  description: 'Watch latest movies online in HD Quality. Unlimited streaming movies for free now',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, hd movies, stream movies, movies to stream, watch movies free',
  'og:url': 'https://sora-anime.vercel.app/movies',
  'og:title': 'Free Movies HD - Watch Movies and Tv Series HD Online on Sora',
  'og:image': 'https://sora-anime.vercel.app/api/ogimage?it=movies',
  'og:description':
    'Watch latest movies online in HD Quality. Unlimited streaming movies for free now',
});

export const handle = {
  breadcrumb: () => (
    <NavLink to="/movies" aria-label="Movies Page">
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
          Movies
        </Badge>
      )}
    </NavLink>
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

const MoviePage = () => (
  <Container fluid responsive={false} css={{ m: 0, p: 0 }}>
    <Outlet />
  </Container>
);

export default MoviePage;
