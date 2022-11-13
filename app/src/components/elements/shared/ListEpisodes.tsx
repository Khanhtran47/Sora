/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react';
import { Row, Spacer, Card, Avatar, Button, Pagination } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

import { IEpisode, IMovieTranslations } from '~/services/tmdb/tmdb.types';
import { IEpisodeInfo } from '~/services/consumet/anilist/anilist.types';
import useMediaQuery from '~/hooks/useMediaQuery';
import useLocalStorage from '~/hooks/useLocalStorage';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import TMDB from '~/utils/media';
import episodeTypes from '~/src/constants/episodeTypes';

import { H3, H5, H6 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';
import SelectProviderModal from '~/src/components/elements/modal/SelectProviderModal';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

interface IListEpisodesProps {
  type: 'tv' | 'anime';
  id: number | string | undefined;
  episodes?: IEpisode[] | IEpisodeInfo[];
  title: string;
  orgTitle: string;
  year: number;
  translations?: IMovieTranslations;
  season?: number;
}

const ListEpisodes: React.FC<IListEpisodesProps> = (props: IListEpisodesProps) => {
  const { type, id, episodes, title, orgTitle, year, translations, season } = props;
  const isSm = useMediaQuery('(max-width: 650px)');
  const [visible, setVisible] = useState(false);
  const [episodeId, setEpisodeEpisodeId] = useState<string>();
  const [episodeNumber, setEpisodeNumber] = useState<number>();
  const closeHandler = () => {
    setVisible(false);
  };
  const [activeType, setActiveType] = useLocalStorage('activeEpisodeType', 0);
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(episodes || [], 50);
  return (
    <>
      {episodes && episodes.length > 0 && (
        <>
          <Flex direction="row" justify="between" align="center">
            <H3 h3 css={{ margin: '20px 0 20px 0' }}>
              Episodes
            </H3>
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
                >
                  {episodeType.activeTypeName}
                </Button>
              ))}
            </Button.Group>
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
              {currentData.map((episode) =>
                activeType === 0 ? (
                  <Button
                    key={episode.id}
                    auto
                    type="button"
                    onClick={() => {
                      setVisible(true);
                      if (type === 'tv') setEpisodeNumber(episode.episode_number);
                      else if (type === 'anime') {
                        setEpisodeEpisodeId(episode.id);
                        setEpisodeNumber(episode.number);
                      }
                    }}
                    css={{
                      padding: 0,
                      minWidth: '40px',
                      margin: '0 0.5rem 0.5rem 0',
                    }}
                  >
                    {type === 'tv' ? episode?.episode_number : episode?.number}
                  </Button>
                ) : activeType === 1 ? (
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
                      onPress={() => {
                        setVisible(true);
                        if (type === 'tv') setEpisodeNumber(episode.episode_number);
                        else if (type === 'anime') {
                          setEpisodeEpisodeId(episode.id);
                          setEpisodeNumber(episode.number);
                        }
                      }}
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
                              alt={episode?.name || ''}
                              title={episode?.name || ''}
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
                          ))}
                        <Flex direction="column" justify="start" css={{ p: '1rem' }}>
                          <H5 h5 weight="bold">
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
      )}
      <SelectProviderModal
        visible={visible}
        closeHandler={closeHandler}
        type={type}
        title={title}
        origTitle={orgTitle}
        year={year}
        id={id}
        episode={episodeNumber}
        {...(type === 'tv' && { season, translations })}
        {...(type === 'anime' && { episodeId })}
      />
    </>
  );
};

export default ListEpisodes;
