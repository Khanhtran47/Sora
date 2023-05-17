/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useMemo } from 'react';
import { Card, CardBody } from '@nextui-org/card';
import { Avatar } from '@nextui-org/react';
import type { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import { MimeType } from 'remix-image';

import type { IMedia } from '~/types/media';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import Image from '~/components/elements/Image';
import { H2, H5, H6, P } from '~/components/styles/Text.styles';
import PhotoIcon from '~/assets/icons/PhotoIcon';

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}/`,
});

const AnimeOverview = () => {
  const animeData = useTypedRouteLoaderData('routes/anime/$animeId');
  const detail = animeData && animeData.detail;
  const { animeId } = useParams();
  const listRelations = useMemo(() => {
    if (!detail?.relations || detail?.relations.length === 0) return [];
    const listFiltered = detail?.relations.filter(
      (relation) => relation.relationType === 'SEQUEL' || relation.relationType === 'PREQUEL',
    );
    const listFormatted = listFiltered.map((relation) => ({
      id: relation.id,
      title: relation.title,
      posterPath: relation.image,
      backdropPath: relation.cover,
      voteAverage: relation.rating,
    }));
    return listFormatted;
  }, [detail?.relations]);
  return (
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-x-0 gap-y-4 px-3 sm:flex-row sm:items-stretch sm:justify-center sm:gap-x-4 sm:gap-y-0 sm:px-3.5 xl:px-4 2xl:px-5">
      <div className="flex w-full grow-0 flex-col sm:w-1/3 sm:items-center sm:justify-start">
        <div className="flex w-full flex-col items-start justify-center gap-y-4 rounded-xl bg-neutral p-4 nextui-sm:w-3/4 xl:w-1/2">
          {detail?.nextAiringEpisode ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="grow-0 basis-1/3">
                Airing
              </H6>
              <P as="p" className="grow">
                {`Ep${detail?.nextAiringEpisode?.episode}: ${detail?.nextAiringEpisode?.timeUntilAiring}`}
              </P>
            </div>
          ) : null}
          {detail?.totalEpisodes ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="grow-0 basis-1/3">
                Episodes
              </H6>
              <P as="p" className="grow">
                {detail?.totalEpisodes}
              </P>
            </div>
          ) : null}
          {detail?.duration ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="grow-0 basis-1/3">
                Episode Duration
              </H6>
              <P as="p" className="grow">
                {detail?.duration}
              </P>
            </div>
          ) : null}
          {detail?.status ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="grow-0 basis-1/3">
                Status
              </H6>
              <P as="p" className="grow">
                {detail?.status}
              </P>
            </div>
          ) : null}
          {detail?.startDate ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="grow-0 basis-1/3">
                Start Date
              </H6>
              <P as="p" className="grow">
                {`${detail?.startDate?.day}/${detail?.startDate?.month}/${detail?.startDate?.year}`}
              </P>
            </div>
          ) : null}
          {detail?.endDate ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="grow-0 basis-1/3">
                End Date
              </H6>
              <P as="p" className="grow">
                {`${detail?.endDate?.day}/${detail?.endDate?.month}/${detail?.endDate?.year}`}
              </P>
            </div>
          ) : null}
          {detail?.countryOfOrigin ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="grow-0 basis-1/3">
                Country of Origin
              </H6>
              <P as="p" className="grow">
                {detail?.countryOfOrigin}
              </P>
            </div>
          ) : null}
          {detail?.popularity ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="grow-0 basis-1/3">
                Popularity
              </H6>
              <P as="p" className="grow">
                {detail?.popularity}
              </P>
            </div>
          ) : null}
          {detail?.studios ? (
            <div className="flex w-full flex-row items-start justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="grow-0 basis-1/3">
                Studios
              </H6>
              <div className="flex grow flex-col">
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
            <div className="flex w-full flex-row items-start justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <H6 h6 weight="bold" className="grow-0 basis-1/3">
                Synonyms
              </H6>
              <div className="flex grow flex-col">
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
      <div className="flex w-full flex-col sm:w-2/3">
        <div className="flex flex-col items-start justify-start gap-y-4 rounded-xl bg-neutral p-4">
          <H6
            h6
            css={{ textAlign: 'justify' }}
            dangerouslySetInnerHTML={{ __html: detail?.description || '' }}
          />
        </div>
        {listRelations && listRelations.length > 0 ? (
          <MediaList
            items={listRelations as IMedia[]}
            itemsType="anime"
            key={`anime-relations-${animeId}`}
            listName="Relations"
            listType="slider-card"
            navigationButtons
          />
        ) : null}
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
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {detail.characters.slice(0, 12).map((character) => (
                <Card
                  key={character.id}
                  isHoverable
                  isPressable
                  className="max-h-[80px] hover:shadow-[0_0_0_1px] hover:shadow-primary-200"
                >
                  <CardBody className="flex flex-row flex-nowrap items-center justify-start overflow-hidden p-0">
                    <div className="flex grow justify-start gap-x-2">
                      {character?.image ? (
                        <Image
                          src={character.image}
                          width="60px"
                          height="100%"
                          alt={character?.name?.full}
                          title={character?.name?.full}
                          className="min-h-[80px] min-w-[60px] object-cover"
                          loaderUrl="/api/image"
                          placeholder="empty"
                          options={{
                            contentType: MimeType.WEBP,
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
                      <div className="flex flex-col items-start justify-center p-1">
                        <H5 h5>{character.name?.full}</H5>
                        <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold' }}>
                          {character.role}
                        </H6>
                      </div>
                    </div>
                    <div className="flex grow flex-row justify-end gap-x-2">
                      {character?.voiceActors && character?.voiceActors.length > 0 && (
                        <div className="flex flex-col items-end justify-center p-1">
                          <H5 h5>{character.voiceActors[0].name?.full}</H5>
                          <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold' }}>
                            Japanese
                          </H6>
                        </div>
                      )}
                      {character?.voiceActors && character?.voiceActors[0]?.image ? (
                        <Image
                          src={character.voiceActors[0]?.image}
                          // objectFit="cover"
                          width="60px"
                          height="100%"
                          // showSkeleton
                          alt={character.voiceActors[0].name?.full}
                          title={character.voiceActors[0].name?.full}
                          // css={{
                          //   minWidth: '60px !important',
                          //   minHeight: '80px !important',
                          // }}
                          loaderUrl="/api/image"
                          placeholder="empty"
                          options={{
                            contentType: MimeType.WEBP,
                          }}
                          // containerCss={{
                          //   margin: 0,
                          //   minWidth: '60px',
                          //   flexBasis: '60px',
                          //   borderRadius: '$lg',
                          // }}
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
                  </CardBody>
                </Card>
              ))}
            </div>
          </>
        ) : null}
        {detail?.recommendations && detail?.recommendations.length > 0 ? (
          <MediaList
            items={detail?.recommendations as IMedia[]}
            itemsType="anime"
            key={`anime-recommendations-${animeId}`}
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
