/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row, Col, Spacer, Card, Avatar, Button, Pagination } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import Image, { MimeType } from 'remix-image';

import { getAnimeEpisodeInfo } from '~/services/consumet/anilist/anilist.server';
import { IAnimeInfo } from '~/services/consumet/anilist/anilist.types';
import useMediaQuery from '~/hooks/useMediaQuery';
import useLocalStorage from '~/hooks/useLocalStorage';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import episodeType from '~/src/constants/episodeType';

import { H3, H5, H6 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';
import SelectProviderModal from '~/src/components/elements/modal/SelectProviderModal';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';
import { authenticate } from '~/services/supabase';

type LoaderData = {
  episodes: Awaited<ReturnType<typeof getAnimeEpisodeInfo>>;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticate(request);

  const { animeId } = params;
  const aid = Number(animeId);
  if (!aid) throw new Response('Not Found', { status: 404 });

  const episodes = await getAnimeEpisodeInfo(aid);
  if (!episodes) throw new Response('Not Found', { status: 404 });
  return json<LoaderData>({ episodes });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}/episodes`,
});

const EpisodesPage = () => {
  const { episodes } = useLoaderData<LoaderData>();
  const animeData: { detail: IAnimeInfo } | undefined = useRouteData('routes/anime/$animeId');
  const detail = animeData && animeData.detail;
  const isSm = useMediaQuery(650, 'max');
  const [visible, setVisible] = useState(false);
  const [episodeId, setEpisodeEpisodeId] = useState<string>();
  const [episodeNumber, setEpisodeNumber] = useState<number>();
  const closeHandler = () => {
    setVisible(false);
  };
  const [activeType, setActiveType] = useLocalStorage('activeEpisodeType', 0);
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(episodes || [], 50);

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
        {episodes && episodes.length > 0 && (
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
                        setEpisodeEpisodeId(episode.id);
                        setEpisodeNumber(episode.number);
                      }}
                      css={{
                        padding: 0,
                        minWidth: '40px',
                        margin: '0 0.5rem 0.5rem 0',
                      }}
                    >
                      {episode.number}
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
                          setEpisodeEpisodeId(episode.id);
                          setEpisodeNumber(episode.number);
                        }}
                      >
                        <Card.Body
                          css={{
                            p: 0,
                            flexFlow: 'row nowrap',
                            justifyContent: 'flex-start',
                          }}
                        >
                          {episode?.image ? (
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
                          )}
                          <Flex direction="column" justify="start" css={{ p: '1rem' }}>
                            <H5 h5 weight="semibold">
                              Episode{' '}
                              {isSm
                                ? `${episode?.number}`
                                : `${episode?.number}: ${episode?.title}`}
                            </H5>
                            {!isSm && episode.description && (
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
      </Col>
      <SelectProviderModal
        visible={visible}
        closeHandler={closeHandler}
        type="anime"
        title={detail?.title?.english || ''}
        origTitle={detail?.title?.native || ''}
        year={Number(detail?.releaseDate)}
        id={detail?.id}
        episodeId={episodeId}
        episode={episodeNumber}
      />
    </Row>
  );
};

export default EpisodesPage;
