import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import type { loader as animeIdLoader } from '~/routes/anime+/$animeId';
import { getAnimeEpisodeInfo } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import ListEpisodes from '~/components/elements/shared/ListEpisodes';

export const loader = async ({ params, request }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const { animeId } = params;
  if (!animeId) throw new Response('Not Found', { status: 404 });

  const episodes = await getAnimeEpisodeInfo(animeId);
  if (!episodes) throw new Response('Not Found', { status: 404 });
  return json(
    {
      episodes: episodes.sort((a, b) => a.number - b.number),
    },
    { headers: { 'Cache-Control': CACHE_CONTROL.episode } },
  );
};

export const meta = mergeMeta<{}, { 'routes/anime+/$animeId': typeof animeIdLoader }>(
  ({ params, matches }) => {
    const animeData = matches.find((match) => match.id === 'routes/anime+/$animeId')?.data;
    if (!animeData) {
      return [
        { title: 'Missing Anime' },
        { name: 'description', content: `There is no anime with the ID: ${params.animeId}` },
      ];
    }
    const { detail } = animeData;
    const { title, description } = detail || {};
    const animeTitle =
      title?.userPreferred || title?.english || title?.romaji || title?.native || '';
    return [
      { title: `Sora - ${animeTitle} - Episodes` },
      {
        name: 'description',
        content: description
          ? description?.replace(/<\/?[^>]+(>|$)/g, '')
          : `Watch ${animeTitle} in Sora`,
      },
      {
        property: 'og:url',
        content: `https://sorachill.vercel.app/anime/${params.animeId}/episodes`,
      },
      { property: 'og:title', content: `Sora - ${animeTitle} - Episodes` },
      {
        property: 'og:description',
        content: description
          ? description?.replace(/<\/?[^>]+(>|$)/g, '')
          : `Watch ${animeTitle} in Sora`,
      },
      { name: 'twitter:title', content: `Sora - ${animeTitle} - Episodes` },
      {
        name: 'twitter:description',
        content: description
          ? description?.replace(/<\/?[^>]+(>|$)/g, '')
          : `Watch ${animeTitle} in Sora`,
      },
    ];
  },
);

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <BreadcrumbItem
      to={`/anime/${match.params.animeId}/episodes`}
      key={`anime-${match.params.animeId}-episodes`}
    >
      {t('episodes')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ parentMatch, t }) => ({
    title:
      parentMatch?.data?.detail?.title?.userPreferred ||
      parentMatch?.data?.detail?.title?.english ||
      parentMatch?.data?.detail?.title?.romaji ||
      parentMatch?.data?.detail?.title?.native ||
      '',
    subtitle: t('episodes'),
    showImage: parentMatch?.data?.detail?.image !== undefined,
    imageUrl: parentMatch?.data?.detail?.image,
  }),
  preventScrollToTop: true,
  disableLayoutPadding: true,
  customHeaderBackgroundColor: true,
  customHeaderChangeColorOnScroll: true,
};

const EpisodesPage = () => {
  const { episodes } = useLoaderData<typeof loader>();
  const animeData = useTypedRouteLoaderData('routes/anime+/$animeId');
  const detail = animeData && animeData.detail;

  return (
    <div className="flex w-full flex-col items-center justify-center px-3 sm:w-2/3 sm:px-5">
      <ListEpisodes
        type="anime"
        id={detail?.id}
        episodes={episodes}
        providers={animeData?.providers || []}
      />
    </div>
  );
};

export default EpisodesPage;
