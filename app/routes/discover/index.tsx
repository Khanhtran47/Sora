import { Button, Spacer } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';

import { H1, H4 } from '~/components/styles/Text.styles';

import Search from '~/assets/icons/SearchIcon';
import Filter from '~/assets/icons/FilterIcon';
import Movie from '~/assets/icons/MovieIcon';
import TvShows from '~/assets/icons/TvIcon';
import Anime from '~/assets/icons/AnimeIcon';
import TwoUsers from '~/assets/icons/TwoUsersIcon';
import Category from '~/assets/icons/CategoryIcon';

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
];

const generalPages = [
  {
    name: 'movies-genres',
    path: '/movies/genres',
    icon: false,
  },
  {
    name: 'tv-shows-genres',
    path: '/tv/genres',
    icon: false,
  },
  {
    name: 'anime-genres',
    path: '/anime/genres',
    icon: false,
  },
  {
    name: 'collections',
    path: '/collections',
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
      className="flex flex-col w-full px-3 justify-center items-start"
    >
      <H1 h1>{t('discover')}</H1>
      <Spacer y={0.5} />
      <Button
        icon={<Search fill="currentColor" />}
        type="button"
        css={{ width: '100%' }}
        onPress={() => {
          navigate('/search/movie');
        }}
      >
        {t('search')}
      </Button>
      <Spacer y={0.75} />
      <Button
        icon={<Filter fill="currentColor" />}
        type="button"
        auto
        onPress={() => {
          navigate('/discover/movies');
        }}
      >
        {t('filter')}
      </Button>
      <Spacer y={1.5} />
      <div className="flex flex-col w-full justify-center items-start">
        <H4>{t('categories')}</H4>
        <Spacer y={0.5} />
        <div className="flex flex-wrap w-full gap-x-2 gap-y-4">
          {categoryPages.map((page) => (
            <Button
              key={page.name}
              icon={page.icon}
              type="button"
              auto
              onPress={() => {
                navigate(page.path);
              }}
            >
              {t(page.name)}
            </Button>
          ))}
        </div>
      </div>
      <Spacer y={1.5} />
      <div className="flex flex-col w-full justify-center items-start">
        <H4>{t('general')}</H4>
        <Spacer y={0.5} />
        <div className="flex flex-wrap w-full gap-x-2 gap-y-4">
          {generalPages.map((page) => (
            <Button
              key={page.name}
              icon={page.icon}
              type="button"
              auto
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
