/* eslint-disable @typescript-eslint/indent */
import { useLoaderData, useNavigate, useLocation, NavLink } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { Badge } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import { authenticate } from '~/services/supabase';
import { getListDiscover } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = () => ({
  title: 'On the air TV shows | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/tv-shows/on-the-air',
  'og:title': 'On the air TV shows | Sora',
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

  const today = dayjs();
  // get next 7 days
  const next7Days = today.add(7, 'day');
  const formattedToday = today.format('YYYY-MM-DD');
  const formattedNext7Days = next7Days.format('YYYY-MM-DD');

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
    <NavLink to="/tv-shows/on-the-air" aria-label="On the air Tv">
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
          On the air Tv
        </Badge>
      )}
    </NavLink>
  ),
};

const ListTvShows = () => {
  const { shows } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/tv-shows/on-the-air?page=${page}`);

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex justify-center flex-col items-center px-3 sm:px-0"
    >
      {shows && shows.items && shows.items.length > 0 && (
        <MediaList
          listType="grid"
          showListTypeChangeButton
          items={shows.items}
          listName={t('on-the-air-tv-shows')}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          showPagination
          totalPages={shows.totalPages}
          currentPage={shows.page}
          onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
        />
      )}
    </motion.div>
  );
};

export default ListTvShows;
