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
import { getUserFromCookie } from '~/services/supabase';

import AnimeList from '~/src/components/anime/AnimeList';

export const handle = {
  i18n: 'anime',
  breadcrumb: () => <Link to="/anime">Anime</Link>,
};

type LoaderData = {
  trending: Awaited<ReturnType<typeof getAnimeTrending>>;
  popular: Awaited<ReturnType<typeof getAnimePopular>>;
  recentEpisodes: Awaited<ReturnType<typeof getAnimeRecentEpisodes>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const user = await getUserFromCookie(request.headers.get('Cookie') || '');
  if (!user) return new Response(null, { status: 500 });
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
            onClickViewMore={() => navigate('/anime/popular')}
            navigationButtons
          />
        )}
        {recentEpisodes && recentEpisodes.results && recentEpisodes.results.length > 0 && (
          <AnimeList
            listType="slider-card"
            items={recentEpisodes.results}
            listName="Recent Episodes"
            showMoreList
            onClickViewMore={() => navigate('/anime/recent-episodes')}
            navigationButtons
            itemType="episode-card"
            provider="gogoanime"
          />
        )}
      </Container>
    </motion.main>
  );
};

export default AnimePage;
