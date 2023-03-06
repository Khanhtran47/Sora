import { useState, useEffect } from 'react';
import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useFetcher, useNavigate, useLoaderData, useLocation } from '@remix-run/react';
import { Container, Loading } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next';
import NProgress from 'nprogress';
import { useMeasure } from '@react-hookz/web';

import {
  getAnimeTrending,
  getAnimePopular,
  getAnimeRecentEpisodes,
} from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';

import { IMedia } from '~/types/media';

import { animeGenres } from '~/constants/filterItems';

import MediaList from '~/components/media/MediaList';

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) page = 1;

  const [trendingAnime, popularAnime, recentEpisodes] = await Promise.all([
    getAnimeTrending(page, 10),
    getAnimePopular(page, 20),
    getAnimeRecentEpisodes('gogoanime', page, 20),
  ]);

  return json(
    {
      trending: trendingAnime,
      popular: popularAnime,
      recentEpisodes,
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.anime },
    },
  );
};

const AnimePage = () => {
  const { trending, popular, recentEpisodes } = useLoaderData<typeof loader>() || {};
  const location = useLocation();
  const navigate = useNavigate();
  const fetcher = useFetcher();

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

    fetcher.load(`/anime/discover?genres=${animeGenres[order]}`);
    setShouldFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition, clientHeight, size?.height]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.length === 0) {
      setShouldFetch(false);
      return;
    }

    if (fetcher.data) {
      if (fetcher.data.items) {
        setListItems((prevItems) =>
          prevItems ? [...prevItems, fetcher.data.items.results] : [fetcher.data.items.results],
        );
        if (order < animeGenres.length - 1) {
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
      {trending && trending.results && trending.results.length > 0 && (
        <MediaList listType="slider-banner" items={trending?.results as IMedia[]} />
      )}
      <Container
        fluid
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
        {popular && popular.results && popular.results.length > 0 && (
          <MediaList
            items={popular.results as IMedia[]}
            itemsType="anime"
            listName="Popular Anime"
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/anime/popular')}
            showMoreList
          />
        )}
        {recentEpisodes && recentEpisodes.results && recentEpisodes.results.length > 0 && (
          <MediaList
            items={recentEpisodes.results as IMedia[]}
            itemsType="episode"
            listName="Recent Episodes"
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/anime/recent-episodes')}
            provider="gogoanime"
            showMoreList
          />
        )}
        {listItems &&
          listItems.length > 0 &&
          listItems.map((items, index) => {
            if (items && items.length > 0)
              return (
                <MediaList
                  items={items}
                  itemsType="anime"
                  key={index}
                  listName={animeGenres[index]}
                  listType="slider-card"
                  navigationButtons
                  onClickViewMore={() => navigate(`/anime/discover?genres=${animeGenres[index]}`)}
                  showMoreList
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

export default AnimePage;
