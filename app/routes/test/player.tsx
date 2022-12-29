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
    <NavLink to="/player" aria-label="Player Page">
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
  playerSettings: () => ({
    isMini: false,
    shouldShowPlayer: true,
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    routePlayer: '/test/player',
  }),
};

const Player = () => null;

export default Player;
