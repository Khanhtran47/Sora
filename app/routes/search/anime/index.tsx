import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, NavLink } from '@remix-run/react';
import { Badge } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { getAnimeTrending } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';

import type { IMedia } from '~/types/media';

import MediaList from '~/components/media/MediaList';
import SearchForm from '~/components/elements/SearchForm';

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;

  return json(
    {
      items: await getAnimeTrending(page, 20),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.trending },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/search/anime" aria-label="Search Anime">
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
          Search Anime
        </Badge>
      )}
    </NavLink>
  ),
};

const SearchRoute = () => {
  const { items } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = (value: string) => {
    navigate(`/search/anime/${value}`);
  };
  return (
    <div className="flex w-full flex-col items-center justify-center px-3 sm:px-0">
      <SearchForm
        onSubmit={onSubmit}
        textOnButton={t('search.action')}
        textHelper={t('search.helper.anime')}
        textPlaceHolder={t('search.placeHolder.anime')}
      />
      {items && items.results && items.results.length > 0 && (
        <MediaList
          hasNextPage={items.hasNextPage || false}
          items={items.results as IMedia[]}
          itemsType="anime"
          listName="Trending Anime"
          listType="grid"
          loadingType="scroll"
          routeName="/anime/trending"
          virtual
        />
      )}
    </div>
  );
};

export default SearchRoute;
