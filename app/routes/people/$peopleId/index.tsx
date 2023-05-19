/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Spacer } from '@nextui-org/react';
import type { MetaFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';

import type { IMedia } from '~/types/media';
import type { IPeople } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/people/${params.peopleId}/`,
});

const OverviewPage = () => {
  const peopleData = useTypedRouteLoaderData('routes/people/$peopleId');
  const rootData = useTypedRouteLoaderData('root');
  const fetcher = useFetcher();
  const [knownFor, setKnownFor] = useState<IMedia[]>();
  useEffect(() => {
    if (peopleData?.detail?.name) {
      fetcher.load(`/search/people/${peopleData?.detail?.name}`);
    }
  }, [peopleData]);
  useEffect(() => {
    if (fetcher.data && fetcher.data.searchResults) {
      const { items } = fetcher.data.searchResults;
      const peopleFound = items.find((result: IPeople) => result.id === peopleData?.detail?.id);
      setKnownFor(TMDB.postFetchDataHandler(peopleFound?.knownFor));
    }
  }, [fetcher.data]);
  return (
    <>
      {peopleData?.detail?.biography ? (
        <>
          <div className="flex flex-col gap-y-2">
            <h4>Biography</h4>
            <p style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
              {/* TODO: add a read more button */}
              {peopleData?.detail?.biography}
            </p>
          </div>
          <Spacer y={1.5} />
        </>
      ) : null}
      {knownFor && knownFor.length > 0 ? (
        <>
          <h4>Known For</h4>
          <Spacer y={0.5} />
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={knownFor}
            itemsType="movie-tv"
            listType="slider-card"
          />
        </>
      ) : null}
    </>
  );
};

export default OverviewPage;
