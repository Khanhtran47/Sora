/* eslint-disable @typescript-eslint/indent */
import { useLoaderData, useNavigate, useLocation, NavLink } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { Badge } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import { authenticate } from '~/services/supabase';
import { getListMovies } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = () => ({
  title: 'Top rated movies | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/movies/top-rated',
  'og:title': 'Top rated movies | Sora',
  'og:description':
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
});

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (page && (page < 1 || page > 1000)) page = 1;

  return json(
    {
      movies: await getListMovies('top_rated', locale, page),
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
    <NavLink to="/movies/top-rated" aria-label="Top Rated Movies">
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
          Top Rated Movies
        </Badge>
      )}
    </NavLink>
  ),
};

const ListMovies = () => {
  const { movies } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/movies/top-rated?page=${page}`);

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex justify-center flex-col items-center px-3 sm:px-0"
    >
      {movies && movies.items && movies.items.length > 0 && (
        <MediaList
          listType="grid"
          showListTypeChangeButton
          items={movies.items}
          listName={t('top-rated-movies')}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          showPagination
          totalPages={movies.totalPages}
          currentPage={movies.page}
          onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
        />
      )}
    </motion.div>
  );
};

export default ListMovies;
