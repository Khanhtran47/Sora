/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, Button, Spacer, Avatar, Tooltip } from '@nextui-org/react';
import { useNavigate, useLocation, useFetcher } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';
import tinycolor from 'tinycolor2';
// import { useTranslation } from 'react-i18next';

import { IAnimeInfo } from '~/services/consumet/anilist/anilist.types';
import { ColorPalette } from '~/routes/api/color-palette';

import { WebShareLink } from '~/utils/client/pwa-utils.client';

import { useMediaQuery } from '@react-hookz/web';
import useSize, { IUseSize } from '~/hooks/useSize';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';

import TabLink from '~/components/elements/tab/TabLink';
import { H2, H5, H6 } from '~/components/styles/Text.styles';
import Flex from '~/components/styles/Flex.styles';
import SelectProviderModal from '~/components/elements/modal/SelectProviderModal';
import Rating from '~/components/elements/shared/Rating';

import PhotoIcon from '~/assets/icons/PhotoIcon';
import ShareIcon from '~/assets/icons/ShareIcon';
import BackgroundDefault from '~/assets/images/background-default.jpg';

import { BackgroundContent, BackgroundTabLink } from './Media.styles';

interface IAnimeDetail {
  item: IAnimeInfo | undefined;
  handler?: (id: number) => void;
}

const detailTab = [
  { pageName: 'Overview', pageLink: '/overview' },
  { pageName: 'Episodes', pageLink: '/episodes' },
  { pageName: 'Character', pageLink: '/characters' },
  { pageName: 'Staff', pageLink: '/staff' },
];

const AnimeDetail = (props: IAnimeDetail) => {
  // const { t } = useTranslation();
  const { item, handler } = props;
  const {
    id,
    genres,
    title,
    releaseDate,
    rating,
    image,
    cover,
    type,
    trailer,
    color,
    description,
  } = item || {};
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  const ref = useRef<HTMLDivElement>(null);
  const size: IUseSize = useSize(ref);
  const { backgroundColor } = useColorDarkenLighten(color);
  const isXs = useMediaQuery('(max-width: 425px)', { initializeWithValue: false });
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const isMd = useMediaQuery('(max-width: 960px)', { initializeWithValue: false });
  const isLg = useMediaQuery('(max-width: 1280px)', { initializeWithValue: false });
  const [visible, setVisible] = useState(false);
  const [colorPalette, setColorPalette] = useState<ColorPalette>();
  const closeHandler = () => {
    setVisible(false);
  };
  const backgroundImageHeight = isXs ? 80 : isSm ? 119 : isMd ? 178 : isLg ? 267 : 400;
  const backgroundGradientHeight = isXs ? 30 : isSm ? 50 : isMd ? 70 : isLg ? 90 : 110;

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
    }
  }, [ref, location.pathname]);

  useEffect(() => {
    if (color?.startsWith('#')) {
      fetcher.load(`/api/color-palette?color=${color.replace('#', '')}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.color) {
      setColorPalette(fetcher.data.color);
    }
  }, [fetcher.data]);

  return (
    <>
      <Card
        variant="flat"
        css={{
          display: 'flex',
          flexFlow: 'column',
          width: '100%',
          height: `calc(${JSON.stringify(size?.height)}px + ${backgroundImageHeight}px - 2rem)`,
          borderWidth: 0,
          backgroundColor,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Card.Body
          css={{
            p: 0,
            overflow: 'hidden',
            margin: 0,
            '&::after': {
              content: '',
              position: 'absolute',
              top: `calc(${backgroundImageHeight}px - ${backgroundGradientHeight}px)`,
              left: 0,
              width: '100%',
              height: `${backgroundGradientHeight}px`,
              backgroundImage: `linear-gradient(to top, ${backgroundColor}, ${tinycolor(
                backgroundColor,
              ).setAlpha(0)})`,
            },
          }}
        >
          <Card.Image
            // @ts-ignore
            as={Image}
            src={cover || BackgroundDefault}
            css={{
              minHeight: `${backgroundImageHeight}px !important`,
              minWidth: '100% !important',
              width: '100%',
              height: `${backgroundImageHeight}px !important`,
              top: 0,
              left: 0,
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.8,
            }}
            title={title?.userPreferred || title?.english || title?.romaji || title?.native}
            alt={title?.userPreferred || title?.english || title?.romaji || title?.native}
            containerCss={{ margin: 0 }}
            showSkeleton
            loaderUrl="/api/image"
            placeholder="empty"
            responsive={[
              {
                size: {
                  width: 376,
                  height: 80,
                },
                maxWidth: 375,
              },
              {
                size: {
                  width: 564,
                  height: 119,
                },
                maxWidth: 650,
              },
              {
                size: {
                  width: 845,
                  height: 178,
                },
                maxWidth: 960,
              },
              {
                size: {
                  width: 1267,
                  height: 267,
                },
                maxWidth: 1280,
              },
              {
                size: {
                  width: 1900,
                  height: 400,
                },
              },
            ]}
            options={{
              contentType: MimeType.WEBP,
            }}
          />
        </Card.Body>
        <Card.Footer
          ref={ref}
          css={{
            position: 'absolute',
            zIndex: 1,
            bottom: 0,
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <BackgroundContent />
          <Row
            fluid
            align="stretch"
            justify="center"
            css={{
              px: '0.75rem',
              paddingTop: '1.25rem',
              '@xs': {
                px: '3vw',
              },
              '@sm': {
                px: '6vw',
              },
              '@md': {
                px: '12vw',
              },
              '@lg': {
                px: '20px',
              },
              maxWidth: '1920px',
            }}
          >
            {!isSm && (
              <Col span={4}>
                {image ? (
                  <Card.Image
                    // @ts-ignore
                    as={Image}
                    src={image}
                    title={title?.userPreferred || title?.english || title?.romaji || title?.native}
                    alt={title?.userPreferred || title?.english || title?.romaji || title?.native}
                    objectFit="cover"
                    width={isLg ? '75%' : isMd ? '100%' : '50%'}
                    showSkeleton
                    containerCss={{ overflow: 'visible' }}
                    css={{
                      minWidth: 'auto !important',
                      minHeight: '205px !important',
                      borderRadius: '24px',
                      boxShadow: '12px 12px 30px 10px rgb(104 112 118 / 0.35)',
                    }}
                    loaderUrl="/api/image"
                    placeholder="empty"
                    responsive={[
                      {
                        size: {
                          width: 137,
                          height: 205,
                        },
                        maxWidth: 960,
                      },
                      {
                        size: {
                          width: 158,
                          height: 237,
                        },
                        maxWidth: 1280,
                      },
                      {
                        size: {
                          width: 173,
                          height: 260,
                        },
                        maxWidth: 1400,
                      },
                      {
                        size: {
                          width: 239,
                          height: 359,
                        },
                      },
                    ]}
                    options={{
                      contentType: MimeType.WEBP,
                    }}
                  />
                ) : (
                  <Row align="center" justify="center">
                    <Avatar
                      icon={<PhotoIcon width={48} height={48} />}
                      css={{
                        width: `${isLg ? '75%' : isMd ? '100%' : '50%'} !important`,
                        size: '$20',
                        minWidth: 'auto !important',
                        minHeight: '205px !important',
                        borderRadius: '24px !important',
                      }}
                    />
                  </Row>
                )}
                <Spacer y={2} />
              </Col>
            )}
            <Col
              span={isSm ? 12 : 8}
              css={{
                display: 'flex',
                flexFlow: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Flex direction="column" justify="center" align="start">
                {isSm && (
                  <>
                    <Spacer y={1.5} />
                    {image ? (
                      <Card.Image
                        // @ts-ignore
                        as={Image}
                        src={image}
                        title={
                          title?.userPreferred || title?.english || title?.romaji || title?.native
                        }
                        alt={
                          title?.userPreferred || title?.english || title?.romaji || title?.native
                        }
                        objectFit="cover"
                        width={isXs ? '70%' : '40%'}
                        containerCss={{
                          borderRadius: '24px',
                          overflow: 'visible',
                        }}
                        showSkeleton
                        css={{
                          minWidth: 'auto !important',
                          minHeight: '205px !important',
                          borderRadius: '24px',
                          boxShadow: '12px 12px 30px 10px rgb(104 112 118 / 0.35)',
                        }}
                        loaderUrl="/api/image"
                        placeholder="empty"
                        options={{
                          contentType: MimeType.WEBP,
                        }}
                        responsive={[
                          {
                            size: {
                              width: 246,
                              height: 369,
                            },
                            maxWidth: 375,
                          },
                          {
                            size: {
                              width: 235,
                              height: 352,
                            },
                          },
                        ]}
                      />
                    ) : (
                      <Row align="center" justify="center">
                        <Avatar
                          icon={<PhotoIcon width={48} height={48} />}
                          css={{
                            width: `${isXs ? '70%' : '40%'} !important`,
                            size: '$20',
                            minWidth: 'auto !important',
                            minHeight: '205px !important',
                            borderRadius: '24px !important',
                          }}
                        />
                      </Row>
                    )}
                    <Spacer y={1.25} />
                  </>
                )}
                <H2 h1 weight="bold">
                  {`${title?.userPreferred || title?.english || title?.romaji || title?.native}`}
                </H2>
                <Row justify="flex-start" align="center">
                  {rating ? (
                    <Flex direction="row" justify="center" align="center">
                      <Rating rating={rating} ratingType="anime" />
                      <Spacer x={0.5} />
                    </Flex>
                  ) : null}
                  {releaseDate ? <H6 h6>{`${type} • ${releaseDate}`}</H6> : null}
                </Row>
                <Row
                  fluid
                  align="center"
                  wrap="wrap"
                  justify="flex-start"
                  css={{
                    width: '100%',
                    margin: '1.25rem 0 1.25rem 0',
                  }}
                >
                  {genres &&
                    genres?.map((genre, index) => (
                      <>
                        <Button
                          type="button"
                          auto
                          flat
                          key={index}
                          size={isSm ? 'sm' : 'md'}
                          onPress={() => navigate(`/anime/discover?genres=${genre}`)}
                          css={{
                            marginBottom: '0.125rem',
                            transition: 'all 0.3s ease-in-out',
                            ...(colorPalette && {
                              color: colorPalette[600],
                              backgroundColor: colorPalette[200],
                              '&:hover': {
                                backgroundColor: colorPalette[300],
                              },
                            }),
                          }}
                        >
                          {genre}
                        </Button>
                        <Spacer x={0.25} />
                      </>
                    ))}
                </Row>
              </Flex>
              <Row
                fluid
                justify="space-between"
                align="center"
                wrap="wrap"
                css={{ marginBottom: '2.55rem' }}
              >
                <Button
                  type="button"
                  auto
                  // shadow
                  color="gradient"
                  onPress={() => setVisible(true)}
                  css={{
                    '@xsMax': {
                      width: '100%',
                    },
                  }}
                >
                  <H5 h5 weight="bold" transform="uppercase">
                    Watch now
                  </H5>
                </Button>
                <Flex direction="row" align="center" justify="start" wrap="wrap">
                  {trailer && trailer.site === 'youtube' ? (
                    <>
                      <Button
                        type="button"
                        auto
                        // shadow
                        flat
                        onPress={() => handler && handler(Number(id))}
                        css={{ margin: '0.5rem 0' }}
                      >
                        Watch Trailer
                      </Button>
                      <Spacer x={0.5} />
                    </>
                  ) : null}
                  <Tooltip content="Share" placement="top" isDisabled={isSm}>
                    <Button
                      type="button"
                      auto
                      flat
                      onPress={() =>
                        WebShareLink(window.location.href, `${title}`, `${description}`)
                      }
                      icon={<ShareIcon />}
                    />
                  </Tooltip>
                </Flex>
              </Row>
            </Col>
          </Row>
          <Row
            fluid
            css={{
              paddingTop: '1rem',
              paddingBottom: '2rem',
              borderRadius: 0,
            }}
            justify="center"
          >
            <BackgroundTabLink css={{ backgroundColor }} />
            <TabLink pages={detailTab} linkTo={`/anime/${id}`} />
          </Row>
        </Card.Footer>
      </Card>
      <SelectProviderModal
        visible={visible}
        closeHandler={closeHandler}
        type="anime"
        id={id}
        title={title?.english || ''}
        origTitle={title?.native || ''}
        year={Number(releaseDate)}
        episode={1}
        season={undefined}
        animeType={type?.toLowerCase() || 'tv'}
      />
    </>
  );
};

export default AnimeDetail;
