/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { Card, Loading, Tooltip, Avatar } from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';
import { useInView } from 'react-intersection-observer';
import { ClientOnly } from 'remix-utils';
import { motion } from 'framer-motion';

import useMediaQuery from '~/hooks/useMediaQuery';
import useLocalStorage from '~/hooks/useLocalStorage';
import { IMedia, Title } from '~/types/media';
import { ITrailer } from '~/services/consumet/anilist/anilist.types';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

import { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import { H5, H6 } from '~/src/components/styles/Text.styles';
import CardItemHover from './CardItemHover';

interface ICardItemProps {
  backdropPath: string;
  character: string;
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
  job: string;
  knownFor?: IMedia[];
  mediaType: 'movie' | 'tv' | 'anime' | 'people';
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
    character,
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
    job,
    knownFor,
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
  const isMd = useMediaQuery('(max-width: 960px)');
  const isLg = useMediaQuery('(max-width: 1400px)');
  const fetcher = useFetcher();
  const [trailerCard, setTrailerCard] = React.useState<Trailer>({});
  const [, setIsCardPlaying] = useLocalStorage('cardPlaying', false);
  const [isPlayTrailer] = useLocalStorage('playTrailer', false);
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
  let cardWidth;
  let cardHeight;
  let cardBodyHeight;
  switch (mediaType) {
    case 'people':
      cardWidth = 160;
      cardHeight = 324;
      cardBodyHeight = 240;
      break;
    default:
      cardWidth = isSm ? 164 : isMd ? 210 : isLg ? 244 : 280;
      cardHeight = isSm ? 318 : isMd ? 386 : isLg ? 435 : 488;
      cardBodyHeight = isSm ? 240 : isMd ? 308 : isLg ? 357 : 410;
      break;
  }

  if (isCoverCard) {
    return (
      <Card
        as="div"
        isHoverable
        isPressable
        css={{
          minWidth: `${isSm ? '280px' : '480px'} !important`,
          minHeight: `${isSm ? '158px' : '270px'} !important`,
          borderWidth: 0,
          filter: 'var(--nextui-dropShadows-md)',
          '&:hover': {
            boxShadow: '0 0 0 1px var(--nextui-colors-primarySolidHover)',
          },
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
              showSkeleton
              loaderUrl="/api/image"
              placeholder="empty"
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
    );
  }

  return (
    <Card
      as="div"
      isHoverable
      isPressable
      css={{
        minWidth: `${cardWidth}px !important`,
        minHeight: `${cardHeight}px !important`,
        borderWidth: 0,
        filter: 'var(--nextui-dropShadows-md)',
        '&:hover': {
          boxShadow: '0 0 0 1px var(--nextui-colors-primarySolidHover)',
        },
      }}
      role="figure"
      ref={ref}
    >
      {inView ? (
        <Card.Body
          css={{
            p: 0,
            minHeight: `${cardBodyHeight}px`,
          }}
        >
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
                minWidth: `${cardWidth}px !important`,
                minHeight: `${cardBodyHeight}px !important`,
              }}
              showSkeleton
              loaderUrl="/api/image"
              placeholder="empty"
              options={{
                contentType: MimeType.WEBP,
              }}
              responsive={[
                {
                  size: {
                    width: mediaType === 'people' ? 160 : 164,
                    height: mediaType === 'people' ? 240 : 240,
                  },
                  maxWidth: 650,
                },
                {
                  size: {
                    width: mediaType === 'people' ? 160 : 210,
                    height: mediaType === 'people' ? 240 : 308,
                  },
                  maxWidth: 960,
                },
                {
                  size: {
                    width: mediaType === 'people' ? 160 : 244,
                    height: mediaType === 'people' ? 240 : 435,
                  },
                  maxWidth: 1400,
                },
                {
                  size: {
                    width: mediaType === 'people' ? 160 : 280,
                    height: mediaType === 'people' ? 240 : 410,
                  },
                },
              ]}
            />
          ) : (
            <Avatar
              icon={<PhotoIcon width={48} height={48} />}
              pointer
              css={{
                minWidth: `${cardWidth}px !important`,
                minHeight: `${cardBodyHeight}px !important`,
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
              if (isEpisodeCard || mediaType === 'people') {
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
        // shadow
        hideArrow
        offset={0}
        visible={false}
        className="!w-fit"
        css={isEpisodeCard || mediaType === 'people' ? { p: 0 } : {}}
        onVisibleChange={(visible) => {
          if (visible) {
            if (mediaType !== 'anime' && mediaType !== 'people' && isPlayTrailer)
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
            minHeight: mediaType === 'people' ? '5.25rem' : '4.875rem',
            maxWidth: `${cardWidth}px`,
          }}
        >
          <H5
            h5
            weight="bold"
            css={{
              ...(color ? { color } : null),
              minWidth: `${mediaType === 'people' ? '100px' : isSm ? '150px' : '240px'}`,
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
          {mediaType === 'people' ? (
            <>
              {knownFor ? (
                <H6
                  h6
                  className="!line-clamp-2"
                  css={{ color: '$accents7', fontWeight: '$semibold' }}
                >
                  {knownFor?.map((movie, index) => (
                    <>
                      {movie?.title || movie?.originalTitle || movie?.name || movie?.originalName}
                      {knownFor?.length && (index < knownFor?.length - 1 ? ', ' : '')}
                    </>
                  ))}
                </H6>
              ) : null}
              {character ? (
                <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold' }}>
                  {character}
                </H6>
              ) : null}
              {job ? (
                <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold' }}>
                  {job}
                </H6>
              ) : null}
            </>
          ) : null}
        </Card.Footer>
      </Tooltip>
    </Card>
  );
};

export default CardItem;
