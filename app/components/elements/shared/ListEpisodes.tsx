import { useMemo, useState } from 'react';
import { Button, ButtonGroup } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Pagination } from '@nextui-org/pagination';
import { Spacer } from '@nextui-org/spacer';
import { useMediaQuery } from '@react-hookz/web';
import { useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { MimeType } from 'remix-image';

import type { IEpisodeInfo } from '~/services/consumet/anilist/anilist.types';
import type { IEpisode } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import episodeTypes from '~/constants/episodeTypes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/elements/Select';
import Rating from '~/components/elements/shared/Rating';
import PhotoIcon from '~/assets/icons/PhotoIcon';
import ViewGrid from '~/assets/icons/ViewGridCardIcon';

import Image from '../Image';

interface IListEpisodesProps {
  type: 'tv' | 'anime';
  id: number | string | undefined;
  episodes?: IEpisode[] | IEpisodeInfo[];
  season?: number;
  providers: {
    id?: string | number | null;
    provider: string;
    episodesCount?: number;
  }[];
}

const ListEpisodes: React.FC<IListEpisodesProps> = (props: IListEpisodesProps) => {
  const { type, id, episodes, season, providers } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isShowSkipOpEdButton } = useSoraSettings();
  const episodesCountAvailable = useMemo(() => episodes && episodes.length, [episodes]);
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const [selectedProvider, setSelectedProvider] = useState(providers[0]?.provider);
  const [episodesCountProvider, setEpisodesCountProvider] = useState<number>(
    providers[0]?.episodesCount || 0,
  );
  const [episodesAvailable, setEpisodesAvailable] = useState<
    IEpisode[] | IEpisodeInfo[] | number[] | undefined
  >(
    episodesCountAvailable && episodesCountAvailable >= (providers[0]?.episodesCount || 0)
      ? episodes?.slice(0, providers[0]?.episodesCount || 0)
      : Array(providers[0]?.episodesCount || 0)
          .fill(null)
          .map((_, i) => i),
  );
  const [activeType, setActiveType] = useState(0);
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(
    episodesAvailable || [],
    50,
  );

  const handleProviderChange = async (value: string) => {
    setSelectedProvider(value);
    const providerData = providers.find((p) => p.provider === value);
    if (providerData) {
      setEpisodesCountProvider(providerData.episodesCount || 0);
      if (episodesCountAvailable && episodesCountAvailable >= (providerData?.episodesCount || 0)) {
        setEpisodesAvailable(episodes?.slice(0, providerData?.episodesCount || 0));
      } else {
        setActiveType(0);
        setEpisodesAvailable(
          Array(providerData?.episodesCount || 0)
            .fill(null)
            .map((_, i) => i),
        );
      }
    }
  };

  const handleSelectEpisode = (index: number) => {
    const providerData = providers.find((p) => p.provider === selectedProvider);
    if (type === 'tv')
      navigate(
        `/tv-shows/${id}/season/${season}/episode/${
          index + 1
        }/watch?provider=${selectedProvider}&id=${providerData?.id}`,
      );
    else if (type === 'anime') {
      navigate(
        `/anime/${id}/episode/${index + 1}/watch?provider=${selectedProvider}&id=${
          providerData?.id
        }&skipOpEd=${isShowSkipOpEdButton.value}`,
      );
    }
  };

  return (
    <>
      <div className="my-5 flex w-full flex-row flex-wrap items-center justify-between gap-4">
        <h3>{t('episodes')}</h3>
        <div className="flex flex-row items-center justify-end gap-2">
          {providers ? (
            <Select value={selectedProvider} onValueChange={(value) => handleProviderChange(value)}>
              <SelectTrigger aria-label="provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.provider} value={provider.provider}>
                    {provider.provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          {episodesCountAvailable && episodesCountAvailable >= episodesCountProvider ? (
            <ButtonGroup>
              {episodeTypes.map((episodeType) => (
                <Button
                  key={`button-item-${episodeType.activeType}`}
                  type="button"
                  onPress={() => setActiveType(episodeType.activeType)}
                  {...(activeType === episodeType.activeType ? {} : { variant: 'ghost' })}
                  isIconOnly
                >
                  {episodeType.activeTypeName === 'Image' ? (
                    <PhotoIcon />
                  ) : (
                    <ViewGrid width={36} height={36} />
                  )}
                </Button>
              ))}
            </ButtonGroup>
          ) : null}
        </div>
      </div>
      {currentData && currentData.length > 0 && (
        <div
          className={`flex w-full ${
            activeType === 0 ? 'flex-row flex-wrap items-center justify-start' : 'flex-col'
          }`}
        >
          {currentData.map((episode, index) =>
            activeType === 0 ? (
              <Button
                key={episode.id}
                type="button"
                onPress={() => handleSelectEpisode(index)}
                className="mb-2 mr-2 w-10 p-0"
                isIconOnly
              >
                {index + 1 + (currentPage - 1) * 50}
              </Button>
            ) : activeType === 1 &&
              episodesCountAvailable &&
              episodesCountAvailable >= episodesCountProvider ? (
              <div key={episode.id}>
                <Card
                  isHoverable
                  isPressable
                  className="!max-h-[127px] w-full data-[hover=true]:ring-2 data-[hover=true]:ring-focus"
                  onPress={() => handleSelectEpisode(index)}
                >
                  <CardBody className="flex flex-row flex-nowrap justify-start p-0">
                    {type === 'tv' &&
                      (episode?.still_path ? (
                        <Image
                          src={TMDB.posterUrl(episode?.still_path, 'w342')}
                          width={227}
                          height="100%"
                          isZoomed
                          radius="lg"
                          loading="lazy"
                          disableSkeleton={false}
                          alt={episode?.name || ''}
                          title={episode?.name || ''}
                          classNames={{
                            wrapper: 'm-0 min-w-[227px] max-h-[127px] overflow-hidden',
                          }}
                          placeholder="empty"
                          options={{ contentType: MimeType.WEBP }}
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
                        <div className="z-0 flex aspect-[16/9] min-h-[125px] min-w-[227px] items-center justify-center rounded-large bg-default">
                          <PhotoIcon width={36} height={36} />
                        </div>
                      ))}
                    {type === 'anime' &&
                      (episode?.image ? (
                        <Image
                          src={episode.image}
                          width={227}
                          height="100%"
                          alt={episode?.title || ''}
                          title={episode?.title || ''}
                          loading="lazy"
                          radius="lg"
                          isZoomed
                          disableSkeleton={false}
                          classNames={{
                            wrapper: 'm-0 min-w-[227px] max-h-[125px] overflow-hidden',
                          }}
                          placeholder="empty"
                          options={{ contentType: MimeType.WEBP }}
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
                        <div className="z-0 flex aspect-[16/9] min-h-[125px] min-w-[227px] items-center justify-center rounded-large bg-default">
                          <PhotoIcon width={48} height={48} />
                        </div>
                      ))}
                    <div className="flex flex-col justify-start gap-y-1 p-4">
                      <h5 className="line-clamp-1">
                        {t('episode')}{' '}
                        {type === 'tv'
                          ? isSm
                            ? `${episode?.episode_number}`
                            : `${episode?.episode_number}: ${episode?.name}`
                          : null}
                        {type === 'anime'
                          ? isSm
                            ? `${episode?.number}`
                            : `${episode?.number}: ${episode?.title}`
                          : null}
                      </h5>
                      {type === 'tv' && !isSm && (
                        <>
                          <div className="flex items-center gap-x-4">
                            <Rating rating={episode?.vote_average.toFixed(1)} ratingType="tv" />
                            <h5>
                              {episode.air_date} | {episode?.runtime} {t('min')}
                            </h5>
                          </div>
                          <h6 className="!line-clamp-1">{episode.overview}</h6>
                        </>
                      )}
                      {type === 'anime' && !isSm && episode.description && (
                        <h6 className="!line-clamp-2">{episode.description}</h6>
                      )}
                    </div>
                  </CardBody>
                </Card>
                <Spacer y={5} />
              </div>
            ) : null,
          )}
        </div>
      )}
      <Spacer y={6} />
      {maxPage > 1 ? (
        <div className="flex flex-row justify-center">
          <Pagination
            // showControls={!isSm}
            total={maxPage}
            initialPage={currentPage}
            // shadow
            onChange={(page) => gotoPage(page)}
            {...(isSm && { size: 'sm' })}
          />
        </div>
      ) : null}
    </>
  );
};

export default ListEpisodes;
