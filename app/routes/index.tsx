/* eslint-disable @typescript-eslint/indent */
import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { authenticate } from '~/services/supabase';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import i18next from '~/i18n/i18next.server';
import {
  getTrending,
  getListMovies,
  getListPeople,
  getListDiscover,
} from '~/services/tmdb/tmdb.server';
import { getAnimePopular } from '~/services/consumet/anilist/anilist.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import { IMedia } from '~/types/media';

import MediaList from '~/components/media/MediaList';
import featuredList from '~/constants/featuredList';

export const handle = {
  i18n: 'home',
  disableLayoutPadding: true,
};

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;

  const [todayTrending, movies, shows, anime, people] = await Promise.all([
    getTrending('all', 'day', locale, page),
    getListMovies('popular', locale, page),
    getListDiscover(
      'tv',
      undefined,
      undefined,
      locale,
      page,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      50,
    ),
    getAnimePopular(page, 16),
    getListPeople('popular', locale, page),
  ]);

  return json(
    {
      todayTrending: todayTrending && todayTrending.items && todayTrending.items.slice(0, 10),
      movies: movies && movies.items && movies.items.slice(0, 16),
      shows: shows && shows.items && shows.items.slice(0, 16),
      popularAnime: anime && (anime.results as IMedia[]),
      people: people && people.items && people.items.slice(0, 16),
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.home,
      },
    },
  );
};

const Index = () => {
  const { movies, shows, popularAnime, people, todayTrending } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('home');

  const onClickViewMore = (type: 'movies' | 'tv-shows' | 'people') => {
    if (type === 'people') navigate(`/${type}`);
    else navigate(`/${type}/popular`);
  };

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col justify-center items-center"
    >
      <MediaList
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={todayTrending}
        listType="slider-banner"
        key="slider-banner-home"
      />
      <div className="w-full flex flex-col justify-start items-center mt-9 px-3 sm:px-5">
        <MediaList
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          items={movies}
          listName={t('popularMovies')}
          listType="slider-card"
          navigationButtons
          onClickViewMore={() => onClickViewMore('movies')}
          showMoreList
          key="slider-card-popular-movies"
        />
        <MediaList
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          items={shows}
          listName={t('popularTv')}
          listType="slider-card"
          navigationButtons
          onClickViewMore={() => onClickViewMore('tv-shows')}
          showMoreList
          key="slider-card-popular-tv"
        />
        <MediaList
          items={popularAnime}
          itemsType="anime"
          listName="Popular Anime"
          listType="slider-card"
          navigationButtons
          onClickViewMore={() => navigate('/anime/popular')}
          showMoreList
          key="slider-card-popular-anime"
        />
        <MediaList
          coverItem={featuredList}
          isCoverCard
          listName="Featured Collections"
          listType="slider-card"
          navigationButtons
          onClickViewMore={() => navigate('/collections')}
          showMoreList
          key="slider-card-featured-collections"
        />
        <MediaList
          items={people}
          listName={t('popularPeople')}
          listType="slider-card"
          navigationButtons
          onClickViewMore={() => onClickViewMore('people')}
          showMoreList
          itemsType="people"
          key="slider-card-popular-people"
        />
      </div>
    </motion.div>
  );
};

export default Index;
