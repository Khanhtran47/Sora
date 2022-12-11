import { useState, useEffect, useRef } from 'react';
import { LoaderFunction, json, DataFunctionArgs } from '@remix-run/node';
import { useFetcher, useNavigate, useLoaderData, useLocation, Link } from '@remix-run/react';
import { Container, Spacer } from '@nextui-org/react';
import { motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next';
import NProgress from 'nprogress';

import {
  getAnimeTrending,
  getAnimePopular,
  getAnimeRecentEpisodes,
} from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { IMedia } from '~/types/media';

import useSize from '~/hooks/useSize';

import { animeGenres } from '~/src/constants/filterItems';

import MediaList from '~/src/components/media/MediaList';
import SkeletonItem from '~/src/components/elements/skeleton/Item';

export const handle = {
  i18n: 'anime',
  breadcrumb: () => (
    <Link to="/anime" aria-label="Anime">
      Anime
    </Link>
  ),
};

type LoaderData = {
  trending: Awaited<ReturnType<typeof getAnimeTrending>>;
  popular: Awaited<ReturnType<typeof getAnimePopular>>;
  recentEpisodes: Awaited<ReturnType<typeof getAnimeRecentEpisodes>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  await authenticate(request);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) page = 1;

  const [trendingAnime, popularAnime, recentEpisodes] = await Promise.all([
    getAnimeTrending(page, 10),
    getAnimePopular(page, 20),
    getAnimeRecentEpisodes('gogoanime', page, 20),
  ]);

  return json<LoaderData>({
    trending: trendingAnime,
    popular: popularAnime,
    recentEpisodes,
  });
};

const AnimePage = () => {
  const { trending, popular, recentEpisodes } = useLoaderData<LoaderData>() || {};
  const location = useLocation();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [listItems, setListItems] = useState<IMedia[][] | undefined>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [order, setOrder] = useState(0);

  const parentRef = useRef<HTMLElement>(null);
  const { height } = useSize(parentRef);

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
    if (!shouldFetch || !height) return;
    if (clientHeight + scrollPosition - 200 < height) return;

    fetcher.load(`/anime/discover?genres=${animeGenres[order]}`);
    setShouldFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition, clientHeight, height]);

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
      {trending && trending.results && trending.results.length > 0 && (
        <MediaList listType="slider-banner" items={trending?.results as IMedia[]} />
      )}
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
                <>
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

export default AnimePage;
