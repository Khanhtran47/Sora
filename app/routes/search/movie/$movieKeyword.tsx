/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { DataFunctionArgs, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useParams, Link, RouteMatch } from '@remix-run/react';
import { Container, Pagination } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { getSearchMovies } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/media/MediaList';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';
import SearchForm from '~/src/components/elements/SearchForm';

type LoaderData = {
  searchResults: Awaited<ReturnType<typeof getSearchMovies>>;
};

export const loader: LoaderFunction = async ({ request, params }: DataFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const keyword = params?.movieKeyword || '';
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    searchResults: await getSearchMovies(keyword, page, locale),
  });
};

export const meta: MetaFunction = ({ data, params }) => {
  const { searchResults } = data;
  return {
    title: `Search results for '${params.movieKeyword}' movie on Sora`,
    description: `Watch ${params.movieKeyword} in full HD online with Subtitle - No sign up - No Buffering - One Click Streaming`,
    keywords: `Watch ${params.movieKeyword}, Stream ${params.movieKeyword}, Watch ${params.movieKeyword} HD, Online ${params.movieKeyword}, Streaming ${params.movieKeyword}, English, Subtitle ${params.movieKeyword}, English Subtitle`,
    'og:url': `https://sora-movie.vercel.app/search/movie/${params.movieKeyword}`,
    'og:title': `Search results for '${params.movieKeyword}' movie on Sora`,
    'og:description': `Watch ${params.movieKeyword} in full HD online with Subtitle - No sign up - No Buffering - One Click Streaming`,
    'og:image': searchResults?.items[0]?.backdropPath || searchResults?.items[0]?.posterPath || '',
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link to={`/search/movie/${match.params.movieKeyword}`}>{match.params.movieKeyword}</Link>
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
  const { movieKeyword } = useParams();
  const isXs = useMediaQuery(650);
  const { t } = useTranslation();
  const [listName] = React.useState(t('searchResults'));

  const paginationChangeHandler = (page: number) =>
    navigate(`/search/movie/${movieKeyword}?page=${page}`);

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
        {searchResults && searchResults.items && searchResults.items.length > 0 && (
          <MediaList
            listType="grid"
            items={searchResults?.items}
            listName={listName}
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
          />
        )}
        <Pagination
          total={searchResults?.totalPages}
          initialPage={searchResults?.page}
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
