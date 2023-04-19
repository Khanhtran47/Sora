/* eslint-disable @typescript-eslint/indent */
import { useRef } from 'react';
import { Badge, Pagination, Spacer } from '@nextui-org/react';
import { useMediaQuery } from '@react-hookz/web';
import type { MetaFunction } from '@remix-run/node';
import { NavLink, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';

import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import featuredList from '~/constants/featuredList';
import MediaList from '~/components/media/MediaList';
import Flex from '~/components/styles/Flex.styles';

export const meta: MetaFunction = () => ({
  title: 'Movies and tv shows Collections | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/collections',
  'og:title': 'Movies and tv shows Collections | Sora',
  'og:description':
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
});

export const handle = {
  breadcrumb: () => (
    <NavLink to="/collections" aria-label="Collections">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Collections
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Featured Collections',
    showImage: false,
  }),
};

const Collections = () => {
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(featuredList, 12);
  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center px-3 sm:px-0"
    >
      <div ref={ref} />
      {featuredList && featuredList.length > 0 && (
        <MediaList
          listType="grid"
          listName="Featured Collections"
          isCoverCard
          coverItem={currentData}
        />
      )}
      <Spacer y={1} />
      {maxPage > 1 && (
        <Flex direction="row" justify="center">
          <Pagination
            total={maxPage}
            initialPage={currentPage}
            // shadow
            onChange={(page) => {
              gotoPage(page);
              ref.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'center',
              });
            }}
            css={{ marginTop: '2rem' }}
            {...(isSm && { size: 'xs' })}
          />
        </Flex>
      )}
    </motion.div>
  );
};

export default Collections;
