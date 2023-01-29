import { styled } from '@nextui-org/react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

const SCROLLBAR_SIZE = 7;

export const StyledScrollArea = styled(ScrollAreaPrimitive.Root, {
  width: 200,
  height: 225,
  borderRadius: 4,
  boxShadow: '$sm',
});

export const StyledViewport = styled(ScrollAreaPrimitive.Viewport, {
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
});

export const StyledScrollbar = styled(ScrollAreaPrimitive.Scrollbar, {
  display: 'flex',
  // ensures no selection
  userSelect: 'none',
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: 'none',
  padding: 2,
  zIndex: 99,
  background: '$accents8',
  transition: 'background 160ms ease-out',
  '&:hover': { background: '$accents5' },
  '&[data-orientation="vertical"]': { width: SCROLLBAR_SIZE },
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
    height: SCROLLBAR_SIZE,
  },
});

export const StyledThumb = styled(ScrollAreaPrimitive.Thumb, {
  flex: 1,
  background: '$accents1',
  borderRadius: SCROLLBAR_SIZE,
  // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
});

export const StyledCorner = styled(ScrollAreaPrimitive.Corner, {
  background: '$accents5',
});
