import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'remix-utils';

import type { Handle } from '~/types/handle';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getListDiscover } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora - Discover movies' },
  { name: 'description', content: 'Discover Movies on Sora' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/discover/movies' },
  { property: 'og:title', content: 'Sora - Discover movies' },
  { property: 'og:image', content: 'https://sorachill.vercel.app/api/ogimage?it=movies' },
  { property: 'og:description', content: 'Discover Movies on Sora' },
  { name: 'twitter:title', content: 'Sora - Discover movies' },
  { name: 'twitter:description', content: 'Discover Movies on Sora' },
  { name: 'twitter:image', content: 'https://sorachill.vercel.app/api/ogimage?it=movies' },
]);

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  const withGenres = url.searchParams.get('with_genres') || undefined;
  let sortBy = url.searchParams.get('sort_by') || undefined;
  if (sortBy && !sortBy.includes('.')) sortBy += '.desc';
  const voteCountGte = url.searchParams.get('vote_count.gte') || 300;
  const withOriginalLanguage = url.searchParams.get('with_original_language') || undefined;
  const releaseDateGte = url.searchParams.get('date.gte') || undefined;
  const releaseDateLte = url.searchParams.get('date.lte') || undefined;
  const voteAverageGte = url.searchParams.get('vote_average.gte') || undefined;
  const voteAverageLte = url.searchParams.get('vote_average.lte') || undefined;
  const withRuntimeGte = url.searchParams.get('with_runtime.gte') || undefined;
  const withRuntimeLte = url.searchParams.get('with_runtime.lte') || undefined;

  return json(
    {
      movies: await getListDiscover(
        'movie',
        withGenres,
        sortBy,
        locale,
        page,
        releaseDateGte,
        releaseDateLte,
        undefined,
        undefined,
        withOriginalLanguage,
        Number(voteCountGte),
        voteAverageGte ? Number(voteAverageGte) : undefined,
        voteAverageLte ? Number(voteAverageLte) : undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        withRuntimeGte ? Number(withRuntimeGte) : undefined,
        withRuntimeLte ? Number(withRuntimeLte) : undefined,
        undefined,
        undefined,
      ),
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.discover,
      },
    },
  );
};

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/discover/movies" key="discover-movies">
      Movies
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Discover',
    subtitle: 'Movies',
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const DiscoverMovies = () => {
  const { movies } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isHydrated = useHydrated();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      return;
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      navigate('/discover/tv-shows');
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
        currentPage={movies.page}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={movies.items}
        itemsType="movie"
        languages={rootData?.languages}
        listName={t('discover-movies')}
        listType="grid"
        showFilterButton
        showListTypeChangeButton
        showSortBySelect
        totalPages={movies.totalPages}
      />
    </motion.div>
  );
};

export default DiscoverMovies;
