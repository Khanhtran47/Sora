import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'remix-utils';

import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getListMovies } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora - Now Playing Movies' },
  { name: 'description', content: 'Now Playing Movies' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/movies/now-playing' },
  { property: 'og:title', content: 'Sora - Now Playing Movies' },
  { property: 'og:description', content: 'Now Playing Movies' },
  { name: 'twitter:title', content: 'Sora - Now Playing Movies' },
  { name: 'twitter:description', content: 'Now Playing Movies' },
]);

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (page && (page < 1 || page > 1000)) page = 1;

  return json(
    {
      movies: await getListMovies('now_playing', locale, page),
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.nowPlaying,
      },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/movies/now-playing" key={`movies-now-playing`}>
      Now Playing Movies
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Movies',
    subtitle: 'Now Playing',
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const ListNowPlayingMovies = () => {
  const { movies } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const navigate = useNavigate();
  const isHydrated = useHydrated();
  const { t } = useTranslation();

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      navigate('/movies/popular');
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      navigate('/movies/upcoming');
    }
  };

  return (
    <motion.div
      key={location.key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center px-3 sm:px-0"
      drag={isMobile && isHydrated ? 'x' : false}
      dragConstraints={isMobile && isHydrated ? { left: 0, right: 0 } : false}
      dragElastic={isMobile && isHydrated ? 0.7 : false}
      onDragEnd={handleDragEnd}
      dragDirectionLock={isMobile && isHydrated}
      draggable={isMobile && isHydrated}
    >
      <MediaList
        currentPage={movies?.page}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={movies?.items}
        itemsType="movie"
        listName={t('now-playing-movies')}
        listType="grid"
        showListTypeChangeButton
        totalPages={movies?.totalPages}
      />
    </motion.div>
  );
};

export default ListNowPlayingMovies;
