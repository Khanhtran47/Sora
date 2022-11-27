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
import { Title } from '~/types/media';
import { ITrailer } from '~/services/consumet/anilist/anilist.types';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

import { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import { H5, H6 } from '~/src/components/styles/Text.styles';
import CardItemHover from './CardItemHover';

interface ICardItemProps {
  backdropPath: string;
  color?: string;
  episodeNumber?: number;
  episodeTitle?: string;
  genreIds: number[];
  genresAnime: string[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  id: number;
  isCoverCard?: boolean;
  isEpisodeCard?: boolean;
  mediaType: 'movie' | 'tv' | 'anime';
  overview: string;
  posterPath: string;
  releaseDate: string | number;
  title: string | Title;
  trailer?: ITrailer;
  virtual?: boolean;
  voteAverage: number;
}

const CardItem = (props: ICardItemProps) => {
  const {
    backdropPath,
    color,
    episodeNumber,
    episodeTitle,
    genreIds,
    genresAnime,
    genresMovie,
    genresTv,
    id,
    isCoverCard,
    isEpisodeCard,
    mediaType,
    overview,
    posterPath,
    releaseDate,
    title,
    trailer,
    virtual,
    voteAverage,
  } = props;
  const { ref, inView } = useInView({
    rootMargin: '3000px 1000px',
    triggerOnce: !virtual,
  });
  const isSm = useMediaQuery('(max-width: 650px)');
  const isLg = useMediaQuery('(max-width: 1400px)');
  const fetcher = useFetcher();
  const [trailerCard, setTrailerCard] = React.useState<Trailer>({});
  const [, setIsCardPlaying] = useLocalStorage('cardPlaying', false);
  const titleItem =
    typeof title === 'string'
      ? title
      : title?.userPreferred || title?.english || title?.romaji || title?.native;

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
          {inView ? (
            <Card.Body css={{ p: 0 }}>
              <Card.Image
                // @ts-ignore
                as={Image}
                src={backdropPath}
                objectFit="cover"
                width="100%"
                height="auto"
                alt={titleItem}
                title={titleItem}
                css={{
                  minWidth: `${isSm ? '280px' : '480px'} !important`,
                  minHeight: `${isSm ? '158px' : '270px'} !important`,
                }}
                showSkeleton={false}
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
          ) : null}
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
              {titleItem}
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
        {inView ? (
          <Card.Body css={{ p: 0 }}>
            {posterPath ? (
              <Card.Image
                // @ts-ignore
                as={Image}
                src={posterPath || ''}
                objectFit="cover"
                width="100%"
                height="auto"
                alt={titleItem}
                title={titleItem}
                css={{
                  minWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'} !important`,
                  minHeight: `${isSm ? '245px' : isLg ? '357px' : '410px'} !important`,
                }}
                showSkeleton={false}
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
        ) : null}
        <Tooltip
          placement="top"
          content={
            <ClientOnly fallback={<Loading type="default" />}>
              {() => {
                if (isEpisodeCard) {
                  return null;
                }
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
                  >
                    <CardItemHover
                      backdropPath={backdropPath}
                      genreIds={genreIds}
                      genresAnime={genresAnime}
                      genresMovie={genresMovie}
                      genresTv={genresTv}
                      mediaType={mediaType}
                      overview={overview}
                      posterPath={posterPath}
                      releaseDate={releaseDate}
                      title={titleItem || ''}
                      trailer={trailer || trailerCard}
                      voteAverage={voteAverage}
                    />
                  </motion.div>
                );
              }}
            </ClientOnly>
          }
          rounded
          shadow
          hideArrow
          offset={0}
          visible={false}
          className="!w-fit"
          onVisibleChange={(visible) => {
            if (visible) {
              if (mediaType !== 'anime')
                fetcher.load(`/${mediaType === 'movie' ? 'movies' : 'tv-shows'}/${id}/videos`);
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
                ...(color ? { color } : null),
                minWidth: `${isSm ? '130px' : isLg ? '180px' : '210px'}`,
                padding: '0 0.25rem',
              }}
            >
              {titleItem}
            </H5>
            {isEpisodeCard ? (
              <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold', fontSize: '$sm' }}>
                EP {episodeNumber} - {episodeTitle}
              </H6>
            ) : null}
          </Card.Footer>
        </Tooltip>
      </Card>
      <Spacer y={1} />
    </>
  );
};

export default CardItem;
