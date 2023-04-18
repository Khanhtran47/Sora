/* eslint-disable @typescript-eslint/indent */

import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, useNavigate, useParams, type RouteMatch } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { authenticate } from '~/services/supabase';
import { getSearchTvShows } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import SearchForm from '~/components/elements/SearchForm';

export const loader = async ({ request, params }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const keyword = params?.tvKeyword || '';
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) {
    return json(
      {
        searchResults: await getSearchTvShows(keyword),
      },
      {
        headers: { 'Cache-Control': CACHE_CONTROL.search },
      },
    );
  }
  return json(
    {
      searchResults: await getSearchTvShows(keyword, page),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.search },
    },
  );
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
  miniTitle: (match: RouteMatch) => ({
    title: 'Search results',
    subtitle: match.params.tvKeyword,
    showImage: false,
  }),
};

const SearchRoute = () => {
  const { searchResults } = useLoaderData<typeof loader>() || {};
  const rootData = useTypedRouteLoaderData('root');
  const navigate = useNavigate();
  const { tvKeyword } = useParams();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) =>
    navigate(`/search/tv/${tvKeyword}?page=${page}`);

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
      {searchResults && searchResults.items && searchResults?.items.length > 0 && (
        <MediaList
          listType="grid"
          showListTypeChangeButton
          items={searchResults.items}
          listName={t('search.searchResults')}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          showPagination
          totalPages={searchResults?.totalPages}
          currentPage={searchResults?.page}
          onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
        />
      )}
    </div>
  );
};

export default SearchRoute;
