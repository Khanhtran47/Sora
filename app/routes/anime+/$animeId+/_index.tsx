import { useMemo } from 'react';
import { Card, CardBody } from '@nextui-org/card';
import { useParams } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { useTranslation } from 'react-i18next';
import { MimeType } from 'remix-image';

import type { Handle } from '~/types/handle';
import type { IMedia } from '~/types/media';
import type { loader as animeIdLoader } from '~/routes/anime+/$animeId';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import Image from '~/components/elements/Image';
import PhotoIcon from '~/assets/icons/PhotoIcon';

export const meta = mergeMeta<{}, { 'routes/anime+/$animeId': typeof animeIdLoader }>(
  ({ params, matches }) => {
    const animeData = matches.find((match) => match.id === 'routes/anime+/$animeId')?.data;
    if (!animeData) {
      return [
        { title: 'Missing Anime' },
        { name: 'description', content: `There is no anime with the ID: ${params.animeId}` },
      ];
    }
    const { detail } = animeData;
    const { title, description } = detail || {};
    const animeTitle =
      title?.userPreferred || title?.english || title?.romaji || title?.native || '';
    return [
      { title: `Sora - ${animeTitle}` },
      {
        name: 'description',
        content: description
          ? description?.replace(/<\/?[^>]+(>|$)/g, '')
          : `Watch ${animeTitle} in Sora`,
      },
      { property: 'og:url', content: `https://sorachill.vercel.app/anime/${params.animeId}` },
      { property: 'og:title', content: `Sora - ${animeTitle}` },
      {
        property: 'og:description',
        content: description
          ? description?.replace(/<\/?[^>]+(>|$)/g, '')
          : `Watch ${animeTitle} in Sora`,
      },
      { name: 'twitter:title', content: `Sora - ${animeTitle}` },
      {
        name: 'twitter:description',
        content: description
          ? description?.replace(/<\/?[^>]+(>|$)/g, '')
          : `Watch ${animeTitle} in Sora`,
      },
    ];
  },
);

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <BreadcrumbItem
      to={`/anime/${match.params.animeId}/`}
      key={`anime-${match.params.animeId}-overview`}
    >
      {t('overview')}
    </BreadcrumbItem>
  ),
};

const AnimeOverview = () => {
  const animeData = useTypedRouteLoaderData('routes/anime+/$animeId');
  const detail = animeData && animeData.detail;
  const { animeId } = useParams();
  const { t } = useTranslation();
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
        <div className="flex w-full flex-col items-start justify-center gap-y-4 rounded-large bg-content1 p-4 nextui-sm:w-3/4 xl:w-1/2">
          {detail?.nextAiringEpisode ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <h6 className="grow-0 basis-1/3">{t('airing')}</h6>
              <p className="grow">
                {`Ep${detail?.nextAiringEpisode?.episode}: ${detail?.nextAiringEpisode?.timeUntilAiring}`}
              </p>
            </div>
          ) : null}
          {detail?.totalEpisodes ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <h6 className="grow-0 basis-1/3">{t('episodes')}</h6>
              <p className="grow">{detail?.totalEpisodes}</p>
            </div>
          ) : null}
          {detail?.duration ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <h6 className="grow-0 basis-1/3">{t('episode-duration')}</h6>
              <p className="grow">{detail?.duration}</p>
            </div>
          ) : null}
          {detail?.status ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <h6 className="grow-0 basis-1/3">{t('status')}</h6>
              <p className="grow">{detail?.status}</p>
            </div>
          ) : null}
          {detail?.startDate ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <h6 className="grow-0 basis-1/3">{t('start-date')}</h6>
              <p className="grow">
                {`${detail?.startDate?.day}/${detail?.startDate?.month}/${detail?.startDate?.year}`}
              </p>
            </div>
          ) : null}
          {detail?.endDate ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <h6 className="grow-0 basis-1/3">{t('end-date')}</h6>
              <p className="grow">
                {`${detail?.endDate?.day}/${detail?.endDate?.month}/${detail?.endDate?.year}`}
              </p>
            </div>
          ) : null}
          {detail?.countryOfOrigin ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <h6 className="grow-0 basis-1/3">{t('country-origin')}</h6>
              <p className="grow">{detail?.countryOfOrigin}</p>
            </div>
          ) : null}
          {detail?.popularity ? (
            <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <h6 className="grow-0 basis-1/3">{t('popularity')}</h6>
              <p className="grow">{detail?.popularity}</p>
            </div>
          ) : null}
          {detail?.studios ? (
            <div className="flex w-full flex-row items-start justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <h6 className="grow-0 basis-1/3">{t('studios')}</h6>
              <div className="flex grow flex-col">
                {detail.studios.length > 0 &&
                  detail.studios.map((studio) => <p key={studio}>{studio}</p>)}
              </div>
            </div>
          ) : null}
          {detail?.synonyms ? (
            <div className="flex w-full flex-row items-start justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
              <h6 className="grow-0 basis-1/3">{t('synonyms')}</h6>
              <div className="flex grow flex-col">
                {detail?.synonyms.length > 0 &&
                  detail?.synonyms.map((synonym) => <p key={synonym}>{synonym}</p>)}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex w-full flex-col sm:w-2/3">
        <div className="flex flex-col items-start justify-start gap-y-4 rounded-large bg-content1 p-4">
          <p
            className="text-justify"
            dangerouslySetInnerHTML={{ __html: detail?.description || '' }}
          />
        </div>
        {listRelations && listRelations.length > 0 ? (
          <MediaList
            items={listRelations as IMedia[]}
            itemsType="anime"
            key={`anime-relations-${animeId}`}
            listName={t('relations')}
            listType="slider-card"
            navigationButtons
          />
        ) : null}
        {detail?.characters && detail.characters.length > 0 ? (
          <>
            <h2 className="my-5">{t('characters')}</h2>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {detail.characters.slice(0, 12).map((character) => (
                <Card
                  key={character.id}
                  isHoverable
                  isPressable
                  className="max-h-[80px] data-[hover=true]:ring-2 data-[hover=true]:ring-focus"
                >
                  <CardBody className="flex h-full flex-row flex-nowrap items-center justify-start overflow-hidden p-0">
                    <div className="flex h-full grow justify-start gap-x-2">
                      {character?.image ? (
                        <Image
                          radius="lg"
                          src={character.image}
                          width="60px"
                          height="80px"
                          alt={character?.name?.full}
                          title={character?.name?.full}
                          placeholder="empty"
                          classNames={{
                            img: 'max-h-[80px]',
                          }}
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
                        <div className="z-0 flex min-h-[80px] min-w-[60px] basis-[60px] items-center justify-center rounded-large bg-default">
                          <PhotoIcon width={36} height={36} />
                        </div>
                      )}
                      <div className="flex flex-col items-start justify-center p-1">
                        <h5>{character.name?.full}</h5>
                        <p className="opacity-80">{character.role}</p>
                      </div>
                    </div>
                    <div className="flex h-full grow flex-row justify-end gap-x-2">
                      {character?.voiceActors && character?.voiceActors.length > 0 && (
                        <div className="flex flex-col items-end justify-center p-1">
                          <h5>{character.voiceActors[0].name?.full}</h5>
                          <p className="opacity-80">{t('japanese')}</p>
                        </div>
                      )}
                      {character?.voiceActors && character?.voiceActors[0]?.image ? (
                        <Image
                          src={character.voiceActors[0]?.image}
                          width="60px"
                          height="80px"
                          alt={character.voiceActors[0].name?.full}
                          title={character.voiceActors[0].name?.full}
                          placeholder="empty"
                          classNames={{
                            img: 'max-h-[80px]',
                          }}
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
                        <div className="z-0 flex min-h-[80px] min-w-[60px] basis-[60px] items-center justify-center rounded-large bg-default">
                          <PhotoIcon width={36} height={36} />
                        </div>
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
            listName={t('recommendations')}
            listType="slider-card"
            navigationButtons
          />
        ) : null}
      </div>
    </div>
  );
};

export default AnimeOverview;
