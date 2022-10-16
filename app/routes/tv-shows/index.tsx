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
import { getListTvShows } from '~/services/tmdb/tmdb.server';
import { IMedia } from '~/services/tmdb/tmdb.types';
import MediaList from '~/src/components/media/MediaList';
import SkeletonItem from '~/src/components/elements/skeleton/Item';
import useSize from '~/hooks/useSize';

type LoaderData = {
  popular: Awaited<ReturnType<typeof getListTvShows>>;
  topRated: Awaited<ReturnType<typeof getListTvShows>>;
  onTheAir: Awaited<ReturnType<typeof getListTvShows>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const page = 1;
  const [popular, topRated, onTheAir] = await Promise.all([
    getListTvShows('popular', locale, page),
    getListTvShows('top_rated', locale, page),
    getListTvShows('on_the_air', locale, page),
  ]);
  return json<LoaderData>({
    popular,
    topRated,
    onTheAir,
  });
};

const TvIndexPage = () => {
  const { popular, topRated, onTheAir } = useLoaderData();
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

  const listGenresTv = Object.entries(rootData?.genresTv || {}).map((entry) => ({
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

    fetcher.load(`/tv-shows/discover?with_genres=${Object.keys(listGenresTv[order])[0]}`);
    setShouldFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition, clientHeight, height]);

  React.useEffect(() => {
    if (fetcher.data && fetcher.data.length === 0) {
      setShouldFetch(false);
      return;
    }

    if (fetcher.data) {
      if (fetcher.data.shows) {
        setListItems((prevItems) =>
          prevItems ? [...prevItems, fetcher.data.shows.items] : [fetcher.data.shows.items],
        );
        if (order < listGenresTv.length - 1) {
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
          marginTop: '48px',
          paddingLeft: '88px',
          minHeight: '564px',
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {topRated && topRated.items.length > 0 && (
          <>
            <MediaList
              listType="slider-card"
              items={topRated.items}
              listName="Top Rated Tv"
              showMoreList
              onClickViewMore={() => navigate('/tv-shows/top-rated')}
              navigationButtons
              genresMovie={rootData?.genresMovie}
              genresTv={rootData?.genresTv}
            />
            <Spacer y={1.5} />
          </>
        )}
        {onTheAir && onTheAir.items.length > 0 && (
          <>
            <MediaList
              listType="slider-card"
              items={onTheAir.items}
              listName="On the air Tv"
              showMoreList
              onClickViewMore={() => navigate('/tv-shows/upcoming')}
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
                    listType="slider-card"
                    items={items}
                    listName={Object.values(listGenresTv[index])[0]}
                    showMoreList
                    onClickViewMore={() =>
                      navigate(
                        `/tv-shows/discover?with_genres=${Object.keys(listGenresTv[index])[0]}`,
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

export default TvIndexPage;
