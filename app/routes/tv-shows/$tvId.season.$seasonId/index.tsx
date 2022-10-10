/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Link } from '@remix-run/react';
import { Row, Col, Spacer, Card, Avatar } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import Image, { MimeType } from 'remix-image';
import { ISeasonDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import useMediaQuery from '~/hooks/useMediaQuery';
import { H2, H4, H5, H6 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';
import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

const Episodes = () => {
  const seasonData: { detail: ISeasonDetail } | undefined = useRouteData(
    'routes/tv-shows/$tvId.season.$seasonId',
  );
  const detail = seasonData && seasonData.detail;

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
      <Col span={isSm ? 12 : 8}>
        {detail?.episodes && detail.episodes.length > 0 && (
          <>
            <H2 h2 css={{ margin: '20px 0 20px 0' }}>
              Episodes
            </H2>
            {detail.episodes.map((episode) => (
              <Link
                key={episode.id}
                to={`/tv-shows/${episode.show_id}/season/${episode.season_number}/episode/${episode.episode_number}`}
              >
                <Card
                  as="div"
                  isHoverable
                  isPressable
                  css={{
                    maxHeight: '127px !important',
                    borderWidth: 0,
                    filter: 'var(--nextui-dropShadows-md)',
                  }}
                  role="figure"
                >
                  <Card.Body
                    css={{
                      p: 0,
                      flexFlow: 'row nowrap',
                      justifyContent: 'flex-start',
                    }}
                  >
                    {episode?.still_path ? (
                      <Card.Image
                        // @ts-ignore
                        as={Image}
                        src={TMDB.posterUrl(episode?.still_path, 'w185')}
                        objectFit="cover"
                        width="227px"
                        height="100%"
                        alt={episode?.name}
                        title={episode?.name}
                        css={{
                          minWidth: '227px !important',
                          minHeight: '127px !important',
                        }}
                        loaderUrl="/api/image"
                        placeholder="blur"
                        options={{
                          contentType: MimeType.WEBP,
                        }}
                        containerCss={{ margin: 0, minWidth: '227px' }}
                        responsive={[
                          {
                            size: {
                              width: 227,
                              height: 127,
                            },
                          },
                        ]}
                      />
                    ) : (
                      <Avatar
                        icon={<PhotoIcon width={48} height={48} />}
                        pointer
                        css={{
                          minWidth: '227px !important',
                          minHeight: '127px !important',
                          size: '$20',
                          borderRadius: '0 !important',
                        }}
                      />
                    )}
                    <Flex direction="column" justify="start" css={{ p: '1rem' }}>
                      <H4 h4>
                        Episode{' '}
                        {isSm
                          ? `${episode?.episode_number}`
                          : `${episode?.episode_number}: ${episode?.name}`}
                      </H4>
                      {!isSm && (
                        <>
                          <Spacer y={0.25} />
                          <Row align="center">
                            <H5
                              h5
                              weight="bold"
                              css={{
                                backgroundColor: '#3ec2c2',
                                borderRadius: '$xs',
                                padding: '0 0.25rem 0 0.25rem',
                                marginRight: '0.5rem',
                              }}
                            >
                              TMDb
                            </H5>
                            <H5 h5 weight="bold">
                              {episode?.vote_average.toFixed(1)}
                            </H5>
                            <Spacer x={0.5} />
                            <H5 h5>
                              {episode.air_date} | {episode?.runtime} min
                            </H5>
                          </Row>
                          <Spacer y={0.25} />
                          <H6 h6 className="!line-clamp-1">
                            {episode.overview}
                          </H6>
                        </>
                      )}
                    </Flex>
                  </Card.Body>
                </Card>
                <Spacer y={1} />
              </Link>
            ))}
          </>
        )}
      </Col>
    </Row>
  );
};

export default Episodes;
