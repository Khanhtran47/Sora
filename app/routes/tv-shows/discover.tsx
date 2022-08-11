import * as React from 'react';
import { useLoaderData, useNavigate, useLocation } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { Container, Pagination } from '@nextui-org/react';
import { motion } from 'framer-motion';

import { getListTvShows, getListGenre, getListDiscover } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';
import useMediaQuery from '~/hooks/useMediaQuery';

type LoaderData = {
  shows: Awaited<ReturnType<typeof getListTvShows>>;
  genres: Awaited<ReturnType<typeof getListGenre>>;
  withGenres?: string;
  sortBy?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  const genres = await getListGenre('tv');
  if (page && page < 1) page = 1;

  const withGenres = url.searchParams.get('with_genres') || undefined;
  let sortBy = url.searchParams.get('sort_by') || undefined;
  if (sortBy && !sortBy.includes('.')) sortBy += sortBy === 'original_title' ? '.asc' : '.desc';

  return json<LoaderData>({
    shows:
      sortBy || genres
        ? await getListDiscover('tv', withGenres, sortBy, page)
        : await getListTvShows('on_the_air', page),
    genres,
    withGenres,
    sortBy,
  });
};

const ListTvShows = () => {
  const { shows, genres, withGenres, sortBy } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const location = useLocation();
  const isXs = useMediaQuery(650);

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
        {shows?.items.length > 0 && (
          <MediaList
            listType="grid"
            items={shows.items}
            listName="Discover Tv shows"
            showFilter
            genres={genres}
            mediaType="tv"
          />
        )}
        <Pagination
          total={shows.totalPages}
          initialPage={shows.page}
          shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
          {...(isXs && { size: 'xs' })}
        />
      </Container>
    </motion.div>
  );
};

export default ListTvShows;
