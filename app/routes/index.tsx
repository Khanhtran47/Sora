import * as React from 'react';
import { MetaFunction, LoaderFunction, json, DataFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';

import { getTrending } from '~/services/tmdb/tmdb.server';
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
  const location = useLocation();
  const [trending] = React.useState(todayTrending.items);

  return (
    <motion.main
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MediaList listType="slider-banner" items={trending} />
    </motion.main>
  );
};

export default Index;
