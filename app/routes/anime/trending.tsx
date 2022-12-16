import { useLoaderData, useLocation, NavLink } from '@remix-run/react';
import { json, LoaderFunction, DataFunctionArgs, MetaFunction } from '@remix-run/node';
import { Container, Badge } from '@nextui-org/react';
import { motion } from 'framer-motion';

import { getAnimeTrending } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { IMedia } from '~/types/media';

import MediaList from '~/src/components/media/MediaList';

type LoaderData = {
  items: Awaited<ReturnType<typeof getAnimeTrending>>;
};

export const meta: MetaFunction = () => ({
  title: 'Watch Top Trending anime free | Sora',
  description:
    'Official Sora website to watch anime online HD for free, Watch TV show & TV series and Download all anime FREE',
  keywords:
    'watch free anime, free anime to watch online, watch anime online free, free anime streaming, free anime full, free anime download, watch anime hd, anime to watch',
  'og:url': 'https://sora-anime.vercel.app/anime/trending',
  'og:title': 'Watch Top Trending anime free | Sora',
  'og:description':
    'Official Sora website to watch anime online HD for free, Watch TV show & TV series and Download all anime FREE',
});

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  await authenticate(request);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    items: await getAnimeTrending(page, 20),
  });
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/anime/trending" aria-label="Trending Anime">
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
          Trending Anime
        </Badge>
      )}
    </NavLink>
  ),
};

const TrendingAnime = () => {
  const { items } = useLoaderData<LoaderData>();
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
            itemsType="anime"
            listName="Trending Anime"
            listType="grid"
            loadingType="scroll"
            routeName="/anime/trending"
            virtual
          />
        )}
      </Container>
    </motion.div>
  );
};

export default TrendingAnime;
