import { json } from '@remix-run/node';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const loader = async () =>
  json({
    provider: 'test',
    idProvider: 'test-player',
    subtitles: [
      {
        url: 'https://www.artplayer.org/assets/sample/subtitle.srt',
        lang: 'ch-jp',
      },
      {
        url: 'https://www.artplayer.org/assets/sample/subtitle.cn.srt',
        lang: 'ch',
      },
      {
        url: 'https://www.artplayer.org/assets/sample/subtitle.jp.srt',
        lang: 'jp',
      },
    ],
    sources: [
      {
        quality: 360,
        url: 'https://www.artplayer.org/assets/sample/video.mp4',
      },
      {
        quality: 480,
        url: 'https://www.artplayer.org/assets/sample/video.mp4',
      },
      {
        quality: 720,
        url: 'https://www.artplayer.org/assets/sample/video.mp4',
      },
      {
        quality: 1080,
        url: 'https://www.artplayer.org/assets/sample/video.mp4',
      },
    ],
    episodeInfo: {
      id: 'test-player-episode',
      title: 'Your name',
      description: "It's a test episode",
      number: 1,
      image: 'https://www.artplayer.org/assets/sample/poster.jpg',
    },
    hasNextEpisode: true,
    routePlayer: '/design-system/video-player',
    titlePlayer: 'Test Player',
    id: 'test-player',
    posterPlayer: 'https://www.artplayer.org/assets/sample/poster.jpg',
  });

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/video-player" key="design-player">
      Player
    </BreadcrumbItem>
  ),
  playerSettings: {
    isMini: false,
    shouldShowPlayer: true,
  },
  miniTitle: () => ({
    title: 'Player',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const Player = () => null;

export default Player;
