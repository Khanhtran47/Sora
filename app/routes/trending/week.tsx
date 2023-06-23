import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import i18next from '~/i18n/i18next.server';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'remix-utils';

import { authenticate } from '~/services/supabase';
import { getTrending } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta: MetaFunction = () => ({
  'og:url': 'https://sora-anime.vercel.app/trending/week',
});

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));

  if (!page || page < 1 || page > 1000) {
    return json(
      { weekTrending: await getTrending('all', 'week', locale) },
      {
        headers: { 'Cache-Control': CACHE_CONTROL.trending },
      },
    );
  }
  return json(
    { weekTrending: await getTrending('all', 'week', locale, page) },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.trending },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/trending/week" key="trending-week">
      This Week
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Trending',
    subtitle: 'This Week',
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const TrendingWeek = () => {
  const { weekTrending } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const navigate = useNavigate();
  const isHydrated = useHydrated();
  const { t } = useTranslation();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      navigate('/trending/today');
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      return;
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
        currentPage={weekTrending?.page}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={weekTrending?.items}
        itemsType="movie-tv"
        listName={t('weekTrending')}
        listType="grid"
        showListTypeChangeButton
        totalPages={weekTrending?.totalPages}
      />
    </motion.div>
  );
};

export default TrendingWeek;
