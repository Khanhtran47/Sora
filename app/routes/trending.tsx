import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { Container, Pagination, Spacer, Radio } from '@nextui-org/react';
import axios, { AxiosRequestConfig } from 'axios';

/* API */
// import { getTrending } from '~/src/models/tmdb.server';
import Trending from '../src/api/tmdbServices/trending';

/* Components */
import MediaList from '../src/components/MediaList';

// type LoaderData = {
//   todayTrending: Awaited<ReturnType<typeof getTrending>>;
//   // weekTrending: Awaited<ReturnType<typeof getTrending>>;
// };

// export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
//   console.log(request);
//   const url = new URL(request.url);
//   const page = Number(url.searchParams.get('page'));
//   if (!page || page < 1 || page > 1000) {
//     return json<LoaderData>({
//       todayTrending: await getTrending('all', 'day'),
//       // weekTrending: await getTrending('all', 'week'),
//     });
//   }

//   return json<LoaderData>({
//     todayTrending: await getTrending('all', 'day', page),
//     // weekTrending: await getTrending('all', 'week', page),
//   });
// };

// How this page load data:
// First load (mount): using useLoaderData (server loaded)
// After: client side
// TODO: choose the best strategy to load data (better for SEO, for user ex)
// and choose a way to swap today trending and this week trending, or both ?
const TrendingPage = () => {
  // const { todayTrending } = useLoaderData<LoaderData>();

  const [trending, setTrending] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [listName] = useState('Today Trending');
  useEffect(() => {
    const loadTrending = async (pageToLoad: number = page) => {
      const params = {
        page: pageToLoad,
      } as AxiosRequestConfig;
      try {
        const response = await Trending.getTrending('all', 'day', { params });
        console.log(response);
        setTrending(response?.results);
        setTotalPages(response?.total_pages);
        setPage(pageToLoad);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
        } else {
          console.log('unexpected error: ', error);
        }
      }
    };
    loadTrending();
  }, [page]);

  // const radioChangeHandler = (value: string) => {
  //   if (value === 'today') {
  //     setTrending(todayTrending);
  //     setListName('Today Trending');
  //   } else {
  //     setTrending(weekTrending);
  //     setListName('This Week Trending');
  //   }
  // };

  const paginationChangeHandler = async (pageToLoad: number) => {
    // TODO: use better fetcher (axios, react-query, ... and swr (a hook))
    // const response = await fetch(`/api/trending?mediaType=all&timeWindow=day&page=${page}`);
    // if (response.ok) {
    //   const data = await response.json();
    //   setTrending({ page: data.page, totalPages: data.totalPages, items: data.items });
    // }
    setPage(pageToLoad);
    // TODO: look for built-in hook allowing changing url without reloading page
    window.history.pushState(null, 'tmp', `?page=${page}`);
  };

  return (
    <Container fluid>
      {/* TODO: better and prettier way to swap trending type */}
      <Radio.Group
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
      <Spacer />
      {trending?.length > 0 && <MediaList listType="grid" items={trending} listName={listName} />}
      <Pagination total={totalPages} initialPage={page} shadow onChange={paginationChangeHandler} />
      <Spacer />
    </Container>
  );
};

export default TrendingPage;
