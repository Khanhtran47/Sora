import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getListTvShows } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = () => ({
  title: 'Airing today Tv Shows | Sora',
  description:
    'Watch latest Tv series online in HD Quality. Unlimited streaming series for free now',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, hd movies, stream movies, movies to stream, watch movies free',
  'og:url': 'https://sora-anime.vercel.app/tv-shows/airing-today',
  'og:title': 'Airing today Tv Shows | Sora',
  'og:description':
    'Watch latest Tv series online in HD Quality. Unlimited streaming series for free now',
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
      shows: await getListTvShows('airing_today', locale, page),
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.airingToday,
      },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/tv-shows/airing-today" aria-label="Airing today Tv">
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
          Airing today Tv
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Airing today Tv',
    showImage: false,
  }),
};

const ListAiringTodayTvShows = () => {
  const { shows } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/tv-shows/airing-today?page=${page}`);

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center px-3 sm:px-0"
    >
      {shows && shows.items && shows.items.length > 0 && (
        <MediaList
          listType="grid"
          showListTypeChangeButton
          items={shows.items}
          listName={t('airing-today-tv-shows')}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          showPagination
          totalPages={shows?.totalPages}
          currentPage={shows?.page}
          onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
        />
      )}
    </motion.div>
  );
};

export default ListAiringTodayTvShows;
