/* eslint-disable @typescript-eslint/indent */
import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, NavLink } from '@remix-run/react';
import { Container, Badge } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { getTrending } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/media/MediaList';
import i18next from '~/i18n/i18next.server';
import SearchForm from '~/src/components/elements/SearchForm';
import { authenticate } from '~/services/supabase';

type LoaderData = {
  todayTrending: Awaited<ReturnType<typeof getTrending>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    todayTrending: await getTrending('all', 'day', locale, page),
  });
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
  const { todayTrending } = useLoaderData<LoaderData>() || {};
  const rootData:
    | {
        user?: User;
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/search/tv?page=${page}`);

  const onSubmit = (value: string) => {
    navigate(`/search/tv/${value}`);
  };

  return (
    <>
      <SearchForm
        onSubmit={onSubmit}
        textOnButton={t('search.action')}
        textHelper={t('search.helper.tv')}
        textPlaceHolder={t('search.placeHolder.tv')}
      />
      <Container
        fluid
        display="flex"
        justify="center"
        direction="column"
        alignItems="center"
        css={{
          '@xsMax': {
            paddingLeft: '$sm',
            paddingRight: '$sm',
          },
        }}
      >
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
      </Container>
    </>
  );
};

export default SearchRoute;
