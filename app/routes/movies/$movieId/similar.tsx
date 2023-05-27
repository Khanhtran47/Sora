import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, type RouteMatch } from '@remix-run/react';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getSimilar } from '~/services/tmdb/tmdb.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

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

  const similar = await getSimilar('movie', mid, page, locale);
  if (!similar) throw new Response('Not Found', { status: 404 });

  return json(
    { similar },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}/similar`,
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <BreadcrumbItem
      to={`/movies/${match.params.movieId}/similar`}
      key={`movies-${match.params.movieId}-similar`}
    >
      Similar
    </BreadcrumbItem>
  ),
  miniTitle: (_match: RouteMatch, parentMatch: RouteMatch) => ({
    title: parentMatch.data?.detail?.title,
    subtitle: 'Similar',
    showImage: parentMatch.data?.detail?.poster_path !== undefined,
    imageUrl: TMDB?.posterUrl(parentMatch.data?.detail?.poster_path || '', 'w92'),
  }),
  showListViewChangeButton: true,
};

const MovieSimilarPage = () => {
  const { similar } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');

  return (
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-y-4 px-3 sm:px-3.5 xl:px-4 2xl:px-5">
      <MediaList
        currentPage={similar?.page}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        items={similar?.items}
        itemsType="movie"
        listName="Similar Movies"
        listType="grid"
        scrollToTopListAfterChangePage
        showListTypeChangeButton
        totalPages={similar?.totalPages}
      />
    </div>
  );
};

export default MovieSimilarPage;
