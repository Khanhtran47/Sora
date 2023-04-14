/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { MetaFunction } from '@remix-run/node';
import { Card, Avatar, Grid } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import { IMedia } from '~/types/media';

import MediaList from '~/components/media/MediaList';
import { H2, H5, H6, P } from '~/components/styles/Text.styles';

import PhotoIcon from '~/assets/icons/PhotoIcon';
import { useParams } from '@remix-run/react';

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}/overview`,
});

const AnimeOverview = () => {
  const animeData = useTypedRouteLoaderData('routes/anime/$animeId');
  const detail = animeData && animeData.detail;
  const { animeId } = useParams();
  return (
    <div className="w-full flex flex-col sm:flex-row sm:justify-center sm:items-stretch mt-3 max-w-[1920px] px-3 sm:px-3.5 xl:px-4 2xl:px-5 gap-x-0 sm:gap-x-4 gap-y-4 sm:gap-y-0">
      <div className="flex flex-col sm:items-center sm:justify-start w-full sm:w-1/3 flex-grow-0">
        <div className="flex flex-col items-start justify-center gap-y-4 rounded-xl bg-background-contrast w-full nextui-sm:w-3/4 xl:w-1/2 p-4">
          {detail?.nextAiringEpisode ? (
            <div className="w-full flex flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
                Airing
              </H6>
              <P as="p" className="flex-grow">
                {`Ep${detail?.nextAiringEpisode?.episode}: ${detail?.nextAiringEpisode?.timeUntilAiring}`}
              </P>
            </div>
          ) : null}
          {detail?.totalEpisodes ? (
            <div className="w-full flex flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
                Episodes
              </H6>
              <P as="p" className="flex-grow">
                {detail?.totalEpisodes}
              </P>
            </div>
          ) : null}
          {detail?.duration ? (
            <div className="w-full flex flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
                Episode Duration
              </H6>
              <P as="p" className="flex-grow">
                {detail?.duration}
              </P>
            </div>
          ) : null}
          {detail?.status ? (
            <div className="w-full flex flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
                Status
              </H6>
              <P as="p" className="flex-grow">
                {detail?.status}
              </P>
            </div>
          ) : null}
          {detail?.startDate ? (
            <div className="w-full flex flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
                Start Date
              </H6>
              <P as="p" className="flex-grow">
                {`${detail?.startDate?.day}/${detail?.startDate?.month}/${detail?.startDate?.year}`}
              </P>
            </div>
          ) : null}
          {detail?.endDate ? (
            <div className="w-full flex flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
                End Date
              </H6>
              <P as="p" className="flex-grow">
                {`${detail?.endDate?.day}/${detail?.endDate?.month}/${detail?.endDate?.year}`}
              </P>
            </div>
          ) : null}
          {detail?.countryOfOrigin ? (
            <div className="w-full flex flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
                Country of Origin
              </H6>
              <P as="p" className="flex-grow">
                {detail?.countryOfOrigin}
              </P>
            </div>
          ) : null}
          {detail?.popularity ? (
            <div className="w-full flex flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
                Popularity
              </H6>
              <P as="p" className="flex-grow">
                {detail?.popularity}
              </P>
            </div>
          ) : null}
          {detail?.studios ? (
            <div className="w-full flex flex-row items-start justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
                Studios
              </H6>
              <div className="flex flex-col flex-grow">
                {detail.studios.length > 0 &&
                  detail.studios.map((studio) => (
                    <P key={studio} as="p">
                      {studio}
                    </P>
                  ))}
              </div>
            </div>
          ) : null}
          {detail?.synonyms ? (
            <div className="w-full flex flex-row items-start justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
                Synonyms
              </H6>
              <div className="flex flex-col flex-grow">
                {detail?.synonyms.length > 0 &&
                  detail?.synonyms.map((synonym) => (
                    <P key={synonym} as="p">
                      {synonym}
                    </P>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col w-full sm:w-2/3">
        <div className="flex flex-col justify-start items-start gap-y-4 rounded-xl bg-background-contrast p-4">
          <H6
            h6
            css={{ textAlign: 'justify' }}
            dangerouslySetInnerHTML={{ __html: detail?.description || '' }}
          />
        </div>
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
                      <div className="flex justify-start flex-grow gap-x-2">
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
                        <div className="flex flex-col justify-center items-start p-1">
                          <H5 h5>{character.name?.full}</H5>
                          <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold' }}>
                            {character.role}
                          </H6>
                        </div>
                      </div>
                      <div className="flex flex-row justify-end flex-grow gap-x-2">
                        {character?.voiceActors && character?.voiceActors.length > 0 && (
                          <div className="flex flex-col justify-center items-end p-1">
                            <H5 h5>{character.voiceActors[0].name?.full}</H5>
                            <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold' }}>
                              Japanese
                            </H6>
                          </div>
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
                      </div>
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
      </div>
    </div>
  );
};

export default AnimeOverview;
