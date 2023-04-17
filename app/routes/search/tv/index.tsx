/* eslint-disable @typescript-eslint/indent */
import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, NavLink } from '@remix-run/react';
import { Badge } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import { getTrending } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';

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
    <NavLink to="/search/tv" aria-label="Search Tv">
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
          Search Tv
        </Badge>
      )}
    </NavLink>
  ),
};

const SearchRoute = () => {
  const { todayTrending } = useLoaderData<typeof loader>() || {};
  const rootData = useTypedRouteLoaderData('root');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/search/tv?page=${page}`);

  const onSubmit = (value: string) => {
    navigate(`/search/tv/${value}`);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center px-3 sm:px-0">
      <SearchForm
        onSubmit={onSubmit}
        textOnButton={t('search.action')}
        textHelper={t('search.helper.tv')}
        textPlaceHolder={t('search.placeHolder.tv')}
      />
      {todayTrending && todayTrending.items && todayTrending?.items.length > 0 && (
        <MediaList
          listType="grid"
          showListTypeChangeButton
          items={todayTrending && todayTrending.items}
          listName={t('todayTrending')}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          showPagination
          totalPages={todayTrending?.totalPages}
          currentPage={todayTrending?.page}
          onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
        />
      )}
    </div>
  );
};

export default SearchRoute;
