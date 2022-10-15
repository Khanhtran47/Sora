/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { Card, Loading, Spacer, Tooltip, Avatar } from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';
import { useInView } from 'react-intersection-observer';
import { ClientOnly } from 'remix-utils';
import { motion } from 'framer-motion';

import useMediaQuery from '~/hooks/useMediaQuery';
import useLocalStorage from '~/hooks/useLocalStorage';
import { IMedia } from '~/services/tmdb/tmdb.types';
import { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import { H5 } from '~/src/components/styles/Text.styles';
import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

import CardItemHover from './CardItemHover';

const CardItem = ({
  item,
  coverItem,
  genresMovie,
  genresTv,
  isCoverCard,
  virtual,
}: {
  item?: IMedia | undefined;
  coverItem?: { id: number; name: string; backdropPath: string };
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  isCoverCard?: boolean;
  virtual?: boolean;
}) => {
  const { title, posterPath } = item || {};
  const { ref, inView } = useInView({
    rootMargin: '3000px 1000px',
    triggerOnce: !virtual,
  });
  const isSm = useMediaQuery(650, 'max');
  const isLg = useMediaQuery(1400, 'max');
  const fetcher = useFetcher();
  const [trailerCard, setTrailerCard] = React.useState<Trailer>({});
  const [, setIsCardPlaying] = useLocalStorage('cardPlaying', false);

  React.useEffect(() => {
    if (fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailerCard(officialTrailer);
    }
  }, [fetcher.data]);

  if (isCoverCard) {
    return (
      <>
        <Card
          as="div"
          isHoverable
          isPressable
          css={{
            minWidth: `${isSm ? '280px' : '480px'} !important`,
            minHeight: `${isSm ? '158px' : '270px'} !important`,
            borderWidth: 0,
            filter: 'var(--nextui-dropShadows-md)',
          }}
          role="figure"
          ref={ref}
        >
          <Card.Body css={{ p: 0 }}>
            <Card.Image
              // @ts-ignore
              as={Image}
              src={coverItem?.backdropPath || ''}
              objectFit="cover"
              width="100%"
              height="auto"
              alt={title}
              title={title}
              css={{
                minWidth: `${isSm ? '280px' : '480px'} !important`,
                minHeight: `${isSm ? '158px' : '270px'} !important`,
              }}
              loaderUrl="/api/image"
              placeholder="blur"
              options={{
                contentType: MimeType.WEBP,
              }}
              responsive={[
                {
                  size: {
                    width: 280,
                    height: 158,
                  },
                  maxWidth: 650,
                },
                {
                  size: {
                    width: 480,
                    height: 270,
                  },
                },
              ]}
            />
          </Card.Body>
          <Card.Footer
            className="backdrop-blur-md"
            css={{
              position: 'absolute',
              backgroundColor: '$backgroundAlpha',
              borderTop: '$borderWeights$light solid $border',
              bottom: 0,
              zIndex: 1,
              justifyContent: 'center',
            }}
          >
            <H5 h5 weight="bold">
              {coverItem?.name}
            </H5>
          </Card.Footer>
        </Card>
        <Spacer y={1} />
      </>
    );
  }

  return (
    <>
      <Card
        as="div"
        isHoverable
        isPressable
        css={{
          minWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'} !important`,
          minHeight: `${isSm ? '323px' : isLg ? '435px' : '488px'} !important`,
          borderWidth: 0,
          filter: 'var(--nextui-dropShadows-md)',
        }}
        role="figure"
        ref={ref}
      >
        {inView && (
          <Card.Body css={{ p: 0 }}>
            {posterPath ? (
              <Card.Image
                // @ts-ignore
                as={Image}
                src={posterPath || ''}
                objectFit="cover"
                width="100%"
                height="auto"
                alt={title}
                title={title}
                css={{
                  minWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'} !important`,
                  minHeight: `${isSm ? '245px' : isLg ? '357px' : '410px'} !important`,
                }}
                loaderUrl="/api/image"
                placeholder="blur"
                options={{
                  contentType: MimeType.WEBP,
                }}
                responsive={[
                  {
                    size: {
                      width: 164,
                      height: 245,
                    },
                    maxWidth: 650,
                  },
                  {
                    size: {
                      width: 210,
                      height: 357,
                    },
                    maxWidth: 1280,
                  },
                  {
                    size: {
                      width: 240,
                      height: 410,
                    },
                  },
                ]}
              />
            ) : (
              <Avatar
                icon={<PhotoIcon width={48} height={48} />}
                pointer
                css={{
                  minWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'} !important`,
                  minHeight: `${isSm ? '245px' : isLg ? '357px' : '410px'} !important`,
                  size: '$20',
                  borderRadius: '0 !important',
                }}
              />
            )}
          </Card.Body>
        )}
        <Tooltip
          placement="top"
          content={
            <ClientOnly fallback={<Loading type="default" />}>
              {() => (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
                >
                  <CardItemHover
                    item={item}
                    genresMovie={genresMovie}
                    genresTv={genresTv}
                    trailer={trailerCard}
                  />
                </motion.div>
              )}
            </ClientOnly>
          }
          rounded
          shadow
          hideArrow
          offset={0}
          className="!w-fit"
          onVisibleChange={(visible) => {
            if (visible) {
              fetcher.load(
                `/${item?.mediaType === 'movie' ? 'movies' : 'tv-shows'}/${item?.id}/videos`,
              );
            } else {
              setIsCardPlaying(false);
            }
          }}
        >
          <Card.Footer
            css={{
              justifyItems: 'flex-start',
              flexDirection: 'column',
              alignItems: 'flex-start',
              minHeight: '4.875rem',
              maxWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'}`,
            }}
          >
            <H5
              h5
              weight="bold"
              css={{
                minWidth: `${isSm ? '130px' : isLg ? '180px' : '210px'}`,
                padding: '0 0.25rem',
              }}
            >
              {title}
            </H5>
          </Card.Footer>
        </Tooltip>
      </Card>
      <Spacer y={1} />
    </>
  );
};

export default CardItem;
