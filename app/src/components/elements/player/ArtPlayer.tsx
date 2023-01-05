/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useRef, memo } from 'react';
import type { CSSProperties } from 'react';
import { Button, Tooltip, Spacer, styled } from '@nextui-org/react';
import { useNavigate, useFetcher } from '@remix-run/react';
import Artplayer from 'artplayer';
import { isMobile } from 'react-device-detect';

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
      container: artRef.current,
      // controls: [
      //   {
      //     position: 'right',
      //     html: '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><path fill="#ffffff" d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z"/></svg>',
      //     tooltip: 'Search Subtitles',
      //     click: () => {
      //       setSearchModalVisible(true);
      //       art.pause();
      //     },
      //   },
      //   ...(hasNextEpisode
      //     ? [
      //         {
      //           position: 'left',
      //           html: '<svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" viewBox="0 0 36 36"><path fill="#ffffff" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" /></svg>',
      //           tooltip: 'Next Episode',
      //           click: () => {
      //             if (nextEpisodeUrl) navigate(nextEpisodeUrl);
      //           },
      //         },
      //       ]
      //     : []),
      // ],
      // settings: [
      //   {
      //     width: 200,
      //     html: 'Subtitle',
      //     icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><path fill="#ffffff" d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z"/></svg>',
      //     tooltip: 'English',
      //     selector: [
      //       {
      //         html: 'Display',
      //         tooltip: 'Show',
      //         switch: true,
      //         onSwitch: (item) => {
      //           item.tooltip = item.switch ? 'Hide' : 'Show';
      //           art.subtitle.show = !item.switch;
      //           return !item.switch;
      //         },
      //       },
      //       ...subtitles,
      //     ],
      //     onSelect: (item) => {
      //       // @ts-ignore
      //       art.subtitle.url = item.url;
      //       return item.html;
      //     },
      //   },
      //   {
      //     html: 'Select Quality',
      //     width: 150,
      //     tooltip: 'auto',
      //     selector: qualitySelector,
      //     onSelect: (item) => {
      //       // @ts-ignore
      //       art.switchQuality(item.url, item.html);
      //       return item.html;
      //     },
      //   },
      //   ...(autoPlay
      //     ? [
      //         {
      //           html: 'Auto Play',
      //           tooltip: playNextEpisode ? 'On' : 'Off',
      //           switch: playNextEpisode,
      //           onSwitch: (item: { tooltip: string; switch: boolean }) => {
      //             item.tooltip = !item.switch ? 'On' : 'Off';
      //             setPlayNextEpisode(!item.switch);
      //             return !item.switch;
      //           },
      //         },
      //       ]
      //     : []),
      // ],
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
