/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef } from 'react';
import { styled } from '@nextui-org/react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';

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
      container: artRef.current,
      moreVideoAttr: {
        crossOrigin: 'anonymous',
      },
      quality: qualitySelector,
      controls: [
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
          tooltip: 'English',
          // icon: '<SubtitleIcon width={22} height={22} />',
          selector: subtitleSelector,
          onSelect: (item) => {
            // @ts-ignore
            art.subtitle.url = item.url;
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
