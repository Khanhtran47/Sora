import * as React from 'react';
import { Link } from '@remix-run/react';
import { Grid, Card, Col, Text, Row, Button, Tooltip, useTheme } from '@nextui-org/react';
import { IMedia } from '~/services/tmdb/tmdb.types';
import { useColor } from 'color-thief-react';

import { changeColor } from '~/utils/media';

interface IMediaItem {
  type: 'banner' | 'card';
  item: IMedia;
}

const BannerItem = ({ item }: { item: IMedia }) => {
  const { backdropPath, overview, posterPath, title, id, mediaType } = item;
  return (
    <Card variant="flat" css={{ w: '100vw', h: '100vh', borderWidth: 0 }}>
      <Card.Header css={{ position: 'absolute', zIndex: 1 }}>
        <Row>
          <Col
            css={{
              marginTop: '20vh',
              marginLeft: '5vw',
              marginRight: '5vw',
              '@sm': {
                marginLeft: '10vw',
              },
            }}
          >
            <Text
              size={28}
              weight="bold"
              transform="uppercase"
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
              <Col span={6}>
                <Button
                  auto
                  shadow
                  rounded
                  color="gradient"
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
              </Col>
              <Col span={6}>
                <Button
                  auto
                  shadow
                  rounded
                  bordered
                  color="gradient"
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
              </Col>
            </Row>
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
              width="50%"
              css={{
                marginTop: '20vh',
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
              width="70%"
              css={{
                marginTop: '20vh',
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
          css={{
            minHeight: '100vh',
            minWidth: '100vw',
            width: '100vw',
            height: '100vh',
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
  const { data, loading, error } = useColor(posterPath, 'hex', {
    crossOrigin: 'anonymous',
    quality: 1000,
  });
  const colorDarkenLighten = isDark ? changeColor(data, 100) : changeColor(data, -80);
  return (
    <Grid.Container
      css={{
        width: 'inherit',
        padding: '0.75rem',
        minWidth: '100px',
        maxWidth: '350px',
      }}
    >
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
    </Grid.Container>
  );
};

const CardItem = ({ item }: { item: IMedia }) => {
  const [style, setStyle] = React.useState<React.CSSProperties>({ display: 'none' });
  const { isDark } = useTheme();
  const { title, posterPath } = item;
  const { data, loading, error } = useColor(posterPath, 'hex', {
    crossOrigin: 'anonymous',
    quality: 1000,
  });
  const colorDarkenLighten = isDark ? changeColor(data, 100) : changeColor(data, -80);

  return (
    <Tooltip
      css={{
        width: 'fit-content',
      }}
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
          setStyle({ display: 'block' });
        }}
        onMouseLeave={() => {
          setStyle({ display: 'none' });
        }}
        className={isDark ? 'bg-black/70' : 'bg-white/70'}
      >
        <Card.Image
          src={posterPath}
          objectFit="cover"
          width="100%"
          height={340}
          alt="Card image background"
        />
        <Card.Footer
          isBlurred
          css={{
            position: 'absolute',
            bgBlur: isDark ? 'rgb(0 0 0 / 0.7)' : 'rgb(255 255 255 / 0.7)',
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
          <Text size={18} b transform="uppercase" color={colorDarkenLighten}>
            {title}
          </Text>
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
