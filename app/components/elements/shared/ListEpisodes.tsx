/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/indent */
import { useMemo, useState } from 'react';
import { Avatar, Button, Card, Dropdown, Pagination, Row, Spacer } from '@nextui-org/react';
import { useMediaQuery } from '@react-hookz/web';
import { useNavigate } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';

import type { IEpisodeInfo } from '~/services/consumet/anilist/anilist.types';
import type { IEpisode } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import episodeTypes from '~/constants/episodeTypes';
import Rating from '~/components/elements/shared/Rating';
import Flex from '~/components/styles/Flex.styles';
import { H3, H5, H6 } from '~/components/styles/Text.styles';
import PhotoIcon from '~/assets/icons/PhotoIcon';
import ViewGrid from '~/assets/icons/ViewGridIcon';

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
      <Flex direction="row" justify="between" align="center" wrap="wrap" css={{ margin: '20px 0' }}>
        <H3 h3>Episodes</H3>
        <Flex direction="row" justify="end" align="center" className="space-x-2">
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
            <Button.Group>
              {episodeTypes.map((episodeType) => (
                <Button
                  key={`button-item-${episodeType.activeType}`}
                  type="button"
                  onPress={() => setActiveType(episodeType.activeType)}
                  {...(activeType === episodeType.activeType ? {} : { ghost: true })}
                  css={{
                    '@xsMax': {
                      flexGrow: '1',
                      flexShrink: '0',
                      dflex: 'center',
                    },
                  }}
                  icon={
                    episodeType.activeTypeName === 'Image' ? (
                      <PhotoIcon />
                    ) : (
                      <ViewGrid width={36} height={36} />
                    )
                  }
                />
              ))}
            </Button.Group>
          ) : null}
        </Flex>
      </Flex>
      {currentData && currentData.length > 0 && (
        <Flex
          direction={activeType === 0 ? 'row' : 'column'}
          {...(activeType === 0
            ? {
                wrap: 'wrap',
                justify: 'start',
                align: 'center',
              }
            : {})}
        >
          {currentData.map((episode, index) =>
            activeType === 0 ? (
              <Button
                key={episode.id}
                auto
                type="button"
                onPress={() => handleSelectEpisode(index)}
                css={{
                  padding: 0,
                  minWidth: '40px',
                  margin: '0 0.5rem 0.5rem 0',
                }}
              >
                {index + 1 + (currentPage - 1) * 50}
              </Button>
            ) : activeType === 1 &&
              episodesCountAvailable &&
              episodesCountAvailable >= episodesCountProvider ? (
              <div key={episode.id}>
                <Card
                  as="div"
                  isHoverable
                  isPressable
                  css={{
                    maxHeight: '127px !important',
                    borderWidth: 0,
                    filter: 'unset',
                    '&:hover': {
                      boxShadow: '0 0 0 1px var(--nextui-colors-primarySolidHover)',
                      filter:
                        'drop-shadow(0 4px 12px rgb(104 112 118 / 0.15)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.1))',
                    },
                  }}
                  role="figure"
                  onClick={() => handleSelectEpisode(index)}
                >
                  <Card.Body
                    css={{
                      p: 0,
                      flexFlow: 'row nowrap',
                      justifyContent: 'flex-start',
                    }}
                  >
                    {type === 'tv' &&
                      (episode?.still_path ? (
                        <Card.Image
                          // @ts-ignore
                          as={Image}
                          src={TMDB.posterUrl(episode?.still_path, 'w185')}
                          objectFit="cover"
                          width="227px"
                          height="100%"
                          showSkeleton
                          loading="lazy"
                          alt={episode?.name || ''}
                          title={episode?.name || ''}
                          css={{
                            minWidth: '227px !important',
                            minHeight: '127px !important',
                          }}
                          loaderUrl="/api/image"
                          placeholder="empty"
                          options={{
                            contentType: MimeType.WEBP,
                          }}
                          containerCss={{ margin: 0, minWidth: '227px', borderRadius: '$lg' }}
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
                        <Card.Image
                          // @ts-ignore
                          as={Image}
                          src={episode.image}
                          objectFit="cover"
                          width="227px"
                          height="100%"
                          alt={episode?.title || ''}
                          title={episode?.title || ''}
                          showSkeleton
                          loading="lazy"
                          css={{
                            minWidth: '227px !important',
                            minHeight: '127px !important',
                          }}
                          loaderUrl="/api/image"
                          placeholder="empty"
                          options={{
                            contentType: MimeType.WEBP,
                          }}
                          containerCss={{ margin: 0, minWidth: '227px', borderRadius: '$lg' }}
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
                    <Flex direction="column" justify="start" css={{ p: '1rem' }}>
                      <H5 h5 weight="bold" className="line-clamp-1">
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
                      </H5>
                      {type === 'tv' && !isSm && (
                        <>
                          <Spacer y={0.25} />
                          <Row align="center">
                            <Rating rating={episode?.vote_average.toFixed(1)} ratingType="tv" />
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
                      {type === 'anime' && !isSm && episode.description && (
                        <>
                          <Spacer y={0.25} />
                          <H6 h6 className="!line-clamp-2">
                            {episode.description}
                          </H6>
                        </>
                      )}
                    </Flex>
                  </Card.Body>
                </Card>
                <Spacer y={1} />
              </div>
            ) : null,
          )}
        </Flex>
      )}
      <Spacer y={1} />
      {maxPage > 1 && (
        <Flex direction="row" justify="center">
          <Pagination
            total={maxPage}
            initialPage={currentPage}
            // shadow
            onChange={(page) => gotoPage(page)}
            css={{ marginTop: '2rem' }}
            {...(isSm && { size: 'xs' })}
          />
        </Flex>
      )}
    </>
  );
};

export default ListEpisodes;
