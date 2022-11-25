import { DataFunctionArgs, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, Link, RouteMatch, useLocation } from '@remix-run/react';
import { Container } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { authenticate } from '~/services/supabase';
import SearchForm from '~/src/components/elements/SearchForm';
import AnimeList from '~/src/components/anime/AnimeList';
import { getAnimeSearch } from '~/services/consumet/anilist/anilist.server';

type LoaderData = {
  searchResults: Awaited<ReturnType<typeof getAnimeSearch>>;
};

export const loader: LoaderFunction = async ({ request, params }: DataFunctionArgs) => {
  await authenticate(request);

  const keyword = params?.animeKeyword || '';
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    searchResults: await getAnimeSearch(keyword, page, 20),
  });
};

export const meta: MetaFunction = ({ data, params }) => {
  const { searchResults } = data;
  return {
    title: `Search results for '${params.animeKeyword}' anime on Sora`,
    description: `Watch ${params.animeKeyword} anime in full HD online with Subtitle`,
    keywords: `Watch ${params.animeKeyword}, Stream ${params.animeKeyword}, Watch ${params.animeKeyword} HD, Online ${params.animeKeyword}, Streaming ${params.animeKeyword}, English, Subtitle ${params.animeKeyword}, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/search/anime/${params.animeKeyword}`,
    'og:title': `Search results for '${params.animeKeyword}' anime on Sora`,
    'og:description': `Watch ${params.animeKeyword} in full HD online with Subtitle`,
    'og:image': searchResults?.results[0]?.cover || searchResults?.results[0]?.image || '',
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link to={`/search/anime/${match.params.animeKeyword}`} aria-label={match.params.animeKeyword}>
      {match.params.animeKeyword}
    </Link>
  ),
};

const SearchRoute = () => {
  const { searchResults } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const onSubmit = (value: string) => {
    navigate(`/search/anime/${value}`);
  };
  return (
    <>
      <SearchForm
        onSubmit={onSubmit}
        textOnButton={t('search.action')}
        textHelper={t('search.helper.anime')}
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
        {searchResults && searchResults.results && searchResults.results.length > 0 && (
          <AnimeList
            listType="grid"
            items={searchResults.results}
            hasNextPage={searchResults.hasNextPage || false}
            listName="Search Results"
            routeName={location.pathname}
            virtual
          />
        )}
      </Container>
    </>
  );
};

export default SearchRoute;
