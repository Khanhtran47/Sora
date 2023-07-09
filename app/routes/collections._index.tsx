import { useRef } from 'react';
import { Pagination } from '@nextui-org/pagination';
import { Spacer } from '@nextui-org/spacer';
import { useMediaQuery } from '@react-hookz/web';
import { useLocation } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion } from 'framer-motion';

import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import featuredList from '~/constants/featuredList';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora - Collections' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/collections' },
  { property: 'og:title', content: 'Sora - Collections' },
  { name: 'twitter:title', content: 'Sora - Collections' },
]);

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/collections" key="collections">
      Collections
    </BreadcrumbItem>
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
      <MediaList
        listType="grid"
        listName="Featured Collections"
        isCoverCard
        coverItem={currentData}
      />
      <Spacer y={5} />
      {maxPage > 1 && (
        <div className="mt-7 flex flex-row justify-center">
          <Pagination
            // showControls={!isSm}
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
            {...(isSm && { size: 'xs' })}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Collections;
