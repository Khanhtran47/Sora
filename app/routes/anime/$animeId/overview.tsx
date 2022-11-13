/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { MetaFunction } from '@remix-run/node';
import { Row, Col, Spacer, Divider, Card, Avatar, Grid } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import Image, { MimeType } from 'remix-image';

import useMediaQuery from '~/hooks/useMediaQuery';
import { IAnimeInfo } from '~/services/consumet/anilist/anilist.types';

import AnimeList from '~/src/components/anime/AnimeList';
import { H3, H5, H6 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}/overview`,
});

const Overview = () => {
  const animeData: { detail: IAnimeInfo } | undefined = useRouteData('routes/anime/$animeId');
  const detail = animeData && animeData.detail;
  const isSm = useMediaQuery('(max-width: 650px)');
  return (
    <Row
      fluid
      align="stretch"
      justify="center"
      css={{
        marginTop: '0.75rem',
        padding: '20px',
        maxWidth: '1920px',
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
        {detail?.relations && detail.relations.length > 0 && (
          <>
            <H3 h3 css={{ margin: '20px 0 20px 0' }}>
              Relations
            </H3>
            <Grid.Container gap={1}>
              {detail.relations.map((relation) => (
                <Grid key={relation.id} xs={6} sm={2.4} xl>
                  <Card
                    as="div"
                    isHoverable
                    isPressable
                    css={{
                      maxWidth: '120px !important',
                      maxHeight: '187px !important',
                      borderWidth: 0,
                      filter: 'var(--nextui-dropShadows-md)',
                    }}
                    role="figure"
                  >
                    <Card.Body css={{ p: 0 }}>
                      {relation.image ? (
                        <Card.Image
                          // @ts-ignore
                          as={Image}
                          src={relation.image || ''}
                          objectFit="cover"
                          width="100%"
                          height="auto"
                          alt={
                            relation.title?.userPreferred ||
                            relation.title?.english ||
                            relation.title?.romaji ||
                            relation.title?.native
                          }
                          title={
                            relation.title?.userPreferred ||
                            relation.title?.english ||
                            relation.title?.romaji ||
                            relation.title?.native
                          }
                          css={{
                            minWidth: '120px !important',
                            minHeight: '187px !important',
                          }}
                          loaderUrl="/api/image"
                          placeholder="blur"
                          options={{
                            contentType: MimeType.WEBP,
                          }}
                          responsive={[
                            {
                              size: {
                                width: 164,
                                height: 245,
                              },
                              maxWidth: 650,
                            },
                            {
                              size: {
                                width: 210,
                                height: 357,
                              },
                              maxWidth: 1280,
                            },
                            {
                              size: {
                                width: 240,
                                height: 410,
                              },
                            },
                          ]}
                        />
                      ) : (
                        <Avatar
                          icon={<PhotoIcon width={48} height={48} />}
                          pointer
                          css={{
                            minWidth: '120px !important',
                            minHeight: '187px !important',
                            size: '$20',
                            borderRadius: '0 !important',
                          }}
                        />
                      )}
                    </Card.Body>
                    <Card.Footer
                      className="backdrop-blur-md"
                      css={{
                        position: 'absolute',
                        backgroundColor: '$backgroundAlpha',
                        borderTop: '$borderWeights$light solid $border',
                        bottom: 0,
                        zIndex: 1,
                        justifyContent: 'center',
                      }}
                    >
                      <H6 h6>{relation.relationType}</H6>
                    </Card.Footer>
                  </Card>
                </Grid>
              ))}
            </Grid.Container>
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
          </>
        )}
        {detail?.characters && detail.characters.length > 0 && (
          <>
            <H3 h3 css={{ margin: '20px 0 20px 0' }}>
              Characters
            </H3>
            <Grid.Container gap={1}>
              {detail.characters.slice(0, 12).map((character) => (
                <Grid key={character.id} xs={12} md={6}>
                  <Card
                    as="div"
                    isHoverable
                    isPressable
                    css={{
                      maxHeight: '80px !important',
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
                      <Flex justify="start" css={{ flexGrow: 1, columnGap: '0.5rem' }}>
                        {character?.image ? (
                          <Card.Image
                            // @ts-ignore
                            as={Image}
                            src={character.image}
                            objectFit="cover"
                            width="60px"
                            height="100%"
                            alt={character?.name?.full}
                            title={character?.name?.full}
                            css={{
                              minWidth: '60px !important',
                              minHeight: '80px !important',
                            }}
                            loaderUrl="/api/image"
                            placeholder="blur"
                            options={{
                              contentType: MimeType.WEBP,
                            }}
                            containerCss={{ margin: 0, minWidth: '60px', flexBasis: '60px' }}
                            responsive={[
                              {
                                size: {
                                  width: 60,
                                  height: 80,
                                },
                              },
                            ]}
                          />
                        ) : (
                          <Avatar
                            icon={<PhotoIcon width={48} height={48} />}
                            pointer
                            css={{
                              minWidth: '60px !important',
                              minHeight: '80px !important',
                              size: '$20',
                              borderRadius: '0 !important',
                              flexBasis: '60px',
                            }}
                          />
                        )}
                        <Flex
                          direction="column"
                          justify="center"
                          align="start"
                          css={{ p: '0.25rem' }}
                        >
                          <H5 h5>{character.name?.full}</H5>
                          <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold' }}>
                            {character.role}
                          </H6>
                        </Flex>
                      </Flex>
                      <Flex justify="end" css={{ flexGrow: 1, columnGap: '0.5rem' }}>
                        {character?.voiceActors && character?.voiceActors.length > 0 && (
                          <Flex
                            direction="column"
                            justify="center"
                            align="end"
                            css={{ p: '0.25rem' }}
                          >
                            <H5 h5>{character.voiceActors[0].name?.full}</H5>
                            <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold' }}>
                              Japanese
                            </H6>
                          </Flex>
                        )}
                        {character?.voiceActors && character?.voiceActors[0]?.image ? (
                          <Card.Image
                            // @ts-ignore
                            as={Image}
                            src={character.voiceActors[0]?.image}
                            objectFit="cover"
                            width="60px"
                            height="100%"
                            alt={character.voiceActors[0].name?.full}
                            title={character.voiceActors[0].name?.full}
                            css={{
                              minWidth: '60px !important',
                              minHeight: '80px !important',
                            }}
                            loaderUrl="/api/image"
                            placeholder="blur"
                            options={{
                              contentType: MimeType.WEBP,
                            }}
                            containerCss={{ margin: 0, minWidth: '60px', flexBasis: '60px' }}
                            responsive={[
                              {
                                size: {
                                  width: 60,
                                  height: 80,
                                },
                              },
                            ]}
                          />
                        ) : (
                          <Avatar
                            icon={<PhotoIcon width={48} height={48} />}
                            pointer
                            css={{
                              minWidth: '60px !important',
                              minHeight: '80px !important',
                              size: '$20',
                              borderRadius: '0 !important',
                              flexBasis: '60px',
                            }}
                          />
                        )}
                      </Flex>
                    </Card.Body>
                  </Card>
                </Grid>
              ))}
            </Grid.Container>
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
          </>
        )}
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
