/* eslint-disable @typescript-eslint/indent */
import { useState, useEffect } from 'react';
import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate, useFetcher } from '@remix-run/react';
import { Container, Loading } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import NProgress from 'nprogress';
import { useMeasure } from '@react-hookz/web';

import i18next from '~/i18n/i18next.server';
import { getListMovies } from '~/services/tmdb/tmdb.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';

import { IMedia } from '~/types/media';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import MediaList from '~/components/media/MediaList';

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const page = 1;
  const [popular, topRated, upcoming] = await Promise.all([
    getListMovies('popular', locale, page),
    getListMovies('top_rated', locale, page),
    getListMovies('upcoming', locale, page),
  ]);
  return json(
    {
      popular,
      topRated,
      upcoming,
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.movie,
      },
    },
  );
};

const MoviesIndexPage = () => {
  const { popular, topRated, upcoming } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const listGenresMovie = Object.entries(rootData?.genresMovie || {}).map((entry) => ({
    [entry[0]]: entry[1],
  }));

  const [listItems, setListItems] = useState<IMedia[][] | undefined>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [order, setOrder] = useState(0);
  const [size, parentRef] = useMeasure<HTMLDivElement>();

  useEffect(() => {
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
  useEffect(() => {
    if (!shouldFetch || !size?.height) return;
    if (clientHeight + scrollPosition - 200 < size?.height) return;

    fetcher.load(`/discover/movies?with_genres=${Object.keys(listGenresMovie[order])[0]}`);
    setShouldFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition, clientHeight, size?.height]);

  useEffect(() => {
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

  useEffect(() => {
    if (fetcher.type === 'normalLoad') {
      NProgress.configure({ showSpinner: false }).start();
    }
    if (fetcher.type === 'done') {
      NProgress.configure({ showSpinner: false }).done();
    }
  }, [fetcher.type]);

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      ref={parentRef}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <MediaList
        listType="slider-banner"
        items={popular.items}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
      />
      <Container
        fluid
        responsive={false}
        display="flex"
        justify="flex-start"
        direction="column"
        alignItems="center"
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
        {topRated?.items && topRated?.items?.length > 0 ? (
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
        ) : null}
        {upcoming?.items && upcoming.items?.length > 0 ? (
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
        ) : null}
        {listItems &&
          listItems.length > 0 &&
          listItems.map((items, index) => {
            if (items && items.length > 0)
              return (
                <MediaList
                  key={index}
                  listType="slider-card"
                  items={items}
                  listName={Object.values(listGenresMovie[index])[0]}
                  showMoreList
                  onClickViewMore={() =>
                    navigate(
                      `/discover/movies?with_genres=${Object.keys(listGenresMovie[index])[0]}`,
                    )
                  }
                  navigationButtons
                  genresMovie={rootData?.genresMovie}
                  genresTv={rootData?.genresTv}
                />
              );
            return null;
          })}
        <AnimatePresence>
          {fetcher.type === 'normalLoad' ? (
            <Loading
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              as={motion.div}
              type="gradient"
              size="lg"
              css={{ my: '$17' }}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          ) : null}
        </AnimatePresence>
      </Container>
    </motion.div>
  );
};

export default MoviesIndexPage;
