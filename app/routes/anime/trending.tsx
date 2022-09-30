import { useLoaderData, useLocation, Link } from '@remix-run/react';
import { json, LoaderFunction, DataFunctionArgs } from '@remix-run/node';
import { Container } from '@nextui-org/react';
import { motion } from 'framer-motion';

import AnimeList from '~/src/components/anime/AnimeList';
import { getAnimeTrending } from '~/services/consumet/anilist/anilist.server';

type LoaderData = {
  items: Awaited<ReturnType<typeof getAnimeTrending>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    items: await getAnimeTrending(page, 20),
  });
};

export const handle = {
  breadcrumb: () => <Link to="/anime/trending">Trending Anime</Link>,
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
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {items && items.results && items.results.length > 0 && (
          <AnimeList
            listType="grid"
            items={items.results}
            hasNextPage={items.hasNextPage || false}
            listName="Trending Anime"
            routeName="/anime/trending"
          />
        )}
      </Container>
    </motion.div>
  );
};

export default TrendingAnime;
