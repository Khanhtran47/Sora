import { type RouteMatch } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { loader as tvSeasonIdLoader } from '~/routes/tv-shows.$tvId_.season.$seasonId';
import type { IEpisode } from '~/services/tmdb/tmdb.types';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import ListEpisodes from '~/components/elements/shared/ListEpisodes';

export const meta = mergeMeta<
  null,
  { 'routes/tv-shows.$tvId_.season.$seasonId': typeof tvSeasonIdLoader }
>(({ params, matches }) => {
  const tvSeasonData = matches.find(
    (match) => match.id === 'routes/tv-shows.$tvId_.season.$seasonId',
  )?.data;
  if (!tvSeasonData?.seasonDetail) {
    return [
      { title: 'Missing Season' },
      { name: 'description', content: `There is no season with the ID: ${params.seasonId}` },
    ];
  }
  const { detail, seasonDetail } = tvSeasonData;
  const { name } = detail || {};
  return [
    { title: `Sora - ${name} ${seasonDetail?.name || ''}` },
    {
      property: 'og:url',
      content: `https://sorachill.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/`,
    },
    { property: 'og:title', content: `Sora - ${name} ${seasonDetail?.name || ''}` },
    { name: 'twitter:title', content: `Sora - ${name} ${seasonDetail?.name || ''}` },
  ];
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <BreadcrumbItem
      to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/`}
      key={`tv-shows-${match.params.tvId}-season-${match.params.seasonId}-episodes`}
    >
      Episodes
    </BreadcrumbItem>
  ),
};

const Episodes = () => {
  const seasonData = useTypedRouteLoaderData('routes/tv-shows.$tvId_.season.$seasonId');
  const seasonDetail = seasonData && seasonData.seasonDetail;
  const detail = seasonData && seasonData.detail;
  return (
    <div className="flex w-full flex-col items-center justify-center px-3 sm:w-2/3 sm:px-5">
      <ListEpisodes
        type="tv"
        id={detail?.id}
        episodes={seasonDetail?.episodes as unknown as IEpisode[]}
        season={seasonDetail?.season_number}
        providers={seasonData?.providers || []}
      />
    </div>
  );
};

export default Episodes;
