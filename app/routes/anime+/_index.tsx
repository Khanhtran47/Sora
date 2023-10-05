import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import type { IMedia } from '~/types/media';
import {
  getAnimePopular,
  getAnimeRecentEpisodes,
  getAnimeTrending,
} from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate(request, undefined, true);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) page = 1;

  const [trendingAnime, popularAnime, recentEpisodes] = await Promise.all([
    getAnimeTrending(page, 10),
    getAnimePopular(page, 20),
    getAnimeRecentEpisodes('gogoanime', page, 20),
  ]);

  return json(
    {
      trending: trendingAnime,
      popular: popularAnime,
      recentEpisodes,
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.anime },
    },
  );
};

export const meta = mergeMeta(() => [
  { title: 'Sora - Anime' },
  { name: 'description', content: 'Discover anime in Sora' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/anime' },
  { property: 'og:title', content: 'Sora - Anime' },
  { property: 'og:description', content: 'Discover anime in Sora' },
  { name: 'twitter:title', content: 'Sora - Anime' },
  { name: 'twitter:description', content: 'Discover anime in Sora' },
]);

export const handle: Handle = {
  disableLayoutPadding: true,
  miniTitle: ({ t }) => ({
    title: t('anime'),
    showImage: false,
  }),
};

const AnimePage = () => {
  const { trending, popular, recentEpisodes } = useLoaderData<typeof loader>() || {};
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {trending && trending.results && trending.results.length > 0 && (
        <MediaList listType="slider-banner" items={trending?.results as IMedia[]} />
      )}
      <div className="mt-9 flex w-full flex-col items-center justify-start px-3 sm:px-5">
        {popular && popular.results && popular.results.length > 0 && (
          <MediaList
            items={popular.results as IMedia[]}
            itemsType="anime"
            listName={t('popular-anime')}
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
            listName={t('recent-episodes')}
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => navigate('/anime/recent-episodes')}
            provider="gogoanime"
            showMoreList
          />
        )}
      </div>
    </motion.div>
  );
};

export default AnimePage;
