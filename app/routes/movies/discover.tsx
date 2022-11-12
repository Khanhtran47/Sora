/* eslint-disable @typescript-eslint/indent */
import { useLoaderData, useNavigate, useLocation, Link } from '@remix-run/react';
import { json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { Container, Pagination } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { authenticate } from '~/services/supabase';
import { getListMovies, getListGenre, getListDiscover } from '~/services/tmdb/tmdb.server';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';
import MediaList from '~/src/components/media/MediaList';

type LoaderData = {
  movies: Awaited<ReturnType<typeof getListMovies>>;
  withGenres?: string;
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
  const genres = await getListGenre('movie', locale);

  const withGenres = url.searchParams.get('with_genres') || undefined;
  let sortBy = url.searchParams.get('sort_by') || undefined;
  if (sortBy && !sortBy.includes('.')) sortBy += '.desc';

  return json<LoaderData>({
    movies:
      sortBy || genres
        ? await getListDiscover('movie', withGenres, sortBy, locale, page)
        : await getListMovies('popular', locale, page),
    withGenres,
    sortBy,
  });
};

export const handle = {
  breadcrumb: () => (
    <Link to="/movies?index" aria-label="Discover Movies">
      Discover Movies
    </Link>
  ),
};

const ListMovies = () => {
  const { movies, withGenres, sortBy } = useLoaderData<LoaderData>();
  const rootData:
    | {
        user?: User;
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const navigate = useNavigate();
  const location = useLocation();
  const isXs = useMediaQuery(650);
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => {
    let url = `?page=${page}`;

    if (withGenres) url += `&with_genres=${withGenres}`;
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
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {movies && movies.items && movies.items.length > 0 && (
          <MediaList
            listType="grid"
            items={movies.items}
            listName={t('discoverMovies')}
            showFilter
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            mediaType="movie"
          />
        )}
        <Pagination
          total={movies.totalPages}
          initialPage={movies.page}
          shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
          {...(isXs && { size: 'xs' })}
        />
      </Container>
    </motion.div>
  );
};

export default ListMovies;
