/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { Button, ButtonGroup } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Pagination } from '@nextui-org/pagination';
import { Avatar, Dropdown, Row, Spacer } from '@nextui-org/react';
import { useMediaQuery } from '@react-hookz/web';
import { useNavigate } from '@remix-run/react';
import { MimeType } from 'remix-image';

import type { IEpisodeInfo } from '~/services/consumet/anilist/anilist.types';
import type { IEpisode } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import episodeTypes from '~/constants/episodeTypes';
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
  const { isShowSkipOpEdButton } = useSoraSettings();
  const episodesCountAvailable = useMemo(() => episodes && episodes.length, [episodes]);
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const [selectedProvider, setSelectedProvider] = useState<Set<string>>(
    new Set([providers[0].provider]),
  );
  const [episodesCountProvider, setEpisodesCountProvider] = useState<number>(
    providers[0].episodesCount || 0,
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
  const selectedValue = useMemo(() => {
    if (selectedProvider) {
      return Array.from(selectedProvider).join(', ').replaceAll('_', ' ');
    }
  }, [selectedProvider]);

  const handleProviderChange = async (keys: any) => {
    setSelectedProvider(keys);
    const provider = Array.from(keys).join(', ').replaceAll('_', ' ');
    const providerData = providers.find((p) => p.provider === provider);
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
    const provider = Array.from(selectedProvider).join(', ').replaceAll('_', ' ');
    const providerData = providers.find((p) => p.provider === provider);
    if (type === 'tv')
      navigate(
        `/tv-shows/${id}/season/${season}/episode/${index + 1}/watch?provider=${provider}&id=${
          providerData?.id
        }`,
      );
    else if (type === 'anime') {
      navigate(
        `/anime/${id}/episode/${index + 1}/watch?provider=${provider}&id=${
          providerData?.id
        }&skipOpEd=${isShowSkipOpEdButton.value}`,
      );
    }
  };

  return (
    <>
      <div className="my-5 flex flex-row flex-wrap items-center justify-between gap-4">
        <h3>Episodes</h3>
        <div className="flex flex-row items-center justify-end gap-2">
          {providers ? (
            <Dropdown isBordered>
              <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedValue}</Dropdown.Button>
              <Dropdown.Menu
                aria-label="Provider Selection"
                color="primary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedProvider}
                onSelectionChange={(keys: any) => handleProviderChange(keys)}
              >
                {providers.map((provider) => (
                  <Dropdown.Item key={provider.provider}>{provider.provider}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
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
          className={`flex ${
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
                  className="!max-h-[127px] hover:shadow-[0_0_0_1px] hover:shadow-primary-200"
                  onClick={() => handleSelectEpisode(index)}
                >
                  <CardBody className="flex flex-row flex-nowrap justify-start p-0">
                    {type === 'tv' &&
                      (episode?.still_path ? (
                        <Image
                          src={TMDB.posterUrl(episode?.still_path, 'w342')}
                          width={227}
                          height="100%"
                          isZoomed
                          radius="xl"
                          loading="lazy"
                          disableSkeleton={false}
                          alt={episode?.name || ''}
                          title={episode?.name || ''}
                          classNames={{
                            base: 'm-0 min-w-[227px] max-h-[127px] overflow-hidden !transition-[transform,_opacity]',
                          }}
                          loaderUrl="/api/image"
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
                          radius="xl"
                          isZoomed
                          disableSkeleton={false}
                          classNames={{
                            base: 'm-0 min-w-[227px] max-h-[127px] overflow-hidden !transition-[transform,_opacity]',
                          }}
                          loaderUrl="/api/image"
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
                      ))}
                    <div className="flex flex-col justify-start p-4">
                      <h5 className="line-clamp-1">
                        Episode{' '}
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
                          <Spacer y={0.25} />
                          <Row align="center">
                            <Rating rating={episode?.vote_average.toFixed(1)} ratingType="tv" />
                            <Spacer x={0.5} />
                            <h5>
                              {episode.air_date} | {episode?.runtime} min
                            </h5>
                          </Row>
                          <Spacer y={0.25} />
                          <h6 className="!line-clamp-1">{episode.overview}</h6>
                        </>
                      )}
                      {type === 'anime' && !isSm && episode.description && (
                        <>
                          <Spacer y={0.25} />
                          <h6 className="!line-clamp-2">{episode.description}</h6>
                        </>
                      )}
                    </div>
                  </CardBody>
                </Card>
                <Spacer y={1} />
              </div>
            ) : null,
          )}
        </div>
      )}
      <Spacer y={1.25} />
      {maxPage > 1 ? (
        <div className="flex flex-row justify-center">
          <Pagination
            showControls={!isSm}
            total={maxPage}
            initialPage={currentPage}
            // shadow
            onChange={(page) => gotoPage(page)}
            {...(isSm && { size: 'xs' })}
          />
        </div>
      ) : null}
    </>
  );
};

export default ListEpisodes;
