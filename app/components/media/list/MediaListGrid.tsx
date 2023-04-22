/* eslint-disable @typescript-eslint/indent */
import { useEffect, useRef, useState } from 'react';
import { Button } from '@nextui-org/react';
import { useMeasure } from '@react-hookz/web';
import { Link, useFetcher } from '@remix-run/react';
import { motion } from 'framer-motion';
import NProgress from 'nprogress';

import type { IMedia } from '~/types/media';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';

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

const MotionLink = motion(Link);

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
  const fetcher = useFetcher();
  const { scrollHeight, scrollPosition } = useLayoutScrollPosition((state) => state);
  const [listItems, setListItems] = useState<IMedia[]>(items || []);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [page, setPage] = useState(2);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [size, parentRef] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    setListItems(items || []);
    setPage(2);
    setShouldFetch(false);
    setShowLoadMore(true);
  }, [items]);

  // Listen on scrolls. Fire on some self-described breakpoint
  useEffect(() => {
    if (!shouldFetch || !size?.height) return;
    if (scrollHeight + scrollPosition.y + 100 < size?.height) return;

    fetcher.load(
      `${routeName}${routeName?.includes('?') ? '&' : '?'}page=${page}${
        provider ? `&provider=${provider}` : ''
      }`,
    );
    setShouldFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition, scrollHeight, size?.height]);

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
      <div className="grid w-full grid-cols-1 items-stretch justify-items-center gap-5 xl:grid-cols-2 4xl:grid-cols-3">
        {coverItem &&
          coverItem?.length > 0 &&
          coverItem.map((item, index) => {
            const href = `/collections/${item.id}`;
            return (
              <MotionLink
                to={href}
                key={`${item.id}-${index}-covercard-grid`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.05 * index }}
              >
                <MediaItem
                  backdropPath={item?.backdropPath}
                  isCoverCard={isCoverCard}
                  title={item?.name}
                  type="card"
                />
              </MotionLink>
            );
          })}
      </div>
    );
  }
  return (
    <>
      <div
        className="grid w-full max-w-screen-4xl grid-cols-1 items-stretch justify-items-center gap-5 2xs:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6"
        ref={parentRef}
      >
        {listItems &&
          listItems?.length > 0 &&
          listItems.map((item, index) => {
            const href =
              itemsType && itemsType === 'episode'
                ? `/anime/${item.id}/episode/${item.episodeNumber}/watch?provider=${provider}`
                : itemsType === 'anime'
                ? `/anime/${item.id}/`
                : itemsType === 'people'
                ? `/people/${item.id}/`
                : item?.mediaType === 'movie' || itemsType === 'movie'
                ? `/movies/${item.id}/`
                : `/tv-shows/${item.id}/`;
            return (
              <MotionLink
                key={`${item.id}-${index}-card-grid`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  itemsType === 'episode' || itemsType === 'anime'
                    ? { x: { type: 'spring', stiffness: 100 }, duration: 0.1 }
                    : { duration: 0.05 * index }
                }
                to={href}
              >
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
              </MotionLink>
            );
          })}
      </div>
      {!shouldFetch && hasNextPage && showLoadMore && loadingType === 'scroll' ? (
        <Button
          type="button"
          // shadow
          color="primary"
          ref={bottomRef}
          onPress={() => {
            setShowLoadMore(false);
            setShouldFetch(true);
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          css={{ marginTop: '$32' }}
        >
          Load More
        </Button>
      ) : null}
    </>
  );
};

export default MediaListGrid;
