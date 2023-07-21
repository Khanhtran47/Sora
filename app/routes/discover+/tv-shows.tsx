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
  { title: 'Sora - Discover tv shows' },
  { name: 'description', content: 'Discover tv shows on Sora' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/discover/tv-shows' },
  { property: 'og:title', content: 'Sora - Discover tv shows' },
  { property: 'og:image', content: 'https://sorachill.vercel.app/api/ogimage?it=tvshows' },
  { property: 'og:description', content: 'Discover tv shows on Sora' },
  { name: 'twitter:title', content: 'Sora - Discover tv shows' },
  { name: 'twitter:description', content: 'Discover tv shows on Sora' },
  { name: 'twitter:image', content: 'https://sorachill.vercel.app/api/ogimage?it=tvshows' },
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
  if (sortBy && !sortBy.includes('.')) sortBy += sortBy === 'original_title' ? '.asc' : '.desc';
  const voteCountGte = url.searchParams.get('vote_count.gte') || 300;
  const withOriginalLanguage = url.searchParams.get('with_original_language') || undefined;
  const withStatus = url.searchParams.get('with_status') || undefined;
  const withType = url.searchParams.get('with_type') || undefined;
  const firstAirDateGte = url.searchParams.get('date.gte') || undefined;
  const firstAirDateLte = url.searchParams.get('date.lte') || undefined;
  const voteAverageGte = url.searchParams.get('vote_average.gte') || undefined;
  const voteAverageLte = url.searchParams.get('vote_average.lte') || undefined;
  const withRuntimeGte = url.searchParams.get('with_runtime.gte') || undefined;
  const withRuntimeLte = url.searchParams.get('with_runtime.lte') || undefined;

  return json(
    {
      shows: await getListDiscover(
        'tv',
        withGenres,
        sortBy,
        locale,
        page,
        undefined,
        undefined,
        firstAirDateGte,
        firstAirDateLte,
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
        withStatus,
        withType,
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
    <BreadcrumbItem to="/discover/tv-shows" key="discover-tv-shows">
      Tv shows
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Discover',
    subtitle: 'Tv Shows',
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const DiscoverTvShows = () => {
  const { shows } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isHydrated = useHydrated();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      navigate('/discover/movies');
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      navigate('/discover/anime');
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
        currentPage={shows.page}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={shows.items}
        itemsType="tv"
        languages={rootData?.languages}
        listName={t('discoverTv')}
        listType="grid"
        showFilterButton
        showListTypeChangeButton
        showSortBySelect
        totalPages={shows.totalPages}
      />
    </motion.div>
  );
};

export default DiscoverTvShows;
