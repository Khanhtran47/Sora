import { styled } from '@nextui-org/react';

const BackgroundTabLink = styled('div', {
  backgroundColor: 'unset !important',
  position: 'absolute',
  top: 0,
  width: '100%',
  zIndex: -2,
  height: '100%',
  backgroundImage:
    'linear-gradient(var(--nextui-colors-backgroundLight) 0%, var(--nextui-colors-background) 100%)',
});

const BackgroundContent = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 0,
  display: 'block',
  height: '100%',
  background: 'linear-gradient(transparent 0%, var(--nextui-colors-backgroundLight) 100%)',
});

export { BackgroundTabLink, BackgroundContent };
