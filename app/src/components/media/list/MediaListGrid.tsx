/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import { useEffect, useState, useRef } from 'react';
import { Grid, Button } from '@nextui-org/react';
import { useFetcher, Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import NProgress from 'nprogress';

import useMediaQuery from '~/hooks/useMediaQuery';
import useSize from '~/hooks/useSize';
import { IMedia } from '~/types/media';
import MediaItem from '../item';

interface IMediaListCardProps {
  coverItem?: { id: number; name: string; backdropPath: string }[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  hasNextPage?: boolean;
  isCoverCard?: boolean;
  items?: IMedia[];
  itemsType?: 'movie' | 'tv' | 'anime' | 'people' | 'episode';
  loadingType?: 'page' | 'scroll';
  provider?: string;
  routeName?: string;
  virtual?: boolean;
}

const MediaListGrid = (props: IMediaListCardProps) => {
  const {
    coverItem,
    genresMovie,
    genresTv,
    hasNextPage,
    isCoverCard,
    items,
    itemsType,
    loadingType,
    provider,
    routeName,
    virtual,
  } = props;
  const isXs = useMediaQuery('(max-width: 370px)');
  const isMd = useMediaQuery('(max-width: 1340px)');
  const isLg = useMediaQuery('(max-width: 1660px)');
  const fetcher = useFetcher();
  const [listItems, setListItems] = useState<IMedia[]>(items || []);
  const parentRef = useRef<HTMLDivElement>(null);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const [shouldFetch, setShouldFetch] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [page, setPage] = useState(2);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { height } = useSize(parentRef);

  useEffect(() => {
    setListItems(items || []);
    setPage(2);
    setShouldFetch(false);
    setShowLoadMore(true);
  }, [items]);

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
    if (clientHeight + scrollPosition + 100 < height) return;

    fetcher.load(
      `${routeName}${routeName?.includes('?') ? '&' : '?'}page=${page}${
        provider ? `&provider=${provider}` : ''
      }`,
    );
    setShouldFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition, clientHeight, height]);

  // Merge items, increment page, and allow fetching again
  useEffect(() => {
    // Discontinue API calls if the last page has been reached
    if (fetcher.data && fetcher.data.length === 0) {
      setShouldFetch(false);
      return;
    }

    // Items contain data, merge them and allow the possibility of another fetch
    if (fetcher.data) {
      if (fetcher.data.items) {
        setListItems((prevItems) => [...prevItems, ...fetcher.data.items.results]);
        if (fetcher.data.items.hasNextPage === true) {
          setPage(page + 1);
          setShouldFetch(true);
        } else {
          setShouldFetch(false);
        }
      } else if (fetcher.data.searchResults) {
        setListItems((prevItems) => [...prevItems, ...fetcher.data.searchResults.results]);
        if (fetcher.data.searchResults.hasNextPage === true) {
          setPage(page + 1);
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

  if (isCoverCard) {
    return (
      <Grid.Container gap={1} justify="flex-start" alignItems="stretch" xl wrap="wrap">
        {coverItem &&
          coverItem?.length > 0 &&
          coverItem.map((item, index) => {
            const href = `/collections/${item.id}`;
            return (
              <Grid xs={12} md={6} xl={4} key={item.id} justify="center">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.05 * index }}
                >
                  <Link to={href}>
                    <MediaItem
                      backdropPath={item?.backdropPath}
                      isCoverCard={isCoverCard}
                      key={item.id}
                      title={item?.name}
                      type="card"
                    />
                  </Link>
                </motion.div>
              </Grid>
            );
          })}
      </Grid.Container>
    );
  }
  return (
    <Grid.Container
      ref={parentRef}
      gap={1}
      justify="flex-start"
      alignItems="stretch"
      wrap="wrap"
      css={{ maxWidth: '1920px' }}
    >
      {listItems &&
        listItems?.length > 0 &&
        listItems.map((item, index) => {
          const href =
            itemsType && itemsType === 'episode'
              ? `/anime/${item.id}/episode/${item.episodeNumber}?provider=${provider}`
              : itemsType === 'anime'
              ? `/anime/${item.id}/overview`
              : itemsType === 'people'
              ? `/people/${item.id}/overview`
              : item?.mediaType === 'movie' || itemsType === 'movie'
              ? `/movies/${item.id}/`
              : `/tv-shows/${item.id}/`;
          return (
            <Grid
              xs={isXs ? 12 : 6}
              sm={4}
              md={isMd ? 4 : 3}
              lg={isLg ? 3 : 2.4}
              xl={2}
              key={item.id}
              justify="center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  itemsType === 'episode' || itemsType === 'anime'
                    ? { x: { type: 'spring', stiffness: 100 }, duration: 0.1 }
                    : { duration: 0.05 * index }
                }
              >
                <Link to={href}>
                  <MediaItem
                    backdropPath={item?.backdropPath}
                    character={item?.character}
                    color={item?.color}
                    episodeNumber={item?.episodeNumber}
                    episodeTitle={item?.episodeTitle}
                    genreIds={item?.genreIds}
                    genresAnime={item?.genresAnime}
                    genresMovie={genresMovie}
                    genresTv={genresTv}
                    id={item?.id}
                    job={item?.job}
                    key={item.id}
                    knownFor={item?.knownFor}
                    mediaType={item?.mediaType}
                    overview={item?.overview}
                    posterPath={item?.posterPath}
                    releaseDate={item?.releaseDate}
                    title={item?.title}
                    trailer={item?.trailer}
                    type={itemsType === 'episode' ? itemsType : 'card'}
                    virtual={virtual}
                    voteAverage={item?.voteAverage}
                  />
                </Link>
              </motion.div>
            </Grid>
          );
        })}
      {!shouldFetch && hasNextPage && showLoadMore && loadingType === 'scroll' ? (
        <Grid xs={12} justify="center">
          <div ref={bottomRef} />
          <Button
            // shadow
            color="primary"
            onClick={() => {
              setShowLoadMore(false);
              setShouldFetch(true);
              bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            css={{ marginTop: '$xl' }}
          >
            Load More
          </Button>
        </Grid>
      ) : null}
    </Grid.Container>
  );
};

export default MediaListGrid;
