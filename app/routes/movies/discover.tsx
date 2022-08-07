import * as React from 'react';
import { useLoaderData, useNavigate, useLocation } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { Container, Pagination } from '@nextui-org/react';
import { motion } from 'framer-motion';

import MediaList from '~/src/components/Media/MediaList';
import { getListMovies, getListGenre, getListDiscover } from '~/services/tmdb/tmdb.server';

type LoaderData = {
  movies: Awaited<ReturnType<typeof getListMovies>>;
  genres: Awaited<ReturnType<typeof getListGenre>>;
  withGenres?: string;
  sortBy?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && page < 1) page = 1;
  const genres = await getListGenre('movie');

  const withGenres = url.searchParams.get('with_genres') || undefined;
  let sortBy = url.searchParams.get('sort_by') || undefined;
  if (sortBy && !sortBy.includes('.')) sortBy += '.desc';

  return json<LoaderData>({
    movies:
      sortBy || genres
        ? await getListDiscover('movie', withGenres, sortBy, page)
        : await getListMovies('popular', page),
    genres,
    withGenres,
    sortBy,
  });
};

const ListMovies = () => {
  const { movies, genres, withGenres, sortBy } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const location = useLocation();

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
      <Container fluid display="flex" justify="center" direction="column" alignItems="center">
        {movies?.items.length > 0 && (
          <MediaList
            listType="grid"
            items={movies.items}
            listName="Discover Movies"
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
        />
      </Container>
    </motion.div>
  );
};

export default ListMovies;
