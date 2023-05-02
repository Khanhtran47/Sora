import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, type RouteMatch } from '@remix-run/react';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getRecommendation } from '~/services/tmdb/tmdb.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  const recommendations = await getRecommendation('movie', mid, page, locale);
  if (!recommendations) throw new Response('Not Found', { status: 404 });

  return json(
    { recommendations },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}/recomendations`,
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink to={`/movies/${match.params.movieId}/recommendations`} aria-label="Recommendations">
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
          Recommendations
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: (_match: RouteMatch, parentMatch: RouteMatch) => ({
    title: parentMatch.data?.detail?.title,
    subtitle: 'Recommendations',
    showImage: parentMatch.data?.detail?.poster_path !== undefined,
    imageUrl: TMDB?.posterUrl(parentMatch.data?.detail?.poster_path || '', 'w92'),
  }),
  showListViewChangeButton: true,
};

const MovieRecommendationsPage = () => {
  const { recommendations } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');

  return (
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-y-4 px-3 sm:px-3.5 xl:px-4 2xl:px-5">
      {recommendations && recommendations.items && recommendations.items.length > 0 ? (
        <MediaList
          currentPage={recommendations.page}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          itemsType="movie"
          items={recommendations.items}
          listName="Recommendations"
          listType="grid"
          scrollToTopListAfterChangePage
          showListTypeChangeButton
          totalPages={recommendations.totalPages}
        />
      ) : null}
    </div>
  );
};

export default MovieRecommendationsPage;
