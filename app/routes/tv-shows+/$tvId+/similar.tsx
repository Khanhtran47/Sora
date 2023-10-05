import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { useTranslation } from 'react-i18next';

import type { Handle } from '~/types/handle';
import type { loader as tvIdLoader } from '~/routes/tv-shows+/$tvId';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getSimilar } from '~/services/tmdb/tmdb.server';
import type { ITvShowDetail } from '~/services/tmdb/tmdb.types';
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
      { title: `Sora - ${name} - Similar` },
      { property: 'og:title', content: `Sora - ${name} - Similar` },
      {
        property: 'og:url',
        content: `https://sorachill.vercel.app/tv-shows/${params.tvId}/similar`,
      },
      { property: 'twitter:title', content: `Sora - ${name} - Similar` },
    ];
  },
);

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <BreadcrumbItem
      to={`/tv-shows/${match.params.tvId}/similar`}
      key={`tv-shows-${match.params.tvId}-similar`}
    >
      {t('similar')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ parentMatch, t }) => ({
    title: parentMatch ? (parentMatch?.data as { detail: ITvShowDetail })?.detail?.name || '' : '',
    subtitle: t('similar'),
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

const TvSimilarPage = () => {
  const { similar } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const { t } = useTranslation();

  return (
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-y-4 px-3 sm:px-3.5 xl:px-4 2xl:px-5">
      <MediaList
        // @ts-expect-error
        currentPage={similar?.page}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        // @ts-expect-error
        items={similar?.items}
        itemsType="tv"
        listName={t('similar-tv-shows')}
        listType="grid"
        scrollToTopListAfterChangePage
        showListTypeChangeButton
        // @ts-expect-error
        totalPages={similar?.totalPages}
      />
    </div>
  );
};

export default TvSimilarPage;
