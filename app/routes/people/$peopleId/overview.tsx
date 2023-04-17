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
import { H4, P } from '~/components/styles/Text.styles';

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/people/${params.peopleId}/overview`,
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
            <H4 h4 weight="bold">
              Biography
            </H4>
            <P css={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
              {/* TODO: add a read more button */}
              {peopleData?.detail?.biography}
            </P>
          </div>
          <Spacer y={1.5} />
        </>
      ) : null}
      {/* TODO: add a loading when "known for" part is loading */}
      {knownFor && knownFor.length > 0 ? (
        <>
          <H4 h4 weight="bold">
            Known For
          </H4>
          <Spacer y={0.5} />
          <MediaList
            listType="slider-card"
            items={knownFor}
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
          />
        </>
      ) : null}
    </>
  );
};

export default OverviewPage;
