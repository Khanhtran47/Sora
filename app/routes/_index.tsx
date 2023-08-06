import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import type { IMedia } from '~/types/media';
import { getAnimePopular } from '~/services/consumet/anilist/anilist.server';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import {
  getListDiscover,
  getListMovies,
  getListPeople,
  getTrending,
} from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import featuredList from '~/constants/featuredList';
import MediaList from '~/components/media/MediaList';

export const handle: Handle = {
  disableLayoutPadding: true,
  miniTitle: () => ({
    title: 'Home',
    showImage: false,
  }),
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
      100,
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

const RootIndex = () => {
  const { movies, shows, popularAnime, people, todayTrending } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      className="mt-[72px] flex w-full flex-col items-center justify-center sm:mt-0"
    >
      <MediaList
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={todayTrending}
        key="slider-banner-home"
        listType="slider-banner"
      />
      <div className="mt-9 flex w-full flex-col items-center justify-start px-3 sm:px-5">
        <MediaList
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          items={movies}
          itemsType="movie"
          key="slider-card-popular-movies"
          listName={t('popular-movies')}
          listType="slider-card"
          navigationButtons
          onClickViewMore={() => onClickViewMore('movies')}
          showMoreList
        />
        <MediaList
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          items={shows}
          itemsType="tv"
          key="slider-card-popular-tv"
          listName={t('popular-tv-shows')}
          listType="slider-card"
          navigationButtons
          onClickViewMore={() => onClickViewMore('tv-shows')}
          showMoreList
        />
        <MediaList
          items={popularAnime}
          itemsType="anime"
          key="slider-card-popular-anime"
          listName={t('popular-anime')}
          listType="slider-card"
          navigationButtons
          onClickViewMore={() => navigate('/anime/popular')}
          showMoreList
        />
        <MediaList
          coverItem={featuredList}
          isCoverCard
          key="slider-card-featured-lists"
          listName={t('featured-lists')}
          listType="slider-card"
          navigationButtons
          onClickViewMore={() => navigate('/lists')}
          showMoreList
        />
        <MediaList
          items={people}
          itemsType="people"
          key="slider-card-popular-people"
          listName={t('popular-people')}
          listType="slider-card"
          navigationButtons
          onClickViewMore={() => onClickViewMore('people')}
          showMoreList
        />
      </div>
    </motion.div>
  );
};

export default RootIndex;
