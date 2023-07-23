import * as React from 'react';
import { Spinner } from '@nextui-org/spinner';
import { useMeasure } from '@react-hookz/web';
import { json, type LoaderArgs } from '@remix-run/node';
import { useFetcher, useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import NProgress from 'nprogress';
import { useTranslation } from 'react-i18next';
import { useGlobalLoadingState } from 'remix-utils';

import type { Handle } from '~/types/handle';
import type { IMedia } from '~/types/media';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getListDiscover, getListTvShows } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const meta = mergeMeta(() => [
  { title: 'Sora - Tv Shows' },
  { name: 'description', content: 'Discover tv shows in Sora' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/tv-shows/' },
  { property: 'og:title', content: 'Sora - Tv Shows' },
  { property: 'og:description', content: 'Discover tv shows in Sora' },
  { name: 'twitter:title', content: 'Sora - Tv Shows' },
  { name: 'twitter:description', content: 'Discover tv shows in Sora' },
]);

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
  const [popular, airingToday, onTheAir, topRated] = await Promise.all([
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
    getListTvShows('airing_today', locale, page),
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
    getListTvShows('top_rated', locale, page),
  ]);
  return json(
    {
      popular,
      airingToday,
      onTheAir,
      topRated,
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.tv,
      },
    },
  );
};

export const handle: Handle = {
  disableLayoutPadding: true,
  miniTitle: ({ t }) => ({
    title: t('tv-shows'),
    showImage: false,
  }),
};

const TvIndexPage = () => {
  const { popular, airingToday, onTheAir, topRated } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const location = useLocation();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const globalState = useGlobalLoadingState();
  const { t } = useTranslation();

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

    fetcher.load(`/discover/tv-shows?with_genres=${Object.keys(listGenresTv[order])[0]}`);
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
    if (globalState === 'loading') {
      NProgress.configure({ showSpinner: false }).start();
    }
    if (globalState === 'idle') {
      NProgress.configure({ showSpinner: false }).done();
    }
  }, [globalState]);

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
      <div className="mt-9 flex w-full flex-col items-center justify-start px-3 sm:px-5">
        {airingToday?.items && airingToday.items.length > 0 && (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={airingToday.items}
            itemsType="tv"
            listName={t('airing-today-tv-shows')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/tv-shows/airing-today')}
            showMoreList
          />
        )}
        {onTheAir?.items && onTheAir.items.length > 0 && (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={onTheAir.items}
            itemsType="tv"
            listName={t('on-the-air-tv-shows')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/tv-shows/on-the-air')}
            showMoreList
          />
        )}
        {topRated?.items && topRated.items.length > 0 && (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={topRated.items}
            itemsType="tv"
            listName={t('top-rated-tv-shows')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/tv-shows/top-rated')}
            showMoreList
          />
        )}
        {listItems &&
          listItems.length > 0 &&
          listItems.map((items, index) => {
            if (items && items.length > 0)
              return (
                <MediaList
                  genresMovie={rootData?.genresMovie}
                  genresTv={rootData?.genresTv}
                  items={items}
                  itemsType="tv"
                  listName={Object.values(listGenresTv[index])[0]}
                  listType="slider-card"
                  navigationButtons
                  onClickViewMore={() =>
                    navigate(
                      `/discover/tv-shows?with_genres=${Object.keys(listGenresTv[index])[0]}`,
                    )
                  }
                  showMoreList
                />
              );
            return null;
          })}
        <AnimatePresence>
          {globalState === 'loading' ? (
            <Spinner
              as={motion.div}
              size="lg"
              className="mt-10"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              // @ts-ignore
              transition={{ duration: 0.3 }}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TvIndexPage;
