import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import type { IMedia } from '~/types/media';
import { getAnimeTrending } from '~/services/consumet/anilist/anilist.server';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getTrending } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) page = 1;

  const [
    todayTrending,
    todayMoviesTrending,
    todayShowsTrending,
    todayAnimeTrending,
    todayPeopleTrending,
  ] = await Promise.all([
    getTrending('all', 'day', locale, page),
    getTrending('movie', 'day', locale, page),
    getTrending('tv', 'day', locale, page),
    getAnimeTrending(page, 16),
    getTrending('person', 'day', locale, page),
  ]);
  return json(
    {
      todayTrending: todayTrending.items,
      todayMoviesTrending: todayMoviesTrending.items,
      todayShowsTrending: todayShowsTrending.items,
      todayAnimeTrending: todayAnimeTrending?.results as IMedia[],
      todayPeopleTrending: todayPeopleTrending.items?.map((item) => ({
        ...item,
        mediaType: 'people',
      })) as IMedia[],
    },
    { headers: { 'Cache-Control': CACHE_CONTROL.trending } },
  );
};

const TrendingRoute = () => {
  const {
    todayTrending,
    todayMoviesTrending,
    todayShowsTrending,
    todayAnimeTrending,
    todayPeopleTrending,
  } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const onClickViewMore = (type: 'all' | 'movie' | 'tv' | 'anime' | 'people') => {
    if (type === 'anime') {
      navigate(`/anime/trending`);
    } else {
      navigate(`/trending/${type}/today`);
    }
  };

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center px-3 sm:px-5"
    >
      <MediaList
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={todayTrending}
        itemsType="movie-tv"
        key="slider-card-trending-today-all"
        listName={t('trending.all.day')}
        listType="slider-card"
        navigationButtons
        onClickViewMore={() => onClickViewMore('all')}
        showMoreList
      />
      <MediaList
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={todayMoviesTrending}
        itemsType="movie"
        key="slider-card-trending-today-movies"
        listName={t('trending.movie.day')}
        listType="slider-card"
        navigationButtons
        onClickViewMore={() => onClickViewMore('movie')}
        showMoreList
      />
      <MediaList
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={todayShowsTrending}
        itemsType="tv"
        key="slider-card-trending-today-tv"
        listName={t('trending.tv.day')}
        listType="slider-card"
        navigationButtons
        onClickViewMore={() => onClickViewMore('tv')}
        showMoreList
      />
      <MediaList
        items={todayAnimeTrending}
        itemsType="anime"
        key="slider-card-trending-today-anime"
        listName={t('trending-anime')}
        listType="slider-card"
        navigationButtons
        onClickViewMore={() => onClickViewMore('anime')}
        showMoreList
      />
      <MediaList
        items={todayPeopleTrending}
        itemsType="people"
        key="slider-card-trending-today-people"
        listName={t('trending.people.day')}
        listType="slider-card"
        navigationButtons
        onClickViewMore={() => onClickViewMore('people')}
        showMoreList
      />
    </motion.div>
  );
};

export default TrendingRoute;
