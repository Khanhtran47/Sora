/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { Row, Col, Spacer, Divider } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import { IAnimeInfo } from '~/services/consumet/anilist/anilist.types';
import AnimeList from '~/src/components/anime/AnimeList';
import { H5, H6 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';
import useMediaQuery from '~/hooks/useMediaQuery';

const Overview = () => {
  const animeData: { detail: IAnimeInfo } | undefined = useRouteData('routes/anime/$animeId');
  const detail = animeData && animeData.detail;
  const isSm = useMediaQuery(650, 'max');
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
      {!isSm && (
        <Col span={4}>
          {detail?.nextAiringEpisode && (
            <Flex direction="column" justify="center" align="center">
              <H5
                h5
                weight="bold"
                css={{
                  marginBottom: '0.25rem !important',
                  width: '50%',
                }}
              >
                Airing
              </H5>
              <H6
                h6
                css={{
                  width: '50%',
                }}
              >
                {`Ep${detail?.nextAiringEpisode?.episode}: ${detail?.nextAiringEpisode?.timeUntilAiring}`}
              </H6>
              <Spacer y={1} />
            </Flex>
          )}
          {detail?.totalEpisodes && (
            <Flex direction="column" justify="center" align="center">
              <H5
                h5
                weight="bold"
                css={{
                  marginBottom: '0.25rem !important',
                  width: '50%',
                }}
              >
                Episodes
              </H5>
              <H6
                h6
                css={{
                  width: '50%',
                }}
              >
                {detail?.totalEpisodes}
              </H6>
              <Spacer y={1} />
            </Flex>
          )}
          {detail?.duration && (
            <Flex direction="column" justify="center" align="center">
              <H5
                h5
                weight="bold"
                css={{
                  marginBottom: '0.25rem !important',
                  width: '50%',
                }}
              >
                Episode Duration
              </H5>
              <H6
                h6
                css={{
                  width: '50%',
                }}
              >
                {detail?.duration}
              </H6>
              <Spacer y={1} />
            </Flex>
          )}
          {detail?.status && (
            <Flex direction="column" justify="center" align="center">
              <H5
                h5
                weight="bold"
                css={{
                  marginBottom: '0.25rem !important',
                  width: '50%',
                }}
              >
                Status
              </H5>
              <H6
                h6
                css={{
                  width: '50%',
                }}
              >
                {detail?.status}
              </H6>
              <Spacer y={1} />
            </Flex>
          )}
          {detail?.startDate && (
            <Flex direction="column" justify="center" align="center">
              <H5
                h5
                weight="bold"
                css={{
                  marginBottom: '0.25rem !important',
                  width: '50%',
                }}
              >
                Start Date
              </H5>
              <H6
                h6
                css={{
                  width: '50%',
                }}
              >
                {`${detail?.startDate?.day}/${detail?.startDate?.month}/${detail?.startDate?.year}`}
              </H6>
              <Spacer y={1} />
            </Flex>
          )}
          {detail?.endDate && (
            <Flex direction="column" justify="center" align="center">
              <H5
                h5
                weight="bold"
                css={{
                  marginBottom: '0.25rem !important',
                  width: '50%',
                }}
              >
                End Date
              </H5>
              <H6
                h6
                css={{
                  width: '50%',
                }}
              >
                {`${detail?.endDate?.day}/${detail?.endDate?.month}/${detail?.endDate?.year}`}
              </H6>
              <Spacer y={1} />
            </Flex>
          )}
          {detail?.countryOfOrigin && (
            <Flex direction="column" justify="center" align="center">
              <H5
                h5
                weight="bold"
                css={{
                  marginBottom: '0.25rem !important',
                  width: '50%',
                }}
              >
                Country of Origin
              </H5>
              <H6
                h6
                css={{
                  width: '50%',
                }}
              >
                {detail?.countryOfOrigin}
              </H6>
              <Spacer y={1} />
            </Flex>
          )}
          {detail?.popularity && (
            <Flex direction="column" justify="center" align="center">
              <H5
                h5
                weight="bold"
                css={{
                  marginBottom: '0.25rem !important',
                  width: '50%',
                }}
              >
                Popularity
              </H5>
              <H6
                h6
                css={{
                  width: '50%',
                }}
              >
                {detail?.popularity}
              </H6>
              <Spacer y={1} />
            </Flex>
          )}
          {detail?.studios && (
            <Flex direction="column" justify="center" align="center">
              <H5
                h5
                weight="bold"
                css={{
                  marginBottom: '0.25rem !important',
                  width: '50%',
                }}
              >
                Studios
              </H5>
              {detail?.studios.map((studio, index) => (
                <H6
                  key={index}
                  h6
                  css={{
                    width: '50%',
                  }}
                >
                  {studio}
                </H6>
              ))}
              <Spacer y={1} />
            </Flex>
          )}
          {detail?.synonyms && (
            <Flex direction="column" justify="center" align="center">
              <H5
                h5
                weight="bold"
                css={{
                  marginBottom: '0.25rem !important',
                  width: '50%',
                }}
              >
                Synonyms
              </H5>
              {detail?.synonyms.map((synonym, index) => (
                <H6
                  key={index}
                  h6
                  css={{
                    width: '50%',
                  }}
                >
                  {synonym}
                </H6>
              ))}
              <Spacer y={1} />
            </Flex>
          )}
        </Col>
      )}
      <Col span={isSm ? 12 : 8}>
        <Row>
          <H6
            h6
            css={{ textAlign: 'justify' }}
            dangerouslySetInnerHTML={{ __html: detail?.description || '' }}
          />
        </Row>
        <Spacer y={1} />
        <Divider x={1} css={{ m: 0 }} />
        {detail?.recommendations && detail?.recommendations.length > 0 && (
          <>
            <AnimeList
              listType="slider-card"
              items={detail?.recommendations}
              listName="Recommendations"
              navigationButtons
            />
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
            <Spacer y={1} />
          </>
        )}
      </Col>
    </Row>
  );
};

export default Overview;
