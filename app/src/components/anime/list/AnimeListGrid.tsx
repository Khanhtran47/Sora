/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { Grid, Button } from '@nextui-org/react';
import { useFetcher, Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import NProgress from 'nprogress';

import useMediaQuery from '~/hooks/useMediaQuery';
import useSize from '~/hooks/useSize';
import { IAnimeResult, IAnimeEpisode } from '~/services/consumet/anilist/anilist.types';
import AnimeItem from '../item';

const AnimeListGrid = ({
  items,
  hasNextPage,
  routeName,
  virtual,
  itemType,
  provider,
}: {
  items: IAnimeResult[] | IAnimeEpisode[];
  hasNextPage?: boolean;
  routeName?: string;
  virtual?: boolean;
  itemType?: 'banner' | 'card' | 'episode-card';
  provider?: string;
}) => {
  const isXs = useMediaQuery(370);
  const fetcher = useFetcher();
  const [listItems, setListItems] = React.useState<IAnimeResult[]>(items);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [clientHeight, setClientHeight] = React.useState(0);

  const [shouldFetch, setShouldFetch] = React.useState(false);
  const [showLoadMore, setShowLoadMore] = React.useState(true);
  const [page, setPage] = React.useState(2);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const { height } = useSize(parentRef);

  React.useEffect(() => {
    setListItems(items);
    setPage(2);
    setShouldFetch(false);
    setShowLoadMore(true);
  }, [items]);

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
    if (clientHeight + scrollPosition + 100 < height) return;

    fetcher.load(`${routeName}?page=${page}${provider ? `&provider=${provider}` : ''}`);
    setShouldFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition, clientHeight, height]);

  // Merge items, increment page, and allow fetching again
  React.useEffect(() => {
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

  React.useEffect(() => {
    if (fetcher.type === 'normalLoad') {
      NProgress.start();
    }
    if (fetcher.type === 'done') {
      NProgress.done();
    }
  }, [fetcher.type]);

  return (
    <Grid.Container
      ref={parentRef}
      gap={1}
      justify="flex-start"
      alignItems="stretch"
      wrap="wrap"
      css={{ maxWidth: '1920px' }}
    >
      {listItems?.length > 0 &&
        listItems.map((item) => (
          <Grid
            key={item.id}
            as="div"
            xs={isXs ? 12 : 6}
            sm={4}
            md={3}
            lg={2.4}
            xl={2}
            justify="center"
          >
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ x: { type: 'spring', stiffness: 100 }, duration: 0.1 }}
            >
              <Link
                to={
                  itemType && itemType === 'episode-card'
                    ? `/anime/${item.id}/episode/${
                        (item as IAnimeEpisode).episodeId
                      }?provider=${provider}&episode=${(item as IAnimeEpisode).episodeNumber}`
                    : `/anime/${item.id}/overview`
                }
              >
                <AnimeItem key={item.id} type={itemType || 'card'} item={item} virtual={virtual} />
              </Link>
            </motion.div>
          </Grid>
        ))}
      <div ref={bottomRef} />
      {!shouldFetch && hasNextPage && showLoadMore && (
        <Grid xs={12} justify="center">
          <Button
            shadow
            color="primary"
            onClick={() => {
              setShowLoadMore(false);
              setShouldFetch(true);
              bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Load More
          </Button>
        </Grid>
      )}
    </Grid.Container>
  );
};

export default AnimeListGrid;
