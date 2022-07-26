import { Link } from '@remix-run/react';
import { Card, Col, Text, Row, Button, Progress } from '@nextui-org/react';
import { IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';

interface IMediaDetail {
  type: 'movie' | 'tv';
  item: IMovieDetail | ITvShowDetail | undefined;
}

const MediaDetail = (props: IMediaDetail) => {
  const { type, item } = props;

  const { title, id, tagline, runtime, genres } = item || {};
  const posterPath = TMDB?.posterUrl(item?.poster_path || '', 'w500');
  const backdropPath = TMDB?.backdropUrl(item?.backdrop_path || '', 'original');
  const releaseYear = new Date(item?.release_date).getFullYear();
  return (
    <Card
      variant="flat"
      css={{
        width: '100vw',
        height: '100vh',
        borderWidth: 0,
        '@xs': {
          height: '50vh',
        },
      }}
    >
      <Card.Header css={{ position: 'absolute', zIndex: 1 }}>
        <Row
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
                '@xsMax': {
                  display: 'none',
                },
              }}
            />
          </Col>
          <Col
            span={8}
            css={{
              marginTop: '8vh',
            }}
          >
            <Card.Image
              src={posterPath}
              alt={title}
              objectFit="cover"
              width="70%"
              css={{
                marginTop: '8vh',
                borderRadius: '24px',
                '@xs': {
                  display: 'none',
                },
              }}
            />
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
            <Row
              align="center"
              css={{
                margin: '20px 0 0 0',
              }}
            >
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
              <Col span={7} css={{ marginLeft: '60px' }}>
                <Progress
                  value={item?.vote_average}
                  shadow
                  max={10}
                  color="primary"
                  status="primary"
                />
              </Col>
            </Row>
            <Row
              align="center"
              css={{
                margin: '20px 0 0 0',
              }}
            >
              <Col span={4}>
                <Text
                  size={12}
                  css={{
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
                  Duration: {runtime && `${Math.floor(runtime / 60)}h ${runtime % 60}m`}
                </Text>
              </Col>
              <Col span={5}>
                <Row>
                  {genres &&
                    genres?.map((genre) => (
                      <Col key={genre?.id} css={{ marginRight: '10px' }}>
                        <Button color="primary" auto ghost rounded shadow>
                          {genre?.name}
                        </Button>
                      </Col>
                    ))}
                </Row>
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
                    marginTop: '8vh',
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
                    to={`/${type === 'movie' ? 'movies' : 'tv-shows'}/watch/${id}`}
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
                    marginTop: '8vh',
                    '@xs': {
                      marginTop: '4vh',
                    },
                    '@sm': {
                      marginTop: '2vh',
                    },
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
