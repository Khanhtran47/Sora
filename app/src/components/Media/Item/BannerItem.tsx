import { Link } from '@remix-run/react';
import { Card, Row, Col, Loading, Text, Button, Spacer, useTheme } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { IMedia } from '~/services/tmdb/tmdb.types';
import useColorImage from '~/hooks/useColorImage';

interface IProps {
  item: IMedia;
}

const BannerItem = ({ item }: IProps) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const { backdropPath, overview, posterPath, title, id, mediaType } = item;

  const { loading, colorDarkenLighten } = useColorImage(posterPath, isDark);

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
                        {t('watchNow')}
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
                      {t('watchTrailer')}
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
              src={posterPath || ''}
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
              src={posterPath || ''}
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
          src={backdropPath || ''}
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

export default BannerItem;
