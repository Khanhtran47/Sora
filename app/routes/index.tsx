/* eslint-disable @typescript-eslint/indent */
import { MetaFunction, LoaderFunction, json, DataFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { Container } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import i18next from '~/i18n/i18next.server';
import {
  getTrending,
  getListMovies,
  getListTvShows,
  getListPeople,
} from '~/services/tmdb/tmdb.server';
import { IMedia, IPeople } from '~/services/tmdb/tmdb.types';
import MediaList from '~/src/components/media/MediaList';
import PeopleList from '~/src/components/people/PeopleList';

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => ({
  title: 'Remix App',
  description: '（づ￣3￣）づ╭❤️～',
});

export const handle = {
  i18n: 'home',
};

type LoaderData = {
  todayTrending: IMedia[] | undefined;
  movies: IMedia[] | undefined;
  shows: IMedia[] | undefined;
  people: IPeople[] | undefined;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const locale = await i18next.getLocale(request);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (page && (page < 1 || page > 1000)) page = 1;

  const [todayTrending, movies, shows, people] = await Promise.all([
    getTrending('all', 'day', locale, page),
    getListMovies('popular', locale, page),
    getListTvShows('popular', locale, page),
    getListPeople('popular', locale, page),
  ]);

  return json<LoaderData>({
    todayTrending: todayTrending && todayTrending.items && todayTrending.items.slice(0, 10),
    movies: movies && movies.items && movies.items.slice(0, 16),
    shows: shows && shows.items && shows.items.slice(0, 16),
    people: people && people.results && people.results.slice(0, 16),
  });
};

// https://remix.run/guides/routing#index-routes
const Index = () => {
  const { movies, shows, people, todayTrending } = useLoaderData();
  const rootData:
    | {
        user?: User;
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('home');

  const onClickViewMore = (type: 'movies' | 'tv-shows' | 'people') => {
    if (type === 'people') navigate(`/${type}`);
    else navigate(`/${type}/popular`);
  };

  return (
    <motion.main
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MediaList
        listType="slider-banner"
        items={todayTrending}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
      />
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
        {movies.length > 0 && (
          <MediaList
            listType="slider-card"
            items={movies}
            listName={t('popularMovies')}
            showMoreList
            onClickViewMore={() => onClickViewMore('movies')}
            navigationButtons
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
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
        {shows.length > 0 && (
          <MediaList
            listType="slider-card"
            items={shows}
            listName={t('popularTv')}
            showMoreList
            onClickViewMore={() => onClickViewMore('tv-shows')}
            navigationButtons
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
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
        {people.length > 0 && (
          <PeopleList
            listType="slider-card"
            items={people}
            listName={t('popularPeople')}
            showMoreList
            onClickViewMore={() => onClickViewMore('people')}
            navigationButtons
          />
        )}
      </Container>
    </motion.main>
  );
};

export default Index;
