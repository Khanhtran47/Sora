import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getListDiscover, getListTvShows, getTrending } from '~/services/tmdb/tmdb.server';
import { useTypedRouteLoaderData } from '~/utils/react/hooks/useTypedRouteLoaderData';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';

export const meta = mergeMeta(() => [
  { title: 'Sora - Tv Shows' },
  { name: 'description', content: 'Discover tv shows in Sora' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/tv-shows/' },
  { property: 'og:title', content: 'Sora - Tv Shows' },
  { property: 'og:description', content: 'Discover tv shows in Sora' },
  { name: 'twitter:title', content: 'Sora - Tv Shows' },
  { name: 'twitter:description', content: 'Discover tv shows in Sora' },
]);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const page = 1;
  const today = dayjs();
  // get next 7 days
  const next7Days = today.add(7, 'day');
  const formattedToday = today.format('YYYY-MM-DD');
  const formattedNext7Days = next7Days.format('YYYY-MM-DD');
  const [trending, popular, airingToday, onTheAir, topRated] = await Promise.all([
    getTrending('tv', 'day', locale, page),
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
    getListTvShows('airing_today', locale, page),
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
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      formattedToday,
      formattedNext7Days,
    ),
    getListTvShows('top_rated', locale, page),
  ]);
  return json(
    {
      trending,
      popular,
      airingToday,
      onTheAir,
      topRated,
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.tv,
      },
    },
  );
};

export const handle: Handle = {
  disableLayoutPadding: true,
  miniTitle: ({ t }) => ({
    title: t('tv-shows'),
    showImage: false,
  }),
};

const TvIndexPage = () => {
  const { trending, popular, airingToday, onTheAir, topRated } = useLoaderData<typeof loader>();
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
        items={trending.items}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
      />
      <div className="mt-9 flex w-full flex-col items-center justify-start px-3 sm:px-5">
        {popular?.items && popular.items.length > 0 && (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={popular.items}
            itemsType="tv"
            listName={t('popular-tv-shows')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/tv-shows/popular')}
            showMoreList
          />
        )}
        {airingToday?.items && airingToday.items.length > 0 && (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={airingToday.items}
            itemsType="tv"
            listName={t('airing-today-tv-shows')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/tv-shows/airing-today')}
            showMoreList
          />
        )}
        {onTheAir?.items && onTheAir.items.length > 0 && (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={onTheAir.items}
            itemsType="tv"
            listName={t('on-the-air-tv-shows')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/tv-shows/on-the-air')}
            showMoreList
          />
        )}
        {topRated?.items && topRated.items.length > 0 && (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={topRated.items}
            itemsType="tv"
            listName={t('top-rated-tv-shows')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/tv-shows/top-rated')}
            showMoreList
          />
        )}
      </div>
    </motion.div>
  );
};

export default TvIndexPage;
