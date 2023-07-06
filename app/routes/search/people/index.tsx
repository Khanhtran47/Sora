import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'remix-utils';

import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getListPeople } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import SearchForm from '~/components/elements/SearchForm';

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json(
    {
      people: await getListPeople('popular', locale, page),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.trending },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/search/people" key="search-people">
      Search People
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Search',
    subtitle: 'People',
    showImage: false,
  }),
};

const SearchRoute = () => {
  const { people } = useLoaderData<typeof loader>() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const isHydrated = useHydrated();
  const { t } = useTranslation();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset?.x > 100) {
      navigate('/search/anime');
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      return;
    }
  };

  const onSubmit = (value: string) => {
    navigate(`/search/people/${value}`);
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
        textHelper={t('search.helper.people')}
        textOnButton={t('search.action')}
        textPlaceHolder={t('search.placeHolder.people')}
      />
      <MediaList
        currentPage={people?.page}
        items={people?.items}
        itemsType="people"
        listName={t('popular-people')}
        listType="grid"
        totalPages={people?.totalPages}
      />
    </motion.div>
  );
};

export default SearchRoute;
