/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { RouteMatch, useLocation } from '@remix-run/react';
import { Container, Button, Popover } from '@nextui-org/react';
import Artplayer from 'artplayer';
import { ClientOnly } from 'remix-utils';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import Hls from 'hls.js';
import { isMobile } from 'react-device-detect';

import usePlayerState from '~/store/player/usePlayerState';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';

import Settings from '~/src/assets/icons/SettingsIcon.js';

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
        <Button auto light aria-label="dropdown" icon={<Settings filled />} />
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
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [artplayer, setArtplayer] = useState<Artplayer | null>(null);
  const [show, setShow] = useState(false);

  const { isMini, shouldShowPlayer, setIsMini, setShouldShowPlayer } = usePlayerState(
    (state) => state,
  );
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

  useEffect(() => {
    setIsMini(shouldPlayInBackground);
  }, [shouldPlayInBackground]);

  useEffect(() => {
    setShouldShowPlayer(playerSettings?.shouldShowPlayer);
  }, [shouldShowPlayer]);

  useEffect(() => {
    if (shouldPlayInBackground && !isMobile) return;
    x.set(0);
    y.set(0);
  }, [x, y, shouldPlayInBackground]);

  return (
    <Container responsive css={{ margin: 0, padding: 0, width: isMini ? '20rem' : '100%' }}>
      <ClientOnly fallback="Loading...">
        {() => (
          <Suspense fallback="Loading...">
            <div className="fixed inset-0 pointer-events-none" ref={constraintsRef} />
            {shouldShowPlayer ? (
              <AnimatePresence initial={false}>
                <motion.div
                  drag={shouldPlayInBackground}
                  dragConstraints={constraintsRef}
                  dragElastic={0.1}
                  dragMomentum={false}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
                  className={shouldPlayInBackground ? 'fixed bottom-4 right-4 z-[9999]' : ''}
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
                      url: 'https://cache.387e6278d8e06083d813358762e0ac63.com/631a7154-808b-11ed-b76c-625f9a4201fc.m3u8?videoid=222961417930',
                      layers: [
                        {
                          html: '',
                          name: 'playlist',
                        },
                        {
                          html: '',
                          name: 'portal',
                          disable: !Artplayer.utils.isMobile,
                        },
                      ],
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
                          tooltip: 'Playlist',
                          position: 'right',
                          html: 'icon',
                          name: 'playlist',
                          click: () => {
                            setShow((state) => !state);
                          },
                        });
                        art.controls.add({
                          position: 'right',
                          name: 'portal',
                          html: '',
                        });
                        setArtplayer(art);
                        console.log(art);
                      });
                    }}
                    css={{
                      width: isMini ? '25rem' : '100%',
                      height: isMini ? '14.0625rem' : '100%',
                      '& div': {
                        '&.art-controls': {
                          display: isMini && 'none !important',
                        },
                        '&.art-bottom': {
                          height: isMini && '6px !important',
                          padding: isMini && '0 !important',
                        },
                        '&.art-control-progress': {
                          height: isMini && '6px !important',
                        },
                      },
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            ) : null}
          </Suspense>
        )}
      </ClientOnly>
      {show ? <div className="playlist">Playlist</div> : null}
      {show && artplayer
        ? createPortal(<div className="playlist">Playlist</div>, artplayer.layers.playlist)
        : null}
      {artplayer && Artplayer.utils.isMobile
        ? createPortal(<PlayerSettings artplayer={artplayer} />, artplayer.layers.portal)
        : null}
      {artplayer && !isMini
        ? createPortal(<PlayerSettings artplayer={artplayer} />, artplayer.controls.portal)
        : null}
    </Container>
  );
};

export default GlobalPlayer;
