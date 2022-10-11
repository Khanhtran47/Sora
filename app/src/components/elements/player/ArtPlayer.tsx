/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { styled } from '@nextui-org/react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { isMobile, isTablet, isDesktop } from 'react-device-detect';

import SearchSubtitles from '../modal/SearchSubtitle';

const Player = ({
  option,
  qualitySelector,
  subtitleSelector,
  getInstance,
  style,
  subtitleOptions,
  ...rest
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: any;
  qualitySelector: { html: string; url: string; default?: boolean }[];
  subtitleSelector?: { html: string; url: string; default?: boolean }[];
  getInstance: (art: Artplayer) => void;
  style?: React.CSSProperties | undefined;
  subtitleOptions?: {
    imdb_id?: number;
    tmdb_id?: number;
    parent_feature_id?: number;
    parent_imdb_id?: number;
    parent_tmdb_id?: number;
    episode_number?: number;
    season_number?: number;
    type?: 'movie' | 'episode' | 'all';
  };
}) => {
  const [visible, setVisible] = React.useState(false);
  const [subtitles, setSubtitles] = React.useState<
    { html: string; url: string; default?: boolean }[]
  >(subtitleSelector || []);
  const artRef = React.useRef<HTMLDivElement>(null);
  const closeHandler = () => {
    setVisible(false);
  };
  React.useEffect(() => {
    const art = new Artplayer({
      ...option,
      autoSize: isDesktop,
      loop: true,
      mutex: true,
      setting: true,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: isDesktop,
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
              name: 'backward',
              position: 'left',
              index: 1,
              html: 'B',
              click: () => {
                art.seek = art.currentTime - 10;
              },
            },
            {
              name: 'forward',
              position: 'left',
              html: 'F',
              click: () => {
                art.seek = art.currentTime + 10;
              },
            },
            {
              position: 'right',
              html: '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><path fill="#ffffff" d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z"/></svg>',
              tooltip: 'Search Subtitles',
              click: () => {
                setVisible(true);
                art.pause();
              },
            },
          ]
        : [
            {
              position: 'right',
              html: '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><path fill="#ffffff" d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z"/></svg>',
              tooltip: 'Search Subtitles',
              click: () => {
                setVisible(true);
                art.pause();
              },
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
  }, [subtitles]);
  // eslint-disable-next-line react/self-closing-comp
  return (
    <>
      <div ref={artRef} style={style} {...rest} />
      <SearchSubtitles
        visible={visible}
        closeHandler={closeHandler}
        setSubtitles={setSubtitles}
        subtitleOptions={subtitleOptions}
      />
    </>
  );
};

const ArtPlayer = styled(Player, {
  '& p': {
    fontSize: 'inherit !important',
  },
});

export default ArtPlayer;
