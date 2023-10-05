import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import type { IMedia } from '~/types/media';
import { getAnimePopular } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { useHydrated } from '~/utils/react/hooks/useHydrated';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora - Popular Anime' },
  { name: 'description', content: 'Popular Anime' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/anime/popular' },
  { property: 'og:title', content: 'Sora - Popular Anime' },
  { property: 'og:description', content: 'Popular Anime' },
  { name: 'twitter:title', content: 'Sora - Popular Anime' },
  { name: 'twitter:description', content: 'Popular Anime' },
]);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate(request, undefined, true);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;

  return json(
    {
      items: await getAnimePopular(page, 20),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.popular },
    },
  );
};

export const handle: Handle = {
  breadcrumb: ({ t }) => (
    <BreadcrumbItem to="/anime/popular" key="anime-popular">
      {t('popular-anime')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ t }) => ({
    title: t('anime'),
    subtitle: t('popular'),
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const PopularAnime = () => {
  const { items } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();
  const isHydrated = useHydrated();
  const { t } = useTranslation();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      return;
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      navigate('/anime/trending');
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
        listName={t('popular-anime')}
        listType="grid"
        showListTypeChangeButton
      />
    </motion.div>
  );
};

export default PopularAnime;
