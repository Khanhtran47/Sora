/* eslint-disable @typescript-eslint/indent */

import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getTrending } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = () => ({
  title: 'Watch Top Trending movies and tv shows free | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/trending',
  'og:title': 'Watch Top Trending movies and tv shows free | Sora',
  'og:description':
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
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
      {
        todayTrending: await getTrending('all', 'day', locale),
        // weekTrending: await getTrending('all', 'week'),
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.trending,
        },
      },
    );
  }

  return json(
    {
      todayTrending: await getTrending('all', 'day', locale, page),
      // weekTrending: await getTrending('all', 'week', page),
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.trending,
      },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/trending" aria-label="Trending Page">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Today Trending
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Today Trending',
    showImage: false,
  }),
};

const Trending = () => {
  const { todayTrending } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/trending?page=${page}`);

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center px-3 sm:px-0"
    >
      {todayTrending && todayTrending.items && todayTrending.items.length > 0 && (
        <MediaList
          currentPage={todayTrending?.page}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          items={todayTrending?.items}
          listName={t('todayTrending')}
          listType="grid"
          loadingType="page"
          onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
          showListTypeChangeButton
          showPagination
          totalPages={todayTrending?.totalPages}
        />
      )}
    </motion.div>
  );
};

export default Trending;
