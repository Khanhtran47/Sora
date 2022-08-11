import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Container, Pagination } from '@nextui-org/react';

import { getTrending } from '~/services/tmdb/tmdb.server';

import MediaList from '~/src/components/Media/MediaList';

import useMediaQuery from '~/hooks/useMediaQuery';

type LoaderData = {
  todayTrending: Awaited<ReturnType<typeof getTrending>>;
  // weekTrending: Awaited<ReturnType<typeof getTrending>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      todayTrending: await getTrending('all', 'day'),
      // weekTrending: await getTrending('all', 'week'),
    });
  }

  return json<LoaderData>({
    todayTrending: await getTrending('all', 'day', page),
    // weekTrending: await getTrending('all', 'week', page),
  });
};

// How this page load data:
// First load (mount): using useLoaderData (server loaded)
// After: client side
// TODO: choose the best strategy to load data (better for SEO, for user ex)
// and choose a way to swap today trending and this week trending, or both ?
const Trending = () => {
  const { todayTrending } = useLoaderData<LoaderData>() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [listName] = useState('Today Trending');
  const isXs = useMediaQuery(650);

  const paginationChangeHandler = (page: number) => navigate(`/trending?page=${page}`);

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
        {/* TODO: better and prettier way to swap trending type */}
        {/* <Radio.Group
        orientation="horizontal"
        label="Time Windows"
        defaultValue="today"
        // onChange={radioChangeHandler}
      >
        <Radio value="today" color="secondary" size="sm">
          Today Trending
        </Radio>
        <Radio value="week" color="success" size="sm">
          This Week Trending
        </Radio>
      </Radio.Group>
      <Spacer /> */}
        {todayTrending?.items.length > 0 && (
          <MediaList listType="grid" items={todayTrending.items} listName={listName} />
        )}
        <Pagination
          total={todayTrending.totalPages}
          initialPage={todayTrending.page}
          shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
          {...(isXs && { size: 'xs' })}
        />
      </Container>
    </motion.div>
  );
};

export default Trending;
