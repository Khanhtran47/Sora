/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Card, Col, Row, Spacer, Text } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import Image, { MimeType } from 'remix-image';
import { useInView } from 'react-intersection-observer';

import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import useMediaQuery from '~/hooks/useMediaQuery';
import { IMedia } from '~/services/tmdb/tmdb.types';

type BannerItemProps = {
  item: IMedia;
  handler?: (id: number, type: 'movie' | 'tv') => void;
};

const BannerItem = ({ item, handler }: BannerItemProps) => {
  const { t } = useTranslation();
  const { backdropPath, overview, posterPath, title, id, mediaType } = item;
  const { isDark, colorDarkenLighten } = useColorDarkenLighten(posterPath);
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const isSm = useMediaQuery(650, 'max');
  const isMd = useMediaQuery(960, 'max');

  return (
    <Card variant="flat" css={{ w: '100%', h: '70vh', borderWidth: 0 }} role="figure" ref={ref}>
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
                  fontSize: '60px',
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
          {!isSm && inView && (
            <Col>
              <Card.Image
                // @ts-ignore
                as={Image}
                src={posterPath || ''}
                alt={title}
                title={title}
                objectFit="cover"
                width={isMd ? '60%' : '40%'}
                css={{
                  minWidth: 'auto !important',
                  marginTop: '10vh',
                  borderRadius: '24px',
                }}
                showSkeleton
                loaderUrl="/api/image"
                placeholder="blur"
                responsive={[
                  {
                    size: {
                      width: 225,
                      height: 338,
                    },
                    maxWidth: 860,
                  },
                  {
                    size: {
                      width: 318,
                      height: 477,
                    },
                  },
                ]}
                options={{
                  contentType: MimeType.WEBP,
                }}
              />
            </Col>
          )}
        </Row>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          // @ts-ignore
          as={Image}
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
            minHeight: '70vh !important',
            height: 'auto',
            top: 0,
            left: 0,
            objectFit: 'cover',
            opacity: 0.3,
          }}
          alt={title}
          title={title}
          showSkeleton
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

export default BannerItem;
