import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useHydrated } from 'remix-utils';

import type { Handle } from '~/types/handle';
import type { IMedia } from '~/types/media';
import { getAnimeAdvancedSearch } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora - Discover anime' },
  { name: 'description', content: 'Discover Anime on Sora' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/discover/anime' },
  { property: 'og:title', content: 'Sora - Discover anime' },
  { property: 'og:image', content: 'https://sorachill.vercel.app/api/ogimage?it=anime' },
  { property: 'og:description', content: 'Discover Anime on Sora' },
  { name: 'twitter:title', content: 'Sora - Discover anime' },
  { name: 'twitter:description', content: 'Discover Anime on Sora' },
  { name: 'twitter:image', content: 'https://sorachill.vercel.app/api/ogimage?it=anime' },
]);

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;
  const query = url.searchParams.get('query') || undefined;
  const type = (url.searchParams.get('type') as 'ANIME' | 'MANGA') || 'ANIME';
  const season =
    (url.searchParams.get('season') as 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL') || undefined;
  const format =
    (url.searchParams.get('format') as
      | 'TV'
      | 'TV_SHORT'
      | 'OVA'
      | 'ONA'
      | 'MOVIE'
      | 'SPECIAL'
      | 'MUSIC') || undefined;
  const sort = url.searchParams.get('sort') || undefined;
  const status =
    (url.searchParams.get('status') as
      | 'RELEASING'
      | 'NOT_YET_RELEASED'
      | 'FINISHED'
      | 'CANCELLED'
      | 'HIATUS') || undefined;
  const genres = url.searchParams.get('genres')?.split(',') || undefined;
  const id = url.searchParams.get('id') || undefined;
  const year = Number(url.searchParams.get('year')) || undefined;

  return json({
    items: await getAnimeAdvancedSearch(
      query,
      type,
      page,
      20,
      season,
      format,
      sort ? [sort.toUpperCase()] : undefined,
      genres,
      id,
      year,
      status,
    ),
  });
};

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/discover/anime" key="discover-anime">
      Anime
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Discover',
    subtitle: 'Anime',
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const DiscoverAnime = () => {
  const { items } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();
  const isHydrated = useHydrated();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      navigate('/discover/tv-shows');
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
        itemsType="anime"
        listName="Discover Anime"
        listType="grid"
        showFilterButton
        showListTypeChangeButton
        showSortBySelect
      />
    </motion.div>
  );
};

export default DiscoverAnime;
