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
  { title: 'Sora - Popular Tv Shows' },
  { name: 'description', content: 'Popular Tv Shows' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/tv-shows/popular' },
  { property: 'og:title', content: 'Sora - Popular Tv Shows' },
  { property: 'og:description', content: 'Popular Tv Shows' },
  { name: 'twitter:title', content: 'Sora - Popular Tv Shows' },
  { name: 'twitter:description', content: 'Popular Tv Shows' },
]);

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json(
    {
      shows: await getListDiscover(
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
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.popular,
      },
    },
  );
};

export const handle: Handle = {
  breadcrumb: ({ t }) => (
    <BreadcrumbItem to="/tv-shows/popular" key="tv-shows-popular">
      {t('popular-tv-shows')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ t }) => ({
    title: t('popular-tv-shows'),
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const ListTvShows = () => {
  const { shows } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const navigate = useNavigate();
  const isHydrated = useHydrated();
  const { t } = useTranslation();

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      return;
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      navigate('/tv-shows/airing-today');
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
        currentPage={shows?.page}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={shows?.items}
        itemsType="tv"
        listName={t('popular-tv-shows')}
        listType="grid"
        showListTypeChangeButton
        totalPages={shows?.totalPages}
      />
    </motion.div>
  );
};

export default ListTvShows;
