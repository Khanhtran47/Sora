/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { Card, Loading, Spacer, Text, Tooltip, Avatar } from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';
import { useInView } from 'react-intersection-observer';
import { ClientOnly } from 'remix-utils';
import { motion } from 'framer-motion';

import useMediaQuery from '~/hooks/useMediaQuery';
import useLocalStorage from '~/hooks/useLocalStorage';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { IMedia } from '~/services/tmdb/tmdb.types';
import { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

import CardItemHover from './CardItemHover';

const CardItem = ({
  item,
  genresMovie,
  genresTv,
}: {
  item: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
}) => {
  const { title, posterPath } = item;
  const { colorDarkenLighten } = useColorDarkenLighten(posterPath);
  const { ref, inView } = useInView({
    rootMargin: '500px 200px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
    triggerOnce: true,
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
                `/${item.mediaType === 'movie' ? 'movies' : 'tv-shows'}/${item.id}/videos`,
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
            <Text
              size={14}
              b
              css={{
                minWidth: `${isSm ? '130px' : isLg ? '180px' : '210px'}`,
                padding: '0 0.25rem',
                '@xs': {
                  fontSize: '16px',
                },
                '@sm': {
                  fontSize: '18px',
                },
                '&:hover': {
                  color: colorDarkenLighten,
                },
              }}
            >
              {title}
            </Text>
          </Card.Footer>
        </Tooltip>
      </Card>

      <Spacer y={1} />
    </>
  );
};

export default CardItem;
