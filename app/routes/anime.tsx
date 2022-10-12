import { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet, useLocation } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import Tab from '~/src/components/elements/Tab';

const animePage = [
  // { pageName: 'Discover Anime', pageLink: '/discover' },
  { pageName: 'Popular Anime', pageLink: '/popular' },
  { pageName: 'Trending Anime', pageLink: '/trending' },
];

export const meta: MetaFunction = () => ({
  title: 'Free Anime HD - Watch Anime HD Online on Sora',
  description:
    'Watch latest anime online in HD Quality. Unlimited streaming anime for free now - No sign up - No Buffering - One Click Streaming',
  keywords:
    'watch free anime, free anime to watch online, watch anime online free, free anime streaming, free anime full, free anime download, watch anime hd, anime to watch, hd anime, stream anime, anime to stream, watch anime free',
  'og:url': 'https://sora-movie.vervel.app/anime',
  'og:title': 'Free Anime HD - Watch Anime HD Online on Sora',
  'og:image':
    'https://www.magicalassam.com/wp-content/uploads/2022/03/Movies-Like-Silent-Voice-.jpg',
  'og:description':
    'Watch latest anime online in HD Quality. Unlimited streaming anime for free now - No sign up - No Buffering - One Click Streaming',
});

export const handle = {
  breadcrumb: () => <NavLink to="/anime">Anime</NavLink>,
};

const AnimeIndexPage = () => {
  const location = useLocation();
  if (location.pathname.split('/')[2]?.match(/^\d+$/) || location.pathname === '/anime')
    return (
      <Container fluid css={{ m: 0, p: 0 }}>
        <Outlet />
      </Container>
    );
  return (
    <Container fluid css={{ m: 0, p: 0 }}>
      <Tab pages={animePage} linkTo="/anime" />
      <Outlet />
    </Container>
  );
};

export default AnimeIndexPage;
