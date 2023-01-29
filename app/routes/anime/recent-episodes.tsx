import { useLoaderData, useLocation, NavLink } from '@remix-run/react';
import { json, MetaFunction } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { Container, Badge } from '@nextui-org/react';
import { motion } from 'framer-motion';

import { authenticate } from '~/services/supabase';
import { getAnimeRecentEpisodes } from '~/services/consumet/anilist/anilist.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import { IMedia } from '~/types/media';

import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = () => ({
  title: 'Watch Recent Anime Episodes | Sora',
  description:
    'Official Sora website to watch anime online HD for free, Watch TV show & TV series and Download all anime FREE',
  keywords:
    'watch free anime, free anime to watch online, watch anime online free, free anime streaming, free anime full, free anime download, watch anime hd, anime to watch',
  'og:url': 'https://sora-anime.vercel.app/anime/recent-episodes',
  'og:title': 'Watch Recent Anime Episodes | Sora',
  'og:description':
    'Official Sora website to watch anime online HD for free, Watch TV show & TV series and Download all anime FREE',
});

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  let provider = url.searchParams.get('provider');
  if (!page && (page < 1 || page > 1000)) page = 1;
  if (!provider) provider = 'gogoanime';

  return json(
    {
      items: await getAnimeRecentEpisodes(provider, page, 20),
      provider,
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.default },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/anime/recent-episodes" aria-label="Recent Episodes">
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
          Recent Episodes
        </Badge>
      )}
    </NavLink>
  ),
};

const RecentEpisodes = () => {
  const { items, provider } = useLoaderData<typeof loader>();
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
            paddingLeft: '$sm',
            paddingRight: '$sm',
          },
        }}
      >
        {items && items.results && items.results.length > 0 && (
          <MediaList
            hasNextPage={items.hasNextPage || false}
            items={items.results as IMedia[]}
            itemsType="episode"
            listName="Recent Episodes"
            listType="grid"
            loadingType="scroll"
            provider={provider}
            routeName="/anime/recent-episodes"
            virtual
          />
        )}
      </Container>
    </motion.div>
  );
};

export default RecentEpisodes;
