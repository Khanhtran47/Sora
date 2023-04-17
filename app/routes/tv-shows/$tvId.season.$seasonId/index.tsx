import { Row, Col } from '@nextui-org/react';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import ListEpisodes from '~/components/elements/shared/ListEpisodes';
import type { IEpisode } from '~/services/tmdb/tmdb.types';

const Episodes = () => {
  const seasonData = useTypedRouteLoaderData('routes/tv-shows/$tvId.season.$seasonId');
  const seasonDetail = seasonData && seasonData.seasonDetail;
  const detail = seasonData && seasonData.detail;
  return (
    <Row
      fluid
      align="stretch"
      justify="center"
      css={{
        marginTop: '0.75rem',
        padding: '0 0.75rem',
        '@xs': {
          padding: '0 3vw',
        },
        '@sm': {
          padding: '0 6vw',
        },
        '@md': {
          padding: '0 12vw',
        },
      }}
    >
      <Col css={{ width: '100%', '@xs': { width: '66.6667%' } }}>
        <ListEpisodes
          type="tv"
          id={detail?.id}
          episodes={seasonDetail?.episodes as unknown as IEpisode[]}
          season={seasonDetail?.season_number}
          providers={seasonData?.providers || []}
        />
      </Col>
    </Row>
  );
};

export default Episodes;
