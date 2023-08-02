import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Pagination } from '@nextui-org/pagination';
import { Spacer } from '@nextui-org/spacer';
import { useIntersectionObserver, useMediaQuery } from '@react-hookz/web';
import { useFetcher, useLocation, useSearchParams } from '@remix-run/react';
import { motion } from 'framer-motion';
import NProgress from 'nprogress';
import { useTranslation } from 'react-i18next';
import { useGlobalLoadingState } from 'remix-utils';
import { tv } from 'tailwind-variants';

import type { IMedia } from '~/types/media';
import { useLayout } from '~/store/layout/useLayout';
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
  isCreditsCard?: boolean;
  items?: IMedia[];
  itemsType?: 'movie' | 'tv' | 'anime' | 'people' | 'episode' | 'movie-tv';
  listType?: 'table' | 'slider-card' | 'slider-banner' | 'grid';
  provider?: string;
  scrollToTopListAfterChangePage?: boolean;
  totalPages?: number;
}

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
    isCreditsCard,
    items,
    itemsType,
    listType,
    provider,
    scrollToTopListAfterChangePage = false,
    totalPages,
  } = props;
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const location = useLocation();
  const globalState = useGlobalLoadingState();
  const [searchParams, setSearchParams] = useSearchParams({});
  const { viewportRef } = useLayout((state) => state);
  const [listItems, setListItems] = useState<IMedia[]>(items || []);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [page, setPage] = useState(2);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { listLoadingType, listViewType, isShowTopPagination } = useSoraSettings();
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
    if (globalState === 'loading') {
      NProgress.configure({ showSpinner: false }).start();
    }
    if (globalState === 'idle') {
      NProgress.configure({ showSpinner: false }).done();
    }
  }, [globalState]);

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

  const pagination =
    listType === 'grid' && listLoadingType.value === 'pagination' ? (
      itemsType === 'anime' || itemsType === 'episode' ? (
        <>
          <div className="flex flex-row gap-x-3">
            <Button
              color="primary"
              isIconOnly
              onPress={() => handlePageChange({ direction: 'prev' })}
              isDisabled={currentPage === 1}
            >
              <Arrow direction="left" />
            </Button>
            <Button
              color="primary"
              isIconOnly
              onPress={() => handlePageChange({ direction: 'next' })}
              isDisabled={!hasNextPage}
            >
              <Arrow direction="right" />
            </Button>
          </div>
          <Spacer y={2.5} />
        </>
      ) : totalPages && totalPages > 1 ? (
        <>
          <Pagination
            // showControls={!isSm}
            total={totalPages}
            initialPage={currentPage}
            // shadow
            onChange={(page) => handlePageChange({ page })}
            {...(isSm && !is2Xs ? { size: 'md' } : isSm && is2Xs ? { size: 'sm' } : {})}
          />
          <Spacer y={2.5} />
        </>
      ) : null
    ) : null;

  if (isCoverCard) {
    return (
      <div className={mediaListGridStyles({ listViewType: 'coverCard' })}>
        {coverItem &&
          coverItem?.length > 0 &&
          coverItem.map((item, index) => {
            const href = `/lists/${item.id}`;
            return (
              <motion.div
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
                  linkTo={href}
                />
              </motion.div>
            );
          })}
      </div>
    );
  }
  return (
    <>
      <div ref={topRef} />
      {isShowTopPagination.value ? pagination : null}
      {listItems && listItems?.length > 0 ? (
        <div
          className={mediaListGridStyles({
            listViewType:
              itemsType === 'episode' || itemsType === 'people'
                ? 'card'
                : isCreditsCard
                ? 'table'
                : listViewType.value,
          })}
        >
          {listItems.map((item, index) => {
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
                  isCreditsCard
                    ? 'w-full'
                    : listViewType.value === 'table' &&
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
                  isCreditsCard={isCreditsCard}
                />
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          <h4 className="opacity-70">{t('no-results')}</h4>
        </div>
      )}
      <Spacer y={5} />
      {!shouldFetch &&
      (hasNextPage || (currentPage && totalPages && currentPage < totalPages)) &&
      showLoadMore &&
      listLoadingType.value === 'infinite-scroll' ? (
        <Button
          type="button"
          // shadow
          fullWidth
          color="primary"
          onPress={() => {
            fetcher.load(
              `${location.pathname}${location.search || ''}${
                location.search?.includes('?') ? '&' : '?'
              }page=${page}${provider ? `&provider=${provider}` : ''}`,
            );
            setShowLoadMore(false);
          }}
        >
          {t('load-more')}
        </Button>
      ) : null}
      {pagination}
      <div ref={bottomRef} />
    </>
  );
};

export default MediaListGrid;
