import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs } from '@remix-run/node';
import { NavLink, useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'remix-utils';

import type { IMedia } from '~/types/media';
import { getAnimeTrending } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';
import SearchForm from '~/components/elements/SearchForm';

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

export const handle = {
  breadcrumb: () => (
    <NavLink to="/search/anime" aria-label="Search Anime">
      Search Anime
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Search',
    subtitle: 'Anime',
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const SearchRoute = () => {
  const { items } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const isHydrated = useHydrated();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      navigate('/search/tv');
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      navigate('/search/people');
    }
  };

  const onSubmit = (value: string) => {
    navigate(`/search/anime/${value}`);
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
      <SearchForm
        onSubmit={onSubmit}
        textOnButton={t('search.action')}
        textHelper={t('search.helper.anime')}
        textPlaceHolder={t('search.placeHolder.anime')}
      />
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

export default SearchRoute;
