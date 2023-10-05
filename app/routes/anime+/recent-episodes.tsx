import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import type { IMedia } from '~/types/media';
import { getAnimeRecentEpisodes } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { useHydrated } from '~/utils/react/hooks/useHydrated';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora - Recent Anime Episodes' },
  { name: 'description', content: 'Recent Anime Episodes' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/anime/recent-episodes' },
  { property: 'og:title', content: 'Sora - Recent Anime Episodes' },
  { property: 'og:description', content: 'Recent Anime Episodes' },
  { name: 'twitter:title', content: 'Sora - Recent Anime Episodes' },
  { name: 'twitter:description', content: 'Recent Anime Episodes' },
]);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate(request, undefined, true);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  let provider = url.searchParams.get('provider') as 'gogoanime' | 'zoro' | undefined;
  if (!page && (page < 1 || page > 1000)) page = 1;
  if (!provider) provider = 'gogoanime';

  return json(
    {
      items: await getAnimeRecentEpisodes(provider, page, 20),
      provider,
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.default },
    },
  );
};

export const handle: Handle = {
  breadcrumb: ({ t }) => (
    <BreadcrumbItem to="/anime/recent-episodes" key="anime-recent-episodes">
      {t('recent-episodes')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ t }) => ({
    title: t('anime'),
    subtitle: t('recent-episodes'),
    showImage: false,
  }),
};

const RecentEpisodes = () => {
  const { items, provider } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();
  const isHydrated = useHydrated();
  const { t } = useTranslation();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      navigate('/anime/trending');
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      return;
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
        itemsType="episode"
        listName={t('recent-episodes')}
        listType="grid"
        provider={provider}
      />
    </motion.div>
  );
};

export default RecentEpisodes;
