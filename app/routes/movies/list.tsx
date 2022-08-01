import * as React from 'react';
import { useLoaderData, useNavigate, useLocation } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { Container, Pagination } from '@nextui-org/react';
import { motion } from 'framer-motion';

import MediaList from '~/src/components/Media/MediaList';
import { getListMovies } from '~/services/tmdb/tmdb.server';

type LoaderData = {
  movies: Awaited<ReturnType<typeof getListMovies>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));

  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      movies: await getListMovies('popular'),
    });
  }
  return json<LoaderData>({
    movies: await getListMovies('popular', page),
  });
};

const ListMovies = () => {
  const { movies } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(movies);

  const paginationChangeHandler = (page: number) => navigate(`/movies/list?page=${page}`);

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
          <MediaList listType="grid" items={movies.items} listName="Popular Movies" showFilter />
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
