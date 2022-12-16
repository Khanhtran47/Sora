import * as React from 'react';
import { DataFunctionArgs, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useParams, NavLink, RouteMatch } from '@remix-run/react';
import { Container, Badge } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { getSearchPerson } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/media/MediaList';
import i18next from '~/i18n/i18next.server';
import SearchForm from '~/src/components/elements/SearchForm';
import { authenticate } from '~/services/supabase';

type LoaderData = {
  searchResults: Awaited<ReturnType<typeof getSearchPerson>>;
};

export const loader: LoaderFunction = async ({ request, params }: DataFunctionArgs) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const keyword = params?.peopleKeyword || '';
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    searchResults: await getSearchPerson(keyword, page, undefined, locale),
  });
};

export const meta: MetaFunction = ({ data, params }) => {
  const { searchResults } = data;
  return {
    title: `Search results for '${params.peopleKeyword}' on Sora`,
    description: `Watch ${params.peopleKeyword} movie, tv seris in full HD online with Subtitle`,
    keywords: `watch ${params.peopleKeyword} free, watch ${params.peopleKeyword} movies, watch ${params.peopleKeyword} series, stream ${params.peopleKeyword} series, ${params.peopleKeyword} movies online free`,
    'og:url': `https://sora-anime.vercel.app/search/people/${params.peopleKeyword}`,
    'og:title': `Search results for '${params.peopleKeyword}' on Sora`,
    'og:description': `Watch ${params.peopleKeyword} in full HD online with Subtitle`,
    'og:image': searchResults?.items[0]?.backdropPath || searchResults?.items[0]?.posterPath || '',
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink
      to={`/search/people/${match.params.peopleKeyword}`}
      aria-label={match.params.peopleKeyword}
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
          {match.params.peopleKeyword}
        </Badge>
      )}
    </NavLink>
  ),
};

const SearchRoute = () => {
  const { searchResults } = useLoaderData<LoaderData>() || {};
  const navigate = useNavigate();
  const { peopleKeyword } = useParams();
  const { t } = useTranslation();
  const [listName] = React.useState(t('searchResults'));

  const paginationChangeHandler = (page: number) =>
    navigate(`/search/people/${peopleKeyword}?page=${page}`);

  const onSubmit = (value: string) => {
    navigate(`/search/people/${value}`);
  };

  return (
    <>
      <SearchForm
        onSubmit={onSubmit}
        textOnButton={t('search.action')}
        textHelper={t('search.helper.people')}
        textPlaceHolder={t('search.placeHolder.people')}
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
        {searchResults && searchResults.results?.length > 0 && (
          <MediaList
            currentPage={searchResults.page}
            items={searchResults.results}
            listName={listName}
            listType="grid"
            onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
            showPagination
            totalPages={searchResults.totalPages}
            itemsType="people"
          />
        )}
      </Container>
    </>
  );
};

export default SearchRoute;
