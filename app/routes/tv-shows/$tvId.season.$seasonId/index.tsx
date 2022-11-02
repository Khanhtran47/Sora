/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react';
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row, Col, Spacer, Card, Avatar, Button, Pagination } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import Image, { MimeType } from 'remix-image';

import { getTvShowDetail, getTranslations } from '~/services/tmdb/tmdb.server';
import { ISeasonDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import useMediaQuery from '~/hooks/useMediaQuery';
import useLocalStorage from '~/hooks/useLocalStorage';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import episodeType from '~/src/constants/episodeType';
import i18next from '~/i18n/i18next.server';

import { H3, H4, H5, H6 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';
import SelectProviderModal from '~/src/components/elements/modal/SelectProviderModal';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getTvShowDetail>>;
  translations?: Awaited<ReturnType<typeof getTranslations>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18next.getLocale(request);
  const { tvId } = params;
  const tid = Number(tvId);
  if (!tid) throw new Response('Not Found', { status: 404 });

  const detail = await getTvShowDetail(tid, locale);
  if (!tid) throw new Response('Not Found', { status: 404 });
  if ((detail && detail?.original_language !== 'en') || locale !== 'en') {
    const translations = await getTranslations('tv', tid);
    return json<LoaderData>({ detail, translations });
  }

  return json<LoaderData>({ detail });
};

const Episodes = () => {
  const { detail, translations } = useLoaderData<LoaderData>();
  const seasonData: { detail: ISeasonDetail } | undefined = useRouteData(
    'routes/tv-shows/$tvId.season.$seasonId',
  );
  const seasonDetail = seasonData && seasonData.detail;
  const isSm = useMediaQuery(650, 'max');
  const [visible, setVisible] = useState(false);
  const [episodeNumber, setEpisodeNumber] = useState<number>();
  const closeHandler = () => {
    setVisible(false);
  };
  const [activeType, setActiveType] = useLocalStorage('activeEpisodeType', 0);
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(
    seasonDetail?.episodes || [],
    50,
  );
  return (
    <Row
      fluid
      align="stretch"
      justify="center"
      css={{
        marginTop: '0.75rem',
        padding: '0 0.75rem',
        '@xs': {
          padding: '0 3vw',
        },
        '@sm': {
          padding: '0 6vw',
        },
        '@md': {
          padding: '0 12vw',
        },
      }}
    >
      <Col span={isSm ? 12 : 8}>
        {seasonDetail?.episodes && seasonDetail.episodes.length > 0 && (
          <>
            <Flex direction="row" justify="between" align="center">
              <H3 h3 css={{ margin: '20px 0 20px 0' }}>
                Episodes
              </H3>
              <Button.Group>
                {episodeType.map((type) => (
                  <Button
                    key={`button-item-${type.activeType}`}
                    type="button"
                    onClick={() => setActiveType(type.activeType)}
                    {...(activeType === type.activeType ? {} : { ghost: true })}
                    css={{
                      '@xsMax': {
                        flexGrow: '1',
                        flexShrink: '0',
                        dflex: 'center',
                      },
                    }}
                  >
                    {type.activeTypeName}
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
                        setEpisodeNumber(episode.episode_number);
                      }}
                      css={{
                        padding: 0,
                        minWidth: '40px',
                        margin: '0 0.5rem 0.5rem 0',
                      }}
                    >
                      {episode?.episode_number}
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
                          setEpisodeNumber(episode.episode_number);
                        }}
                      >
                        <Card.Body
                          css={{
                            p: 0,
                            flexFlow: 'row nowrap',
                            justifyContent: 'flex-start',
                          }}
                        >
                          {episode?.still_path ? (
                            <Card.Image
                              // @ts-ignore
                              as={Image}
                              src={TMDB.posterUrl(episode?.still_path, 'w185')}
                              objectFit="cover"
                              width="227px"
                              height="100%"
                              alt={episode?.name}
                              title={episode?.name}
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
                          )}
                          <Flex direction="column" justify="start" css={{ p: '1rem' }}>
                            <H4 h4>
                              Episode{' '}
                              {isSm
                                ? `${episode?.episode_number}`
                                : `${episode?.episode_number}: ${episode?.name}`}
                            </H4>
                            {!isSm && (
                              <>
                                <Spacer y={0.25} />
                                <Row align="center">
                                  <H5
                                    h5
                                    weight="bold"
                                    css={{
                                      backgroundColor: '#3ec2c2',
                                      borderRadius: '$xs',
                                      padding: '0 0.25rem 0 0.25rem',
                                      marginRight: '0.5rem',
                                    }}
                                  >
                                    TMDb
                                  </H5>
                                  <H5 h5 weight="bold">
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
      </Col>
      <SelectProviderModal
        visible={visible}
        closeHandler={closeHandler}
        type="tv"
        title={detail?.name || ''}
        origTitle={detail?.original_name || ''}
        year={new Date(seasonDetail?.air_date || '').getFullYear()}
        translations={translations}
        id={detail?.id}
        season={seasonDetail?.season_number}
        episode={episodeNumber}
      />
    </Row>
  );
};

export default Episodes;
