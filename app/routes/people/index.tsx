import { useLoaderData, useNavigate, useLocation, NavLink } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { Badge } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { authenticate } from '~/services/supabase';
import { getListPeople } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = () => ({
  title: 'Discover most popular celebs on Sora',
  description: 'Discover the most popular celebrities right now on Sora.',
  keywords:
    'popular celebrities, popular celebrity, top celebrities, top celebrity, people celebrity, celebrity people, best celebrity, best celebrities, famous celebrity, famous people, celebrity movies, movies by celebrity, celebrity tv shows, tv show celebrities, celebrity television shows, celebrity tv series',
  'og:url': 'https://sora-anime.vercel.app/people',
  'og:title': 'Discover most popular celebs on Sora',
  'og:image': 'https://sora-anime.vercel.app/api/ogimage?it=people',
  'og:description': 'Discover the most popular celebrities right now on Sora.',
});

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
    <NavLink to="/people?index" aria-label="Popular People">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Popular People
        </Badge>
      )}
    </NavLink>
  ),
};

const ListPeoplePopular = () => {
  const { people } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/people?page=${page}`);

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex justify-center flex-col items-center px-3 sm:px-0"
    >
      {people && people.items && people.items.length > 0 && (
        <MediaList
          currentPage={people.page}
          items={people.items}
          listName={t('popularPeople')}
          listType="grid"
          onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
          showPagination
          totalPages={people.totalPages}
          itemsType="people"
        />
      )}
    </motion.div>
  );
};

export default ListPeoplePopular;
