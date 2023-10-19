import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate, useParams } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getTrending } from '~/services/tmdb/tmdb.server';
import { useHydrated } from '~/utils/react/hooks/useHydrated';
import { useTypedRouteLoaderData } from '~/utils/react/hooks/useTypedRouteLoaderData';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(({ params }) => {
  const { mediaType } = params;
  return [
    { title: `Sora - Trending ${mediaType} This Week` },
    {
      name: 'keywords',
      content: `trending, trending ${mediaType}, trending this week, trending ${mediaType} this week`,
    },
    { property: 'og:url', content: `https://sorachill.vercel.app/trending/${mediaType}/week` },
    { property: 'og:title', content: `Sora - Trending ${mediaType} This Week` },
    { name: 'description', content: `Trending ${mediaType} This Week` },
    { property: 'og:description', content: `Trending ${mediaType} This Week` },
    { name: 'twitter:title', content: `Sora - Trending ${mediaType} This Week` },
    { name: 'twitter:description', content: `Trending ${mediaType} This Week` },
  ];
});

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (
    !['all', 'movie', 'tv', 'people'].includes(
      params.mediaType as 'all' | 'movie' | 'tv' | 'people',
    )
  ) {
    return redirect(`/trending/all/week`);
  }
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) page = 1;
  const weekTrending =
    params.mediaType === 'people'
      ? await getTrending('person', 'week', locale, page)
      : await getTrending(params.mediaType as 'all' | 'movie' | 'tv', 'week', locale, page);

  return json({ weekTrending }, { headers: { 'Cache-Control': CACHE_CONTROL.trending } });
};

export const handle: Handle = {
  breadcrumb: ({ params, t }) => {
    const { mediaType } = params;
    return (
      <BreadcrumbItem to={`/trending/${mediaType}/week`} key={`trending-${mediaType}-week`}>
        {t(`trending.${mediaType}.week`)}
      </BreadcrumbItem>
    );
  },
  miniTitle: ({ params, t }) => ({
    title: t(`trending-${params.mediaType}`),
    subtitle: t('week'),
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const TrendingWeek = () => {
  const { weekTrending } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const navigate = useNavigate();
  const { mediaType } = useParams();
  const isHydrated = useHydrated();
  const { t } = useTranslation();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      navigate(`/trending/${mediaType}/today`);
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      return;
    }
  };

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
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
        itemsType={mediaType === 'all' ? 'movie-tv' : (mediaType as 'movie' | 'tv' | 'people')}
        listName={t(`trending.${mediaType}.week`)}
        listType="grid"
        showListTypeChangeButton={mediaType !== 'people'}
        totalPages={weekTrending?.totalPages}
      />
    </motion.div>
  );
};

export default TrendingWeek;
