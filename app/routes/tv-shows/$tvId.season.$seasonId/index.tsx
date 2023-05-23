import type { IEpisode } from '~/services/tmdb/tmdb.types';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import ListEpisodes from '~/components/elements/shared/ListEpisodes';

const Episodes = () => {
  const seasonData = useTypedRouteLoaderData('routes/tv-shows/$tvId.season.$seasonId');
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
