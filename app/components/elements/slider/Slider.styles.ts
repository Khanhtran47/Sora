import { styled } from '@nextui-org/react';
import * as SliderPrimitive from '@radix-ui/react-slider';

export const StyledSlider = styled(SliderPrimitive.Root, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  width: 200,

  '&[data-orientation="horizontal"]': {
    height: 40,
  },

  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    width: 40,
    height: 100,
  },
});

export const StyledTrack = styled(SliderPrimitive.Track, {
  backgroundColor: '$accents9',
  position: 'relative',
  flexGrow: 1,
  borderRadius: '9999px',

  '&[data-orientation="horizontal"]': { height: 10 },
  '&[data-orientation="vertical"]': { width: 10 },
});

export const StyledRange = styled(SliderPrimitive.Range, {
  position: 'absolute',
  background: '$gradient',
  borderRadius: '9999px',
  height: '100%',
});

export const StyledThumb = styled(SliderPrimitive.Thumb, {
  all: 'unset',
  display: 'block',
  width: 20,
  height: 20,
  backgroundColor: '$primary',
  boxShadow: '$sm',
  borderRadius: 10,
  '&:hover': { backgroundColor: '$primaryLightHover', cursor: 'grab' },
  '&:active': { backgroundColor: '$primaryLightActive' },
  '&:focus': { boxShadow: '$xs' },
});
