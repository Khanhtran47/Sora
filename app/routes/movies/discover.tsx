/* eslint-disable @typescript-eslint/indent */
import { useLoaderData, useNavigate, useLocation, NavLink } from '@remix-run/react';
import { json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { Container, Badge } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { authenticate } from '~/services/supabase';
import { getListMovies, getListDiscover } from '~/services/tmdb/tmdb.server';
import { ILanguage } from '~/services/tmdb/tmdb.types';
import i18next from '~/i18n/i18next.server';

import MediaList from '~/src/components/media/MediaList';

type LoaderData = {
  movies: Awaited<ReturnType<typeof getListMovies>>;
  withGenres?: string;
  withOriginalLanguage?: string;
  releaseDateGte?: string;
  releaseDateLte?: string;
  voteAverageGte?: string;
  voteAverageLte?: string;
  withRuntimeGte?: string;
  withRuntimeLte?: string;
  sortBy?: string;
};

export const meta: MetaFunction = () => ({
  title: 'Discover and watch movies and tv shows for free | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/movies/discover',
  'og:title': 'Discover and watch movies and tv shows for free | Sora',
  'og:description':
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
});

export const loader: LoaderFunction = async ({ request }) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

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

  return json<LoaderData>({
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
    withGenres,
    withOriginalLanguage,
    releaseDateGte,
    releaseDateLte,
    voteAverageGte,
    voteAverageLte,
    withRuntimeGte,
    withRuntimeLte,
    sortBy,
  });
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
};

const ListMovies = () => {
  const {
    movies,
    withGenres,
    withOriginalLanguage,
    releaseDateGte,
    releaseDateLte,
    sortBy,
    voteAverageGte,
    voteAverageLte,
    withRuntimeGte,
    withRuntimeLte,
  } = useLoaderData<LoaderData>();
  const rootData:
    | {
        user?: User;
        locale: string;
        languages: ILanguage[];
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => {
    let url = `?page=${page}`;

    if (withGenres) url += `&with_genres=${withGenres}`;
    if (withOriginalLanguage) url += `&with_original_language=${withOriginalLanguage}`;
    if (releaseDateGte) url += `&date.gte=${releaseDateGte}`;
    if (releaseDateLte) url += `&date.lte=${releaseDateLte}`;
    if (voteAverageGte) url += `&vote_average.gte=${voteAverageGte}`;
    if (voteAverageLte) url += `&vote_average.lte=${voteAverageLte}`;
    if (withRuntimeGte) url += `&with_runtime.gte=${withRuntimeGte}`;
    if (withRuntimeLte) url += `&with_runtime.lte=${withRuntimeLte}`;
    if (sortBy) url += `&sort_by=${sortBy}`;

    navigate(url);
  };

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container
        fluid
        display="flex"
        justify="center"
        direction="column"
        alignItems="center"
        css={{
          '@xsMax': {
            paddingLeft: '$sm',
            paddingRight: '$sm',
          },
        }}
      >
        {movies && movies.items && movies.items.length > 0 && (
          <MediaList
            listType="grid"
            showListTypeChangeButton
            items={movies.items}
            listName={t('discoverMovies')}
            showFilterButton
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            mediaType="movie"
            languages={rootData?.languages}
            showPagination
            totalPages={movies.totalPages}
            currentPage={movies.page}
            onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
          />
        )}
      </Container>
    </motion.div>
  );
};

export default ListMovies;
