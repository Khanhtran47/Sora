/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react';
import { MetaFunction } from '@remix-run/node';
import { Row, Col, Spacer, Card, Avatar } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import Image, { MimeType } from 'remix-image';

import { IAnimeInfo } from '~/services/consumet/anilist/anilist.types';
import useMediaQuery from '~/hooks/useMediaQuery';

import { H3, H5, H6 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';
import SelectProviderModal from '~/src/components/elements/modal/SelectProviderModal';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-movie.vercel.app/anime/${params.animeId}/episodes`,
});

const EpisodesPage = () => {
  const animeData: { detail: IAnimeInfo } | undefined = useRouteData('routes/anime/$animeId');
  const detail = animeData && animeData.detail;
  const isSm = useMediaQuery(650, 'max');
  const [visible, setVisible] = useState(false);
  const [episodeId, setEpisodeEpisodeId] = useState<string>();
  const [episodeNumber, setEpisodeNumber] = useState<number>();
  const closeHandler = () => {
    setVisible(false);
  };
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
        {detail?.episodes && detail.episodes.length > 0 && (
          <>
            <H3 h3 css={{ margin: '20px 0 20px 0' }}>
              Episodes
            </H3>
            {detail.episodes.map((episode) => (
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
                        alt={episode?.title}
                        title={episode?.title}
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
                        {isSm ? `${episode?.number}` : `${episode?.number}: ${episode?.title}`}
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
            ))}
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
