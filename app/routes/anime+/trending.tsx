import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useHydrated } from 'remix-utils';

import type { Handle } from '~/types/handle';
import type { IMedia } from '~/types/media';
import { getAnimeTrending } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora - Trending Anime' },
  { name: 'description', content: 'Trending Anime' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/anime/trending' },
  { property: 'og:title', content: 'Sora - Trending Anime' },
  { property: 'og:description', content: 'Trending Anime' },
  { name: 'twitter:title', content: 'Sora - Trending Anime' },
  { name: 'twitter:description', content: 'Trending Anime' },
]);

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;

  return json(
    {
      items: await getAnimeTrending(page, 20),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.trending },
    },
  );
};

export const handle: Handle = {
  breadcrumb: ({ t }) => (
    <BreadcrumbItem to="/anime/trending" key="anime-trending">
      {t('trending-anime')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ t }) => ({
    title: t('anime'),
    subtitle: t('trending.title'),
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const TrendingAnime = () => {
  const { items } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();
  const isHydrated = useHydrated();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      navigate('/anime/popular');
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      navigate('/anime/recent-episodes');
    }
  };

  return (
    <motion.div
      key={location.key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center px-3 sm:px-0"
      drag={isMobile && isHydrated ? 'x' : false}
      dragConstraints={isMobile && isHydrated ? { left: 0, right: 0 } : false}
      dragElastic={isMobile && isHydrated ? 0.7 : false}
      onDragEnd={handleDragEnd}
      dragDirectionLock={isMobile && isHydrated}
      draggable={isMobile && isHydrated}
    >
      <MediaList
        currentPage={items?.currentPage || 1}
        hasNextPage={items?.hasNextPage || false}
        items={items?.results as IMedia[]}
        itemsType="anime"
        listName="Trending Anime"
        listType="grid"
        showListTypeChangeButton
      />
    </motion.div>
  );
};

export default TrendingAnime;
