import * as React from 'react';
import { useLoaderData, useNavigate, useLocation } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { Container, Pagination } from '@nextui-org/react';
import { motion } from 'framer-motion';

import { getListTvShows } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';

type LoaderData = {
  shows: Awaited<ReturnType<typeof getListTvShows>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));

  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      shows: await getListTvShows('popular'),
    });
  }
  return json<LoaderData>({
    shows: await getListTvShows('popular', page),
  });
};

const ListTvShows = () => {
  const { shows } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const location = useLocation();

  const paginationChangeHandler = (page: number) => navigate(`/tv-shows/popular?page=${page}`);

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container fluid display="flex" justify="center" direction="column" alignItems="center">
        {shows?.items.length > 0 && (
          <MediaList listType="grid" items={shows.items} listName="Popular Tv shows" />
        )}
        <Pagination
          total={shows.totalPages}
          initialPage={shows.page}
          shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
        />
      </Container>
    </motion.div>
  );
};

export default ListTvShows;
