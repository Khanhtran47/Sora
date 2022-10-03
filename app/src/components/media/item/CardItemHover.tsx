/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { Container, Loading, Row, Spacer, Image as NextImage, Button } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import { ClientOnly } from 'remix-utils';

import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import useLocalStorage from '~/hooks/useLocalStorage';
import { IMedia } from '~/services/tmdb/tmdb.types';
import { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import Flex from '~/src/components/styles/Flex.styles';
import { H4, H5, H6 } from '~/src/components/styles/Text.styles';

import VolumeUp from '~/src/assets/icons/VolumeUpIcon.js';
import VolumeOff from '~/src/assets/icons/VolumeOffIcon.js';

const CardItemHover = ({
  item,
  genresMovie,
  genresTv,
  trailer,
}: {
  item: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  trailer?: Trailer;
}) => {
  const {
    title,
    overview,
    releaseDate,
    voteAverage,
    mediaType,
    posterPath,
    backdropPath,
    genreIds,
  } = item;
  const { loading, colorDarkenLighten, colorBackground } = useColorDarkenLighten(posterPath);
  const [player, setPlayer] = React.useState<ReturnType<YouTube['getInternalPlayer']>>();
  const [showTrailer, setShowTrailer] = React.useState<boolean>(false);
  const [isMuted, setIsMuted] = useLocalStorage('muteTrailer', true);
  const [, setIsCardPlaying] = useLocalStorage('cardPlaying', false);
  const [isPlayTrailer] = useLocalStorage('playTrailer', false);

  const mute = React.useCallback(() => {
    if (!player) return;

    player.mute();

    setIsMuted(true);
  }, [player]);

  const unMute = React.useCallback(() => {
    if (!player) return;

    player.unMute();

    setIsMuted(false);
  }, [player]);

  React.useEffect(() => {
    if (!isPlayTrailer === true) {
      setShowTrailer(false);
    }
  }, [isPlayTrailer]);

  return (
    <Container
      css={{
        padding: '0.75rem 0.375rem',
        minWidth: '350px',
        maxWidth: '400px',
        width: 'inherit',
      }}
    >
      {loading ? (
        <Loading type="points-opacity" />
      ) : (
        <>
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
                  height="218px"
                  alt={title}
                  title={title}
                  containerCss={{
                    borderRadius: '0.5rem',
                  }}
                  css={{
                    minWidth: '388px !important',
                    minHeight: 'auto !important',
                  }}
                  loaderUrl="/api/image"
                  placeholder="blur"
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
              if (trailer?.key && isPlayTrailer)
                return (
                  <YouTube
                    videoId={trailer.key}
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
                      },
                    }}
                    onReady={({ target }) => {
                      setPlayer(target);
                      setIsCardPlaying(true);
                      if (!isMuted) target.unMute();
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
                      showTrailer ? 'aspect-w-16 aspect-h-9 rounded-lg overflow-hidden' : 'hidden'
                    }
                  />
                );
            }}
          </ClientOnly>
          <Spacer y={0.5} />
          <Row justify="center" align="center">
            <H4 h4 weight="bold" color={colorDarkenLighten}>
              {title}
            </H4>
          </Row>
          <Spacer y={0.5} />
          {genreIds && (
            <>
              <Flex direction="row">
                {item?.genreIds?.slice(0, 3).map((genreId) => {
                  if (mediaType === 'movie') {
                    return (
                      <>
                        <H5
                          key={genreId}
                          h5
                          color={colorDarkenLighten}
                          css={{
                            backgroundColor: colorBackground,
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
                        color={colorDarkenLighten}
                        css={{
                          backgroundColor: colorBackground,
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
          )}
          {overview && (
            <>
              <H6 h6 className="!line-clamp-2">
                {overview}
              </H6>
              <Spacer y={0.5} />
            </>
          )}
          <Row justify="space-between" align="center">
            {releaseDate && (
              <H5 h5>{`${mediaType === 'movie' ? 'Movie' : 'TV-Show'} • ${releaseDate}`}</H5>
            )}
            {voteAverage && (
              <Flex direction="row">
                <H5
                  h5
                  css={{
                    backgroundColor: '#3ec2c2',
                    borderRadius: '$xs',
                    padding: '0 0.25rem 0 0.25rem',
                    marginRight: '0.5rem',
                  }}
                >
                  TMDb
                </H5>
                <H5 h5>{item?.voteAverage?.toFixed(1)}</H5>
              </Flex>
            )}
          </Row>
          {showTrailer && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Button
                auto
                color="primary"
                rounded
                ghost
                icon={
                  isMuted ? <VolumeOff fill="currentColor" /> : <VolumeUp fill="currentColor" />
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
                onClick={isMuted ? unMute : mute}
              />
            </motion.div>
          )}
        </>
      )}
    </Container>
  );
};

export default CardItemHover;
