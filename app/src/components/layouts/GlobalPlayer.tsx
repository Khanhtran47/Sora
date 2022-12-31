/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { RouteMatch, useLocation, useNavigate } from '@remix-run/react';
import { Container, Button, Popover, Tooltip, keyframes } from '@nextui-org/react';
import Artplayer from 'artplayer';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import Hls from 'hls.js';
import { isMobile } from 'react-device-detect';

import usePlayerState from '~/store/player/usePlayerState';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import { H5 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';
import Box from '~/src/components/styles/Box.styles';

import Settings from '~/src/assets/icons/SettingsIcon.js';
import Close from '~/src/assets/icons/CloseIcon.js';
import Expand from '~/src/assets/icons/ExpandIcon.js';
import Play from '~/src/assets/icons/PlayIcon.js';
import Pause from '~/src/assets/icons/PauseIcon.js';

interface IPlayerSettingsProps {
  artplayer: Artplayer | null;
}

interface IGlobalPlayerProps {
  matches: RouteMatch[];
}

// const slideHorizontalAnimation = {
//   left: {
//     x: 0,
//     transition: {
//       duration: 0.3,
//     },
//   },
//   right: {
//     x: -250,
//     transition: {
//       duration: 0.3,
//     },
//   },
// };

const PlayerSettings = (props: IPlayerSettingsProps) => {
  const { artplayer } = props;
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  // const [isLeftMenu, setIsLeftMenu] = useState(true);
  // const [isLanguageTab, setIsLanguageTab] = useState(false);
  // const [isDisplayTab, setIsDisplayTab] = useState(false);
  return (
    <Popover
      shouldFlip
      triggerType="menu"
      placement="top"
      isOpen={isSettingsOpen}
      onOpenChange={setSettingsOpen}
    >
      <Popover.Trigger>
        <Button auto light aria-label="dropdown" icon={<Settings />} />
      </Popover.Trigger>
      <Popover.Content
        css={{
          display: 'block',
          opacity: 1,
          transform: 'none',
          overflow: 'hidden',
          transition: 'height 0.5s',
          width: 240,
          zIndex: 999,
          borderWidth: 0,
        }}
      >
        <Button auto onClick={() => artplayer?.play()}>
          play
        </Button>
        <Button auto onClick={() => artplayer?.pause()}>
          pause
        </Button>
        <p>test</p>
      </Popover.Content>
    </Popover>
  );
};

const GlobalPlayer = (props: IGlobalPlayerProps) => {
  const { matches } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [artplayer, setArtplayer] = useState<Artplayer | null>(null);
  const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);
  const {
    isMini,
    shouldShowPlayer,
    setIsMini,
    setShouldShowPlayer,
    routePlayer,
    setRoutePlayer,
    titlePlayer,
    setTitlePlayer,
  } = usePlayerState((state) => state);
  const matchesFiltered = matches.find(
    (match) => match?.pathname.includes('player') || match?.pathname.includes('watch'),
  );
  const playerSettings = matchesFiltered?.handle?.playerSettings();
  const shouldPlayInBackground = useMemo(
    () => !(location?.pathname.includes('player') || location?.pathname.includes('watch')),
    [location?.pathname],
  );
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const jumpAnimation = keyframes({
    '15%': {
      borderBottomRightRadius: '3px',
    },
    '25%': {
      transform: 'translateY(9px) rotate(22.5deg)',
    },
    '50%': {
      transform: 'translateY(18px) scale(1, .9) rotate(45deg)',
      borderBottomRightRadius: '40px',
    },
    '75%': {
      transform: 'translateY(9px) rotate(67.5deg)',
    },
    '100%': {
      transform: 'translateY(0) rotate(90deg)',
    },
  });

  const shadowAnimation = keyframes({
    '0%, 100%': {
      transform: 'scale(1, 1)',
    },
    '50%': {
      transform: 'scale(1.2, 1)',
    },
  });

  useEffect(() => {
    setIsMini(shouldPlayInBackground);
  }, [shouldPlayInBackground]);

  useEffect(() => {
    if (playerSettings?.shouldShowPlayer) {
      if (playerSettings?.shouldShowPlayer === true) setShouldShowPlayer(true);
      else if (playerSettings?.shouldShowPlayer === false && shouldPlayInBackground)
        setShouldShowPlayer(true);
      else setShouldShowPlayer(false);
    }
    if (playerSettings?.routePlayer) {
      setRoutePlayer(playerSettings?.routePlayer);
    }
    if (playerSettings?.title) {
      setTitlePlayer(playerSettings?.title);
    }
  }, [playerSettings]);

  useEffect(() => {
    if (shouldPlayInBackground && !isMobile) return;
    x.set(0);
    y.set(0);
  }, [x, y, shouldPlayInBackground]);

  return (
    <Container responsive css={{ margin: 0, padding: 0, width: isMini ? '20rem' : '100%' }}>
      <div className="fixed inset-0 pointer-events-none" ref={constraintsRef} />
      <AnimatePresence initial={false}>
        {shouldShowPlayer ? (
          <motion.div
            layout
            drag={shouldPlayInBackground}
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
            exit={{ opacity: 0, x: 250 }}
            transition={{ duration: 0.3 }}
            className={shouldPlayInBackground ? 'fixed bottom-16 right-4 z-[9999]' : ''}
            style={{
              x,
              y,
              width: isMini ? '25rem' : '100%',
              height: isMini ? '14.0625rem' : '100%',
            }}
          >
            <ArtPlayer
              type="movie"
              // key={} for re-rendering the player
              autoPlay={false}
              hideBottomGroupButtons
              option={{
                container: '.artplayer-app',
                autoplay: true,
                url: playerSettings?.url,
                layers: [
                  {
                    html: '',
                    name: 'mask',
                    style: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    },
                  },
                  {
                    html: '',
                    name: 'controlButtons',
                    style: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    },
                  },
                  {
                    html: '',
                    name: 'expandPlayer',
                    style: {
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                    },
                  },
                  {
                    html: '',
                    name: 'closePlayer',
                    style: {
                      position: 'absolute',
                      top: '10px',
                      left: '50px',
                    },
                  },
                  {
                    html: '',
                    name: 'settings',
                    style: {
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                    },
                  },
                ],
                icons: {
                  state: '',
                  loading: '<div class="custom-loader"></div>',
                },
                customType: {
                  m3u8: (video: HTMLMediaElement, url: string) => {
                    if (Hls.isSupported()) {
                      const hls = new Hls();
                      hls.loadSource(url);
                      hls.attachMedia(video);
                    } else {
                      const canPlay = video.canPlayType('application/vnd.apple.mpegurl');
                      if (canPlay === 'probably' || canPlay === 'maybe') {
                        video.src = url;
                      }
                    }
                  },
                },
              }}
              getInstance={(art) => {
                art.on('ready', () => {
                  art.controls.add({
                    position: 'right',
                    name: 'portal',
                    html: '',
                  });
                  setArtplayer(art);
                });
                art.on('play', () => {
                  setIsPlayerPlaying(true);
                });
                art.on('pause', () => {
                  setIsPlayerPlaying(false);
                });
              }}
              css={{
                width: isMini ? '25rem' : '100%',
                height: isMini ? '14.0625rem' : '100%',
                '& div': {
                  '&.custom-loader': {
                    width: '48px',
                    height: '48px',
                    margin: 'auto',
                    position: 'relative',

                    '&::before': {
                      content: "''",
                      width: '48px',
                      height: '5px',
                      background: '$primarySolidHover',
                      position: 'absolute',
                      top: '60px',
                      left: 0,
                      borderRadius: '50%',
                      animation: `${shadowAnimation} 0.5s linear infinite`,
                    },
                    '&::after': {
                      content: "''",
                      width: '100%',
                      height: '100%',
                      background: '$primary',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      borderRadius: '4px',
                      animation: `${jumpAnimation} 0.5s linear infinite`,
                    },
                  },
                  '&.art-controls': {
                    display: isMini && 'none !important',
                  },
                  '&.art-bottom': {
                    height: isMini && '7px !important',
                    padding: isMini && '0 !important',
                  },
                  '&.art-control-progress': {
                    height: isMini && '7px !important',
                    alignItems: isMini && 'flex-end !important',
                  },
                  '&.art-layer-expandPlayer': {
                    transition: 'all 0.3s ease',
                    opacity: 0,
                  },
                  '&.art-layer-closePlayer': {
                    transition: 'all 0.3s ease',
                    opacity: 0,
                  },
                  '&.art-layer-settings': {
                    transition: 'all 0.3s ease',
                    opacity: 0,
                  },
                  '&.art-layer-mask': {
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    display: 'none',
                  },
                  '&.art-layer-controlButtons': {
                    transition: 'all 0.3s ease',
                    opacity: 0,
                  },
                },
                '&:hover': {
                  '& div': {
                    '&.art-layer-expandPlayer': {
                      opacity: 1,
                    },
                    '&.art-layer-closePlayer': {
                      opacity: 1,
                    },
                    '&.art-layer-settings': {
                      opacity: 1,
                    },
                    '&.art-layer-mask': {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: isMini && 'block',
                    },
                    '&.art-layer-controlButtons': {
                      opacity: 1,
                    },
                  },
                },
              }}
            />
            {isMini ? (
              <Flex
                direction="column"
                align="start"
                justify="center"
                css={{
                  position: 'absolute',
                  bottom: '-64px',
                  left: 0,
                  right: 0,
                  height: '64px',
                  padding: '$sm',
                  backgroundColor: '$backgroundContrast',
                }}
              >
                <H5
                  h5
                  weight="bold"
                  onClick={() => navigate(routePlayer)}
                  css={{ cursor: 'pointer' }}
                >
                  {titlePlayer}
                </H5>
              </Flex>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
      {/* Creating a portal for the player layers */}
      {isMini && artplayer
        ? createPortal(
            <Box
              css={{
                width: '100%',
                height: '100%',
                zIndex: 1,
              }}
            />,
            artplayer.layers.mask,
          )
        : null}
      {isMini && artplayer
        ? createPortal(
            <Flex direction="row" align="center" justify="center" css={{ w: '100%', h: '100%' }}>
              <Tooltip content={isPlayerPlaying ? 'Pause' : 'Play'}>
                <Button
                  auto
                  light
                  onClick={() => {
                    if (isPlayerPlaying) {
                      artplayer.pause();
                    } else {
                      artplayer.play();
                    }
                  }}
                  icon={
                    isPlayerPlaying ? (
                      <Pause height={48} width={48} />
                    ) : (
                      <Play height={48} width={48} />
                    )
                  }
                  css={{ height: '48px' }}
                />
              </Tooltip>
            </Flex>,
            artplayer.layers.controlButtons,
          )
        : null}
      {isMini && artplayer
        ? createPortal(
            <Tooltip content="Expand">
              <Button auto light onClick={() => navigate(routePlayer)} icon={<Expand />} />
            </Tooltip>,
            artplayer.layers.expandPlayer,
          )
        : null}
      {isMini && artplayer
        ? createPortal(
            <Tooltip content="Close">
              <Button auto light onClick={() => setShouldShowPlayer(false)} icon={<Close />} />
            </Tooltip>,
            artplayer.layers.closePlayer,
          )
        : null}
      {isMini && artplayer
        ? createPortal(<PlayerSettings artplayer={artplayer} />, artplayer.layers.settings)
        : null}
      {/* Creating portals for the player controls */}
      {artplayer && !isMini
        ? createPortal(<PlayerSettings artplayer={artplayer} />, artplayer.controls.portal)
        : null}
    </Container>
  );
};

export default GlobalPlayer;
