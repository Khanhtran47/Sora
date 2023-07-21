import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getListPeople } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora - Popular People' },
  { name: 'description', content: 'Discover the most popular celebrities on Sora.' },
  {
    name: 'keywords',
    content:
      'popular celebrities, popular celebrity, top celebrities, top celebrity, people celebrity, celebrity people, best celebrity, best celebrities, famous celebrity, famous people, celebrity movies, movies by celebrity, celebrity tv shows, tv show celebrities, celebrity television shows, celebrity tv series',
  },
  { property: 'og:url', content: 'https://sorachill.vercel.app/people' },
  { property: 'og:title', content: 'Sora - Popular People' },
  { property: 'og:image', content: 'https://sorachill.vercel.app/api/ogimage?it=people' },
  { property: 'og:description', content: 'Discover the most popular celebrities on Sora.' },
  { name: 'twitter:title', content: 'Sora - Popular People' },
  { name: 'twitter:description', content: 'Discover the most popular celebrities on Sora.' },
  { name: 'twitter:image', content: 'https://sorachill.vercel.app/api/ogimage?it=people' },
]);

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

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/people" key="people">
      Popular People
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'People',
    subtitle: 'Popular',
    showImage: false,
  }),
};

const ListPeoplePopular = () => {
  const { people } = useLoaderData<typeof loader>();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center px-3 sm:px-0"
    >
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

export default ListPeoplePopular;
