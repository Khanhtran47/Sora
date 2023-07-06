import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'remix-utils';

import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getListTvShows } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta: MetaFunction = () => ({
  title: 'Top Rated TV shows | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sorachill.vercel.app/tv-shows/top-rated',
  'og:title': 'Top Rated TV shows | Sora',
  'og:description':
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
});

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
      shows: await getListTvShows('top_rated', locale, page),
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.topRated,
      },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/tv-shows/top-rated" key="tv-shows-top-rated">
      Top Rated Tv
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Top Rated Tv',
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
      navigate('/tv-shows/on-the-air');
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
        currentPage={shows?.page}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={shows?.items}
        itemsType="tv"
        listName={t('top-rated-tv-shows')}
        listType="grid"
        showListTypeChangeButton
        totalPages={shows?.totalPages}
      />
    </motion.div>
  );
};

export default ListTvShows;
