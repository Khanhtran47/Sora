/* eslint-disable @typescript-eslint/indent */
import { MetaFunction } from '@remix-run/node';
import { useLocation, NavLink } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Container, Badge } from '@nextui-org/react';

import MediaList from '~/components/media/MediaList';
import featuredList from '~/constants/featuredList';

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
        responsive={false}
        display="flex"
        justify="center"
        direction="column"
        alignItems="center"
        css={{
          '@xsMax': {
            paddingLeft: '$sm',
            paddingRight: '$sm',
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
