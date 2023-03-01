/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef } from 'react';
import { Card, Row, Col, Spacer, Badge, Text } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { Title } from '~/types/media';

import useMediaQuery from '~/hooks/useMediaQuery';
import useSize from '~/hooks/useSize';

import AspectRatio from '~/components/elements/aspect-ratio/AspectRatio';
import { H5 } from '~/components/styles/Text.styles';
import Balancer from '~/components/elements/shared/Balancer';

import Star from '~/assets/icons/StarIcon';

interface IBannerItemMobileProps {
  active?: boolean;
  posterPath: string;
  genreIds: number[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  id: number | string;
  mediaType: 'movie' | 'tv' | 'anime' | 'people';
  title: string | Title;
  voteAverage: number;
  genresAnime: string[];
}

const BannerItemMobile = (props: IBannerItemMobileProps) => {
  const {
    active,
    posterPath,
    genreIds,
    genresMovie,
    genresTv,
    id,
    mediaType,
    title,
    voteAverage,
    genresAnime,
  } = props;
  const isXs = useMediaQuery('(max-width: 375px)');

  const { ref, inView } = useInView({
    threshold: 0,
  });
  const bannerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useSize(bannerRef);

  const titleItem =
    typeof title === 'string'
      ? title
      : title?.userPreferred || title?.english || title?.romaji || title?.native;

  return (
    <AspectRatio.Root ratio={4 / 5} ref={bannerRef}>
      <Link
        to={`/${
          mediaType === 'movie' ? 'movies/' : mediaType === 'tv' ? 'tv-shows/' : 'anime/'
        }${id}/${mediaType === 'anime' ? 'overview' : ''}`}
      >
        <Card
          as="div"
          variant="flat"
          ref={ref}
          isPressable
          css={{
            w: width,
            h: height,
            borderWidth: 0,
            transition: 'all 0.5s ease',
            marginTop: !active ? '1.5rem' : 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          role="figure"
        >
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
                height: `${height / 2}px`,
                backgroundImage: 'linear-gradient(0deg, $background, $backgroundTransparent)',
                '@lgMin': {
                  height: '250px',
                },
              },
            }}
          >
            <AnimatePresence>
              {inView ? (
                <motion.div
                  initial={{ opacity: 0, scale: 1.2, y: 40 }}
                  animate={active && { opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.2, y: 40 }}
                  transition={{ duration: 0.5 }}
                  style={{ overflow: 'hidden' }}
                >
                  <Card.Image
                    // @ts-ignore
                    as={Image}
                    src={posterPath || ''}
                    loading="eager"
                    width="100%"
                    height="auto"
                    css={{
                      opacity: 0.8,
                      top: 0,
                      left: 0,
                    }}
                    showSkeleton
                    objectFit="cover"
                    alt={titleItem}
                    title={titleItem}
                    loaderUrl="/api/image"
                    placeholder="empty"
                    responsive={[
                      {
                        size: {
                          width,
                          height: width * (5 / 4),
                        },
                      },
                    ]}
                    options={{
                      contentType: MimeType.WEBP,
                    }}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Card.Body>
          <Card.Footer css={{ position: 'absolute', zIndex: 1, bottom: 5 }}>
            <Col css={{ py: '1rem' }}>
              <Text
                h4
                weight="bold"
                css={{
                  fontSize: isXs ? '1.5rem' : '1.75rem',
                  marginBottom: 0,
                  fontWeight: 600,
                  lineHeight: 'var(--nextui-lineHeights-base)',
                  textAlign: 'center',
                }}
              >
                <Balancer>{titleItem}</Balancer>
              </Text>
              <Row css={{ marginTop: '1.25rem' }} align="center">
                <H5
                  h5
                  className="space-x-2"
                  css={{
                    display: 'flex',
                    flexDirection: 'row',
                    margin: 0,
                    [`& ${Badge}`]: {
                      border: 0,
                    },
                  }}
                >
                  <Badge variant="flat" color="primary">
                    <Star filled width={16} height={16} />
                    <Spacer x={0.25} />
                    {mediaType === 'anime' ? voteAverage : Number(voteAverage.toFixed(1))}
                  </Badge>
                  {mediaType === 'anime' ? (
                    <>
                      <Badge variant="flat" color="primary">
                        {genresAnime[0]}
                      </Badge>
                      <Spacer x={0.5} />
                    </>
                  ) : mediaType === 'movie' ? (
                    <>
                      <Badge variant="flat" color="primary">
                        {genresMovie?.[genreIds[0]]}
                      </Badge>
                      <Spacer x={0.5} />
                    </>
                  ) : (
                    <>
                      <Badge variant="flat" color="primary">
                        {genresTv?.[genreIds[0]]}
                      </Badge>
                      <Spacer x={0.5} />
                    </>
                  )}
                </H5>
              </Row>
            </Col>
          </Card.Footer>
        </Card>
      </Link>
    </AspectRatio.Root>
  );
};

export default BannerItemMobile;
