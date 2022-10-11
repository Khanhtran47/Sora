/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as React from 'react';
import { Link } from '@remix-run/react';
import { Card, Col, Row, Button, Spacer, Avatar } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import tinycolor from 'tinycolor2';

// import { useTranslation } from 'react-i18next';

import { IAnimeInfo } from '~/services/consumet/anilist/anilist.types';
import useMediaQuery from '~/hooks/useMediaQuery';
import useSize, { IUseSize } from '~/hooks/useSize';
import Tab from '~/src/components/elements/Tab';
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
  console.log('🚀 ~ file: AnimeDetail.tsx ~ line 40 ~ AnimeDetail ~ item', item);
  const ref = React.useRef<HTMLDivElement>(null);
  const size: IUseSize = useSize(ref);

  const isXs = useMediaQuery(425, 'max');
  const isSm = useMediaQuery(650, 'max');
  const isMd = useMediaQuery(960, 'max');
  // TODO: style mobile in landscape mode
  // const isMdLand = useMediaQuery(960, 'max', 'landscape');

  const { id, genres, status, title, releaseDate, rating, image, cover, type, trailer, color } =
    item || {};

  const colorBackground = tinycolor(color).isDark()
    ? tinycolor(color).brighten(40).saturate(70).spin(180).toString()
    : tinycolor(color).darken(40).saturate(70).spin(180).toString();

  return (
    <Card
      variant="flat"
      css={{
        display: 'flex',
        flexFlow: 'column',
        width: '100vw',
        height: `calc(${JSON.stringify(size?.height)}px + 1rem)`,
        borderWidth: 0,
      }}
    >
      <Card.Header ref={ref} css={{ position: 'absolute', zIndex: 1, flexGrow: 1 }}>
        <Row
          fluid
          align="stretch"
          justify="center"
          css={{
            padding: 0,
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
                  width="50%"
                  css={{
                    minWidth: 'auto !important',
                    marginTop: '10vh',
                    borderRadius: '24px',
                  }}
                  loaderUrl="/api/image"
                  placeholder="blur"
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
                      width: '50% !important',
                      size: '$20',
                      minWidth: 'auto !important',
                      minHeight: '205px !important',
                      marginTop: '10vh',
                      borderRadius: '24px !important',
                    }}
                  />
                </Row>
              )}
              {(status === 'Completed' || status === 'Ongoing') && !isSm && (
                <Row align="center" justify="center">
                  <Button
                    auto
                    shadow
                    rounded
                    color="gradient"
                    css={{
                      width: '50%',
                      margin: '0.5rem 0 0.5rem 0',
                      '@xs': {
                        marginTop: '4vh',
                      },
                      '@sm': {
                        marginTop: '2vh',
                      },
                    }}
                  >
                    <Link
                      prefetch="intent"
                      to={`/anime/${item?.id}/episode/${
                        // eslint-disable-next-line no-unsafe-optional-chaining
                        item?.episodes[item?.episodes?.length > 1 ? item?.episodes.length - 1 : 0]
                          .id
                      }`}
                    >
                      <H5 h5 weight="bold" transform="uppercase">
                        Watch now
                      </H5>
                    </Link>
                  </Button>
                </Row>
              )}
            </Col>
          )}
          <Col
            span={isSm ? 12 : 8}
            css={{
              marginTop: `${isMd ? '8vh' : '10vh'}`,
              display: 'flex',
              flexFlow: 'column',
              justifyContent: 'flex-start',
            }}
          >
            {(status === 'Completed' || status === 'Ongoing') && isSm && (
              <>
                {image ? (
                  <>
                    <Row>
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
                        css={{
                          minWidth: 'auto !important',
                          marginTop: '2rem',
                          borderRadius: '24px',
                        }}
                        loaderUrl="/api/image"
                        placeholder="blur"
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
                )}
                <Row>
                  <Button
                    auto
                    shadow
                    rounded
                    color="gradient"
                    size="sm"
                    css={{
                      width: '100%',
                      minHeight: '36px',
                      margin: '0.5rem 0 0.5rem 0',
                      '@xs': {
                        marginTop: '4vh',
                      },
                      '@sm': {
                        marginTop: '2vh',
                      },
                    }}
                  >
                    <Link
                      prefetch="intent"
                      to={`/anime/${item?.id}/episode/${
                        // eslint-disable-next-line no-unsafe-optional-chaining
                        item?.episodes[item?.episodes?.length > 1 ? item?.episodes.length - 1 : 0]
                          .id
                      }`}
                    >
                      <H5 h5 weight="bold" transform="uppercase">
                        Watch now
                      </H5>
                    </Link>
                  </Button>
                </Row>
              </>
            )}
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
                  shadow
                  rounded
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
                width: `${isMd ? '100%' : '60%'}`,
                margin: '1.25rem 0 1.25rem 0',
              }}
            >
              {genres &&
                genres?.map((genre, index) => (
                  <>
                    <Button
                      auto
                      rounded
                      key={index}
                      size={isSm ? 'sm' : 'md'}
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
            <Tab pages={detailTab} linkTo={`/anime/${id}`} />
          </Col>
        </Row>
      </Card.Header>
      <Card.Body
        css={{
          p: 0,
          overflow: 'hidden',
          margin: 0,
          '&::after': {
            content: '',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100px',
            backgroundImage: 'linear-gradient(0deg, $background, $backgroundTransparent)',
          },
        }}
      >
        <Card.Image
          // @ts-ignore
          as={Image}
          src={cover || BackgroundDefault}
          css={{
            minHeight: '100vh !important',
            minWidth: '100vw !important',
            width: '100vw',
            height: `calc(${JSON.stringify(size?.height)}px + 1rem)`,
            top: 0,
            left: 0,
            objectFit: 'cover',
            opacity: 0.3,
          }}
          title={title?.userPreferred || title?.english || title?.romaji || title?.native}
          alt={title?.userPreferred || title?.english || title?.romaji || title?.native}
          loaderUrl="/api/image"
          placeholder="blur"
          responsive={[
            {
              size: {
                width: 375,
                height: 605,
              },
              maxWidth: 375,
            },
            {
              size: {
                width: 650,
                height: 605,
              },
              maxWidth: 650,
            },
            {
              size: {
                width: 960,
                height: 605,
              },
              maxWidth: 960,
            },
            {
              size: {
                width: 1280,
                height: 720,
              },
              maxWidth: 1280,
            },
            {
              size: {
                width: 1400,
                height: 787,
              },
            },
          ]}
          options={{
            contentType: MimeType.WEBP,
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default AnimeDetail;
