import { useLoaderData, useLocation, Link } from '@remix-run/react';
import { json, LoaderFunction, DataFunctionArgs, MetaFunction } from '@remix-run/node';
import { Container } from '@nextui-org/react';
import { motion } from 'framer-motion';

import AnimeList from '~/src/components/anime/AnimeList';
import { authenticate } from '~/services/supabase';
import { getAnimePopular } from '~/services/consumet/anilist/anilist.server';

type LoaderData = {
  items: Awaited<ReturnType<typeof getAnimePopular>>;
};

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

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  await authenticate(request);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    items: await getAnimePopular(page, 20),
  });
};

export const handle = {
  breadcrumb: () => (
    <Link to="/anime/popular" aria-label="Popular Anime">
      Popular Anime
    </Link>
  ),
};

const PopularAnime = () => {
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
          <AnimeList
            listType="grid"
            items={items.results}
            hasNextPage={items.hasNextPage || false}
            listName="Popular Anime"
            routeName="/anime/popular"
            virtual
          />
        )}
      </Container>
    </motion.div>
  );
};

export default PopularAnime;
