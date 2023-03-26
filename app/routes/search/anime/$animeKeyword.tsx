import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, NavLink, RouteMatch, useLocation } from '@remix-run/react';
import { Badge } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { authenticate } from '~/services/supabase';
import { getAnimeSearch } from '~/services/consumet/anilist/anilist.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import { IMedia } from '~/types/media';

import MediaList from '~/components/media/MediaList';
import SearchForm from '~/components/elements/SearchForm';

export const loader = async ({ request, params }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const keyword = params?.animeKeyword || '';
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;

  return json(
    {
      searchResults: await getAnimeSearch(keyword, page, 20),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.search },
    },
  );
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
    <NavLink
      to={`/search/anime/${match.params.animeKeyword}`}
      aria-label={match.params.animeKeyword}
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
          {match.params.animeKeyword}
        </Badge>
      )}
    </NavLink>
  ),
};

const SearchRoute = () => {
  const { searchResults } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const onSubmit = (value: string) => {
    navigate(`/search/anime/${value}`);
  };
  return (
    <div className="w-full flex justify-center flex-col items-center px-3 sm:px-0">
      <SearchForm
        onSubmit={onSubmit}
        textOnButton={t('search.action')}
        textHelper={t('search.helper.anime')}
        textPlaceHolder={t('search.placeHolder.anime')}
      />
      {searchResults && searchResults.results && searchResults.results.length > 0 && (
        <MediaList
          hasNextPage={searchResults.hasNextPage || false}
          items={searchResults.results as IMedia[]}
          itemsType="anime"
          listName={t('search.searchResults')}
          listType="grid"
          loadingType="scroll"
          routeName={location.pathname}
          virtual
        />
      )}
    </div>
  );
};

export default SearchRoute;
