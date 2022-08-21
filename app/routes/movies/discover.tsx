import * as React from 'react';
import { useLoaderData, useNavigate, useLocation, Link } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { Container, Pagination } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import MediaList from '~/src/components/Media/MediaList';
import { getListMovies, getListGenre, getListDiscover } from '~/services/tmdb/tmdb.server';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';

type LoaderData = {
  movies: Awaited<ReturnType<typeof getListMovies>>;
  genres: Awaited<ReturnType<typeof getListGenre>>;
  withGenres?: string;
  sortBy?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18next.getLocale(request);
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
    genres,
    withGenres,
    sortBy,
  });
};

export const handle = {
  breadcrumb: () => <Link to="/movies?index">Discover Movies</Link>,
};

const ListMovies = () => {
  const { movies, genres, withGenres, sortBy } = useLoaderData<LoaderData>();
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
            genres={genres}
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
