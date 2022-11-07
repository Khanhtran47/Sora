/* eslint-disable @typescript-eslint/indent */
import { MetaFunction } from '@remix-run/node';
import { useLocation, Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Container } from '@nextui-org/react';

import MediaList from '~/src/components/media/MediaList';
import featuredList from '~/src/constants/featuredList';

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
    <Link to="/collections" aria-label="Collections">
      Collections
    </Link>
  ),
};

const Collections = () => {
  const location = useLocation();
  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container
        fluid
        display="flex"
        justify="center"
        direction="column"
        alignItems="center"
        css={{
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {featuredList && featuredList.length > 0 && (
          <MediaList
            listType="grid"
            listName="Featured Collections"
            isCoverCard
            coverItem={featuredList}
          />
        )}
      </Container>
    </motion.div>
  );
};

export default Collections;
