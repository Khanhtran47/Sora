import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { Container, Pagination, Spacer } from '@nextui-org/react';

import { getTrending } from '~/models/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';

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
  const { todayTrending } = useLoaderData<LoaderData>();

  const [trending, setTrending] = useState(todayTrending);
  const [listName] = useState('Today Trending');

  // const radioChangeHandler = (value: string) => {
  //   if (value === 'today') {
  //     setTrending(todayTrending);
  //     setListName('Today Trending');
  //   } else {
  //     setTrending(weekTrending);
  //     setListName('This Week Trending');
  //   }
  // };

  const paginationChangeHandler = async (page: number) => {
    // TODO: use better fetcher (axios, react-query, ... and swr (a hook))
    const response = await fetch(`/api/trending?mediaType=all&timeWindow=day&page=${page}`);
    if (response.ok) {
      const data = await response.json();
      setTrending({ page: data.page, totalPages: data.totalPages, items: data.items });
    }
    // TODO: look for built-in hook allowing changing url without reloading page
    window.history.pushState(null, 'tmp', `?page=${page}`);
  };

  return (
    <Container fluid>
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
      {trending?.items.length > 0 && (
        <MediaList listType="grid" items={trending.items} listName={listName} />
      )}
      <Pagination
        total={trending.totalPages}
        initialPage={trending.page}
        shadow
        onChange={paginationChangeHandler}
      />
      <Spacer />
      <Link to="/about" color="secondary">
        Go to the about page
      </Link>
    </Container>
  );
};

export default Trending;
