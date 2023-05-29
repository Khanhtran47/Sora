import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, type RouteMatch } from '@remix-run/react';

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
  return json({ episodes }, { headers: { 'Cache-Control': CACHE_CONTROL.episode } });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}/episodes`,
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <BreadcrumbItem
      to={`/anime/${match.params.animeId}/episodes`}
      key={`anime-${match.params.animeId}-episodes`}
    >
      Episodes
    </BreadcrumbItem>
  ),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  miniTitle: (match: RouteMatch, parentMatch?: RouteMatch) => ({
    title:
      parentMatch?.data?.detail?.title?.userPreferred ||
      parentMatch?.data?.detail?.title?.english ||
      parentMatch?.data?.detail?.title?.romaji ||
      parentMatch?.data?.detail?.title?.native ||
      '',
    subtitle: 'Episodes',
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
  const animeData = useTypedRouteLoaderData('routes/anime/$animeId');
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
