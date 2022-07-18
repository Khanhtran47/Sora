import { Link } from '@remix-run/react';
import { Card, Col, Text, Row, Button, useTheme } from '@nextui-org/react';
import { IMedia } from '~/services/tmdb.types';

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

const CardItem = ({ item }: { item: IMedia }) => {
  const { isDark } = useTheme();
  const { title, posterPath } = item;

  return (
    <Card variant="flat" css={{ borderWidth: 0 }}>
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
          bgBlur: isDark ? 'rgb(0 0 0 / 0.3)' : 'rgb(255 255 255 / 0.3)',
          bottom: 0,
          zIndex: 1,
          height: '80px',
          alignItems: 'center',
        }}
        className={isDark ? 'bg-black/30' : 'bg-white/30'}
      >
        <Text size={18} b transform="uppercase">
          {title}
        </Text>
      </Card.Footer>
    </Card>
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
