import type { MetaFunction } from '@remix-run/node';
import { json, useLoaderData } from 'remix';
import { getTrending } from '~/models/tmdb.server';
import Home from '~/src/components/Home/Home';

type LoaderData = {
  trendingItems: Awaited<ReturnType<typeof getTrending>>;
};

export const loader = async () =>
  json<LoaderData>({
    trendingItems: await getTrending('all', 'day'),
  });

// interface IIndexProps {}

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => ({
  title: 'Remix App',
  description: '（づ￣3￣）づ╭❤️～',
});

// https://remix.run/guides/routing#index-routes
const Index = () => {
  const { trendingItems } = useLoaderData<LoaderData>();

  return <Home trendingItems={trendingItems} />;
};

export default Index;
