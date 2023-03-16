import { useLoaderData, useLocation, NavLink } from '@remix-run/react';
import { json, MetaFunction } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { Container, Badge } from '@nextui-org/react';
import { motion } from 'framer-motion';

import { IMedia } from '~/types/media';

import { CACHE_CONTROL } from '~/utils/server/http';
import { authenticate } from '~/services/supabase';
import { getAnimePopular } from '~/services/consumet/anilist/anilist.server';

import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = () => ({
  title: 'Watch Popular anime free | Sora',
  description:
    'Official Sora website to watch anime online HD for free, Watch TV show & TV series and Download all anime FREE',
  keywords:
    'watch free anime, free anime to watch online, watch anime online free, free anime streaming, free anime full, free anime download, watch anime hd, anime to watch',
  'og:url': 'https://sora-anime.vercel.app/anime/popular',
  'og:title': 'Watch Popular anime free | Sora',
  'og:description':
    'Official Sora website to watch anime online HD for free, Watch TV show & TV series and Download all anime FREE',
});

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;

  return json(
    {
      items: await getAnimePopular(page, 20),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.popular },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/anime/popular" aria-label="Popular Anime">
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
          Popular Anime
        </Badge>
      )}
    </NavLink>
  ),
};

const PopularAnime = () => {
  const { items } = useLoaderData<typeof loader>();
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
        {items && items.results && items.results.length > 0 && (
          <MediaList
            hasNextPage={items.hasNextPage || false}
            items={items.results as IMedia[]}
            itemsType="anime"
            listName="Popular Anime"
            listType="grid"
            loadingType="scroll"
            routeName="/anime/popular"
            virtual
          />
        )}
      </Container>
    </motion.div>
  );
};

export default PopularAnime;
