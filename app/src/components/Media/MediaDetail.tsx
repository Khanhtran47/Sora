import { Link } from '@remix-run/react';
import { Card, Col, Text, Row, Button, Progress, useTheme } from '@nextui-org/react';
import { IMovieDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/mediaUrl';

interface IMediaDetail {
  type: 'movie' | 'tv';
  item: IMovieDetail | undefined;
}

const MediaDetail = (props: IMediaDetail) => {
  const { type, item } = props;

  const { title, id, tagline, runtime } = item || {};
  const posterPath = TMDB?.posterUrl(item?.poster_path || '', 'w500');
  const backdropPath = TMDB?.backdropUrl(item?.backdrop_path || '', 'original');
  const releaseYear = new Date(item?.release_date).getFullYear();
  console.log(releaseYear);
  return (
    <Card
      variant="flat"
      css={{
        w: '100vw',
        h: '50vh',
        borderWidth: 0,
      }}
    >
      <Card.Header css={{ position: 'absolute', zIndex: 1 }}>
        <Row
          css={{
            padding: '0 12vw',
          }}
        >
          <Col
            span={4}
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
                marginTop: '8vh',
                borderRadius: '24px',
                '@mdMax': {
                  display: 'none',
                },
              }}
            />
            {/* <Card.Image
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
            /> */}
          </Col>
          <Col
            span={8}
            css={{
              marginTop: '8vh',
            }}
          >
            <Text
              size={18}
              weight="bold"
              transform="uppercase"
              css={{
                margin: 0,
                '@xs': {
                  fontSize: '24px',
                },
                '@sm': {
                  fontSize: '30px',
                },
                '@md': {
                  fontSize: '36px',
                },
              }}
            >
              {`${title} (${releaseYear})`}
            </Text>
            {tagline && (
              <Text
                size={12}
                i
                css={{
                  margin: 0,
                  '@xs': {
                    fontSize: '14px',
                  },
                  '@sm': {
                    fontSize: '16px',
                  },
                  '@md': {
                    fontSize: '18px',
                  },
                }}
              >
                {tagline}
              </Text>
            )}
            <Text
              size={12}
              css={{
                margin: '20px 0 0 0',
                '@xs': {
                  fontSize: '14px',
                },
                '@sm': {
                  fontSize: '16px',
                },
                '@md': {
                  fontSize: '18px',
                },
              }}
            >
              {runtime && `${Math.floor(runtime / 60)}h ${runtime % 60}m`}
            </Text>
            <Row align="center">
              <Col span={1}>
                <Text
                  size={12}
                  css={{
                    margin: 0,
                    '@xs': {
                      fontSize: '14px',
                    },
                    '@sm': {
                      fontSize: '16px',
                    },
                    '@md': {
                      fontSize: '18px',
                    },
                  }}
                >
                  User Score
                </Text>
              </Col>
              <Col span={6} offset={1}>
                {/* TODO: add tooltip for showing vote_average */}
                <Progress value={item?.vote_average * 10} shadow color="primary" status="primary" />
              </Col>
            </Row>
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
                  <Link to={`/${type === 'movie' ? 'movies/' : 'tv-shows/'}${id}`}>
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

export default MediaDetail;
