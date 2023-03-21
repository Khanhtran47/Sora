/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-unsafe-optional-chaining */
import * as React from 'react';
import { Card, Loading, Tooltip, Avatar } from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';
import { useInView } from 'react-intersection-observer';
import { ClientOnly } from 'remix-utils';
import { motion } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useMeasure } from '@react-hookz/web';

import useCardHoverStore from '~/store/card/useCardHoverStore';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import { IMedia, Title } from '~/types/media';
import { ITrailer } from '~/services/consumet/anilist/anilist.types';

import PhotoIcon from '~/assets/icons/PhotoIcon';

import { Trailer } from '~/components/elements/modal/WatchTrailerModal';
import { H5, H6 } from '~/components/styles/Text.styles';
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
  const fetcher = useFetcher();
  const setIsCardPlaying = useCardHoverStore((state) => state.setIsCardPlaying);
  const [trailerCard, setTrailerCard] = React.useState<Trailer>({});
  const { isPlayTrailer } = useSoraSettings();
  const [size, imageRef] = useMeasure<HTMLDivElement>();
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
      <Card
        as="div"
        isHoverable
        isPressable
        css={{
          width: '100%',
          borderWidth: 0,
          filter: 'unset',
          '&:hover': {
            boxShadow: '0 0 0 1px var(--nextui-colors-primarySolidHover)',
            filter:
              'drop-shadow(0 4px 12px rgb(104 112 118 / 0.15)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.1))',
          },
        }}
        role="figure"
        ref={ref}
      >
        <Card.Body ref={imageRef} css={{ p: 0, width: '100%', aspectRatio: '16 / 9' }}>
          {size ? (
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
                aspectRatio: '16 / 9',
              }}
              showSkeleton
              loaderUrl="/api/image"
              placeholder="empty"
              loading="lazy"
              decoding={inView ? 'async' : 'auto'}
              options={{
                contentType: MimeType.WEBP,
              }}
              responsive={[
                {
                  size: {
                    width: Math.round(size?.width),
                    height: Math.round(size?.height),
                  },
                },
              ]}
            />
          ) : null}
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
        width: '100%',
        maxWidth: mediaType === 'people' ? '164px' : 'unset',
        minHeight: `${mediaType === 'people' ? '324px' : '318px'} !important`,
        borderWidth: 0,
        filter: 'unset',
        '&:hover': {
          boxShadow: '0 0 0 1px var(--nextui-colors-primarySolidHover)',
          filter:
            'drop-shadow(0 4px 12px rgb(104 112 118 / 0.15)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.1))',
        },
      }}
      role="figure"
      ref={ref}
    >
      <Card.Body ref={imageRef} css={{ p: 0, width: '100%', aspectRatio: '2 / 3' }}>
        {size ? (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
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
                loading="lazy"
                decoding={inView ? 'async' : 'auto'}
                css={{ aspectRatio: '2 / 3' }}
                showSkeleton
                loaderUrl="/api/image"
                placeholder="empty"
                options={{
                  contentType: MimeType.WEBP,
                }}
                responsive={[
                  {
                    size: {
                      width: Math.round(size?.width),
                      height: Math.round(size?.height),
                    },
                  },
                ]}
              />
            ) : (
              <Avatar
                icon={<PhotoIcon width={48} height={48} />}
                pointer
                css={{
                  size: '$20',
                  borderRadius: '0 !important',
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '2 / 3',
                }}
              />
            )}
          </>
        ) : null}
      </Card.Body>
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
        isDisabled={isMobile}
        // shadow
        hideArrow
        offset={0}
        visible={false}
        className="!w-fit"
        css={isEpisodeCard || mediaType === 'people' ? { p: 0 } : {}}
        onVisibleChange={(visible) => {
          if (visible) {
            if (mediaType !== 'anime' && mediaType !== 'people' && isPlayTrailer.value)
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
            maxWidth: mediaType === 'people' ? '160px' : '164px',
            ...(mediaType !== 'people'
              ? {
                  '@xs': { maxWidth: '210px' },
                  '@sm': { maxWidth: '244px' },
                  '@lg': { maxWidth: '280px' },
                }
              : {}),
          }}
        >
          <H5
            h5
            weight="bold"
            css={{
              ...(color ? { color } : null),
              minWidth: `${mediaType === 'people' ? '100px' : '150px'}`,
              padding: '0 0.25rem',
              ...(mediaType !== 'people' ? { '@xs': { minWidth: '240px' } } : {}),
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
