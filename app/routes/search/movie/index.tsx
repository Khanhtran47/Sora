import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs } from '@remix-run/node';
import { NavLink, useLoaderData, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getTrending } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
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
      todayTrending: await getTrending('all', 'day', locale, page),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.trending },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/search/movie" aria-label="Search Movies">
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
          Search Movies
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Search',
    subtitle: 'Movies',
    showImage: false,
  }),
};

const SearchRoute = () => {
  const { todayTrending } = useLoaderData<typeof loader>() || {};
  const rootData = useTypedRouteLoaderData('root');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = (value: string) => {
    navigate(`/search/movie/${value}`);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center px-3 sm:px-0">
      <SearchForm
        onSubmit={onSubmit}
        textHelper={t('search.helper.movie')}
        textOnButton={t('search.action')}
        textPlaceHolder={t('search.placeHolder.movie')}
      />
      {todayTrending && todayTrending.items && todayTrending?.items.length > 0 && (
        <MediaList
          currentPage={todayTrending?.page}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          items={todayTrending?.items}
          itemsType="movie-tv"
          listName={t('todayTrending')}
          listType="grid"
          showListTypeChangeButton
          totalPages={todayTrending?.totalPages}
        />
      )}
    </div>
  );
};

export default SearchRoute;
