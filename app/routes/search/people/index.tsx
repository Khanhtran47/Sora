import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, NavLink } from '@remix-run/react';
import { Badge } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { getListPeople } from '~/services/tmdb/tmdb.server';
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
      people: await getListPeople('popular', locale, page),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.trending },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/search/people" aria-label="Search People">
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
          Search People
        </Badge>
      )}
    </NavLink>
  ),
};

const SearchRoute = () => {
  const { people } = useLoaderData<typeof loader>() || {};
  const navigate = useNavigate();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/people/popular?page=${page}`);

  const onSubmit = (value: string) => {
    navigate(`/search/people/${value}`);
  };

  return (
    <div className="w-full flex justify-center flex-col items-center px-3 sm:px-0">
      <SearchForm
        onSubmit={onSubmit}
        textOnButton={t('search.action')}
        textHelper={t('search.helper.people')}
        textPlaceHolder={t('search.placeHolder.people')}
      />
      {people && people.items && people.items.length > 0 && (
        <MediaList
          currentPage={people.page}
          items={people.items}
          listName={t('popular-people')}
          listType="grid"
          onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
          showPagination
          totalPages={people.totalPages}
          itemsType="people"
        />
      )}
    </div>
  );
};

export default SearchRoute;
