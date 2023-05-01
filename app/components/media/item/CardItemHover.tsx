/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Loading, Image as NextImage, Row, Spacer } from '@nextui-org/react';
import { useColor } from 'color-thief-react';
import { AnimatePresence, motion } from 'framer-motion';
import YouTube from 'react-youtube';
import Image, { MimeType } from 'remix-image';
import { ClientOnly } from 'remix-utils';

import { type ITrailer } from '~/services/consumet/anilist/anilist.types';
import useCardHoverStore from '~/store/card/useCardHoverStore';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { type Trailer } from '~/components/elements/dialog/WatchTrailerModal';
import Rating from '~/components/elements/shared/Rating';
import Flex from '~/components/styles/Flex.styles';
import { H4, H5, H6 } from '~/components/styles/Text.styles';
import VolumeOff from '~/assets/icons/VolumeOffIcon';
import VolumeUp from '~/assets/icons/VolumeUpIcon';

interface ICardItemHoverProps {
  backdropPath: string;
  genreIds: number[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  mediaType: 'movie' | 'tv' | 'anime' | 'people';
  overview: string;
  releaseDate: string | number;
  title: string;
  trailer?: Trailer | ITrailer;
  voteAverage: number;
  genresAnime: string[];
}

const CardItemHover = (props: ICardItemHoverProps) => {
  const {
    backdropPath,
    genreIds,
    genresMovie,
    genresTv,
    mediaType,
    overview,
    releaseDate,
    title,
    trailer,
    voteAverage,
    genresAnime,
  } = props;
  const { data } = useColor(
    `https://corsproxy.io/?${encodeURIComponent(backdropPath || '')}`,
    'hex',
    {
      crossOrigin: 'anonymous',
    },
  );
  const { saturatedColor, backgroundInvertColor } = useColorDarkenLighten(data);
  const [player, setPlayer] = useState<ReturnType<YouTube['getInternalPlayer']>>();
  const [showTrailer, setShowTrailer] = useState<boolean>(false);
  const setIsCardPlaying = useCardHoverStore((state) => state.setIsCardPlaying);
  const { isMutedTrailer, isPlayTrailer } = useSoraSettings();

  const mute = useCallback(() => {
    if (!player) return;
    player.mute();
    isMutedTrailer.set(true);
  }, [player]);

  const unMute = useCallback(() => {
    if (!player) return;
    player.unMute();
    isMutedTrailer.set(false);
  }, [player]);

  useEffect(() => {
    if (!isPlayTrailer.value === true) {
      setShowTrailer(false);
    }
  }, [isPlayTrailer.value]);

  return (
    <Container
      responsive={false}
      justify="center"
      alignItems="center"
      css={{
        padding: '0.75rem 0.75rem',
        minWidth: '350px',
        maxWidth: '400px',
        width: 'inherit',
      }}
    >
      <AnimatePresence>
        {backdropPath && !showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <NextImage
              // @ts-ignore
              as={Image}
              src={backdropPath || ''}
              objectFit="cover"
              width="100%"
              height="auto"
              alt={title}
              title={title}
              loading="lazy"
              decoding="async"
              containerCss={{ borderRadius: '0.5rem' }}
              css={{ aspectRatio: '16/9' }}
              loaderUrl="/api/image"
              placeholder="empty"
              options={{
                contentType: MimeType.WEBP,
              }}
              responsive={[
                {
                  size: {
                    width: 388,
                    height: 218,
                  },
                },
              ]}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ClientOnly fallback={<Loading type="default" />}>
        {() => {
          if (
            ((trailer as Trailer)?.key ||
              ((trailer as ITrailer)?.id && (trailer as ITrailer)?.site === 'youtube')) &&
            isPlayTrailer.value
          )
            return (
              <YouTube
                videoId={(trailer as Trailer).key || (trailer as ITrailer).id}
                opts={{
                  width: '388px',
                  height: '218.25px',
                  playerVars: {
                    // https://developers.google.com/youtube/player_parameters
                    autoplay: 1,
                    modestbranding: 1,
                    controls: 0,
                    disablekb: 1,
                    showinfo: 0,
                    branding: 0,
                    rel: 0,
                    autohide: 0,
                    iv_load_policy: 3,
                    cc_load_policy: 0,
                    playsinline: 1,
                    mute: 1,
                    origin: 'https://sora-anime.vercel.app',
                  },
                }}
                onReady={({ target }) => {
                  setPlayer(target);
                  setIsCardPlaying(true);
                  if (!isMutedTrailer.value) target.unMute();
                }}
                onPlay={() => {
                  if (setShowTrailer) {
                    setShowTrailer(true);
                  }
                }}
                onPause={() => {
                  if (setShowTrailer) {
                    setShowTrailer(false);
                  }
                }}
                onEnd={() => {
                  if (setShowTrailer) {
                    setShowTrailer(false);
                  }
                }}
                onError={() => {
                  if (setShowTrailer) {
                    setShowTrailer(false);
                  }
                }}
                style={{
                  width: '388px',
                  height: '218.25px',
                  pointerEvents: 'none',
                }}
                className={
                  showTrailer ? 'aspect-w-16 aspect-h-9 overflow-hidden rounded-lg' : 'hidden'
                }
              />
            );
        }}
      </ClientOnly>
      <Spacer y={0.5} />
      <Row justify="center" align="center">
        <H4 h4 weight="bold" color={saturatedColor}>
          {title}
        </H4>
      </Row>
      <Spacer y={0.5} />
      {genreIds || genresAnime ? (
        <>
          <Flex direction="row">
            {mediaType === 'anime'
              ? genresAnime?.slice(0, 2).map((genre, index) => (
                  <>
                    <H5
                      key={index}
                      h5
                      color={saturatedColor}
                      css={{
                        backgroundColor: backgroundInvertColor,
                        borderRadius: '$md',
                        padding: '0 0.5rem 0 0.5rem',
                      }}
                    >
                      {genre}
                    </H5>
                    <Spacer x={0.5} />
                  </>
                ))
              : genreIds?.slice(0, 3).map((genreId) => {
                  if (mediaType === 'movie') {
                    return (
                      <>
                        <H5
                          key={genreId}
                          h5
                          color={saturatedColor}
                          css={{
                            backgroundColor: backgroundInvertColor,
                            borderRadius: '$md',
                            padding: '0 0.5rem 0 0.5rem',
                          }}
                        >
                          {genresMovie?.[genreId]}
                        </H5>
                        <Spacer x={0.25} />
                      </>
                    );
                  }
                  return (
                    <>
                      <H5
                        key={genreId}
                        h5
                        color={saturatedColor}
                        css={{
                          backgroundColor: backgroundInvertColor,
                          borderRadius: '$md',
                          padding: '0 0.25rem 0 0.25rem',
                        }}
                      >
                        {genresTv?.[genreId]}
                      </H5>
                      <Spacer x={0.25} />
                    </>
                  );
                })}
          </Flex>
          <Spacer y={0.5} />
        </>
      ) : null}
      {overview ? (
        <>
          <H6 h6 className="!line-clamp-2" dangerouslySetInnerHTML={{ __html: overview || '' }} />
          <Spacer y={0.5} />
        </>
      ) : null}
      <Row justify="space-between" align="center">
        {releaseDate ? (
          <H5 h5>{`${mediaType.charAt(0).toUpperCase()}${mediaType.slice(1)} • ${releaseDate}`}</H5>
        ) : null}
        {voteAverage ? (
          <Flex direction="row" align="center">
            <Rating
              rating={mediaType === 'anime' ? voteAverage : Number(voteAverage.toFixed(1))}
              ratingType={mediaType}
            />
          </Flex>
        ) : null}
      </Row>
      {showTrailer ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Button
            type="button"
            auto
            color="primary"
            rounded
            ghost
            icon={
              isMutedTrailer.value ? (
                <VolumeOff fill="currentColor" />
              ) : (
                <VolumeUp fill="currentColor" />
              )
            }
            css={{
              width: '42px',
              height: '42px',
              cursor: 'pointer',
              position: 'absolute',
              top: '25px',
              right: '20px',
              zIndex: '90',
              '&:hover': {
                opacity: '0.8',
              },
            }}
            aria-label="Toggle Mute"
            onPress={isMutedTrailer.value ? unMute : mute}
          />
        </motion.div>
      ) : null}
    </Container>
  );
};

export default CardItemHover;
