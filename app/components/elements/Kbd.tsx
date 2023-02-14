import { styled } from '@nextui-org/react';

const Kbd = styled('kbd', {
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$backgroundContrast',
  flexShrink: 0,
  color: '$text',
  userSelect: 'none',
  cursor: 'default',
  whiteSpace: 'nowrap',
  boxShadow: `
    inset 0 0.5px rgba(255, 255, 255, 0.1),
    inset 0 1px 5px $colors$slate2,
    0px 0px 0px 0.5px $colors$slate8,
    0px 2px 1px -1px $colors$slate8,
    0 1px $colors$slate8`,
  textShadow: '0 0 1px rgba(255, 255, 255, 0.5)',
  fontFamily: 'inherit',
  fontWeight: 400,
  lineHeight: '1.5',
  mx: '2px',

  variants: {
    size: {
      '1': {
        borderRadius: '$xs',
        px: '$3',
        height: '$10',
        minWidth: '1.6em',
        fontSize: '$xs',
        lineHeight: '$xs',
      },
      '2': {
        borderRadius: '$sm',
        px: '$4',
        height: '$12',
        minWidth: '2em',
        fontSize: '$sm',
        lineHeight: '$sm',
      },
    },
    width: {
      shift: {
        width: '4em',
        justifyContent: 'flex-start',
      },
      command: {
        width: '3em',
        justifyContent: 'flex-end',
      },
      space: {
        width: '8em',
      },
    },
  },

  compoundVariants: [
    {
      size: '1',
      width: 'shift',
      css: {
        width: '3em',
      },
    },
    {
      size: '1',
      width: 'command',
      css: {
        width: '2.5em',
      },
    },
    {
      size: '1',
      width: 'space',
      css: {
        width: '5em',
      },
    },
  ],

  defaultVariants: {
    size: '2',
  },
});

export default Kbd;
