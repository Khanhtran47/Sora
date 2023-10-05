import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import type { loader as tvIdLoader } from '~/routes/tv-shows+/$tvId';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getRecommendation } from '~/services/tmdb/tmdb.server';
import type { ITvShowDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import { useTypedRouteLoaderData } from '~/utils/react/hooks/useTypedRouteLoaderData';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await authenticate(request, undefined, true);

  const { tvId } = params;
  const mid = Number(tvId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const locale = await i18next.getLocale(request);
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  const recommendations = await getRecommendation('tv', mid, page, locale);
  if (!recommendations) throw new Response('Not Found', { status: 404 });

  return json(
    {
      recommendations,
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta = mergeMeta<typeof loader, { 'routes/tv-shows+/$tvId': typeof tvIdLoader }>(
  ({ matches, params }) => {
    const tvData = matches.find((match) => match.id === 'routes/tv-shows+/$tvId')?.data;
    if (!tvData) {
      return [
        { title: 'Missing Tv show' },
        { name: 'description', content: `There is no tv show with ID: ${params.tvId}` },
      ];
    }
    const { detail } = tvData;
    const { name } = detail || {};
    return [
      { title: `Sora - ${name} - Recommendations` },
      { property: 'og:title', content: `Sora - ${name} - Recommendations` },
      {
        property: 'og:url',
        content: `https://sorachill.vercel.app/tv-shows/${params.tvId}/recommendations`,
      },
      { property: 'twitter:title', content: `Sora - ${name} - Recommendations` },
    ];
  },
);

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <BreadcrumbItem
      to={`/tv-shows/${match.params.tvId}/recommendations`}
      key={`tv-shows-${match.params.tvId}-recommendations`}
    >
      {t('recommendations')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ parentMatch, t }) => ({
    title: parentMatch ? (parentMatch?.data as { detail: ITvShowDetail })?.detail?.name || '' : '',
    subtitle: t('recommendations'),
    showImage: parentMatch
      ? (parentMatch?.data as { detail: ITvShowDetail })?.detail?.poster_path !== undefined
      : false,
    imageUrl: TMDB?.posterUrl(
      parentMatch
        ? (parentMatch?.data as { detail: ITvShowDetail })?.detail?.poster_path || ''
        : '',
      'w92',
    ),
  }),
  showListViewChangeButton: true,
};

const TvRecommendationsPage = () => {
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
        // @ts-expect-error
        items={recommendations?.items}
        itemsType="tv"
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

export default TvRecommendationsPage;
