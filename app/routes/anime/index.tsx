import { LoaderFunction, json, DataFunctionArgs } from '@remix-run/node';
import { useNavigate, useLoaderData, useLocation, Link } from '@remix-run/react';
import { Container } from '@nextui-org/react';
import { motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next';

import {
  getAnimeTrending,
  getAnimePopular,
  getAnimeRecentEpisodes,
} from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { IMedia } from '~/types/media';

import MediaList from '~/src/components/media/MediaList';

export const handle = {
  i18n: 'anime',
  breadcrumb: () => (
    <Link to="/anime" aria-label="Anime">
      Anime
    </Link>
  ),
};

type LoaderData = {
  trending: Awaited<ReturnType<typeof getAnimeTrending>>;
  popular: Awaited<ReturnType<typeof getAnimePopular>>;
  recentEpisodes: Awaited<ReturnType<typeof getAnimeRecentEpisodes>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  await authenticate(request);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) page = 1;

  const [trendingAnime, popularAnime, recentEpisodes] = await Promise.all([
    getAnimeTrending(page, 10),
    getAnimePopular(page, 20),
    getAnimeRecentEpisodes('gogoanime', page, 20),
  ]);

  return json<LoaderData>({
    trending: trendingAnime,
    popular: popularAnime,
    recentEpisodes,
  });
};

const AnimePage = () => {
  const { trending, popular, recentEpisodes } = useLoaderData<LoaderData>() || {};
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.main
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {trending && trending.results && trending.results.length > 0 && (
        <MediaList listType="slider-banner" items={trending?.results as IMedia[]} />
      )}
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          padding: 0,
          marginTop: '48px',
          minHeight: '564px',
          '@xsMax': {
            paddingLeft: '$sm',
            paddingRight: '$sm',
          },
        }}
      >
        {popular && popular.results && popular.results.length > 0 && (
          <MediaList
            items={popular.results as IMedia[]}
            itemsType="anime"
            listName="Popular Anime"
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/anime/popular')}
            showMoreList
          />
        )}
        {recentEpisodes && recentEpisodes.results && recentEpisodes.results.length > 0 && (
          <MediaList
            items={recentEpisodes.results as IMedia[]}
            itemsType="episode"
            listName="Recent Episodes"
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/anime/recent-episodes')}
            provider="gogoanime"
            showMoreList
          />
        )}
      </Container>
    </motion.main>
  );
};

export default AnimePage;
