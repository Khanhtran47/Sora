/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { LoaderFunction, json, DataFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate, useFetcher } from '@remix-run/react';
import { Container, Spacer } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';
import NProgress from 'nprogress';

import i18next from '~/i18n/i18next.server';
import { getListMovies } from '~/services/tmdb/tmdb.server';
import { authenticate } from '~/services/supabase';
import { IMedia } from '~/types/media';

import useSize from '~/hooks/useSize';

import MediaList from '~/src/components/media/MediaList';
import SkeletonItem from '~/src/components/elements/skeleton/Item';

type LoaderData = {
  popular: Awaited<ReturnType<typeof getListMovies>>;
  topRated: Awaited<ReturnType<typeof getListMovies>>;
  upcoming: Awaited<ReturnType<typeof getListMovies>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const page = 1;
  const [popular, topRated, upcoming] = await Promise.all([
    getListMovies('popular', locale, page),
    getListMovies('top_rated', locale, page),
    getListMovies('upcoming', locale, page),
  ]);
  return json<LoaderData>({
    popular,
    topRated,
    upcoming,
  });
};

const MoviesIndexPage = () => {
  const { popular, topRated, upcoming } = useLoaderData();
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
  const fetcher = useFetcher();

  const listGenresMovie = Object.entries(rootData?.genresMovie || {}).map((entry) => ({
    [entry[0]]: entry[1],
  }));

  const [listItems, setListItems] = React.useState<IMedia[][] | undefined>([]);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [clientHeight, setClientHeight] = React.useState(0);
  const [shouldFetch, setShouldFetch] = React.useState(true);
  const [order, setOrder] = React.useState(0);

  const parentRef = React.useRef<HTMLElement>(null);
  const { height } = useSize(parentRef);

  React.useEffect(() => {
    const scrollListener = () => {
      setClientHeight(window.innerHeight);
      setScrollPosition(window.scrollY);
    };

    // Avoid running during SSR
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', scrollListener);
    }

    // Clean up
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', scrollListener);
      }
    };
  }, []);

  // Listen on scrolls. Fire on some self-described breakpoint
  React.useEffect(() => {
    if (!shouldFetch || !height) return;
    if (clientHeight + scrollPosition - 200 < height) return;

    fetcher.load(`/movies/discover?with_genres=${Object.keys(listGenresMovie[order])[0]}`);
    setShouldFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition, clientHeight, height]);

  React.useEffect(() => {
    if (fetcher.data && fetcher.data.length === 0) {
      setShouldFetch(false);
      return;
    }

    if (fetcher.data) {
      if (fetcher.data.movies) {
        setListItems((prevItems) =>
          prevItems ? [...prevItems, fetcher.data.movies.items] : [fetcher.data.movies.items],
        );
        if (order < listGenresMovie.length - 1) {
          setOrder(order + 1);
          setShouldFetch(true);
        } else {
          setShouldFetch(false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  React.useEffect(() => {
    if (fetcher.type === 'normalLoad') {
      NProgress.start();
    }
    if (fetcher.type === 'done') {
      NProgress.done();
    }
  }, [fetcher.type]);

  return (
    <motion.main
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      ref={parentRef}
    >
      <MediaList
        listType="slider-banner"
        items={popular.items}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
      />
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          padding: 0,
          marginTop: '48px',
          minHeight: '564px',
          '@xsMax': {
            paddingLeft: '$sm',
            paddingRight: '$sm',
          },
        }}
      >
        {topRated && topRated.items.length > 0 && (
          <>
            <MediaList
              listType="slider-card"
              items={topRated.items}
              listName="Top Rated Movies"
              showMoreList
              onClickViewMore={() => navigate('/movies/top-rated')}
              navigationButtons
              genresMovie={rootData?.genresMovie}
              genresTv={rootData?.genresTv}
            />
            <Spacer y={1.5} />
          </>
        )}
        {upcoming && upcoming.items.length > 0 && (
          <>
            <MediaList
              listType="slider-card"
              items={upcoming.items}
              listName="Upcoming Movies"
              showMoreList
              onClickViewMore={() => navigate('/movies/upcoming')}
              navigationButtons
              genresMovie={rootData?.genresMovie}
              genresTv={rootData?.genresTv}
            />
            <Spacer y={1.5} />
          </>
        )}
        {listItems &&
          listItems.length > 0 &&
          listItems.map((items, index) => {
            if (items && items.length > 0)
              return (
                <>
                  <MediaList
                    key={index}
                    listType="slider-card"
                    items={items}
                    listName={Object.values(listGenresMovie[index])[0]}
                    showMoreList
                    onClickViewMore={() =>
                      navigate(
                        `/movies/discover?with_genres=${Object.keys(listGenresMovie[index])[0]}`,
                      )
                    }
                    navigationButtons
                    genresMovie={rootData?.genresMovie}
                    genresTv={rootData?.genresTv}
                  />
                  <Spacer y={1.5} />
                </>
              );
            return null;
          })}
        {fetcher.type === 'normalLoad' && (
          <div className="animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5" />
            <div className="mb-10 w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
            <div className="flex justify-start flex-row">
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </Container>
    </motion.main>
  );
};

export default MoviesIndexPage;
