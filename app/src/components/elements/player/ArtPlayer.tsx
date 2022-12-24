/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useRef, memo } from 'react';
import type { CSSProperties } from 'react';
import { Button, Tooltip, Spacer, styled } from '@nextui-org/react';
import { useNavigate, useFetcher } from '@remix-run/react';
import Artplayer from 'artplayer';
import { isMobile, isTablet, isDesktop } from 'react-device-detect';

import usePlayerState from '~/store/player/usePlayerState';

import { ITrailer } from '~/services/consumet/anilist/anilist.types';

import useLocalStorage from '~/hooks/useLocalStorage';

import Flex from '~/src/components/styles/Flex.styles';
import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';
import WatchTrailerModal, { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import SearchSubtitles from '~/src/components/elements/modal/SearchSubtitle';

interface IPlayerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: any;
  id?: number | string | undefined;
  type: 'movie' | 'tv' | 'anime';
  trailerAnime?: ITrailer;
  autoPlay: boolean;
  currentEpisode?: number;
  hasNextEpisode?: boolean;
  nextEpisodeUrl?: string;
  qualitySelector?: {
    html: string;
    url: string;
    default?: boolean;
    isM3U8?: boolean;
    isDASH?: boolean;
  }[];
  subtitleSelector?: { html: string; url: string; default?: boolean }[];
  getInstance: (art: Artplayer) => void;
  style?: CSSProperties | undefined;
  subtitleOptions?: {
    imdb_id?: number;
    tmdb_id?: number;
    parent_feature_id?: number;
    parent_imdb_id?: number;
    parent_tmdb_id?: number;
    episode_number?: number;
    season_number?: number;
    type?: 'movie' | 'episode' | 'all';
    title?: string;
    sub_format: 'srt' | 'webvtt';
  };
  hideBottomGroupButtons?: boolean;
}

const Player: React.FC<IPlayerProps> = (props: IPlayerProps) => {
  const {
    option,
    id,
    type,
    trailerAnime,
    autoPlay,
    currentEpisode,
    hasNextEpisode,
    nextEpisodeUrl,
    qualitySelector,
    subtitleSelector,
    getInstance,
    style,
    subtitleOptions,
    hideBottomGroupButtons = false,
    ...rest
  } = props;
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [isWatchTrailerModalVisible, setWatchTrailerModalVisible] = useState(false);
  const [trailer, setTrailer] = useState<Trailer>({});
  const isMini = usePlayerState((state) => state.isMini);
  const closeWatchTrailerModalHandler = () => {
    setWatchTrailerModalVisible(false);
    if (type === 'movie' || type === 'tv') setTrailer({});
  };
  const [subtitles, setSubtitles] = useState<{ html: string; url: string; default?: boolean }[]>(
    subtitleSelector || [],
  );
  const [playNextEpisode, setPlayNextEpisode] = useLocalStorage('playNextEpisode', true);
  const artRef = useRef<HTMLDivElement>(null);
  const closeSearchModalHandler = () => {
    setSearchModalVisible(false);
  };
  useEffect(() => {
    if (fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailer(officialTrailer);
    }
  }, [fetcher.data]);
  useEffect(() => {
    const art = new Artplayer({
      ...option,
      autoSize: false,
      loop: !autoPlay,
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
      fastForward: isMobile || isTablet,
      lock: isMobile || isTablet,
      miniProgressBar: true,
      autoOrientation: isMobile || isTablet,
      whitelist: ['*'],
      theme: 'var(--nextui-colors-primary)',
      container: artRef.current,
      autoMini: false,
      hotkey: true,
      icons: {
        state: '',
      },
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
      controls: isDesktop
        ? [
            {
              html: '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 240 240" focusable="false"><path fill="#ffffff" d="M113.2,131.078a21.589,21.589,0,0,0-17.7-10.6,21.589,21.589,0,0,0-17.7,10.6,44.769,44.769,0,0,0,0,46.3,21.589,21.589,0,0,0,17.7,10.6,21.589,21.589,0,0,0,17.7-10.6,44.769,44.769,0,0,0,0-46.3Zm-17.7,47.2c-7.8,0-14.4-11-14.4-24.1s6.6-24.1,14.4-24.1,14.4,11,14.4,24.1S103.4,178.278,95.5,178.278Zm-43.4,9.7v-51l-4.8,4.8-6.8-6.8,13-13a4.8,4.8,0,0,1,8.2,3.4v62.7l-9.6-.1Zm162-130.2v125.3a4.867,4.867,0,0,1-4.8,4.8H146.6v-19.3h48.2v-96.4H79.1v19.3c0,5.3-3.6,7.2-8,4.3l-41.8-27.9a6.013,6.013,0,0,1-2.7-8,5.887,5.887,0,0,1,2.7-2.7l41.8-27.9c4.4-2.9,8-1,8,4.3v19.3H209.2A4.974,4.974,0,0,1,214.1,57.778Z"></path></svg>',
              position: 'left',
              tooltip: 'Rewind 10s',
              click: () => {
                art.seek = art.currentTime - 10;
              },
            },
            {
              html: '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 240 240" focusable="false"><path fill="#ffffff" d="m 25.993957,57.778 v 125.3 c 0.03604,2.63589 2.164107,4.76396 4.8,4.8 h 62.7 v -19.3 h -48.2 v -96.4 H 160.99396 v 19.3 c 0,5.3 3.6,7.2 8,4.3 l 41.8,-27.9 c 2.93574,-1.480087 4.13843,-5.04363 2.7,-8 -0.57502,-1.174985 -1.52502,-2.124979 -2.7,-2.7 l -41.8,-27.9 c -4.4,-2.9 -8,-1 -8,4.3 v 19.3 H 30.893957 c -2.689569,0.03972 -4.860275,2.210431 -4.9,4.9 z m 163.422413,73.04577 c -3.72072,-6.30626 -10.38421,-10.29683 -17.7,-10.6 -7.31579,0.30317 -13.97928,4.29374 -17.7,10.6 -8.60009,14.23525 -8.60009,32.06475 0,46.3 3.72072,6.30626 10.38421,10.29683 17.7,10.6 7.31579,-0.30317 13.97928,-4.29374 17.7,-10.6 8.60009,-14.23525 8.60009,-32.06475 0,-46.3 z m -17.7,47.2 c -7.8,0 -14.4,-11 -14.4,-24.1 0,-13.1 6.6,-24.1 14.4,-24.1 7.8,0 14.4,11 14.4,24.1 0,13.1 -6.5,24.1 -14.4,24.1 z m -47.77056,9.72863 v -51 l -4.8,4.8 -6.8,-6.8 13,-12.99999 c 3.02543,-3.03598 8.21053,-0.88605 8.2,3.4 v 62.69999 z"></path></svg>',
              position: 'left',
              tooltip: 'Forward 10s',
              click: () => {
                art.seek = art.currentTime + 10;
              },
            },
            {
              position: 'right',
              html: '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><path fill="#ffffff" d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z"/></svg>',
              tooltip: 'Search Subtitles',
              click: () => {
                setSearchModalVisible(true);
                art.pause();
              },
            },
            ...(hasNextEpisode
              ? [
                  {
                    position: 'left',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" viewBox="0 0 36 36"><path fill="#ffffff" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" /></svg>',
                    tooltip: 'Next Episode',
                    click: () => {
                      if (nextEpisodeUrl) navigate(nextEpisodeUrl);
                    },
                  },
                ]
              : []),
          ]
        : [
            {
              position: 'right',
              html: '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><path fill="#ffffff" d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z"/></svg>',
              tooltip: 'Search Subtitles',
              click: () => {
                setSearchModalVisible(true);
                art.pause();
              },
            },
            ...(hasNextEpisode
              ? [
                  {
                    position: 'left',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" viewBox="0 0 36 36"><path fill="#ffffff" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" /></svg>',
                    tooltip: 'Next Episode',
                    click: () => {
                      if (nextEpisodeUrl) navigate(nextEpisodeUrl);
                    },
                  },
                ]
              : []),
          ],
      settings: [
        {
          width: 200,
          html: 'Subtitle',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><path fill="#ffffff" d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z"/></svg>',
          tooltip: 'English',
          selector: [
            {
              html: 'Display',
              tooltip: 'Show',
              switch: true,
              onSwitch: (item) => {
                item.tooltip = item.switch ? 'Hide' : 'Show';
                art.subtitle.show = !item.switch;
                return !item.switch;
              },
            },
            ...subtitles,
          ],
          onSelect: (item) => {
            // @ts-ignore
            art.subtitle.url = item.url;
            return item.html;
          },
        },
        {
          html: 'Select Quality',
          width: 150,
          tooltip: 'auto',
          selector: qualitySelector,
          onSelect: (item) => {
            // @ts-ignore
            art.switchQuality(item.url, item.html);
            return item.html;
          },
        },
        ...(autoPlay
          ? [
              {
                html: 'Auto Play',
                tooltip: playNextEpisode ? 'On' : 'Off',
                switch: playNextEpisode,
                onSwitch: (item: { tooltip: string; switch: boolean }) => {
                  item.tooltip = !item.switch ? 'On' : 'Off';
                  setPlayNextEpisode(!item.switch);
                  return !item.switch;
                },
              },
            ]
          : []),
      ],
    });
    if (getInstance && typeof getInstance === 'function') {
      getInstance(art);
    }
    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtitles, currentEpisode]);
  return (
    <>
      <AspectRatio.Root ratio={isMini ? undefined : isMobile ? 16 / 9 : 7 / 3}>
        <div ref={artRef} style={style} {...rest} />
      </AspectRatio.Root>
      {!hideBottomGroupButtons ? (
        <Flex
          justify="start"
          align="center"
          wrap="wrap"
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
            <Button size="sm" color="primary" auto ghost css={{ marginBottom: '0.75rem' }}>
              Toggle Light
            </Button>
          </Tooltip>
          <Spacer x={0.5} />
          <Button
            size="sm"
            color="primary"
            auto
            ghost
            onClick={() => {
              setWatchTrailerModalVisible(true);
              if (type === 'movie' || type === 'tv')
                fetcher.load(`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}/videos`);
            }}
            css={{ marginBottom: '0.75rem' }}
          >
            Watch Trailer
          </Button>
          <Spacer x={0.5} />
          <Tooltip content="In development">
            <Button size="sm" color="primary" auto ghost css={{ marginBottom: '0.75rem' }}>
              Add to My List
            </Button>
          </Tooltip>
        </Flex>
      ) : null}
      <SearchSubtitles
        visible={isSearchModalVisible}
        closeHandler={closeSearchModalHandler}
        setSubtitles={setSubtitles}
        subtitleOptions={subtitleOptions}
      />
      {(type === 'movie' || type === 'tv') && (
        <WatchTrailerModal
          trailer={trailer}
          visible={isWatchTrailerModalVisible}
          closeHandler={closeWatchTrailerModalHandler}
        />
      )}
      {type === 'anime' && trailerAnime && (
        <WatchTrailerModal
          trailer={trailerAnime}
          visible={isWatchTrailerModalVisible}
          closeHandler={closeWatchTrailerModalHandler}
        />
      )}
    </>
  );
};

const ArtPlayer = styled(Player, {
  '& p': {
    fontSize: 'inherit !important',
  },
});

export default memo(ArtPlayer);
