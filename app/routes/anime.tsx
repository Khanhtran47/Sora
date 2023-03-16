import { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet, useLocation } from '@remix-run/react';
import { Container, Badge } from '@nextui-org/react';

import TabLink from '~/components/elements/tab/TabLink';

const animePage = [
  { pageName: 'Discover Anime', pageLink: '/discover' },
  { pageName: 'Recent Episodes', pageLink: '/recent-episodes' },
  { pageName: 'Popular Anime', pageLink: '/popular' },
  { pageName: 'Trending Anime', pageLink: '/trending' },
];

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
    <NavLink to="/anime" aria-label="Anime Page">
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
          Anime
        </Badge>
      )}
    </NavLink>
  ),
};

const AnimeIndexPage = () => {
  const location = useLocation();
  if (location.pathname.split('/')[2]?.match(/^\d+$/) || location.pathname === '/anime')
    return (
      <Container fluid responsive={false} css={{ m: 0, p: 0 }}>
        <Outlet />
      </Container>
    );
  return (
    <Container fluid responsive={false} css={{ m: 0, p: 0 }}>
      <TabLink pages={animePage} linkTo="/anime" />
      <Outlet />
    </Container>
  );
};

export default AnimeIndexPage;
