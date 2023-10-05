import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import type { loader as movieIdLoader } from '~/routes/movies+/$movieId';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getRecommendation } from '~/services/tmdb/tmdb.server';
import type { IMovieDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import { useTypedRouteLoaderData } from '~/utils/react/hooks/useTypedRouteLoaderData';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
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

export const meta = mergeMeta<typeof loader, { 'routes/movies+/$movieId': typeof movieIdLoader }>(
  ({ params, matches }) => {
    const movieData = matches.find((match) => match.id === 'routes/movies+/$movieId')?.data;
    if (!movieData) {
      return [
        { title: 'Missing Movie' },
        { name: 'description', content: `There is no movie with the ID: ${params.movieId}` },
      ];
    }
    const { detail } = movieData;
    const { title } = detail || {};
    const movieTitle = title || '';
    return [
      { title: `Sora - ${movieTitle} - Recommendations` },
      {
        property: 'og:url',
        content: `https://sorachill.vercel.app/movies/${params.movieId}/recommendations`,
      },
      { property: 'og:title', content: `Sora - ${movieTitle} - Recommendations` },
      { name: 'twitter:title', content: `Sora - ${movieTitle} - Recommendations` },
    ];
  },
);

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <BreadcrumbItem
      to={`/movies/${match.params.movieId}/recommendations`}
      key={`movies-${match.params.movieId}-recommendations`}
    >
      {t('recommendations')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ parentMatch, t }) => ({
    title: parentMatch ? (parentMatch.data as { detail: IMovieDetail })?.detail?.title || '' : '',
    subtitle: t('recommendations'),
    showImage: parentMatch
      ? (parentMatch.data as { detail: IMovieDetail })?.detail?.poster_path !== undefined
      : false,
    imageUrl: parentMatch
      ? TMDB?.posterUrl(
          (parentMatch.data as { detail: IMovieDetail })?.detail?.poster_path || '',
          'w92',
        )
      : undefined,
  }),
  showListViewChangeButton: true,
};

const MovieRecommendationsPage = () => {
  const { recommendations } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const { t } = useTranslation();

  return (
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-y-4 px-3 sm:px-3.5 xl:px-4 2xl:px-5">
      <MediaList
        // @ts-expect-error
        currentPage={recommendations?.page}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        itemsType="movie"
        // @ts-expect-error
        items={recommendations?.items}
        listName={t('recommendations')}
        listType="grid"
        scrollToTopListAfterChangePage
        showListTypeChangeButton
        // @ts-expect-error
        totalPages={recommendations?.totalPages}
      />
    </div>
  );
};

export default MovieRecommendationsPage;
