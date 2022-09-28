import { useLoaderData, useLocation, Link } from '@remix-run/react';
import { json, LoaderFunction, DataFunctionArgs } from '@remix-run/node';
import { Container } from '@nextui-org/react';
import { motion } from 'framer-motion';

import AnimeList from '~/src/components/anime/AnimeList';
import { getAnimePopular } from '~/services/consumet/anilist/anilist.server';

type LoaderData = {
  popularAnime: Awaited<ReturnType<typeof getAnimePopular>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    popularAnime: await getAnimePopular(page, 20),
  });
};

export const handle = {
  breadcrumb: () => <Link to="/anime/popular">Popular Anime</Link>,
};

const PopularAnime = () => {
  const { popularAnime } = useLoaderData<LoaderData>();
  console.log('🚀 ~ file: popular.tsx ~ line 29 ~ PopularAnime ~ popularAnime', popularAnime);
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
        {popularAnime && popularAnime.results && popularAnime.results.length > 0 && (
          <AnimeList listType="grid" items={popularAnime.results} listName="Popular Anime" />
        )}
      </Container>
    </motion.div>
  );
};

export default PopularAnime;
