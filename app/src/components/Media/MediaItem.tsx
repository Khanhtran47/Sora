import * as React from 'react';
import { Link } from '@remix-run/react';
import {
  Grid,
  Card,
  Col,
  Text,
  Row,
  Button,
  Tooltip,
  Spacer,
  Loading,
  useTheme,
} from '@nextui-org/react';
import { IMedia } from '~/services/tmdb/tmdb.types';
import { useColor } from 'color-thief-react';
import tinycolor from 'tinycolor2';

interface IMediaItem {
  type: 'banner' | 'card';
  item: IMedia;
}

const BannerItem = ({ item }: { item: IMedia }) => {
  const { isDark } = useTheme();
  const { backdropPath, overview, posterPath, title, id, mediaType } = item;
  const {
    data,
    loading,
    // error,
  } = useColor(`https://api.allorigins.win/raw?url=${encodeURIComponent(posterPath)}`, 'hex', {
    crossOrigin: 'anonymous',
  });
  let colorDarkenLighten = '';
  if (isDark) {
    colorDarkenLighten = !tinycolor(data).isLight()
      ? tinycolor(data).brighten(70).saturate(70).toString()
      : tinycolor(data).saturate(70).toString();
  } else {
    colorDarkenLighten = !tinycolor(data).isDark()
      ? tinycolor(data).darken().saturate(100).toString()
      : tinycolor(data).saturate(70).toString();
  }
  return (
    <Card variant="flat" css={{ w: '100%', h: '70vh', borderWidth: 0 }}>
      <Card.Header css={{ position: 'absolute', zIndex: 1 }}>
        <Row>
          <Col
            css={{
              marginTop: '10vh',
              marginLeft: '5vw',
              marginRight: '5vw',
              '@sm': {
                marginLeft: '10vw',
              },
            }}
          >
            {loading ? (
              <Loading type="default" size="xl" />
            ) : (
              <>
                <Text
                  size={28}
                  weight="bold"
                  color={colorDarkenLighten}
                  css={{
                    margin: 0,
                    '@xs': {
                      fontSize: '40px',
                    },
                    '@sm': {
                      fontSize: '50px',
                    },
                    '@md': {
                      fontSize: '68px',
                    },
                  }}
                >
                  {title}
                </Text>
                <Text
                  size={12}
                  weight="bold"
                  css={{
                    margin: '5vh 0 0 0',
                    textAlign: 'justify',
                    '@xs': {
                      fontSize: '16px',
                    },
                    '@sm': {
                      fontSize: '18px',
                    },
                  }}
                >
                  {overview}
                </Text>
                <Row>
                  <Button
                    auto
                    shadow
                    rounded
                    css={{
                      marginTop: '5vh',
                    }}
                  >
                    <Link to={`/${mediaType === 'movie' ? 'movies/' : 'tv-shows/'}${id}`}>
                      <Text
                        size={12}
                        weight="bold"
                        transform="uppercase"
                        css={{
                          '@xs': {
                            fontSize: '18px',
                          },
                          '@sm': {
                            fontSize: '20px',
                          },
                        }}
                      >
                        Watch now
                      </Text>
                    </Link>
                  </Button>
                  <Spacer y={1} />
                  <Button
                    auto
                    shadow
                    rounded
                    bordered
                    css={{
                      marginTop: '5vh',
                    }}
                  >
                    <Text
                      size={12}
                      weight="bold"
                      transform="uppercase"
                      css={{
                        '@xs': {
                          fontSize: '18px',
                        },
                        '@sm': {
                          fontSize: '20px',
                        },
                      }}
                    >
                      Watch trailer
                    </Text>
                  </Button>
                </Row>
              </>
            )}
          </Col>
          <Col
            css={{
              '@smMax': {
                display: 'none',
              },
            }}
          >
            <Card.Image
              src={posterPath}
              alt={title}
              objectFit="cover"
              width="40%"
              css={{
                marginTop: '10vh',
                borderRadius: '24px',
                '@mdMax': {
                  display: 'none',
                },
              }}
            />
            <Card.Image
              src={posterPath}
              alt={title}
              objectFit="cover"
              width="50%"
              css={{
                marginTop: '10vh',
                borderRadius: '24px',
                '@md': {
                  display: 'none',
                },
              }}
            />
          </Col>
        </Row>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          src={backdropPath}
          containerCss={{
            '&::after': {
              content: '',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '100px',
              backgroundImage: isDark
                ? 'linear-gradient(0deg, rgb(0,0,0), rgba(0, 0, 0, 0))'
                : 'linear-gradient(0deg, rgb(255,255,255), rgba(255,255,255, 0))',
            },
          }}
          css={{
            width: '100%',
            minHeight: '70vh',
            height: 'auto',
            top: 0,
            left: 0,
            objectFit: 'cover',
            opacity: 0.3,
          }}
          alt="Card example background"
        />
      </Card.Body>
    </Card>
  );
};

const CardItemHover = ({ item }: { item: IMedia }) => {
  const { isDark } = useTheme();
  const { title, overview, releaseDate, voteAverage, mediaType, posterPath } = item;
  // TODO: add spinner on loading color
  const {
    data,
    loading,
    // error,
  } = useColor(`https://api.allorigins.win/raw?url=${encodeURIComponent(posterPath)}`, 'hex', {
    crossOrigin: 'anonymous',
  });
  let colorDarkenLighten = '';
  if (isDark) {
    colorDarkenLighten = !tinycolor(data).isLight()
      ? tinycolor(data).brighten(70).saturate(70).toString()
      : tinycolor(data).saturate(70).toString();
  } else {
    colorDarkenLighten = !tinycolor(data).isDark()
      ? tinycolor(data).darken().saturate(100).toString()
      : tinycolor(data).saturate(70).toString();
  }
  return (
    <Grid.Container
      css={{
        width: 'inherit',
        padding: '0.75rem',
        minWidth: '100px',
        maxWidth: '350px',
      }}
    >
      {loading ? (
        <Loading type="points-opacity" />
      ) : (
        <>
          <Row justify="center" align="center">
            <Text size={18} b color={colorDarkenLighten}>
              {title}
            </Text>
          </Row>
          {overview && (
            <Row>
              <Text>{`${overview?.substring(0, 100)}...`}</Text>
            </Row>
          )}
          <Grid.Container justify="space-between" alignContent="center">
            {releaseDate && (
              <Grid>
                <Text>{`${mediaType === 'movie' ? 'Movie' : 'TV-Shows'} • ${releaseDate}`}</Text>
              </Grid>
            )}
            {voteAverage && (
              <Grid>
                <Text>{`Vote Average: ${voteAverage}`}</Text>
              </Grid>
            )}
          </Grid.Container>
        </>
      )}
    </Grid.Container>
  );
};

const CardItem = ({ item }: { item: IMedia }) => {
  const [style, setStyle] = React.useState<React.CSSProperties>({ display: 'block' });
  const { isDark } = useTheme();
  // TODO: add spinner on loading color
  const { title, posterPath } = item;
  const {
    data,
    loading,
    // error,
  } = useColor(`https://api.allorigins.win/raw?url=${encodeURIComponent(posterPath)}`, 'hex', {
    crossOrigin: 'anonymous',
  });
  let colorDarkenLighten = '';
  if (isDark) {
    colorDarkenLighten = !tinycolor(data).isLight()
      ? tinycolor(data).brighten(70).saturate(70).toString()
      : tinycolor(data).saturate(70).toString();
  } else {
    colorDarkenLighten = !tinycolor(data).isDark()
      ? tinycolor(data).darken().saturate(100).toString()
      : tinycolor(data).saturate(70).toString();
  }

  return (
    <Tooltip
      placement="bottom"
      content={<CardItemHover item={item} />}
      rounded
      shadow
      className="!w-fit"
    >
      <Card
        as="div"
        variant="flat"
        css={{ borderWidth: 0 }}
        onMouseEnter={() => {
          setStyle({ display: 'none' });
        }}
        onMouseLeave={() => {
          setStyle({ display: 'block' });
        }}
        className={isDark ? 'bg-black/70' : 'bg-white/70'}
      >
        <Card.Image
          src={posterPath}
          objectFit="cover"
          width="100%"
          height={340}
          alt="Card image background"
          showSkeleton
          maxDelay={10000}
        />
        <Card.Footer
          isBlurred
          css={{
            position: 'absolute',
            bgBlur: isDark ? 'rgb(0 0 0 / 0.8)' : 'rgb(255 255 255 / 0.8)',
            bottom: 0,
            zIndex: 1,
            height: '80px',
            alignItems: 'center',
            '@sm': {
              height: '100px',
              ...style,
            },
          }}
          className={isDark ? 'bg-black/30' : 'bg-white/30'}
        >
          {loading ? (
            <Loading type="points-opacity" />
          ) : (
            <Text
              size={14}
              b
              color={colorDarkenLighten}
              css={{
                '@xs': {
                  fontSize: '16px',
                },
                '@sm': {
                  fontSize: '18px',
                },
              }}
            >
              {title}
            </Text>
          )}
        </Card.Footer>
      </Card>
    </Tooltip>
  );
};

const MediaItem = (props: IMediaItem) => {
  const { type, item } = props;

  if (type === 'banner') {
    return <BannerItem item={item} />;
  }
  return <CardItem item={item} />;
};

export default MediaItem;
