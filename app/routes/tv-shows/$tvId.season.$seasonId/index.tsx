/* eslint-disable @typescript-eslint/indent */
import { Row, Col } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';

import { ISeasonDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import useMediaQuery from '~/hooks/useMediaQuery';

import ListEpisodes from '~/src/components/elements/shared/ListEpisodes';

const Episodes = () => {
  const seasonData:
    | {
        detail: ITvShowDetail;
        seasonDetail: ISeasonDetail;
        providers: {
          id?: string | number | null;
          provider: string;
          episodesCount?: number;
        }[];
      }
    | undefined = useRouteData('routes/tv-shows/$tvId.season.$seasonId');
  const seasonDetail = seasonData && seasonData.seasonDetail;
  const detail = seasonData && seasonData.detail;
  const isSm = useMediaQuery('(max-width: 650px)');
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
      <Col span={isSm ? 12 : 8}>
        <ListEpisodes
          type="tv"
          id={detail?.id}
          episodes={seasonDetail?.episodes}
          season={seasonDetail?.season_number}
          providers={seasonData?.providers || [{ provider: 'Embed' }]}
        />
      </Col>
    </Row>
  );
};

export default Episodes;
