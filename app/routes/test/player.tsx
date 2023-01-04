import type { MetaFunction } from '@remix-run/node';
import { NavLink } from '@remix-run/react';
import { Badge } from '@nextui-org/react';

export const meta: MetaFunction = () => ({
  title: 'Player',
  description: 'This page for testing the player',
  'og:title': 'Player',
  'og:description': 'This page for testing the player',
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
    url: 'https://artplayer.org/assets/sample/video.mp4',
    routePlayer: '/test/player',
    title: 'Test Player',
    subtitle: {
      url: 'https://artplayer.org/assets/sample/subtitle.srt',
      type: 'srt',
      encoding: 'utf-8',
    },
  },
};

const Player = () => null;

export default Player;
