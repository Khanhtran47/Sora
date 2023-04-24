/* eslint-disable @typescript-eslint/indent */

import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getListTvShows } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = () => ({
  title: 'Top Rated TV shows | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/tv-shows/top-rated',
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
    <NavLink to="/tv-shows/top-rated" aria-label="Top Rated Tv">
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
          Top Rated Tv
        </Badge>
      )}
    </NavLink>
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
  const { t } = useTranslation();

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center px-3 sm:px-0"
    >
      {shows && shows.items && shows.items.length > 0 ? (
        <MediaList
          currentPage={shows?.page}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          items={shows.items}
          itemsType="tv"
          listName={t('top-rated-tv-shows')}
          listType="grid"
          showListTypeChangeButton
          totalPages={shows?.totalPages}
        />
      ) : null}
    </motion.div>
  );
};

export default ListTvShows;
