import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, type RouteMatch } from '@remix-run/react';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getSimilar } from '~/services/tmdb/tmdb.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { tvId } = params;
  const mid = Number(tvId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  const similar = await getSimilar('tv', mid, page, locale);
  if (!similar) throw new Response('Not Found', { status: 404 });

  return json(
    {
      similar,
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/similar`,
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink to={`/tv-shows/${match.params.tvId}/similar`} aria-label="Similar Tv">
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
          Similar
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: (_match: RouteMatch, parentMatch: RouteMatch) => ({
    title: parentMatch.data?.detail?.name,
    subtitle: 'Similar',
    showImage: parentMatch.data?.detail?.poster_path !== undefined,
    imageUrl: TMDB?.posterUrl(parentMatch.data?.detail?.poster_path || '', 'w92'),
  }),
  showListViewChangeButton: true,
};

const TvSimilarPage = () => {
  const { similar } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');

  return (
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-y-4 px-3 sm:px-3.5 xl:px-4 2xl:px-5">
      {similar && similar.items && similar.items.length > 0 ? (
        <MediaList
          currentPage={similar?.page}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          items={similar.items}
          itemsType="tv"
          listName="Similar Tv Shows"
          listType="grid"
          scrollToTopListAfterChangePage
          showListTypeChangeButton
          totalPages={similar?.totalPages}
        />
      ) : null}
    </div>
  );
};

export default TvSimilarPage;
