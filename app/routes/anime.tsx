import { LoaderFunction, json, DataFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, Link } from '@remix-run/react';
import { Container } from '@nextui-org/react';
import { motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next';

import { getAnimeTrending, getAnimePopular } from '~/services/consumet/anilist/anilist.server';
import AnimeList from '~/src/components/anime/AnimeList';

export const handle = {
  i18n: 'anime',
  breadcrumb: () => <Link to="/anime">Anime</Link>,
};

type LoaderData = {
  trending: Awaited<ReturnType<typeof getAnimeTrending>>;
  popular: Awaited<ReturnType<typeof getAnimePopular>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) page = 1;

  const [trendingAnime, popularAnime] = await Promise.all([
    getAnimeTrending(page, 10),
    getAnimePopular(page, 20),
  ]);

  return json<LoaderData>({
    trending: trendingAnime,
    popular: popularAnime,
  });
};

const AnimePage = () => {
  const { trending, popular } = useLoaderData<LoaderData>() || {};
  const location = useLocation();

  return (
    <motion.main
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {trending && trending.results && trending.results.length > 0 && (
        <AnimeList listType="slider-banner" items={trending?.results} />
      )}
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          marginTop: '48px',
          paddingLeft: '88px',
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {popular && popular.results && popular.results.length > 0 && (
          <AnimeList
            listType="slider-card"
            items={popular.results}
            listName="Popular Anime"
            showMoreList
            // onClickViewMore={() => onClickViewMore('movies')}
            navigationButtons
          />
        )}
      </Container>
    </motion.main>
  );
};

export default AnimePage;
