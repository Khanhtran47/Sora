import { tv } from 'tailwind-variants';

export const backgroundStyles = tv({
  base: 'absolute top-0 h-full w-full',
  variants: {
    tablink: {
      true: 'from-background/20 to-background z-[1] bg-gradient-to-b',
    },
    content: {
      true: 'to-background/20 z-[0] bg-gradient-to-b from-transparent',
    },
  },
});
