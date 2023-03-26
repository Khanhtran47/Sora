import { Outlet } from '@remix-run/react';

const genresPage = [
  { pageName: 'movie-genres', pageLink: '/movie' },
  { pageName: 'tv-show-genres', pageLink: '/tv' },
  { pageName: 'anime-genres', pageLink: '/anime' },
];

export const handle = {
  showTabLink: true,
  tabLinkPages: genresPage,
  tabLinkTo: '/genres',
};

const GenresPage = () => (
  <div className="w-full">
    <Outlet />
  </div>
);

export default GenresPage;
