import { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet, useLocation } from '@remix-run/react';
import { Container, Badge } from '@nextui-org/react';

import TabLink from '~/components/elements/tab/TabLink';

export const meta: MetaFunction = () => ({
  title: 'Free Movies HD - Watch Movies and Tv Series HD Online on Sora',
  description: 'Watch latest movies online in HD Quality. Unlimited streaming movies for free now',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, hd movies, stream movies, movies to stream, watch movies free',
  'og:url': 'https://sora-anime.vercel.app/movies',
  'og:title': 'Free Movies HD - Watch Movies and Tv Series HD Online on Sora',
  'og:image': 'https://static.alphacoders.com/thumbs_categories/20.jpg',
  'og:description':
    'Watch latest movies online in HD Quality. Unlimited streaming movies for free now',
});

const moviePage = [
  { pageName: 'Discover Movies', pageLink: '/discover' },
  { pageName: 'Popular Movies', pageLink: '/popular' },
  { pageName: 'Top Rated Movies', pageLink: '/top-rated' },
  { pageName: 'Upcoming Movies', pageLink: '/upcoming' },
];

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
};

const MoviePage = () => {
  const location = useLocation();
  if (location.pathname.split('/')[2]?.match(/^\d+$/) || location.pathname === '/movies')
    return (
      <Container fluid css={{ m: 0, p: 0 }}>
        <Outlet />
      </Container>
    );
  return (
    <Container fluid css={{ m: 0, p: 0 }}>
      <TabLink pages={moviePage} linkTo="/movies" />
      <Outlet />
    </Container>
  );
};

export default MoviePage;
