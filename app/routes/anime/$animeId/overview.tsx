/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { MetaFunction } from '@remix-run/node';
import { Row, Col, Card, Avatar, Grid } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import { useMediaQuery } from '@react-hookz/web';

import { IMedia } from '~/types/media';

import MediaList from '~/components/media/MediaList';
import { H2, H5, H6 } from '~/components/styles/Text.styles';
import Flex from '~/components/styles/Flex.styles';

import PhotoIcon from '~/assets/icons/PhotoIcon';
import { useParams } from '@remix-run/react';

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}/overview`,
});

const Overview = () => {
  const animeData = useTypedRouteLoaderData('routes/anime/$animeId');
  const detail = animeData && animeData.detail;
  const { animeId } = useParams();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  return (
    <Row
      fluid
      align="stretch"
      justify="center"
      css={{
        marginTop: '0.75rem',
        maxWidth: '1920px',
        px: '1.5rem',
        '@xs': {
          px: 'calc(0.75rem + 3vw)',
        },
        '@sm': {
          px: 'calc(0.75rem + 6vw)',
        },
        '@md': {
          px: 'calc(0.75rem + 12vw)',
        },
        '@lg': {
          px: 'calc(0.75rem + 20px)',
        },
      }}
    >
      {!isSm && (
        <Col span={4} css={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Flex
            direction="column"
            align="start"
            justify="center"
            className="space-y-4"
            css={{
              borderRadius: '$lg',
              backgroundColor: '$backgroundContrast',
              width: '50%',
              padding: '$md',
              '@smMax': {
                width: '100%',
              },
              '@mdMax': {
                width: '75%',
              },
            }}
          >
            {detail?.nextAiringEpisode && (
              <Flex direction="column">
                <H5 h5 weight="bold">
                  Airing
                </H5>
                <H6 h6>
                  {`Ep${detail?.nextAiringEpisode?.episode}: ${detail?.nextAiringEpisode?.timeUntilAiring}`}
                </H6>
              </Flex>
            )}
            {detail?.totalEpisodes && (
              <Flex direction="column">
                <H5 h5 weight="bold">
                  Episodes
                </H5>
                <H6 h6>{detail?.totalEpisodes}</H6>
              </Flex>
            )}
            {detail?.duration && (
              <Flex direction="column">
                <H5 h5 weight="bold">
                  Episode Duration
                </H5>
                <H6 h6>{detail?.duration}</H6>
              </Flex>
            )}
            {detail?.status && (
              <Flex direction="column">
                <H5 h5 weight="bold">
                  Status
                </H5>
                <H6 h6>{detail?.status}</H6>
              </Flex>
            )}
            {detail?.startDate && (
              <Flex direction="column">
                <H5 h5 weight="bold">
                  Start Date
                </H5>
                <H6 h6>
                  {`${detail?.startDate?.day}/${detail?.startDate?.month}/${detail?.startDate?.year}`}
                </H6>
              </Flex>
            )}
            {detail?.endDate && (
              <Flex direction="column">
                <H5 h5 weight="bold">
                  End Date
                </H5>
                <H6 h6>
                  {`${detail?.endDate?.day}/${detail?.endDate?.month}/${detail?.endDate?.year}`}
                </H6>
              </Flex>
            )}
            {detail?.countryOfOrigin && (
              <Flex direction="column">
                <H5 h5 weight="bold">
                  Country of Origin
                </H5>
                <H6 h6>{detail?.countryOfOrigin}</H6>
              </Flex>
            )}
            {detail?.popularity && (
              <Flex direction="column">
                <H5 h5 weight="bold">
                  Popularity
                </H5>
                <H6 h6>{detail?.popularity}</H6>
              </Flex>
            )}
            {detail?.studios && (
              <Flex direction="column">
                <H5 h5 weight="bold">
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
              </Flex>
            )}
            {detail?.synonyms && (
              <Flex direction="column">
                <H5 h5 weight="bold">
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
              </Flex>
            )}
          </Flex>
        </Col>
      )}
      <Col span={isSm ? 12 : 8}>
        <Flex
          direction="column"
          align="start"
          justify="center"
          className="space-y-4"
          css={{
            borderRadius: '$lg',
            backgroundColor: '$backgroundContrast',
            justifyContent: 'flex-start',
            padding: '$md',
          }}
        >
          <Row>
            <H6
              h6
              css={{ textAlign: 'justify' }}
              dangerouslySetInnerHTML={{ __html: detail?.description || '' }}
            />
          </Row>
        </Flex>
        {detail?.relations && detail.relations.length > 0 && (
          <>
            <H2
              h2
              css={{
                margin: '20px 0 20px 0',
                '@xsMax': {
                  fontSize: '1.75rem !important',
                },
              }}
            >
              Relations
            </H2>
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
                      filter: 'unset',
                      '&:hover': {
                        boxShadow: '0 0 0 1px var(--nextui-colors-primarySolidHover)',
                        filter:
                          'drop-shadow(0 4px 12px rgb(104 112 118 / 0.15)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.1))',
                      },
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
                          showSkeleton
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
                          placeholder="empty"
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
          </>
        )}
        {detail?.characters && detail.characters.length > 0 ? (
          <>
            <H2
              h2
              css={{
                margin: '20px 0 20px 0',
                '@xsMax': {
                  fontSize: '1.75rem !important',
                },
              }}
            >
              Characters
            </H2>
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
                      filter: 'unset',
                      '&:hover': {
                        boxShadow: '0 0 0 1px var(--nextui-colors-primarySolidHover)',
                        filter:
                          'drop-shadow(0 4px 12px rgb(104 112 118 / 0.15)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.1))',
                      },
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
                            showSkeleton
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
                            placeholder="empty"
                            options={{
                              contentType: MimeType.WEBP,
                            }}
                            containerCss={{
                              margin: 0,
                              minWidth: '60px',
                              flexBasis: '60px',
                              borderRadius: '$lg',
                            }}
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
                            squared
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
                            showSkeleton
                            alt={character.voiceActors[0].name?.full}
                            title={character.voiceActors[0].name?.full}
                            css={{
                              minWidth: '60px !important',
                              minHeight: '80px !important',
                            }}
                            loaderUrl="/api/image"
                            placeholder="empty"
                            options={{
                              contentType: MimeType.WEBP,
                            }}
                            containerCss={{
                              margin: 0,
                              minWidth: '60px',
                              flexBasis: '60px',
                              borderRadius: '$lg',
                            }}
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
                            squared
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
          </>
        ) : null}
        {detail?.recommendations && detail?.recommendations.length > 0 ? (
          <MediaList
            key={`anime-recommendations-${animeId}`}
            items={detail?.recommendations as IMedia[]}
            itemsType="anime"
            listName="Recommendations"
            listType="slider-card"
            navigationButtons
          />
        ) : null}
      </Col>
    </Row>
  );
};

export default Overview;
