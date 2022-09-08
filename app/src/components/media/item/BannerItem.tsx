import { Button, Card, Col, Row, Spacer, Text } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { IMedia } from '~/services/tmdb/tmdb.types';

type BannerItemProps = {
  item: IMedia;
  handler?: (id: number, type: 'movie' | 'tv') => void;
};

const BannerItem = ({ item, handler }: BannerItemProps) => {
  const { t } = useTranslation();

  const { backdropPath, overview, posterPath, title, id, mediaType } = item;
  const { isDark, colorDarkenLighten } = useColorDarkenLighten(posterPath);

  return (
    <Card variant="flat" css={{ w: '100%', h: '70vh', borderWidth: 0 }} role="figure">
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
            <Text
              size={28}
              weight="bold"
              color={colorDarkenLighten || undefined}
              css={{
                transition: 'color 0.25s ease 0s',
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
              {overview && overview.length > 400 ? `${overview?.substring(0, 400)}...` : overview}
            </Text>
            <Row wrap="wrap">
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
                onClick={() => handler && handler(Number(id), mediaType)}
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
              title={title}
              objectFit="cover"
              width="40%"
              css={{
                marginTop: '10vh',
                borderRadius: '24px',
                '@mdMax': {
                  display: 'none',
                },
              }}
              loading="lazy"
            />
            <Card.Image
              src={posterPath || ''}
              alt={title}
              title={title}
              objectFit="cover"
              width="50%"
              css={{
                marginTop: '10vh',
                borderRadius: '24px',
                '@md': {
                  display: 'none',
                },
              }}
              loading="lazy"
            />
          </Col>
        </Row>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          src={backdropPath || ''}
          containerCss={{
            margin: 0,
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
          alt={title}
          title={title}
          loading="lazy"
        />
      </Card.Body>
    </Card>
  );
};

export default BannerItem;
