/* eslint-disable no-nested-ternary */
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
import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';
import Flex from '~/src/components/styles/Flex.styles';
import { H4, H5, H6 } from '~/src/components/styles/Text.styles';

import AnilistStatIcon from '~/src/assets/icons/AnilistStatIcon.js';
import VolumeUp from '~/src/assets/icons/VolumeUpIcon.js';
import VolumeOff from '~/src/assets/icons/VolumeOffIcon.js';

const CardItemHover = ({ item }: { item: IAnimeResult }) => {
  const { title, description, releaseDate, rating, image, cover, genres, type, trailer } = item;
  const { loading, colorDarkenLighten, colorBackground } = useColorDarkenLighten(image);
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
            {cover && !showTrailer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <NextImage
                  // @ts-ignore
                  as={Image}
                  src={cover || ''}
                  objectFit="cover"
                  width="100%"
                  height="218px"
                  alt={title?.userPreferred || title?.english || title?.romaji || title?.native}
                  title={title?.userPreferred || title?.english || title?.romaji || title?.native}
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
              if (trailer?.id && trailer?.site === 'youtube' && isPlayTrailer)
                return (
                  <YouTube
                    videoId={trailer.id}
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
              {title?.userPreferred || title?.english || title?.romaji || title?.native}
            </H4>
          </Row>
          <Spacer y={0.5} />
          {genres && (
            <>
              <Flex direction="row">
                {genres?.slice(0, 2).map((genre, index) => (
                  <>
                    <H5
                      key={index}
                      h5
                      color={colorDarkenLighten}
                      css={{
                        backgroundColor: colorBackground,
                        borderRadius: '$md',
                        padding: '0 0.5rem 0 0.5rem',
                      }}
                    >
                      {genre}
                    </H5>
                    <Spacer x={0.5} />
                  </>
                ))}
              </Flex>
              <Spacer y={0.5} />
            </>
          )}
          {description && (
            <>
              <H6 h6 className="!line-clamp-2" dangerouslySetInnerHTML={{ __html: description }} />
              <Spacer y={0.5} />
            </>
          )}
          <Row justify="space-between" align="center">
            {releaseDate && <H5 h5>{`${type} • ${releaseDate}`}</H5>}
            {rating && (
              <Flex direction="row" justify="center" align="center">
                {Number(rating) > 75 ? (
                  <AnilistStatIcon stat="good" />
                ) : Number(rating) > 60 ? (
                  <AnilistStatIcon stat="average" />
                ) : (
                  <AnilistStatIcon stat="bad" />
                )}
                <Spacer x={0.25} />
                <H5 weight="bold">{rating}%</H5>
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
