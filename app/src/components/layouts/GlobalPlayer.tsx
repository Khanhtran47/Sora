/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { RouteMatch, useLocation, useNavigate } from '@remix-run/react';
import { Container, Button, Tooltip, keyframes } from '@nextui-org/react';
import Artplayer from 'artplayer';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import Hls from 'hls.js';
import { isDesktop, isMobile, isMobileOnly } from 'react-device-detect';
// @ts-ignore
import artplayerPluginControl from 'artplayer-plugin-control';
import tinycolor from 'tinycolor2';
import { useRouteData } from 'remix-utils';

import usePlayerState from '~/store/player/usePlayerState';
import type { PlayerData } from '~/store/player/usePlayerState';

import useLocalStorage from '~/hooks/useLocalStorage';
import useMeasure from '~/hooks/useMeasure';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import PlayerSettings from '~/src/components/elements/player/PlayerSettings';
import PlayerError from '~/src/components/elements/player/PlayerError';
import { H5 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';
import Box from '~/src/components/styles/Box.styles';

import Close from '~/src/assets/icons/CloseIcon.js';
import Expand from '~/src/assets/icons/ExpandIcon.js';
import Play from '~/src/assets/icons/PlayIcon.js';
import Pause from '~/src/assets/icons/PauseIcon.js';

interface IGlobalPlayerProps {
  matches: RouteMatch[];
}

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

const GlobalPlayer = (props: IGlobalPlayerProps) => {
  const { matches } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isMini,
    shouldShowPlayer,
    setIsMini,
    setShouldShowPlayer,
    routePlayer,
    setRoutePlayer,
    titlePlayer,
    setTitlePlayer,
    playerData,
    setPlayerData,
    qualitySelector,
    setQualitySelector,
    subtitleSelector,
    setSubtitleSelector,
  } = usePlayerState((state) => state);

  const { provider, sources, subtitles } = playerData || {};
  let backgroundColor;
  let windowColor;
  let hls: Hls | null = null;
  const matchesFiltered = matches.find(
    (match) => match?.pathname.includes('player') || match?.pathname.includes('watch'),
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const playerSettings = matchesFiltered?.handle?.playerSettings;
  const shouldPlayInBackground = useMemo(
    () => !(location?.pathname.includes('player') || location?.pathname.includes('watch')),
    [location?.pathname],
  );
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [artplayer, setArtplayer] = useState<Artplayer | null>(null);
  const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);

  const [currentSubtitleFontColor] = useLocalStorage('sora-settings_subtitle_font-color', 'White');
  const [currentSubtitleFontSize] = useLocalStorage('sora-settings_subtitle_font-size', '100%');
  const [currentSubtitleBackgroundColor] = useLocalStorage(
    'sora-settings_subtitle_background-color',
    'Black',
  );
  const [currentSubtitleBackgroundOpacity] = useLocalStorage(
    'sora-settings_subtitle_background-opacity',
    '0%',
  );
  const [currentSubtitleWindowColor] = useLocalStorage(
    'sora-settings_subtitle_window-color',
    'Black',
  );
  const [currentSubtitleWindowOpacity] = useLocalStorage(
    'sora-settings_subtitle_window-opacity',
    '0%',
  );
  const subtitleBackgroundColor = useMemo(() => {
    switch (currentSubtitleBackgroundColor) {
      case 'Black':
        backgroundColor = tinycolor('#000000');
        backgroundColor.setAlpha(Number(currentSubtitleBackgroundOpacity.replace(/%/g, '')) / 100);
        return backgroundColor.toHslString();
      case 'Blue':
        backgroundColor = tinycolor('#0072F5');
        backgroundColor.setAlpha(Number(currentSubtitleBackgroundOpacity.replace(/%/g, '')) / 100);
        return backgroundColor.toHslString();
      case 'Purple':
        backgroundColor = tinycolor('#7828C8');
        backgroundColor.setAlpha(Number(currentSubtitleBackgroundOpacity.replace(/%/g, '')) / 100);
        return backgroundColor.toHslString();
      case 'Green':
        backgroundColor = tinycolor('#17C964');
        backgroundColor.setAlpha(Number(currentSubtitleBackgroundOpacity.replace(/%/g, '')) / 100);
        return backgroundColor.toHslString();
      case 'Yellow':
        backgroundColor = tinycolor('#F5A524');
        backgroundColor.setAlpha(Number(currentSubtitleBackgroundOpacity.replace(/%/g, '')) / 100);
        return backgroundColor.toHslString();
      case 'Red':
        backgroundColor = tinycolor('#F31260');
        backgroundColor.setAlpha(Number(currentSubtitleBackgroundOpacity.replace(/%/g, '')) / 100);
        return backgroundColor.toHslString();
      case 'Cyan':
        backgroundColor = tinycolor('#06B7DB');
        backgroundColor.setAlpha(Number(currentSubtitleBackgroundOpacity.replace(/%/g, '')) / 100);
        return backgroundColor.toHslString();
      case 'Pink':
        backgroundColor = tinycolor('#FF4ECD');
        backgroundColor.setAlpha(Number(currentSubtitleBackgroundOpacity.replace(/%/g, '')) / 100);
        return backgroundColor.toHslString();
      case 'White':
        backgroundColor = tinycolor('#FFFFFF');
        backgroundColor.setAlpha(Number(currentSubtitleBackgroundOpacity.replace(/%/g, '')) / 100);
        return backgroundColor.toHslString();
      default:
        break;
    }
  }, [currentSubtitleBackgroundColor, currentSubtitleBackgroundOpacity]);
  const subtitleWindowColor = useMemo(() => {
    switch (currentSubtitleWindowColor) {
      case 'Black':
        windowColor = tinycolor('#000000');
        windowColor.setAlpha(Number(currentSubtitleWindowOpacity.replace(/%/g, '')) / 100);
        return windowColor.toHslString();
      case 'Blue':
        windowColor = tinycolor('#0072F5');
        windowColor.setAlpha(Number(currentSubtitleWindowOpacity.replace(/%/g, '')) / 100);
        return windowColor.toHslString();
      case 'Purple':
        windowColor = tinycolor('#7828C8');
        windowColor.setAlpha(Number(currentSubtitleWindowOpacity.replace(/%/g, '')) / 100);
        return windowColor.toHslString();
      case 'Green':
        windowColor = tinycolor('#17C964');
        windowColor.setAlpha(Number(currentSubtitleWindowOpacity.replace(/%/g, '')) / 100);
        return windowColor.toHslString();
      case 'Yellow':
        windowColor = tinycolor('#F5A524');
        windowColor.setAlpha(Number(currentSubtitleWindowOpacity.replace(/%/g, '')) / 100);
        return windowColor.toHslString();
      case 'Red':
        windowColor = tinycolor('#F31260');
        windowColor.setAlpha(Number(currentSubtitleWindowOpacity.replace(/%/g, '')) / 100);
        return windowColor.toHslString();
      case 'Cyan':
        windowColor = tinycolor('#06B7DB');
        windowColor.setAlpha(Number(currentSubtitleWindowOpacity.replace(/%/g, '')) / 100);
        return windowColor.toHslString();
      case 'Pink':
        windowColor = tinycolor('#FF4ECD');
        windowColor.setAlpha(Number(currentSubtitleWindowOpacity.replace(/%/g, '')) / 100);
        return windowColor.toHslString();
      case 'White':
        windowColor = tinycolor('#FFFFFF');
        windowColor.setAlpha(Number(currentSubtitleWindowOpacity.replace(/%/g, '')) / 100);
        return windowColor.toHslString();
      default:
        break;
    }
  }, [currentSubtitleWindowColor, currentSubtitleWindowOpacity]);

  useEffect(() => {
    setIsMini(shouldPlayInBackground);
    if (artplayer && !isMobile) {
      artplayer.plugins.artplayerPluginControl.enable = !shouldPlayInBackground;
    }
  }, [shouldPlayInBackground]);

  useEffect(() => {
    if (playerSettings?.shouldShowPlayer && playerData && !shouldPlayInBackground)
      setShouldShowPlayer(true);
    else if (!playerSettings && shouldPlayInBackground && playerData && !isMobileOnly)
      setShouldShowPlayer(true);
    else setShouldShowPlayer(false);
  }, [playerSettings, playerData]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    if (shouldPlayInBackground && !isMobile) return;
    x.set(0);
    y.set(0);
  }, [x, y, shouldPlayInBackground]);

  const RouteData: PlayerData = useRouteData(matchesFiltered?.id as string);
  useEffect(() => {
    if (RouteData) {
      setPlayerData(RouteData);
    }
  }, [matchesFiltered?.id]);

  useEffect(() => {
    if (playerData) {
      if (provider && sources && sources.length > 0) {
        setQualitySelector(
          provider === 'Loklok' ||
            provider === 'Gogo' ||
            provider === 'Zoro' ||
            provider === 'Flixhq'
            ? sources?.map(({ quality, url }: { quality: number | string; url: string }) => ({
                html: quality.toString(),
                url: url.toString().startsWith('http:')
                  ? `https://cors.proxy.consumet.org/${url.toString()}`
                  : url.toString(),
                isM3U8: true,
                isDASH: false,
                ...(provider === 'Flixhq' && quality === 'auto' && { default: true }),
                ...(provider === 'Loklok' && Number(quality) === 720 && { default: true }),
                ...((provider === 'Gogo' || provider === 'Zoro') &&
                  quality === 'default' && { default: true }),
              }))
            : provider === 'Bilibili'
            ? sources?.map(({ quality, url }: { quality: number | string; url: string }) => ({
                html: quality.toString(),
                url: url.toString(),
                isM3U8: false,
                isDASH: true,
                ...(quality === 'auto' && { default: true }),
              }))
            : provider === 'test'
            ? sources?.map(({ quality, url }: { quality: number | string; url: string }) => ({
                html: quality.toString(),
                url: url.toString(),
                isM3U8: true,
                isDASH: false,
                ...(quality === 720 && { default: true }),
              }))
            : sources?.map(({ quality, url }: { quality: number | string; url: string }) => ({
                html: quality.toString(),
                url: url.toString(),
                isM3U8: true,
                isDASH: false,
                ...(quality === 'default' && { default: true }),
              })),
        );
        setSubtitleSelector(
          subtitles?.map(({ lang, url }: { lang: string; url: string }) => ({
            html: lang.toString(),
            url: url.toString(),
            ...(provider === 'Flixhq' && lang === 'English' && { default: true }),
            ...(provider === 'Loklok' && lang.includes('en') && { default: true }),
            ...(provider === 'Bilibili' && lang.includes('en') && { default: true }),
            ...(provider === 'KissKh' && lang === 'English' && { default: true }),
            ...(provider === 'test' && lang === 'ch-jp' && { default: true }),
          })),
        );
        setRoutePlayer(playerData?.routePlayer);
        setTitlePlayer(playerData?.titlePlayer);
      }
    }
  }, [playerData]);

  return (
    <Container fluid css={{ margin: 0, padding: 0, width: isMini ? '20rem' : '100%' }}>
      <div className="fixed inset-0 pointer-events-none" ref={constraintsRef} />
      <AnimatePresence initial={false}>
        {shouldShowPlayer ? (
          <motion.div
            layout
            ref={ref}
            drag={shouldPlayInBackground}
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
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
            {playerData ? (
              <>
                <ArtPlayer
                  type="movie"
                  key={`${playerData?.id}-${playerData?.routePlayer}-${playerData?.titlePlayer}-${playerData?.provider}`}
                  autoPlay={false}
                  hideBottomGroupButtons
                  option={{
                    type: provider === 'Bilibili' ? 'mpd' : provider === 'test' ? 'mp4' : 'm3u8',
                    autoSize: false,
                    loop: false,
                    mutex: true,
                    setting: false,
                    flip: true,
                    playbackRate: true,
                    aspectRatio: true,
                    fullscreen: true,
                    fullscreenWeb: false,
                    airplay: true,
                    pip: isDesktop,
                    autoplay: false,
                    screenshot: isDesktop,
                    subtitleOffset: true,
                    fastForward: isMobile,
                    lock: isMobile,
                    miniProgressBar: true,
                    autoOrientation: isMobile,
                    isLive: false,
                    playsInline: true,
                    autoPlayback: true,
                    whitelist: ['*'],
                    theme: 'var(--nextui-colors-primary)',
                    autoMini: false,
                    hotkey: true,
                    moreVideoAttr: isDesktop
                      ? {
                          crossOrigin: 'anonymous',
                        }
                      : {
                          'x5-video-player-type': 'h5',
                          'x5-video-player-fullscreen': false,
                          'x5-video-orientation': 'portraint',
                          preload: 'metadata',
                        },
                    url:
                      provider === 'Loklok'
                        ? sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              Number(item.quality) === 720,
                          )?.url ||
                          (sources && sources[0]?.url)
                        : provider === 'Flixhq'
                        ? sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              item.quality === 'auto',
                          )?.url ||
                          (sources && sources[0]?.url)
                        : provider === 'Gogo' || provider === 'Zoro'
                        ? sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              item.quality === 'default',
                          )?.url ||
                          (sources && sources[0]?.url)
                        : provider === 'Bilibili' || provider === 'KissKh'
                        ? sources && sources[0]?.url
                        : provider === 'test'
                        ? sources?.find((source) => Number(source.quality) === 720)?.url
                        : sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              item.quality === 'default',
                          )?.url ||
                          (sources && sources[0]?.url) ||
                          '',
                    subtitle: {
                      url:
                        provider === 'Loklok'
                          ? subtitles?.find((item: { lang: string; url: string }) =>
                              item.lang.includes('English'),
                            )?.url
                          : provider === 'Flixhq'
                          ? subtitles?.find((item: { lang: string; url: string }) =>
                              item.lang.includes('English'),
                            )?.url || ''
                          : provider === 'KissKh'
                          ? subtitles?.find(
                              (item: { lang: string; url: string; default?: boolean }) =>
                                item.default,
                            )?.url || ''
                          : provider === 'test'
                          ? subtitles?.find((item: { lang: string; url: string }) =>
                              item.lang.includes('ch-jp'),
                            )?.url || ''
                          : subtitles?.find((item: { lang: string; url: string }) =>
                              item.lang.includes('English'),
                            )?.url || '',
                      encoding: 'utf-8',
                      type:
                        provider === 'Flixhq' || provider === 'Loklok' || provider === 'Bilibili'
                          ? 'vtt'
                          : provider === 'KissKh'
                          ? 'srt'
                          : '',
                    },
                    title: playerData?.titlePlayer,
                    poster: playerData?.posterPlayer,
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
                        name: 'playPauseButton',
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
                        name: 'topControlButtons',
                        style: {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                        },
                      },
                    ],
                    icons: {
                      // state: isDesktop && '',
                      loading: '<div class="custom-loader"></div>',
                    },
                    customType:
                      provider === 'Bilibili'
                        ? {
                            mpd: async (video: HTMLMediaElement, url: string) => {
                              const { default: dashjs } = await import('dashjs');
                              const player = dashjs.MediaPlayer().create();
                              player.initialize(video, url, false);
                            },
                          }
                        : {
                            m3u8: async (video: HTMLMediaElement, url: string) => {
                              if (hls) {
                                hls.destroy();
                              }
                              if (Hls.isSupported()) {
                                hls = new Hls();
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
                    controls: [
                      {
                        position: 'right',
                        name: 'settings',
                        html: '',
                        tooltip: 'Settings',
                      },
                    ],
                    plugins: [artplayerPluginControl()],
                  }}
                  getInstance={(art) => {
                    art.on('ready', () => {
                      setArtplayer(art);
                      console.log(art);
                      art.controls.add({
                        position: 'top',
                        name: 'test',
                        html: '',
                        tooltip: 'Test',
                        style: {
                          position: 'absolute',
                          bottom: `${Number(art?.height) - 30}px`,
                          left: '0px',
                          padding: '0px 7px',
                          width: '100%',
                        },
                      });
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
                    borderTopLeftRadius: isMini ? '$sm' : 0,
                    borderTopRightRadius: isMini ? '$sm' : 0,
                    overflow: 'hidden',
                    '& div': {
                      '&.art-video-player': {
                        fontFamily: 'Inter !important',
                      },
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
                        flexDirection: isMobile ? 'column-reverse' : 'column',
                      },
                      '&.art-notice': {
                        justifyContent: 'center',
                      },
                      '&.art-control-progress': {
                        height: isMini && '7px !important',
                        alignItems: isMini && 'flex-end !important',
                      },
                      '&.art-layer-mask': {
                        transition: 'all 0.3s ease',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        display: 'none',
                      },
                      '&.art-layer-playPauseButton': {
                        transition: 'all 0.3s ease',
                        display: 'none',
                      },
                      '&.art-layer-topControlButtons': {
                        transition: 'all 0.3s ease',
                        display: 'none',
                      },
                      '&.art-control-playAndPause': {
                        display: isMobile ? 'none !important' : 'flex',
                      },
                      '&.art-control-volume': {
                        display: isMobile ? 'none !important' : 'flex',
                      },
                      '&.art-state': {
                        display: isDesktop && 'none !important',
                      },
                      '&.art-subtitle': {
                        bottom: isMini && '7px !important',
                        display: 'flex !important',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        backgroundColor: subtitleWindowColor,
                        color:
                          currentSubtitleFontColor === 'White'
                            ? '#fff'
                            : currentSubtitleFontColor === 'Blue'
                            ? '#0072F5'
                            : currentSubtitleFontColor === 'Purple'
                            ? '#7828C8'
                            : currentSubtitleFontColor === 'Green'
                            ? '#17C964'
                            : currentSubtitleFontColor === 'Yellow'
                            ? '#F5A524'
                            : currentSubtitleFontColor === 'Red'
                            ? '#F31260'
                            : currentSubtitleFontColor === 'Cyan'
                            ? '#06B7DB'
                            : currentSubtitleFontColor === 'Pink'
                            ? '#FF4ECD'
                            : currentSubtitleFontColor === 'White'
                            ? '#7828C8'
                            : '#000',
                        fontSize:
                          currentSubtitleFontSize === '50%'
                            ? `${height * 0.05 * 0.5}px`
                            : currentSubtitleFontSize === '75%'
                            ? `${height * 0.05 * 0.75}px`
                            : currentSubtitleFontSize === '100%'
                            ? `${height * 0.05}px`
                            : currentSubtitleFontSize === '150%'
                            ? `${height * 0.05 * 1.5}px`
                            : currentSubtitleFontSize === '200%'
                            ? `${height * 0.05 * 2}px`
                            : currentSubtitleFontSize === '300%'
                            ? `${height * 0.05 * 3}px`
                            : `${height * 0.05 * 4}px`,
                        '& p': {
                          p: '$2',
                          backgroundColor: subtitleBackgroundColor,
                          m: 0,
                        },
                      },
                    },
                    '&:hover': {
                      '& div': {
                        '&.art-layer-mask': {
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: isMini && 'block',
                        },
                        '&.art-layer-playPauseButton': {
                          display: isMini && 'block',
                        },
                        '&.art-layer-topControlButtons': {
                          display: isMini && 'block',
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
                      borderBottomLeftRadius: '$sm',
                      borderBottomRightRadius: '$sm',
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
              </>
            ) : (
              <PlayerError
                title="Video not found"
                message="The video you are trying to watch is not available."
              />
            )}
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
            <Flex
              direction="row"
              align="center"
              justify="center"
              css={{
                w: '100%',
                h: '100%',
              }}
            >
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
                      <Pause height={48} width={48} filled />
                    ) : (
                      <Play height={48} width={48} filled />
                    )
                  }
                  css={{ height: '48px' }}
                />
              </Tooltip>
            </Flex>,
            artplayer.layers.playPauseButton,
          )
        : null}
      {isMini && artplayer
        ? createPortal(
            <Flex direction="row" align="center" justify="between">
              <Flex direction="row" align="center" justify="center" className="space-x-1">
                <Tooltip content="Expand">
                  <Button
                    auto
                    light
                    onClick={() => navigate(routePlayer)}
                    icon={<Expand filled />}
                  />
                </Tooltip>
                <Tooltip content="Close">
                  <Button
                    auto
                    light
                    onClick={() => {
                      setShouldShowPlayer(false);
                      setPlayerData(undefined);
                      setIsMini(false);
                      setRoutePlayer('');
                      setTitlePlayer('');
                      setQualitySelector([]);
                      setSubtitleSelector([]);
                    }}
                    icon={<Close />}
                  />
                </Tooltip>
              </Flex>
              <PlayerSettings
                artplayer={artplayer}
                qualitySelector={qualitySelector}
                subtitleSelector={subtitleSelector}
              />
            </Flex>,
            artplayer.layers.topControlButtons,
          )
        : null}
      {/* Creating portals for the player controls */}
      {artplayer && !isMini
        ? createPortal(
            <PlayerSettings
              artplayer={artplayer}
              qualitySelector={qualitySelector}
              subtitleSelector={subtitleSelector}
            />,
            artplayer.controls.settings,
          )
        : null}
    </Container>
  );
};

export default GlobalPlayer;
