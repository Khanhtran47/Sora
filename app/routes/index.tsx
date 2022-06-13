import { Link } from '@remix-run/react';
import { Container } from '@nextui-org/react';
import type { MetaFunction } from '@remix-run/node';
import { json, useLoaderData } from 'remix';

import { getTrending } from '~/models/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';

type LoaderData = {
  todayTrending: Awaited<ReturnType<typeof getTrending>>;
  weekTrending: Awaited<ReturnType<typeof getTrending>>;
};

export const loader = async () =>
  json<LoaderData>({
    todayTrending: await getTrending('all', 'day'),
    weekTrending: await getTrending('all', 'week'),
  });

// interface IIndexProps {}

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => ({
  title: 'Remix App',
  description: '（づ￣3￣）づ╭❤️～',
});

// https://remix.run/guides/routing#index-routes
const Index = () => {
  const { weekTrending } = useLoaderData<LoaderData>();

  return (
    <Container fluid>
      {weekTrending && weekTrending.length > 0 && (
        <MediaList listType="grid" items={weekTrending} listName="Trending This Week" />
      )}
      <Link to="/about" color="secondary">
        Go to the about page
      </Link>
    </Container>
  );
};

export default Index;
