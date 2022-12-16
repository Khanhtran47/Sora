/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { DataFunctionArgs, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useParams, NavLink, RouteMatch } from '@remix-run/react';
import { Container, Badge } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { getSearchTvShows } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/media/MediaList';
import { useTranslation } from 'react-i18next';
import SearchForm from '~/src/components/elements/SearchForm';
import { authenticate } from '~/services/supabase';

type LoaderData = {
  searchResults: Awaited<ReturnType<typeof getSearchTvShows>>;
};

export const loader: LoaderFunction = async ({ request, params }: DataFunctionArgs) => {
  await authenticate(request);

  const keyword = params?.tvKeyword || '';
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      searchResults: await getSearchTvShows(keyword),
    });
  }
  return json<LoaderData>({
    searchResults: await getSearchTvShows(keyword, page),
  });
};

export const meta: MetaFunction = ({ data, params }) => {
  const { searchResults } = data;
  return {
    title: `Search results for '${params.tvKeyword}' tv serie on Sora`,
    description: `Watch ${params.tvKeyword} in full HD online with Subtitle`,
    keywords: `Watch ${params.tvKeyword}, Stream ${params.tvKeyword}, Watch ${params.tvKeyword} HD, Online ${params.tvKeyword}, Streaming ${params.tvKeyword}, English, Subtitle ${params.tvKeyword}, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/search/tv/${params.tvKeyword}`,
    'og:title': `Search results for '${params.tvKeyword}' tv serie on Sora`,
    'og:description': `Watch ${params.tvKeyword} in full HD online with Subtitle`,
    'og:image': searchResults?.items[0]?.backdropPath || searchResults?.items[0]?.posterPath || '',
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink to={`/search/tv/${match.params.tvKeyword}`} aria-label={match.params.tvKeyword}>
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
          {match.params.tvKeyword}
        </Badge>
      )}
    </NavLink>
  ),
};

const SearchRoute = () => {
  const { searchResults } = useLoaderData<LoaderData>() || {};
  const rootData:
    | {
        user?: User;
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const navigate = useNavigate();
  const { tvKeyword } = useParams();
  const { t } = useTranslation();
  const [listName] = React.useState(t('searchResults'));

  const paginationChangeHandler = (page: number) =>
    navigate(`/search/tv/${tvKeyword}?page=${page}`);

  const onSubmit = (value: string) => {
    navigate(`/search/tv/${value}`);
  };

  return (
    <>
      <SearchForm
        onSubmit={onSubmit}
        textOnButton={t('search.action')}
        textHelper={t('search.helper.tv')}
        textPlaceHolder={t('search.placeHolder.anime')}
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
        {searchResults && searchResults.items && searchResults?.items.length > 0 && (
          <MediaList
            listType="grid"
            showListTypeChangeButton
            items={searchResults.items}
            listName={listName}
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            showPagination
            totalPages={searchResults?.totalPages}
            currentPage={searchResults?.page}
            onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
          />
        )}
      </Container>
    </>
  );
};

export default SearchRoute;
