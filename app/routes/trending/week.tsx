import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getTrending } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = () => ({
  'og:url': 'https://sora-anime.vercel.app/trending/week',
});

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));

  if (!page || page < 1 || page > 1000) {
    return json(
      { weekTrending: await getTrending('all', 'week', locale) },
      {
        headers: { 'Cache-Control': CACHE_CONTROL.trending },
      },
    );
  }
  return json(
    { weekTrending: await getTrending('all', 'week', locale, page) },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.trending },
    },
  );
};

export const handle = {
  breadcrumb: () => {
    <NavLink to="/trending/week" aria-label="Trending This Week">
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
          Trending This Week
        </Badge>
      )}
    </NavLink>;
  },
  miniTitle: () => ({
    title: 'Trending',
    subtitle: 'This Week',
    showImage: false,
  }),
};

const TrendingWeek = () => {
  const { weekTrending } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
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
      {weekTrending && weekTrending.items && weekTrending.items.length > 0 && (
        <MediaList
          currentPage={weekTrending?.page}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          items={weekTrending?.items}
          itemsType="movie-tv"
          listName={t('weekTrending')}
          listType="grid"
          showListTypeChangeButton
          totalPages={weekTrending?.totalPages}
        />
      )}
    </motion.div>
  );
};

export default TrendingWeek;
