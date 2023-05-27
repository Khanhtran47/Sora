/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Spacer } from '@nextui-org/spacer';
import { Spinner } from '@nextui-org/spinner';
import { useColor } from 'color-thief-react';
import { AnimatePresence, motion } from 'framer-motion';
import YouTube from 'react-youtube';
import { MimeType } from 'remix-image';
import { ClientOnly } from 'remix-utils';

import { type ITrailer } from '~/services/consumet/anilist/anilist.types';
import useCardHoverStore from '~/store/card/useCardHoverStore';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import Image from '~/components/elements/Image';
import { type Trailer } from '~/components/elements/dialog/WatchTrailerModal';
import Rating from '~/components/elements/shared/Rating';
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
    <div className="flex w-[inherit] min-w-[350px] max-w-[400px] flex-col items-start justify-center gap-y-2 p-3">
      <AnimatePresence>
        {backdropPath && !showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <Image
              src={backdropPath || ''}
              width="100%"
              height="auto"
              alt={title}
              title={title}
              loading="lazy"
              decoding="async"
              radius="md"
              className="aspect-video object-cover"
              loaderUrl="/api/image"
              placeholder="empty"
              options={{
                contentType: MimeType.WEBP,
              }}
              responsive={[
                {
                  size: {
                    width: 376,
                    height: 212,
                  },
                },
              ]}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ClientOnly fallback={<Spinner />}>
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
                className={showTrailer ? 'aspect-video overflow-hidden rounded-lg' : 'hidden'}
              />
            );
        }}
      </ClientOnly>
      <h4 className="w-full text-center" style={{ color: saturatedColor }}>
        {title}
      </h4>
      {genreIds || genresAnime ? (
        <>
          <div className="flex flex-row gap-x-2">
            {mediaType === 'anime'
              ? genresAnime?.slice(0, 2).map((genre, index) => (
                  <h5
                    key={index}
                    className="rounded-xl px-2"
                    style={{
                      color: saturatedColor,
                      backgroundColor: backgroundInvertColor,
                    }}
                  >
                    {genre}
                  </h5>
                ))
              : genreIds?.slice(0, 3).map((genreId, index) => {
                  if (mediaType === 'movie') {
                    return (
                      <h5
                        key={index}
                        className="rounded-xl px-2"
                        style={{
                          color: saturatedColor,
                          backgroundColor: backgroundInvertColor,
                        }}
                      >
                        {genresMovie?.[genreId]}
                      </h5>
                    );
                  }
                  return (
                    <h5
                      key={index}
                      className="rounded-xl px-2"
                      style={{
                        color: saturatedColor,
                        backgroundColor: backgroundInvertColor,
                      }}
                    >
                      {genresTv?.[genreId]}
                    </h5>
                  );
                })}
          </div>
          <Spacer y={0.5} />
        </>
      ) : null}
      {overview ? (
        <p className="!line-clamp-2" dangerouslySetInnerHTML={{ __html: overview || '' }} />
      ) : null}
      <div className="flex w-full items-center justify-between">
        {releaseDate ? (
          <h5>{`${mediaType.charAt(0).toUpperCase()}${mediaType.slice(1)} • ${releaseDate}`}</h5>
        ) : null}
        {voteAverage ? (
          <div className="flex flex-row items-center">
            <Rating
              rating={mediaType === 'anime' ? voteAverage : Number(voteAverage.toFixed(1))}
              ratingType={mediaType}
            />
          </div>
        ) : null}
      </div>
      {showTrailer ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Button
            type="button"
            color="primary"
            radius="full"
            variant="ghost"
            isIconOnly
            className="absolute right-5 top-[25px] z-[90] h-10 w-10 cursor-pointer hover:opacity-80"
            aria-label="Toggle Mute"
            onPress={isMutedTrailer.value ? unMute : mute}
          >
            {isMutedTrailer.value ? (
              <VolumeOff fill="currentColor" />
            ) : (
              <VolumeUp fill="currentColor" />
            )}
          </Button>
        </motion.div>
      ) : null}
    </div>
  );
};

export default CardItemHover;
