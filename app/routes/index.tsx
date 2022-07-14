import * as React from 'react';
import { MetaFunction, LoaderFunction, json, DataFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { getTrending } from '~/models/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => ({
  title: 'Remix App',
  description: '（づ￣3￣）づ╭❤️～',
});

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) {
    return json({
      todayTrending: await getTrending('all', 'day'),
      // weekTrending: await getTrending('all', 'week'),
    });
  }

  return json({
    todayTrending: await getTrending('all', 'day', page),
    // weekTrending: await getTrending('all', 'week', page),
  });
};

// https://remix.run/guides/routing#index-routes
const Index = () => {
  const { todayTrending } = useLoaderData();
  console.log(todayTrending.items);
  const [trending] = React.useState(todayTrending.items);

  return (
    // Home page
    <MediaList listType="slider-banner" items={trending} />
  );
};

export default Index;
