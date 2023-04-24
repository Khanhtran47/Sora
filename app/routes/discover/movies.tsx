/* eslint-disable @typescript-eslint/indent */

import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getListDiscover } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = () => ({
  title: 'Discover and watch movies and tv shows for free | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/discover/movies',
  'og:title': 'Discover and watch movies and tv shows for free | Sora',
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

  const withGenres = url.searchParams.get('with_genres') || undefined;
  let sortBy = url.searchParams.get('sort_by') || undefined;
  if (sortBy && !sortBy.includes('.')) sortBy += '.desc';
  const voteCountGte = url.searchParams.get('vote_count.gte') || 300;
  const withOriginalLanguage = url.searchParams.get('with_original_language') || undefined;
  const releaseDateGte = url.searchParams.get('date.gte') || undefined;
  const releaseDateLte = url.searchParams.get('date.lte') || undefined;
  const voteAverageGte = url.searchParams.get('vote_average.gte') || undefined;
  const voteAverageLte = url.searchParams.get('vote_average.lte') || undefined;
  const withRuntimeGte = url.searchParams.get('with_runtime.gte') || undefined;
  const withRuntimeLte = url.searchParams.get('with_runtime.lte') || undefined;

  return json(
    {
      movies: await getListDiscover(
        'movie',
        withGenres,
        sortBy,
        locale,
        page,
        releaseDateGte,
        releaseDateLte,
        undefined,
        undefined,
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
        undefined,
        undefined,
      ),
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.discover,
      },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/movies?index" aria-label="Discover Movies">
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
          Discover Movies
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Discover',
    subtitle: 'Movies',
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const DiscoverMovies = () => {
  const { movies } = useLoaderData<typeof loader>();
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
      {movies && movies.items && movies.items.length > 0 && (
        <MediaList
          currentPage={movies.page}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          items={movies.items}
          itemsType="movie"
          languages={rootData?.languages}
          listName={t('discoverMovies')}
          listType="grid"
          showFilterButton
          showListTypeChangeButton
          totalPages={movies.totalPages}
        />
      )}
    </motion.div>
  );
};

export default DiscoverMovies;
