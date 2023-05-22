import { tv } from 'tailwind-variants';

export const backgroundStyles = tv({
  base: 'absolute top-0 h-full w-full',
  variants: {
    tablink: {
      true: 'z-[1] bg-gradient-to-b from-background/20 to-background',
    },
    content: {
      true: 'z-[0] bg-gradient-to-b from-transparent to-background/20',
    },
  },
});
