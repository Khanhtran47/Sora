import { Badge } from '@nextui-org/react';
import { json, type MetaFunction } from '@remix-run/node';
import { NavLink } from '@remix-run/react';

export const meta: MetaFunction = () => ({
  title: 'Player',
  description: 'This page for testing the player',
  'og:title': 'Player',
  'og:description': 'This page for testing the player',
});

export const loader = async () =>
  json({
    provider: 'test',
    idProvider: 'test-player',
    subtitles: [
      {
        url: 'https://artplayer.org/assets/sample/subtitle.srt',
        lang: 'ch-jp',
      },
      {
        url: 'https://artplayer.org/assets/sample/subtitle.cn.srt',
        lang: 'ch',
      },
      {
        url: 'https://artplayer.org/assets/sample/subtitle.jp.srt',
        lang: 'jp',
      },
    ],
    sources: [
      {
        quality: 360,
        url: 'https://artplayer.org/assets/sample/video.mp4',
      },
      {
        quality: 480,
        url: 'https://artplayer.org/assets/sample/video.mp4',
      },
      {
        quality: 720,
        url: 'https://artplayer.org/assets/sample/video.mp4',
      },
      {
        quality: 1080,
        url: 'https://artplayer.org/assets/sample/video.mp4',
      },
    ],
    episodeInfo: {
      id: 'test-player-episode',
      title: 'Your name',
      description: "It's a test episode",
      number: 1,
      image: 'https://artplayer.org/assets/sample/poster.jpg',
    },
    hasNextEpisode: true,
    routePlayer: '/test/player',
    titlePlayer: 'Test Player',
    id: 'test-player',
    posterPlayer: 'https://artplayer.org/assets/sample/poster.jpg',
  });

export const handle = {
  breadcrumb: () => (
    <NavLink to="/test/player" aria-label="Player Page">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Player
        </Badge>
      )}
    </NavLink>
  ),
  playerSettings: {
    isMini: false,
    shouldShowPlayer: true,
  },
  getSitemapEntries: () => null,
};

const Player = () => null;

export default Player;
