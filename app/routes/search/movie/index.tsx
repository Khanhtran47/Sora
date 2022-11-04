/* eslint-disable @typescript-eslint/indent */
import { DataFunctionArgs, json, LoaderFunction, redirect } from '@remix-run/node';
import { useLoaderData, useNavigate, Link } from '@remix-run/react';
import { Container, Pagination } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { getTrending } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/media/MediaList';
import SearchForm from '~/src/components/elements/SearchForm';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';
import { getUserFromCookie, verifyReqPayload } from '~/services/supabase';

type LoaderData = {
  todayTrending: Awaited<ReturnType<typeof getTrending>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const [locale, user, verified] = await Promise.all([
    i18next.getLocale(request),
    getUserFromCookie(request.headers.get('Cookie') || ''),
    await verifyReqPayload(request),
  ]);

  if (!user || !verified) return redirect('/sign-out?ref=/sign-in');

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    todayTrending: await getTrending('all', 'day', locale, page),
  });
};

export const handle = {
  breadcrumb: () => <Link to="/search/movie">Search Movies</Link>,
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
  const isXs = useMediaQuery(650);
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/search/movie?page=${page}`);

  const onSubmit = (value: string) => {
    navigate(`/search/movie/${value}`);
  };

  return (
    <>
      <SearchForm
        onSubmit={onSubmit}
        textOnButton={t('search.action')}
        textHelper={t('search.helper.movie')}
        textPlaceHolder={t('search.placeHolder.movie')}
      />
      <Container
        fluid
        display="flex"
        justify="center"
        direction="column"
        alignItems="center"
        css={{
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {todayTrending && todayTrending.items && todayTrending?.items.length > 0 && (
          <MediaList
            listType="grid"
            items={todayTrending && todayTrending.items}
            listName={t('todayTrending')}
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
          />
        )}
        <Pagination
          total={todayTrending?.totalPages}
          initialPage={todayTrending?.page}
          shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
          {...(isXs && { size: 'xs' })}
        />
      </Container>
    </>
  );
};

export default SearchRoute;
