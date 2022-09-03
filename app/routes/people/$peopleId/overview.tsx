/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { Text, Row, Spacer } from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import { useRouteData } from 'remix-utils';

import { IPeopleDetail, IMedia, IPeople } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import MediaList from '~/src/components/Media/MediaList';

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
  const fetcher = useFetcher();
  const [knownFor, setKnownFor] = React.useState<IMedia[]>();
  React.useEffect(() => {
    peopleData?.detail?.name && fetcher.load(`/search/people/${peopleData?.detail?.name}`);
  }, [peopleData]);
  React.useEffect(() => {
    if (fetcher.data && fetcher.data.searchResults) {
      const { results } = fetcher.data.searchResults;
      const peopleFound = results.find((result: IPeople) => result.id === peopleData?.detail?.id);
      setKnownFor(TMDB.postFetchDataHandler(peopleFound?.known_for));
    }
  }, [fetcher.data]);
  return (
    <>
      {peopleData?.detail?.biography && (
        <>
          <Row justify="flex-start" fluid>
            <Text
              h4
              size={14}
              css={{
                whiteSpace: 'pre-line',
                textAlign: 'justify',
                margin: 0,
                '@xs': {
                  fontSize: '16px',
                },
                '@sm': {
                  fontSize: '18px',
                },
                '@md': {
                  fontSize: '20px',
                },
              }}
            >
              <strong>Biography</strong>
              <br />
              {/* TODO: add a read more button */}
              {peopleData?.detail?.biography}
            </Text>
          </Row>
          <Spacer y={1} />
        </>
      )}
      {/* TODO: add a loading when "known for" part is loading */}
      {knownFor && (
        <>
          <Row justify="flex-start" fluid>
            <Text
              h4
              size={14}
              css={{
                margin: 0,
                '@xs': {
                  fontSize: '16px',
                },
                '@sm': {
                  fontSize: '18px',
                },
                '@md': {
                  fontSize: '20px',
                },
              }}
            >
              <strong>Known For</strong>
            </Text>
          </Row>
          <Spacer y={0.5} />
          <MediaList listType="slider-card" items={knownFor} />
        </>
      )}
    </>
  );
};

export default OverviewPage;
