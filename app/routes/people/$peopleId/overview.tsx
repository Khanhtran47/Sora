/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { MetaFunction } from '@remix-run/node';
import { Row, Spacer } from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { IPeopleDetail, IPeople } from '~/services/tmdb/tmdb.types';
import { IMedia } from '~/types/media';
import TMDB from '~/utils/media';
import MediaList from '~/components/media/MediaList';
import { H6 } from '~/components/styles/Text.styles';

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/people/${params.peopleId}/overview`,
});

const OverviewPage = () => {
  const peopleData:
    | {
        detail: IPeopleDetail;
        externalIds: {
          facebookId: null | string;
          instagramId: string | null;
          twitterId: null | string;
        };
      }
    | undefined = useRouteData('routes/people/$peopleId');
  const rootData:
    | {
        user?: User;
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const fetcher = useFetcher();
  const [knownFor, setKnownFor] = React.useState<IMedia[]>();
  React.useEffect(() => {
    peopleData?.detail?.name && fetcher.load(`/search/people/${peopleData?.detail?.name}`);
  }, [peopleData]);
  React.useEffect(() => {
    if (fetcher.data && fetcher.data.searchResults) {
      const { items } = fetcher.data.searchResults;
      const peopleFound = items.find((result: IPeople) => result.id === peopleData?.detail?.id);
      setKnownFor(TMDB.postFetchDataHandler(peopleFound?.knownFor));
    }
  }, [fetcher.data]);
  return (
    <>
      {peopleData?.detail?.biography && (
        <>
          <Row justify="flex-start" fluid>
            <H6 h6 css={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
              <strong>Biography</strong>
              <br />
              {/* TODO: add a read more button */}
              {peopleData?.detail?.biography}
            </H6>
          </Row>
          <Spacer y={1} />
        </>
      )}
      {/* TODO: add a loading when "known for" part is loading */}
      {knownFor && (
        <>
          <Row justify="flex-start" fluid>
            <H6 h6>
              <strong>Known For</strong>
            </H6>
          </Row>
          <Spacer y={0.5} />
          <MediaList
            listType="slider-card"
            items={knownFor}
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
          />
        </>
      )}
    </>
  );
};

export default OverviewPage;
