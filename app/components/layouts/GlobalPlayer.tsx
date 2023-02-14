/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, useFetcher, useMatches, useParams } from '@remix-run/react';
import { Container, Button, Tooltip, keyframes } from '@nextui-org/react';
import Artplayer from 'artplayer';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import Hls from 'hls.js';
import { isDesktop, isMobile, isMobileOnly } from 'react-device-detect';
import tinycolor from 'tinycolor2';
import { useRouteData } from 'remix-utils';

import usePlayerState from '~/store/player/usePlayerState';
import type { PlayerData } from '~/store/player/usePlayerState';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import useMeasure from '~/hooks/useMeasure';

import updateHistory from '~/utils/client/update-history';

import ArtPlayer from '~/components/elements/player/ArtPlayer';
import PlayerSettings from '~/components/elements/player/PlayerSettings';
import PlayerError from '~/components/elements/player/PlayerError';
import { H5, H6 } from '~/components/styles/Text.styles';
import Flex from '~/components/styles/Flex.styles';
import Box from '~/components/styles/Box.styles';
import WatchTrailerModal, { Trailer } from '~/components/elements/modal/WatchTrailerModal';
import SearchSubtitles from '~/components/elements/modal/SearchSubtitle';

import Close from '~/assets/icons/CloseIcon';
import Expand from '~/assets/icons/ExpandIcon';
import Play from '~/assets/icons/PlayIcon';
import Pause from '~/assets/icons/PauseIcon';
import Next from '~/assets/icons/NextIcon';
import Previous from '~/assets/icons/PreviousIcon';

import { PlayerHotKey } from '../elements/player/PlayerHotkey';

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

type Highlight = {
  start: number;
  end: number;
  text: string;
};

const GlobalPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const matches = useMatches();
  const { seasonId, episodeId } = useParams();
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

  const {
    provider,
    sources,
    subtitles,
    id,
    posterPlayer,
    typeVideo,
    trailerAnime,
    hasNextEpisode,
    idProvider,
    userId,
    subtitleOptions,
    highlights,
  } = playerData || {};
  let backgroundColor;
  let windowColor;
  let hls: Hls | null = null;
  const matchesFiltered = useMemo(
    () =>
      matches.find(
        (match) => match?.pathname.includes('player') || match?.pathname.includes('watch'),
      ),
    [matches],
  );
  const playerSettings = matchesFiltered?.handle?.playerSettings;
  const shouldPlayInBackground = useMemo(
    () => !(location?.pathname.includes('player') || location?.pathname.includes('watch')),
    [location?.pathname],
  );
  const {
    autoShowSubtitle,
    currentSubtitleFontColor,
    currentSubtitleFontSize,
    currentSubtitleBackgroundColor,
    currentSubtitleBackgroundOpacity,
    currentSubtitleWindowColor,
    currentSubtitleWindowOpacity,
    currentSubtitleTextEffects,
    isAutoSize,
    isPicInPic,
    isMuted,
    isAutoPlay,
    isAutoMini,
    isLoop,
    isScreenshot,
    isMiniProgressbar,
    isAutoPlayback,
    isAutoPlayNextEpisode,
    isAutoSkipOpEd,
    isFastForward,
    isShowSkipOpEdButton,
  } = useSoraSettings();
  const currentEpisode = useMemo(() => Number(episodeId), [episodeId]);
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [artplayer, setArtplayer] = useState<Artplayer | null>(null);
  const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isPlayerFullScreen, setIsPlayerFullScreen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(autoShowSubtitle);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState<Highlight | null>(null);
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
  const subtitleTextEffects = useMemo(() => {
    switch (currentSubtitleTextEffects) {
      case 'None':
        return 'none';
      case 'Drop Shadow':
        return 'rgb(34 34 34) 2.2px 2.2px 3.3px, rgb(34 34 34) 2.2px 2.2px 4.4px, rgb(34 34 34) 2.2px 2.2px 5.5px';
      case 'Raised':
        return 'rgb(34 34 34) 1.1px 1.1px, rgb(34 34 34) 2.1px 2.1px, rgb(34 34 34) 3.1px 3.1px';
      case 'Depressed':
        return 'rgb(204 204 204) 1.1px 1.1px, rgb(34 34 34) -1.1px -1.1px';
      case 'Outline':
        return 'rgb(34 34 34) 0px 0px 2.2px, rgb(34 34 34) 0px 0px 2.2px, rgb(34 34 34) 0px 0px 2.2px, rgb(34 34 34) 0px 0px 2.2px, rgb(34 34 34) 0px 0px 2.2px';
      default:
        break;
    }
  }, [currentSubtitleTextEffects]);

  const closeSearchModalHandler = () => {
    setSearchModalVisible(false);
  };

  const savePlayProgress = (art: Artplayer) => {
    if (userId && playerData?.titlePlayer) {
      switch (typeVideo) {
        case 'movie':
          updateHistory(
            art,
            fetcher,
            userId,
            location.pathname + location.search,
            'movie',
            playerData?.titlePlayer,
            playerData?.overview || '',
          );
          break;
        case 'tv':
          updateHistory(
            art,
            fetcher,
            userId,
            location.pathname + location.search,
            'tv',
            playerData?.titlePlayer,
            playerData?.overview || '',
            seasonId,
            episodeId,
          );
          break;
        case 'anime':
          updateHistory(
            art,
            fetcher,
            userId,
            location.pathname + location.search,
            'anime',
            playerData?.titlePlayer,
            playerData?.overview || '',
            episodeId,
          );
          break;
        default:
      }
    }
  };

  useEffect(() => {
    setIsMini(shouldPlayInBackground);
  }, [shouldPlayInBackground]);

  useEffect(() => {
    if (playerSettings?.shouldShowPlayer && playerData && !shouldPlayInBackground)
      setShouldShowPlayer(true);
    else if (!playerSettings && shouldPlayInBackground && playerData?.sources && !isMobileOnly)
      setShouldShowPlayer(true);
    else setShouldShowPlayer(false);
  }, [playerSettings, playerData, userId]);

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
  }, [matchesFiltered?.pathname]);

  const nextEpisodeUrl = useMemo(() => {
    if (typeVideo === 'tv') {
      return `/tv-shows/${id}/season/${seasonId}/episode/${
        currentEpisode + 1
      }/watch?provider=${provider}&id=${idProvider}`;
    }
    if (typeVideo === 'anime') {
      return `/anime/${id}/episode/${
        currentEpisode + 1
      }/watch?provider=${provider}&id=${idProvider}&skipOpEd=${isShowSkipOpEdButton}`;
    }
  }, [typeVideo, id, seasonId, currentEpisode, provider, idProvider, isShowSkipOpEdButton]);

  const prevEpisodeUrl = useMemo(() => {
    if (currentEpisode > 1) {
      if (typeVideo === 'tv') {
        return `/tv-shows/${id}/season/${seasonId}/episode/${
          currentEpisode - 1
        }/watch?provider=${provider}&id=${idProvider}`;
      }
      if (typeVideo === 'anime') {
        return `/anime/${id}/episode/${
          currentEpisode - 1
        }/watch?provider=${provider}&id=${idProvider}&skipOpEd=${isShowSkipOpEdButton}`;
      }
    }
  }, [typeVideo, id, seasonId, currentEpisode, provider, idProvider, isShowSkipOpEdButton]);

  useEffect(() => {
    if (
      isVideoEnded &&
      provider &&
      idProvider &&
      hasNextEpisode &&
      nextEpisodeUrl &&
      typeVideo !== 'movie' &&
      isAutoPlayNextEpisode
    ) {
      navigate(nextEpisodeUrl);
    }
  }, [isVideoEnded]);

  const [isWatchTrailerModalVisible, setWatchTrailerModalVisible] = useState(false);
  const [trailer, setTrailer] = useState<Trailer>({});
  const closeWatchTrailerModalHandler = () => {
    setWatchTrailerModalVisible(false);
    artplayer?.play();
    if (typeVideo === 'movie' || typeVideo === 'tv') setTrailer({});
  };
  useEffect(() => {
    if (fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailer(officialTrailer);
    }
  }, [fetcher.data]);

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
                url:
                  url.toString().startsWith('http:') || provider === 'Gogo' || provider === 'Zoro'
                    ? `https://cors.consumet.stream/${url.toString()}`
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
            : provider === 'KissKh'
            ? sources?.map(({ quality, url }: { quality: number | string; url: string }) => ({
                html: quality.toString(),
                url: `https://cors.consumet.stream/${url.toString()}`,
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
        setTitlePlayer(
          `${playerData?.titlePlayer}${seasonId ? ` season ${seasonId}` : ''}${
            episodeId ? ` episode ${episodeId}` : ''
          }`,
        );
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
            {playerData?.sources ? (
              <>
                <ArtPlayer
                  key={`${id}-${routePlayer}-${titlePlayer}-${provider}`}
                  option={{
                    id: `${id}-${routePlayer}-${titlePlayer}-${provider}`,
                    type: provider === 'Bilibili' ? 'mpd' : provider === 'test' ? 'mp4' : 'm3u8',
                    autoSize: isAutoSize,
                    loop: isLoop,
                    muted: isMuted,
                    mutex: true,
                    setting: false,
                    flip: true,
                    playbackRate: true,
                    aspectRatio: true,
                    fullscreen: true,
                    fullscreenWeb: false,
                    airplay: true,
                    pip: isPicInPic,
                    autoplay: isAutoPlay,
                    screenshot: isDesktop && isScreenshot,
                    subtitleOffset: true,
                    fastForward: isMobile && isFastForward,
                    lock: isMobile,
                    miniProgressBar: isMiniProgressbar,
                    autoOrientation: isMobile,
                    isLive: false,
                    playsInline: true,
                    autoPlayback: isAutoPlayback,
                    whitelist: ['*'],
                    theme: 'var(--nextui-colors-primary)',
                    autoMini: isAutoMini,
                    hotkey: true,
                    useSSR: false,
                    moreVideoAttr: isDesktop
                      ? {
                          crossOrigin: 'anonymous',
                        }
                      : {
                          'x5-video-player-type': 'h5',
                          'x5-video-player-fullscreen': false,
                          'x5-video-orientation': 'portrait',
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
                        ? `https://cors.consumet.stream/${
                            sources?.find(
                              (item: { quality: number | string; url: string }) =>
                                item.quality === 'default',
                            )?.url
                          }` ||
                          (sources && `https://cors.consumet.stream/${sources[0]?.url}`)
                        : provider === 'Bilibili'
                        ? sources && sources[0]?.url
                        : provider === 'KissKh'
                        ? sources && `https://cors.consumet.stream/${sources[0]?.url}`
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
                    title: titlePlayer,
                    poster: posterPlayer,
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
                        name: 'miniTopControlButtons',
                        style: {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                        },
                      },
                      {
                        html: '',
                        name: 'skipButton',
                        style: {
                          position: 'absolute',
                          bottom: '65px',
                          right: '10px',
                        },
                      },
                    ],
                    icons: {
                      // state: isDesktop && '',
                      loading: '<div class="custom-loader"></div>',
                      play: `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.49 9.59965L5.6 16.7696C4.9 17.1896 4 16.6896 4 15.8696V7.86965C4 4.37965 7.77 2.19965 10.8 3.93965L15.39 6.57965L17.48 7.77965C18.17 8.18965 18.18 9.18965 17.49 9.59965Z" fill="none"/>
                          <path d="M18.0888 15.4606L14.0388 17.8006L9.99883 20.1306C8.54883 20.9606 6.90883 20.7906 5.71883 19.9506C5.13883 19.5506 5.20883 18.6606 5.81883 18.3006L18.5288 10.6806C19.1288 10.3206 19.9188 10.6606 20.0288 11.3506C20.2788 12.9006 19.6388 14.5706 18.0888 15.4606Z" fill="none"/>
                        </svg>
                      `,
                      pause: `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z" fill="none"/>
                          <path d="M21.0016 19.11V4.89C21.0016 3.54 20.4316 3 18.9916 3H15.3616C13.9316 3 13.3516 3.54 13.3516 4.89V19.11C13.3516 20.46 13.9216 21 15.3616 21H18.9916C20.4316 21 21.0016 20.46 21.0016 19.11Z" fill="none"/>
                        </svg>
                      `,
                      volume: `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.0003 16.7503C17.8403 16.7503 17.6903 16.7003 17.5503 16.6003C17.2203 16.3503 17.1503 15.8803 17.4003 15.5503C18.9703 13.4603 18.9703 10.5403 17.4003 8.45027C17.1503 8.12027 17.2203 7.65027 17.5503 7.40027C17.8803 7.15027 18.3503 7.22027 18.6003 7.55027C20.5603 10.1703 20.5603 13.8303 18.6003 16.4503C18.4503 16.6503 18.2303 16.7503 18.0003 16.7503Z" fill="none"/>
                          <path d="M19.8284 19.2503C19.6684 19.2503 19.5184 19.2003 19.3784 19.1003C19.0484 18.8503 18.9784 18.3803 19.2284 18.0503C21.8984 14.4903 21.8984 9.51027 19.2284 5.95027C18.9784 5.62027 19.0484 5.15027 19.3784 4.90027C19.7084 4.65027 20.1784 4.72027 20.4284 5.05027C23.4984 9.14027 23.4984 14.8603 20.4284 18.9503C20.2884 19.1503 20.0584 19.2503 19.8284 19.2503Z" fill="none"/>
                          <path d="M14.02 3.78168C12.9 3.16168 11.47 3.32168 10.01 4.23168L7.09 6.06168C6.89 6.18168 6.66 6.25168 6.43 6.25168H5.5H5C2.58 6.25168 1.25 7.58168 1.25 10.0017V14.0017C1.25 16.4217 2.58 17.7517 5 17.7517H5.5H6.43C6.66 17.7517 6.89 17.8217 7.09 17.9417L10.01 19.7717C10.89 20.3217 11.75 20.5917 12.55 20.5917C13.07 20.5917 13.57 20.4717 14.02 20.2217C15.13 19.6017 15.75 18.3117 15.75 16.5917V7.41168C15.75 5.69168 15.13 4.40168 14.02 3.78168Z" fill="none"/>
                        </svg>
                      `,
                      volumeClose: `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.5314 13.4197L21.0814 11.9697L22.4814 10.5697C22.7714 10.2797 22.7714 9.79969 22.4814 9.50969C22.1914 9.21969 21.7114 9.21969 21.4214 9.50969L20.0214 10.9097L18.5714 9.45969C18.2814 9.16969 17.8014 9.16969 17.5114 9.45969C17.2214 9.74969 17.2214 10.2297 17.5114 10.5197L18.9614 11.9697L17.4714 13.4597C17.1814 13.7497 17.1814 14.2297 17.4714 14.5197C17.6214 14.6697 17.8114 14.7397 18.0014 14.7397C18.1914 14.7397 18.3814 14.6697 18.5314 14.5197L20.0214 13.0297L21.4714 14.4797C21.6214 14.6297 21.8114 14.6997 22.0014 14.6997C22.1914 14.6997 22.3814 14.6297 22.5314 14.4797C22.8214 14.1897 22.8214 13.7197 22.5314 13.4197Z" fill="none"/>
                          <path d="M14.02 3.78168C12.9 3.16168 11.47 3.32168 10.01 4.23168L7.09 6.06168C6.89 6.18168 6.66 6.25168 6.43 6.25168H5.5H5C2.58 6.25168 1.25 7.58168 1.25 10.0017V14.0017C1.25 16.4217 2.58 17.7517 5 17.7517H5.5H6.43C6.66 17.7517 6.89 17.8217 7.09 17.9417L10.01 19.7717C10.89 20.3217 11.75 20.5917 12.55 20.5917C13.07 20.5917 13.57 20.4717 14.02 20.2217C15.13 19.6017 15.75 18.3117 15.75 16.5917V7.41168C15.75 5.69168 15.13 4.40168 14.02 3.78168Z" fill="none"/>
                        </svg>
                      `,
                      screenshot: `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.0002 6C17.3902 6 16.8302 5.65 16.5502 5.11L15.8302 3.66C15.3702 2.75 14.1702 2 13.1502 2H10.8602C9.83017 2 8.63017 2.75 8.17017 3.66L7.45017 5.11C7.17017 5.65 6.61017 6 6.00017 6C3.83017 6 2.11017 7.83 2.25017 9.99L2.77017 18.25C2.89017 20.31 4.00017 22 6.76017 22H17.2402C20.0002 22 21.1002 20.31 21.2302 18.25L21.7502 9.99C21.8902 7.83 20.1702 6 18.0002 6ZM10.5002 7.25H13.5002C13.9102 7.25 14.2502 7.59 14.2502 8C14.2502 8.41 13.9102 8.75 13.5002 8.75H10.5002C10.0902 8.75 9.75017 8.41 9.75017 8C9.75017 7.59 10.0902 7.25 10.5002 7.25ZM12.0002 18.12C10.1402 18.12 8.62017 16.61 8.62017 14.74C8.62017 12.87 10.1302 11.36 12.0002 11.36C13.8702 11.36 15.3802 12.87 15.3802 14.74C15.3802 16.61 13.8602 18.12 12.0002 18.12Z" fill="none"/>
                        </svg>
                      `,
                      pip: `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM18.5 16.4C18.5 17.9 17.9 18.5 16.4 18.5H12.6C11.1 18.5 10.5 17.9 10.5 16.4V14.6C10.5 13.1 11.1 12.5 12.6 12.5H16.4C17.9 12.5 18.5 13.1 18.5 14.6V16.4Z" fill="none"/>
                        </svg>
                      `,
                      fullscreenOn: `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM10.22 21H7.91C5.2 21 3 18.8 3 16.09V13.78C3 13.37 3.34 13.03 3.75 13.03C4.16 13.03 4.5 13.37 4.5 13.78V16.09C4.5 17.97 6.03 19.5 7.91 19.5H10.22C10.63 19.5 10.97 19.84 10.97 20.25C10.97 20.66 10.64 21 10.22 21ZM10.22 4.5H7.91C6.03 4.5 4.5 6.03 4.5 7.91V10.22C4.5 10.63 4.16 10.97 3.75 10.97C3.34 10.97 3 10.64 3 10.22V7.91C3 5.2 5.2 3 7.91 3H10.22C10.63 3 10.97 3.34 10.97 3.75C10.97 4.16 10.64 4.5 10.22 4.5ZM21 16.09C21 18.8 18.8 21 16.09 21H14.7C14.29 21 13.95 20.66 13.95 20.25C13.95 19.84 14.29 19.5 14.7 19.5H16.09C17.97 19.5 19.5 17.97 19.5 16.09V14.7C19.5 14.29 19.84 13.95 20.25 13.95C20.66 13.95 21 14.29 21 14.7V16.09ZM21 10.22C21 10.63 20.66 10.97 20.25 10.97C19.84 10.97 19.5 10.63 19.5 10.22V7.91C19.5 6.03 17.97 4.5 16.09 4.5H13.78C13.37 4.5 13.03 4.16 13.03 3.75C13.03 3.34 13.36 3 13.78 3H16.09C18.8 3 21 5.2 21 7.91V10.22Z" fill="none"/>
                        </svg>
                      `,
                      fullscreenOff: `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 9C3 8.44772 3.44772 8 4 8H8L8 4C8 3.44772 8.44772 3 9 3C9.55229 3 10 3.44772 10 4L10 9C10 9.55229 9.55228 10 9 10H4C3.44772 10 3 9.55229 3 9Z" fill="none"/>
                          <path d="M20 8C20.5523 8 21 8.44772 21 9C21 9.55229 20.5523 10 20 10H15C14.4477 10 14 9.55229 14 9L14 4C14 3.44772 14.4477 3 15 3C15.5523 3 16 3.44772 16 4V8H20Z" fill="none"/>
                          <path d="M20 16C20.5523 16 21 15.5523 21 15C21 14.4477 20.5523 14 20 14H15C14.4477 14 14 14.4477 14 15L14 20C14 20.5523 14.4477 21 15 21C15.5523 21 16 20.5523 16 20V16H20Z" fill="none"/>
                          <path d="M4 16C3.44772 16 3 15.5523 3 15C3 14.4477 3.44772 14 4 14H9C9.55228 14 10 14.4477 10 15L10 20C10 20.5523 9.55229 21 9 21C8.44772 21 8 20.5523 8 20L8 16H4Z" fill="none"/>
                        </svg>
                      `,
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
                      ...(currentEpisode > 1 && isDesktop
                        ? [{ position: 'left', name: 'prev', html: '' }]
                        : []),
                      ...(hasNextEpisode && isDesktop
                        ? [{ position: 'left', name: 'next', html: '' }]
                        : []),
                    ],
                  }}
                  getInstance={(art) => {
                    art.on('ready', async () => {
                      const t = new URLSearchParams(location.search).get('t');
                      if (t) {
                        art.currentTime = Number(t);
                      }
                      if (art?.height) {
                        art.controls.add({
                          position: 'right',
                          name: 'topControlButtons',
                          html: '',
                          style: {
                            position: 'absolute',
                            bottom: `${Number(art?.height) - (isMobile ? 70 : 55)}px`,
                            left: isMobile ? '-7px' : '-10px',
                            width: `${Number(art?.width)}px`,
                            padding: '0 7px 0 7px',
                            height: '55px',
                            cursor: 'default',
                          },
                        });
                      }
                      setIsVideoEnded(false);
                      setShowSkipButton(false);
                      setArtplayer(art);
                      if (autoShowSubtitle && art.subtitle) {
                        art.subtitle.show = autoShowSubtitle;
                      }
                      PlayerHotKey(art, setShowSubtitle);
                    });
                    savePlayProgress(art);
                    art.on('play', () => {
                      setIsVideoEnded(false);
                      setIsPlayerPlaying(true);
                    });
                    art.on('pause', () => {
                      setIsPlayerPlaying(false);
                    });
                    art.on('video:loadedmetadata', () => {
                      /* Adding highlights in player's progress bar */
                      if (highlights) {
                        const $highlight = art.query('.art-progress-highlight');
                        // @ts-ignore
                        const { append, createElement, setStyles } = art.constructor.utils;
                        for (let index = 0; index < highlights.length; index += 1) {
                          const item = highlights[index];
                          const left = (item.start / art.duration) * 100;
                          const width = ((item.end - item.start) / art.duration) * 100;
                          const $item = createElement('span');
                          $item.dataset.text = item.text;
                          setStyles($item, {
                            left: `${left}%`,
                            width: `${width}%`,
                            backgroundColor: 'var(--nextui-colors-secondary) !important',
                          });
                          append($highlight, $item);
                        }
                      }
                    });
                    art.on('resize', () => {
                      // eslint-disable-next-line @typescript-eslint/dot-notation
                      const $topControlButtons = art.controls['topControlButtons'];
                      // set top control buttons position when player resize
                      $topControlButtons.style.bottom = `${
                        Number(art?.height) - (isMobile ? 70 : 55)
                      }px`;
                      $topControlButtons.style.width = `${Number(art?.width)}px`;
                    });
                    art.on('video:timeupdate', () => {
                      /* Finding the current highlight and show skip button */
                      if (highlights) {
                        const findCurrentHighlight = highlights.find(
                          (item) => art.currentTime >= item.start && art.currentTime <= item.end,
                        );
                        if (findCurrentHighlight) {
                          if (isAutoSkipOpEd) {
                            art.currentTime = findCurrentHighlight.end;
                            art.notice.show = `Skipped ${findCurrentHighlight.text}`;
                          } else {
                            setShowSkipButton(true);
                            setCurrentHighlight(findCurrentHighlight);
                          }
                        } else {
                          setShowSkipButton(false);
                          setCurrentHighlight(null);
                        }
                      }
                    });
                    art.on('fullscreen', (state) => {
                      setIsPlayerFullScreen(state);
                    });
                    art.on('video:ended', () => {
                      setIsVideoEnded(true);
                      setIsPlayerPlaying(false);
                      setShowSkipButton(false);
                      art.fullscreen = false;
                    });
                    art.on('destroy', () => {
                      setIsVideoEnded(false);
                      setIsPlayerPlaying(false);
                      setIsPlayerFullScreen(false);
                      setArtplayer(null);
                      if (hls) {
                        hls.destroy();
                      }
                    });
                  }}
                  css={{
                    width: isMini ? '25rem' : '100%',
                    height: isMini ? '14.0625rem' : '100%',
                    borderTopLeftRadius: isMini ? '$sm' : 0,
                    borderTopRightRadius: isMini ? '$sm' : 0,
                    overflow: 'hidden',
                    '& video': {
                      backgroundColor: '$backgroundContrast !important',
                    },
                    '& svg': {
                      fill: '$text !important',
                      '& path': {
                        fill: '$text !important',
                      },
                    },
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
                        flexDirection: isMobile && 'column-reverse',
                        opacity: !isMini && isSettingsOpen && 1,
                        visibility: !isMini && isSettingsOpen && 'visible',
                        backgroundImage:
                          'linear-gradient(to bottom, transparent, $backgroundAlpha, $background)',
                      },
                      '&.art-notice': {
                        justifyContent: 'center',
                      },
                      '&.art-notice-inner': {
                        backgroundColor: '$backgroundAlpha !important',
                        color: '$text !important',
                      },
                      '&.art-control-progress': {
                        height: isMini && '7px !important',
                        alignItems: isMini && 'flex-end !important',
                      },
                      '&.art-layer-mask': {
                        transition: 'all 0.3s ease',
                        backgroundColor:
                          isMini && isSettingsOpen ? '$backgroundAlpha' : 'rgba(0, 0, 0, 0)',
                        display: isMini && isSettingsOpen ? 'block' : 'none',
                      },
                      '&.art-layer-playPauseButton': {
                        transition: 'all 0.3s ease',
                        display: 'none',
                      },
                      '&.art-layer-miniTopControlButtons': {
                        transition: 'all 0.3s ease',
                        display: isMini && isSettingsOpen ? 'block' : 'none',
                      },
                      // '&.art-control-playAndPause': {
                      //   display: isMobile && 'none !important',
                      // },
                      '&.art-layer-lock': {
                        background: '$backgroundAlpha !important',
                      },
                      '&.art-control-topControlButtons': {
                        opacity: '1 !important',
                        display: isPlayerFullScreen ? 'block' : 'none',
                        '&::before': {
                          display: isPlayerFullScreen ? 'block' : 'none',
                          content: '',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100px',
                          backgroundImage:
                            'linear-gradient(to top, transparent, $backgroundAlpha, $background)',
                          backgroundPosition: 'top',
                          backgroundRepeat: 'repeat-x',
                        },
                      },
                      '&.art-control-volume': {
                        display: isMobile && 'none !important',
                      },
                      '&.art-state': {
                        display: isDesktop && 'none !important',
                      },
                      '&.art-subtitle': {
                        bottom: isMini && '7px !important',
                        display: showSubtitle ? 'flex !important' : 'none !important',
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
                        textShadow: subtitleTextEffects,
                        '& p': {
                          p: '$2',
                          backgroundColor: subtitleBackgroundColor,
                          m: 0,
                        },
                      },
                      '&.art-control-progress-inner': {
                        background: '$textLight !important',
                      },
                      '&.art-progress-loaded': {
                        background: '$textAlpha !important',
                      },
                      '&.art-control-time': {
                        color: '$text !important',
                      },
                      '&.art-layer-autoPlayback': {
                        background: '$backgroundAlpha !important',
                        color: '$text !important',
                        backdropFilter: 'saturate(180%) blur(20px)',
                        borderRadius: '$md',
                        border: '1px solid $border',
                        boxShadow: '$lg',
                      },
                      '&.art-contextmenus': {
                        background: '$backgroundAlpha !important',
                        borderRadius: '$md',
                        border: '1px solid $border',
                        boxShadow: '$lg',
                      },
                      '&.art-contextmenu': {
                        color: '$text !important',
                        textShadow: 'none !important',
                        borderBottomColor: '$border !important',
                        '& a': {
                          color: '$text !important',
                        },
                      },
                      '&.art-info': {
                        color: '$text !important',
                        background: '$backgroundAlpha !important',
                        borderRadius: '$md',
                        border: '1px solid $border',
                        boxShadow: '$lg',
                      },
                      '&.art-volume-slider-handle': {
                        background: '$text !important',
                        '&::before': {
                          background: '$text !important',
                        },
                        '&::after': {
                          background: '$textLight !important',
                        },
                      },
                    },
                    '&:hover': {
                      '& div': {
                        '&.art-layer-mask': {
                          backgroundColor: '$backgroundAlpha',
                          display: isMini && 'block',
                        },
                        '&.art-layer-playPauseButton': {
                          display: isMini && 'block',
                        },
                        '&.art-layer-miniTopControlButtons': {
                          display: isMini && 'block',
                        },
                      },
                    },
                  }}
                />
                {isMini ? (
                  <Flex
                    direction="row"
                    align="center"
                    justify="between"
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
                      className="line-clamp-1"
                      css={{ cursor: 'pointer' }}
                      title={titlePlayer}
                    >
                      {titlePlayer}
                    </H5>
                    <Button
                      type="button"
                      auto
                      light
                      onPress={() => {
                        if (artplayer) artplayer.destroy();
                        setShouldShowPlayer(false);
                        setPlayerData(undefined);
                        setIsMini(false);
                        setRoutePlayer('');
                        setTitlePlayer('');
                        setQualitySelector([]);
                        setSubtitleSelector([]);
                        setIsPlayerPlaying(false);
                      }}
                      icon={<Close />}
                    />
                  </Flex>
                ) : null}
                {!isMini ? (
                  <Flex
                    justify="start"
                    align="center"
                    wrap="wrap"
                    className="space-x-4"
                    css={{
                      marginTop: '1.5rem',
                      padding: '0 0.75rem',
                      '@xs': {
                        padding: '0 3vw',
                      },
                      '@sm': {
                        padding: '0 6vw',
                      },
                      '@md': {
                        padding: '0 12vw',
                      },
                    }}
                  >
                    <Tooltip content="In development">
                      <Button
                        type="button"
                        size="sm"
                        color="primary"
                        auto
                        ghost
                        css={{ marginBottom: '0.75rem' }}
                      >
                        Toggle Light
                      </Button>
                    </Tooltip>
                    <Button
                      type="button"
                      size="sm"
                      color="primary"
                      auto
                      ghost
                      onPress={() => {
                        artplayer?.pause();
                        setWatchTrailerModalVisible(true);
                        if (typeVideo === 'movie' || typeVideo === 'tv')
                          fetcher.load(
                            `/${typeVideo === 'movie' ? 'movies' : 'tv-shows'}/${id}/videos`,
                          );
                      }}
                      css={{ marginBottom: '0.75rem' }}
                    >
                      Watch Trailer
                    </Button>
                    {/* <Tooltip content="In development">
                      <Button
                        size="sm"
                        color="primary"
                        auto
                        ghost
                        css={{ marginBottom: '0.75rem' }}
                      >
                        Add to My List
                      </Button>
                    </Tooltip> */}
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
                  type="button"
                  auto
                  light
                  onPress={() => {
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
                    type="button"
                    auto
                    light
                    onPress={() => navigate(routePlayer)}
                    icon={<Expand filled />}
                  />
                </Tooltip>
                {/* <Tooltip content="Close">
                  <Button
                    type="button"
                    auto
                    light
                    onPress={() => {
                      setShouldShowPlayer(false);
                      setPlayerData(undefined);
                      setIsMini(false);
                      setRoutePlayer('');
                      setTitlePlayer('');
                      setQualitySelector([]);
                      setSubtitleSelector([]);
                      setIsPlayerPlaying(false);
                    }}
                    icon={<Close />}
                  />
                </Tooltip> */}
              </Flex>
              <PlayerSettings
                artplayer={artplayer}
                qualitySelector={qualitySelector}
                subtitleSelector={subtitleSelector}
                isPlayerFullScreen={isPlayerFullScreen}
                isSettingsOpen={isSettingsOpen}
                showSubtitle={showSubtitle}
                setShowSubtitle={setShowSubtitle}
                setSettingsOpen={setSettingsOpen}
                setSearchModalVisible={setSearchModalVisible}
              />
            </Flex>,
            artplayer.layers.miniTopControlButtons,
          )
        : null}
      {!isMini && artplayer && showSkipButton
        ? createPortal(
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Button
                type="button"
                auto
                css={{ px: '$md !important' }}
                onPress={() => {
                  if (currentHighlight?.end) {
                    artplayer.currentTime = currentHighlight?.end;
                  }
                }}
              >
                {`Skip ${currentHighlight?.text || ''}`}
              </Button>
            </motion.div>,
            artplayer.layers.skipButton,
          )
        : null}
      {/* Creating portals for the player controls */}
      {artplayer && !isMini && isDesktop
        ? createPortal(
            <PlayerSettings
              artplayer={artplayer}
              qualitySelector={qualitySelector}
              subtitleSelector={subtitleSelector}
              isPlayerFullScreen={isPlayerFullScreen}
              isSettingsOpen={isSettingsOpen}
              showSubtitle={showSubtitle}
              setShowSubtitle={setShowSubtitle}
              setSettingsOpen={setSettingsOpen}
              setSearchModalVisible={setSearchModalVisible}
            />,
            artplayer.controls.settings,
          )
        : null}
      {artplayer?.controls.prev && !isMini && currentEpisode > 1 && isDesktop
        ? createPortal(
            <Button
              type="button"
              auto
              light
              onPress={() => prevEpisodeUrl && navigate(prevEpisodeUrl)}
              icon={<Previous filled />}
            />,
            artplayer.controls.prev,
          )
        : null}
      {artplayer?.controls.next && !isMini && hasNextEpisode && isDesktop
        ? createPortal(
            <Button
              type="button"
              auto
              light
              onPress={() => nextEpisodeUrl && navigate(nextEpisodeUrl)}
              icon={<Next filled />}
            />,
            artplayer.controls.next,
          )
        : null}
      {artplayer?.controls.topControlButtons && !isMini
        ? createPortal(
            <Flex direction="row" align="center" justify="start" className="w-full z-10 space-x-2">
              <Flex
                direction="row"
                align="center"
                justify="start"
                className="space-x-2 basis-2/3 shrink grow-0 w-2/3"
              >
                {isPlayerFullScreen ? (
                  <Flex
                    direction="column"
                    align="start"
                    justify="center"
                    className="space-y-2 w-full"
                  >
                    <H6
                      h6
                      weight="bold"
                      className="text-ellipsis text-start whitespace-nowrap overflow-hidden w-full"
                    >
                      {playerData?.titlePlayer}
                    </H6>
                    <H6 h6 weight="light" css={{ color: '$accents8' }}>
                      {seasonId ? ` Season ${seasonId}` : ''}
                      {episodeId ? ` Episode ${episodeId}` : ''}
                    </H6>
                  </Flex>
                ) : null}
              </Flex>
              {isMobile ? (
                <Flex
                  direction="row"
                  align="center"
                  justify="end"
                  className="space-x-2 grow shrink-0 basis-1/3"
                >
                  <PlayerSettings
                    artplayer={artplayer}
                    qualitySelector={qualitySelector}
                    subtitleSelector={subtitleSelector}
                    isPlayerFullScreen={isPlayerFullScreen}
                    isSettingsOpen={isSettingsOpen}
                    showSubtitle={showSubtitle}
                    setShowSubtitle={setShowSubtitle}
                    setSettingsOpen={setSettingsOpen}
                    setSearchModalVisible={setSearchModalVisible}
                  />
                </Flex>
              ) : null}
            </Flex>,
            artplayer.controls.topControlButtons,
          )
        : null}

      <SearchSubtitles
        visible={isSearchModalVisible}
        closeHandler={closeSearchModalHandler}
        subtitleOptions={subtitleOptions}
      />
      {typeVideo === 'movie' || typeVideo === 'tv' ? (
        <WatchTrailerModal
          trailer={trailer}
          visible={isWatchTrailerModalVisible}
          closeHandler={closeWatchTrailerModalHandler}
        />
      ) : null}
      {typeVideo === 'anime' && trailerAnime ? (
        <WatchTrailerModal
          trailer={trailerAnime}
          visible={isWatchTrailerModalVisible}
          closeHandler={closeWatchTrailerModalHandler}
        />
      ) : null}
    </Container>
  );
};

export default GlobalPlayer;
