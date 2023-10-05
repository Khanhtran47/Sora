import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getListMovies, getTrending } from '~/services/tmdb/tmdb.server';
import { useTypedRouteLoaderData } from '~/utils/react/hooks/useTypedRouteLoaderData';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const page = 1;
  const [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all([
    getTrending('movie', 'day', locale, page),
    getListMovies('popular', locale, page),
    getListMovies('top_rated', locale, page),
    getListMovies('upcoming', locale, page),
    getListMovies('now_playing', locale, page),
  ]);
  return json(
    {
      trending,
      popular,
      topRated,
      upcoming,
      nowPlaying,
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.movie,
      },
    },
  );
};

export const meta = mergeMeta(() => [
  { title: 'Sora - Movies' },
  { name: 'description', content: 'Discover movies in Sora' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/movies/' },
  { property: 'og:title', content: 'Sora - Movies' },
  { property: 'og:description', content: 'Discover movies in Sora' },
  { name: 'twitter:title', content: 'Sora - Movies' },
  { name: 'twitter:description', content: 'Discover movies in Sora' },
]);

export const handle: Handle = {
  disableLayoutPadding: true,
  miniTitle: ({ t }) => ({
    title: t('movies'),
    showImage: false,
  }),
};

const MoviesIndexPage = () => {
  const { trending, popular, topRated, upcoming, nowPlaying } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <MediaList
        listType="slider-banner"
        // @ts-expect-error
        items={trending.items}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
      />
      <div className="mt-9 flex w-full flex-col items-center justify-start px-3 sm:px-5">
        {popular?.items && popular?.items?.length > 0 ? (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            // @ts-expect-error
            items={popular.items}
            itemsType="movie"
            listName={t('popular-movies')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/movies/popular')}
            showMoreList
          />
        ) : null}
        {topRated?.items && topRated?.items?.length > 0 ? (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            // @ts-expect-error
            items={topRated.items}
            itemsType="movie"
            listName={t('top-rated-movies')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/movies/top-rated')}
            showMoreList
          />
        ) : null}
        {nowPlaying?.items && nowPlaying.items?.length > 0 ? (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            // @ts-expect-error
            items={nowPlaying.items}
            itemsType="movie"
            listName={t('now-playing-movies')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/movies/now-playing')}
            showMoreList
          />
        ) : null}
        {upcoming?.items && upcoming.items?.length > 0 ? (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            // @ts-expect-error
            items={upcoming.items}
            itemsType="movie"
            listName={t('upcoming-movies')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/movies/upcoming')}
            showMoreList
          />
        ) : null}
      </div>
    </motion.div>
  );
};

export default MoviesIndexPage;
