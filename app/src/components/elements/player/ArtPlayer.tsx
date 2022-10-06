/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef } from 'react';
import { styled } from '@nextui-org/react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { isMobile, isTablet, isDesktop } from 'react-device-detect';

const Player = ({
  option,
  qualitySelector,
  subtitleSelector,
  getInstance,
  style,
  ...rest
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: any;
  qualitySelector: { html: string; url: string; default?: boolean }[];
  subtitleSelector: { html: string; url: string; default?: boolean }[];
  getInstance: (art: Artplayer) => void;
  style?: React.CSSProperties | undefined;
}) => {
  const artRef = useRef<HTMLElement | string>();
  useEffect(() => {
    const art = new Artplayer({
      ...option,
      autoSize: false,
      loop: true,
      mutex: true,
      setting: true,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
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
          ]
        : [],
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
          tooltip: 'English',
          // icon: '<SubtitleIcon width={22} height={22} />',
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
            ...subtitleSelector,
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
  }, []);
  // eslint-disable-next-line react/self-closing-comp
  return React.createElement('div', {
    ref: artRef,
    style,
    ...rest,
  });
};

const ArtPlayer = styled(Player, {
  '& p': {
    fontSize: 'inherit !important',
  },
});

export default ArtPlayer;
