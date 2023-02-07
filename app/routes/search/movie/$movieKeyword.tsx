/* eslint-disable @typescript-eslint/indent */
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, useParams, NavLink, RouteMatch } from '@remix-run/react';
import { Container, Badge } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { authenticate } from '~/services/supabase';
import { getSearchMovies } from '~/services/tmdb/tmdb.server';
import MediaList from '~/components/media/MediaList';
import i18next from '~/i18n/i18next.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import SearchForm from '~/components/elements/SearchForm';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const keyword = params?.movieKeyword || '';
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json(
    {
      searchResults: await getSearchMovies(keyword, page, locale),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.search },
    },
  );
};

export const meta: MetaFunction = ({ data, params }) => {
  const { searchResults } = data;
  return {
    title: `Search results for '${params.movieKeyword}' movie on Sora`,
    description: `Watch ${params.movieKeyword} in full HD online with Subtitle`,
    keywords: `Watch ${params.movieKeyword}, Stream ${params.movieKeyword}, Watch ${params.movieKeyword} HD, Online ${params.movieKeyword}, Streaming ${params.movieKeyword}, English, Subtitle ${params.movieKeyword}, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/search/movie/${params.movieKeyword}`,
    'og:title': `Search results for '${params.movieKeyword}' movie on Sora`,
    'og:description': `Watch ${params.movieKeyword} in full HD online with Subtitle`,
    'og:image': searchResults?.items[0]?.backdropPath || searchResults?.items[0]?.posterPath || '',
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink
      to={`/search/movie/${match.params.movieKeyword}`}
      aria-label={match.params.movieKeyword}
    >
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
          {match.params.movieKeyword}
        </Badge>
      )}
    </NavLink>
  ),
};

const SearchRoute = () => {
  const { searchResults } = useLoaderData<typeof loader>() || {};
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
  const { t } = useTranslation();

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
            paddingLeft: '$sm',
            paddingRight: '$sm',
          },
        }}
      >
        {searchResults && searchResults.items && searchResults.items.length > 0 && (
          <MediaList
            listType="grid"
            showListTypeChangeButton
            items={searchResults?.items}
            listName={t('search.searchResults')}
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
