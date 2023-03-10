/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate, useFetcher } from '@remix-run/react';
import { Container, Loading } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import NProgress from 'nprogress';
import dayjs from 'dayjs';

import i18next from '~/i18n/i18next.server';
import { getListTvShows, getListDiscover } from '~/services/tmdb/tmdb.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';

import { IMedia } from '~/types/media';

import MediaList from '~/components/media/MediaList';

import { useMeasure } from '@react-hookz/web';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const page = 1;
  const today = dayjs();
  // get next 7 days
  const next7Days = today.add(7, 'day');
  const formattedToday = today.format('YYYY-MM-DD');
  const formattedNext7Days = next7Days.format('YYYY-MM-DD');
  const [popular, topRated, onTheAir] = await Promise.all([
    getListDiscover(
      'tv',
      undefined,
      undefined,
      locale,
      page,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      50,
    ),
    getListTvShows('top_rated', locale, page),
    getListDiscover(
      'tv',
      undefined,
      undefined,
      locale,
      page,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      50,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      formattedToday,
      formattedNext7Days,
    ),
  ]);
  return json(
    {
      popular,
      topRated,
      onTheAir,
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.tv,
      },
    },
  );
};

const TvIndexPage = () => {
  const { popular, topRated, onTheAir } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
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
  const [size, parentRef] = useMeasure<HTMLDivElement>();

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
    if (!shouldFetch || !size?.height) return;
    if (clientHeight + scrollPosition - 200 < size?.height) return;

    fetcher.load(`/tv-shows/discover?with_genres=${Object.keys(listGenresTv[order])[0]}`);
    setShouldFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition, clientHeight, size?.height]);

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
      NProgress.configure({ showSpinner: false }).start();
    }
    if (fetcher.type === 'done') {
      NProgress.configure({ showSpinner: false }).done();
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
        display="flex"
        justify="flex-start"
        alignItems="center"
        direction="column"
        css={{
          padding: 0,
          marginTop: '48px',
          minHeight: '564px',
          '@xsMax': {
            paddingLeft: 'var(--nextui-space-sm)',
            paddingRight: 'var(--nextui-space-sm)',
          },
        }}
      >
        {topRated?.items && topRated.items.length > 0 && (
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
        )}
        {onTheAir?.items && onTheAir.items.length > 0 && (
          <MediaList
            listType="slider-card"
            items={onTheAir.items}
            listName="On the air Tv"
            showMoreList
            onClickViewMore={() => navigate('/tv-shows/on-tv')}
            navigationButtons
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
          />
        )}
        {listItems &&
          listItems.length > 0 &&
          listItems.map((items, index) => {
            if (items && items.length > 0)
              return (
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
    </motion.main>
  );
};

export default TvIndexPage;
