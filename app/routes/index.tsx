import * as React from 'react';
import { MetaFunction, LoaderFunction, json, DataFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { Container } from '@nextui-org/react';
import { motion } from 'framer-motion';

import {
  getTrending,
  getListMovies,
  getListTvShows,
  getListPeople,
} from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';
import PeopleList from '~/src/components/people/PeopleList';

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => ({
  title: 'Remix App',
  description: '（づ￣3￣）づ╭❤️～',
});

type LoaderData = {
  todayTrending: Awaited<ReturnType<typeof getTrending>>;
  movies: Awaited<ReturnType<typeof getListMovies>>;
  shows: Awaited<ReturnType<typeof getListTvShows>>;
  people: Awaited<ReturnType<typeof getListPeople>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      todayTrending: await getTrending('all', 'day'),
      movies: await getListMovies('popular'),
      shows: await getListTvShows('popular'),
      people: await getListPeople('popular'),
    });
  }

  return json<LoaderData>({
    todayTrending: await getTrending('all', 'day', page),
    movies: await getListMovies('popular', page),
    shows: await getListTvShows('popular', page),
    people: await getListPeople('popular', undefined, page),
  });
};

// https://remix.run/guides/routing#index-routes
const Index = () => {
  const { movies, shows, people, todayTrending } = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();
  const [trending] = React.useState(todayTrending.items);

  const onClickViewMore = (type: 'movies' | 'tv-shows' | 'people') => {
    navigate(`/${type}/popular`);
  };

  return (
    <motion.main
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MediaList listType="slider-banner" items={trending} />
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          marginTop: '48px',
          paddingLeft: '88px',
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {movies?.items.length > 0 && (
          <MediaList
            listType="slider-card"
            items={movies.items}
            listName="Popular Movies"
            showMoreList
            onClickViewMore={() => onClickViewMore('movies')}
          />
        )}
      </Container>
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          marginTop: '48px',
          paddingLeft: '88px',
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {shows?.items.length > 0 && (
          <MediaList
            listType="slider-card"
            items={shows.items}
            listName="Popular Tv shows"
            showMoreList
            onClickViewMore={() => onClickViewMore('tv-shows')}
          />
        )}
      </Container>
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          marginTop: '48px',
          paddingLeft: '88px',
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {people?.results.length > 0 && (
          <PeopleList
            listType="slider-card"
            items={people.results}
            listName="Popular People"
            showMoreList
            onClickViewMore={() => onClickViewMore('people')}
          />
        )}
      </Container>
    </motion.main>
  );
};

export default Index;
