/* eslint-disable @typescript-eslint/indent */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Pagination } from '@nextui-org/react';
import { useIntersectionObserver, useMediaQuery } from '@react-hookz/web';
import { Link, useFetcher, useLocation, useSearchParams } from '@remix-run/react';
import { motion } from 'framer-motion';
import NProgress from 'nprogress';
import { tv } from 'tailwind-variants';

import type { IMedia } from '~/types/media';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import Arrow from '~/assets/icons/ArrowIcon';

import MediaItem from '../item';

interface IMediaListCardProps {
  coverItem?: { id: number; name: string; backdropPath: string }[];
  currentPage?: number;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  hasNextPage?: boolean;
  isCoverCard?: boolean;
  items?: IMedia[];
  itemsType?: 'movie' | 'tv' | 'anime' | 'people' | 'episode' | 'movie-tv';
  listType?: 'table' | 'slider-card' | 'slider-banner' | 'grid';
  provider?: string;
  totalPages?: number;
  scrollToTopListAfterChangePage?: boolean;
}

const MotionLink = motion(Link);

const mediaListGridStyles = tv({
  base: 'grid w-full max-w-screen-4xl items-stretch justify-items-center gap-5',
  variants: {
    listViewType: {
      table: 'grid-cols-1',
      card: 'grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6',
      detail: 'grid-cols-1 xl:grid-cols-2 4xl:grid-cols-3',
      coverCard: 'grid-cols-1 xl:grid-cols-2 4xl:grid-cols-3',
    },
  },
  defaultVariants: {
    listViewType: 'card',
  },
});

const MediaListGrid = (props: IMediaListCardProps) => {
  const {
    coverItem,
    currentPage,
    genresMovie,
    genresTv,
    hasNextPage,
    isCoverCard,
    items,
    itemsType,
    listType,
    provider,
    totalPages,
    scrollToTopListAfterChangePage = false,
  } = props;
  const fetcher = useFetcher();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams({});
  const { viewportRef } = useLayoutScrollPosition((state) => state);
  const [listItems, setListItems] = useState<IMedia[]>(items || []);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [page, setPage] = useState(2);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { listLoadingType, listViewType } = useSoraSettings();
  const is2Xs = useMediaQuery('(max-width: 320px)', { initializeWithValue: false });
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const currentSearchParams = useMemo<{ [key: string]: string }>(() => {
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);
  const bottomIntersection = useIntersectionObserver(bottomRef, {
    root: viewportRef,
    rootMargin: '0px 0px 300px 0px',
    threshold: [0],
  });

  useEffect(() => {
    setListItems(items || []);
    setPage(2);
    setShouldFetch(false);
    setShowLoadMore(true);
  }, [items]);

  useEffect(() => {
    if (!bottomIntersection || !shouldFetch) return;
    if (bottomIntersection.isIntersecting) {
      fetcher.load(
        `${location.pathname}${location.search || ''}${
          location.search?.includes('?') ? '&' : '?'
        }page=${page}${provider ? `&provider=${provider}` : ''}`,
      );
      setShouldFetch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottomIntersection]);

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
      } else if (Object.keys(fetcher.data).length) {
        const newItems = Object.values(fetcher.data)[0] as {
          items: IMedia[];
          totalPages: number;
          page: number;
        };
        if (newItems.items) {
          setListItems((prevItems) => [...prevItems, ...newItems.items]);
          if (newItems.page < newItems.totalPages) {
            setPage(page + 1);
            setShouldFetch(true);
          } else {
            setShouldFetch(false);
          }
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

  const handlePageChange = ({
    direction,
    page,
  }: {
    direction?: 'next' | 'prev';
    page?: number;
  }) => {
    if (direction) {
      if (direction === 'prev' && currentPage && currentPage > 1) {
        setSearchParams({ ...currentSearchParams, page: (currentPage - 1).toString() });
      } else if (direction === 'next' && currentPage && hasNextPage) {
        setSearchParams({ ...currentSearchParams, page: (currentPage + 1).toString() });
      }
    }
    if (page) {
      setSearchParams({
        ...currentSearchParams,
        page: page.toString(),
      });
    }
    if (scrollToTopListAfterChangePage) {
      topRef.current?.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
    }
  };

  if (isCoverCard) {
    return (
      <div className={mediaListGridStyles({ listViewType: 'coverCard' })}>
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
      <div ref={topRef} />
      <div
        className={mediaListGridStyles({
          listViewType:
            itemsType === 'episode' || itemsType === 'people' ? 'card' : listViewType.value,
        })}
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
                : itemsType === 'movie'
                ? `/movies/${item.id}/`
                : itemsType === 'tv'
                ? `/tv-shows/${item.id}/`
                : itemsType === 'movie-tv' && item?.mediaType === 'movie'
                ? `/movies/${item.id}/`
                : itemsType === 'movie-tv' && item?.mediaType === 'tv'
                ? `/tv-shows/${item.id}/`
                : '/';

            return (
              <motion.div
                key={`${item.id}-${index}-card-grid`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  listLoadingType.value === 'infinite-scroll'
                    ? { x: { type: 'spring', stiffness: 100 }, duration: 0.1 }
                    : { duration: 0.05 * index }
                }
                className={
                  listViewType.value === 'table' &&
                  itemsType !== 'episode' &&
                  itemsType !== 'people'
                    ? 'w-full'
                    : listViewType.value === 'detail' &&
                      itemsType !== 'episode' &&
                      itemsType !== 'people'
                    ? 'w-full sm:w-fit'
                    : ''
                }
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
                  linkTo={href}
                  mediaType={item?.mediaType}
                  overview={item?.overview}
                  posterPath={item?.posterPath}
                  releaseDate={item?.releaseDate}
                  title={item?.title}
                  trailer={item?.trailer}
                  type={itemsType === 'episode' ? itemsType : 'card'}
                  voteAverage={item?.voteAverage}
                />
              </motion.div>
            );
          })}
      </div>
      {!shouldFetch &&
      (hasNextPage || (currentPage && totalPages && currentPage < totalPages)) &&
      showLoadMore &&
      listLoadingType.value === 'infinite-scroll' ? (
        <Button
          type="button"
          // shadow
          color="primary"
          onPress={() => {
            fetcher.load(
              `${location.pathname}${location.search || ''}${
                location.search?.includes('?') ? '&' : '?'
              }page=${page}${provider ? `&provider=${provider}` : ''}`,
            );
            setShowLoadMore(false);
          }}
          css={{ marginTop: '$32' }}
        >
          Load More
        </Button>
      ) : null}
      {listType === 'grid' && listLoadingType.value === 'pagination' ? (
        itemsType === 'anime' || itemsType === 'episode' ? (
          <div className="mt-[50px] flex flex-row gap-x-3">
            <Button
              auto
              icon={<Arrow direction="left" />}
              onPress={() => handlePageChange({ direction: 'prev' })}
              disabled={currentPage === 1}
            />
            <Button
              auto
              icon={<Arrow direction="right" />}
              onPress={() => handlePageChange({ direction: 'next' })}
              disabled={!hasNextPage}
            />
          </div>
        ) : totalPages && totalPages > 1 ? (
          <Pagination
            total={totalPages}
            initialPage={currentPage}
            // shadow
            onChange={(page) => handlePageChange({ page })}
            css={{ marginTop: '50px' }}
            {...(isSm && !is2Xs ? { size: 'sm' } : isSm && is2Xs ? { size: 'xs' } : {})}
          />
        ) : null
      ) : null}
      <div ref={bottomRef} />
    </>
  );
};

export default MediaListGrid;
