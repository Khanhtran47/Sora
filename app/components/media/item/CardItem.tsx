/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { Avatar, Card, Tooltip } from '@nextui-org/react';
import { useMeasure, useMediaQuery } from '@react-hookz/web';
import { useFetcher } from '@remix-run/react';
import { motion } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useInView } from 'react-intersection-observer';
import Image, { MimeType } from 'remix-image';

import type { IMedia, Title } from '~/types/media';
import type { ITrailer } from '~/services/consumet/anilist/anilist.types';
import useCardHoverStore from '~/store/card/useCardHoverStore';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import type { Trailer } from '~/components/elements/modal/WatchTrailerModal';
import { H5, H6 } from '~/components/styles/Text.styles';
import PhotoIcon from '~/assets/icons/PhotoIcon';

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
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);
  const { isPlayTrailer } = useSoraSettings();
  const [size, imageRef] = useMeasure<HTMLDivElement>();
  const titleItem =
    typeof title === 'string'
      ? title
      : title?.userPreferred || title?.english || title?.romaji || title?.native;
  const isSm = useMediaQuery('(min-width: 650px)', { initializeWithValue: false });
  const isMd = useMediaQuery('(min-width: 768px)', { initializeWithValue: false });
  const isLg = useMediaQuery('(min-width: 1024px)', { initializeWithValue: false });
  const isXl = useMediaQuery('(min-width: 1280px)', { initializeWithValue: false });
  const cardMaxWidth = isXl ? '264px' : isLg ? '244px' : isMd ? '200px' : isSm ? '180px' : '164px';

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
          // width: '100%',
          borderWidth: 0,
          filter: 'unset',
          '&:hover': {
            boxShadow: '0 0 0 1px var(--nextui-colors-primarySolidHover)',
            filter:
              'drop-shadow(0 4px 12px rgb(104 112 118 / 0.15)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.1))',
          },
        }}
        className="!w-[280px] sm:!w-[480px]"
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
        width: mediaType === 'people' ? '164px' : cardMaxWidth,
        minHeight: `${mediaType === 'people' ? '324px' : '318px'} !important`,
        borderWidth: 0,
        filter: 'unset',
        '&:hover': {
          boxShadow: '0 0 0 1px var(--nextui-colors-primarySolidHover)',
          filter:
            'drop-shadow(0 4px 12px rgb(104 112 118 / 0.15)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.1))',
        },
        opacity: isTooltipVisible ? 0 : 1,
        transition: 'all 0.3s ease',
      }}
      role="figure"
      ref={ref}
    >
      <Card.Body ref={imageRef} css={{ p: 0, width: '100%', aspectRatio: '2 / 3' }}>
        {size && !isTooltipVisible ? (
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
                css={{
                  aspectRatio: '2 / 3',
                  transition: 'all 0.3s ease !important',
                  transform: 'scale(1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transformOrigin: 'center center',
                  },
                }}
                containerCss={{ overflow: 'hidden' }}
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
        animated={false}
        content={
          <motion.div
            initial={{ scaleX: 0.6, scaleY: 1.1 }}
            animate={{ scaleX: 1, scaleY: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl bg-background-contrast-alpha shadow-md backdrop-blur-md"
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
        }
        rounded
        isDisabled={isMobile || mediaType === 'people' || isEpisodeCard}
        // shadow
        hideArrow
        offset={-70}
        enterDelay={300}
        visible={false}
        className="!w-fit"
        css={
          isEpisodeCard || mediaType === 'people'
            ? { p: 0 }
            : { zIndex: 2999, backgroundColor: 'transparent', boxShadow: 'none' }
        }
        onVisibleChange={(visible) => {
          if (visible) {
            if (mediaType !== 'people') {
              setIsTooltipVisible(true);
              if (isPlayTrailer.value && mediaType !== 'anime') {
                fetcher.load(`/${mediaType === 'movie' ? 'movies' : 'tv-shows'}/${id}/videos`);
              }
            }
          } else {
            setIsTooltipVisible(false);
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
            className="!line-clamp-2"
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
