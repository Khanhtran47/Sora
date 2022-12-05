/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useMemo } from 'react';
import { Row, Spacer, Card, Avatar, Button, Pagination, Dropdown } from '@nextui-org/react';
import { useNavigate } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';

import { IEpisode } from '~/services/tmdb/tmdb.types';
import { IEpisodeInfo } from '~/services/consumet/anilist/anilist.types';
import useMediaQuery from '~/hooks/useMediaQuery';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import TMDB from '~/utils/media';
import episodeTypes from '~/src/constants/episodeTypes';

import { H3, H5, H6 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';
import ViewGrid from '~/src/assets/icons/ViewGridIcon.js';

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
  const episodesCountAvailable = useMemo(() => episodes && episodes.length, [episodes]);
  const isSm = useMediaQuery('(max-width: 650px)');
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
        `/tv-shows/${id}/season/${season}/episode/${index + 1}?provider=${provider}&id=${
          providerData?.id
        }`,
      );
    else if (type === 'anime') {
      navigate(`/anime/${id}/episode/${index + 1}?provider=${provider}&id=${providerData?.id}`);
    }
  };

  return (
    <>
      <Flex direction="row" justify="between" align="center" wrap="wrap" css={{ margin: '20px 0' }}>
        <H3 h3>Episodes</H3>
        <Flex direction="row" justify="end" align="center" className="space-x-2">
          {providers ? (
            <Dropdown>
              <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedValue}</Dropdown.Button>
              <Dropdown.Menu
                aria-label="Provider Selection"
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
                  onClick={() => setActiveType(episodeType.activeType)}
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
                onClick={() => handleSelectEpisode(index)}
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
                    filter: 'var(--nextui-dropShadows-md)',
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
                            <H5
                              h5
                              weight="semibold"
                              css={{
                                backgroundColor: '#3ec2c2',
                                borderRadius: '$xs',
                                padding: '0 0.25rem 0 0.25rem',
                                marginRight: '0.5rem',
                              }}
                            >
                              TMDb
                            </H5>
                            <H5 h5 weight="semibold">
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
            shadow
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
