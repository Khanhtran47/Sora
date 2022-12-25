/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef } from 'react';
import { Card, Col, Row, Button, Spacer, Avatar } from '@nextui-org/react';
import { useNavigate, useLocation } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';
import tinycolor from 'tinycolor2';

// import { useTranslation } from 'react-i18next';

import { IAnimeInfo } from '~/services/consumet/anilist/anilist.types';
import useMediaQuery from '~/hooks/useMediaQuery';
import useSize, { IUseSize } from '~/hooks/useSize';

import TabLink from '~/src/components/elements/tab/TabLink';
import { H2, H5 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';
import AnilistStatIcon from '~/src/assets/icons/AnilistStatIcon.js';
import BackgroundDefault from '~/src/assets/images/background-default.jpg';

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
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const size: IUseSize = useSize(ref);

  const isXs = useMediaQuery('(max-width: 425px)');
  const isSm = useMediaQuery('(max-width: 650px)');
  const isMd = useMediaQuery('(max-width: 960px)');
  const isLg = useMediaQuery('(max-width: 1280px)');

  const backgroundImageHeight = isXs ? 80 : isSm ? 119 : isMd ? 178 : isLg ? 267 : 400;
  const backgroundGradientHeight = isXs ? 30 : isSm ? 50 : isMd ? 70 : isLg ? 90 : 110;

  const { id, genres, title, releaseDate, rating, image, cover, type, trailer, color } = item || {};

  const colorBackground = tinycolor(color).isDark()
    ? tinycolor(color).brighten(40).saturate(70).spin(180).toString()
    : tinycolor(color).darken(40).saturate(70).spin(180).toString();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [ref, location.pathname]);

  return (
    <Card
      variant="flat"
      css={{
        display: 'flex',
        flexFlow: 'column',
        width: '100%',
        height: `calc(${JSON.stringify(size?.height)}px + ${backgroundImageHeight}px - 2rem)`,
        borderWidth: 0,
        backgroundColor: '$background',
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
            backgroundImage: 'linear-gradient(0deg, $background, $backgroundTransparent)',
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
        }}
      >
        <Row
          fluid
          align="stretch"
          justify="center"
          css={{
            px: '0.75rem',
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
                  css={{
                    minWidth: 'auto !important',
                    minHeight: '205px !important',
                    borderRadius: '24px',
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
            </Col>
          )}
          <Col
            span={isSm ? 12 : 8}
            css={{
              display: 'flex',
              flexFlow: 'column',
              justifyContent: 'flex-start',
            }}
          >
            {isSm &&
              (image ? (
                <>
                  <Row>
                    <Card.Image
                      // @ts-ignore
                      as={Image}
                      src={image}
                      title={
                        title?.userPreferred || title?.english || title?.romaji || title?.native
                      }
                      alt={title?.userPreferred || title?.english || title?.romaji || title?.native}
                      objectFit="cover"
                      width={isXs ? '70%' : '40%'}
                      showSkeleton
                      css={{
                        minWidth: 'auto !important',
                        minHeight: '205px !important',
                        marginTop: '2rem',
                        borderRadius: '24px',
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
                  </Row>
                  <Spacer y={1} />
                </>
              ) : (
                <>
                  <Row align="center" justify="center">
                    <Avatar
                      icon={<PhotoIcon width={48} height={48} />}
                      css={{
                        width: `${isXs ? '70%' : '40%'} !important`,
                        size: '$20',
                        minWidth: 'auto !important',
                        minHeight: '205px !important',
                        marginTop: '2rem',
                        borderRadius: '24px !important',
                      }}
                    />
                  </Row>
                  <Spacer y={1} />
                </>
              ))}
            <Row>
              <H2 h2 weight="bold">
                {`${title?.userPreferred || title?.english || title?.romaji || title?.native}`}
              </H2>
            </Row>
            <Row justify="flex-start" align="center">
              {rating && (
                <Flex direction="row" justify="center" align="center">
                  {Number(rating) > 75 ? (
                    <AnilistStatIcon stat="good" />
                  ) : Number(rating) > 60 ? (
                    <AnilistStatIcon stat="average" />
                  ) : (
                    <AnilistStatIcon stat="bad" />
                  )}
                  <Spacer x={0.25} />
                  <H5 weight="bold">{rating}%</H5>
                </Flex>
              )}
              <Spacer x={0.5} />
              {releaseDate && <H5 h5>{`${type} • ${releaseDate}`}</H5>}
            </Row>
            <Spacer y={1} />
            {trailer && trailer.site === 'youtube' && (
              <Row>
                <Button
                  auto
                  // shadow
                  size={isSm ? 'sm' : 'md'}
                  onClick={() => handler && handler(Number(id))}
                >
                  <H5 h5 transform="uppercase">
                    Watch Trailer
                  </H5>
                </Button>
              </Row>
            )}
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
                      auto
                      key={index}
                      size={isSm ? 'sm' : 'md'}
                      onClick={() => navigate(`/anime/discover?genres=${genre}`)}
                      css={{
                        marginBottom: '0.125rem',
                        background: color,
                        color: colorBackground,
                        '&:hover': {
                          background: colorBackground,
                          color,
                        },
                      }}
                    >
                      {genre}
                    </Button>
                    <Spacer x={1} />
                  </>
                ))}
            </Row>
            <TabLink pages={detailTab} linkTo={`/anime/${id}`} />
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default AnimeDetail;
