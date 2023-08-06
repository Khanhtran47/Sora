import { Button } from '@nextui-org/button';
import { Spacer } from '@nextui-org/spacer';
import { useLocation, useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import Anime from '~/assets/icons/AnimeIcon';
import Category from '~/assets/icons/CategoryIcon';
import Filter from '~/assets/icons/FilterIcon';
import Movie from '~/assets/icons/MovieIcon';
import Search from '~/assets/icons/SearchIcon';
import TrendingUp from '~/assets/icons/TrendingUpIcon';
import TvShows from '~/assets/icons/TvIcon';
import TwoUsers from '~/assets/icons/TwoUsersIcon';

const categoryPages = [
  {
    name: 'movies',
    icon: <Movie fill="currentColor" />,
    path: '/movies/popular',
  },
  {
    name: 'tv-shows',
    icon: <TvShows fill="currentColor" />,
    path: '/tv-shows/popular',
  },
  {
    name: 'anime',
    icon: <Anime fill="currentColor" />,
    path: '/anime/popular',
  },
  {
    name: 'people',
    icon: <TwoUsers fill="currentColor" />,
    path: '/people',
  },
  {
    name: 'trending',
    icon: <TrendingUp fill="currentColor" />,
    path: '/trending/',
  },
];

const generalPages = [
  {
    name: 'movie-genres',
    path: '/genres/movie',
    icon: <Movie fill="currentColor" />,
  },
  {
    name: 'tv-show-genres',
    path: '/genres/tv',
    icon: <TvShows fill="currentColor" />,
  },
  {
    name: 'anime-genres',
    path: '/genres/anime',
    icon: <Anime fill="currentColor" />,
  },
  {
    name: 'featured-lists',
    path: '/lists',
    icon: <Category fill="currentColor" />,
  },
];

const DiscoverPage = () => {
  const { t } = useTranslation('discover');
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ x: '10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-start justify-center px-3"
    >
      <h1>{t('discover')}</h1>
      <Spacer y={2.5} />
      <Button
        startContent={<Search fill="currentColor" />}
        type="button"
        fullWidth
        onPress={() => {
          navigate('/search/movie');
        }}
      >
        {t('search')}
      </Button>
      <Spacer y={3} />
      <Button
        startContent={<Filter fill="currentColor" />}
        type="button"
        onPress={() => {
          navigate('/discover/movies');
        }}
      >
        {t('filter')}
      </Button>
      <Spacer y={7} />
      <div className="flex w-full flex-col items-start justify-center">
        <h4>{t('categories')}</h4>
        <Spacer y={2.5} />
        <div className="flex w-full flex-wrap gap-x-2 gap-y-4">
          {categoryPages.map((page) => (
            <Button
              key={page.name}
              startContent={page.icon}
              type="button"
              onPress={() => {
                navigate(page.path);
              }}
            >
              {t(page.name)}
            </Button>
          ))}
        </div>
      </div>
      <Spacer y={7} />
      <div className="flex w-full flex-col items-start justify-center">
        <h4>{t('general')}</h4>
        <Spacer y={2.5} />
        <div className="flex w-full flex-wrap gap-x-2 gap-y-4">
          {generalPages.map((page) => (
            <Button
              key={page.name}
              startContent={page.icon}
              type="button"
              onPress={() => {
                navigate(page.path);
              }}
            >
              {t(page.name)}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DiscoverPage;
