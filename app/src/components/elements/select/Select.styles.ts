import { styled } from '@nextui-org/react';
import * as SelectPrimitive from '@radix-ui/react-select';

export const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 13,
  lineHeight: 1,
  height: 35,
  gap: 5,
  backgroundColor: '$background',
  color: '$primary',
  boxShadow: '$sm',
  '&:hover': { backgroundColor: '$accents2' },
  '&:focus': { boxShadow: '$xs' },
  '&[data-placeholder]': { color: '$primary' },
});

export const StyledIcon = styled(SelectPrimitive.SelectIcon, {
  color: '$primary',
});

export const StyledContent = styled(SelectPrimitive.Content, {
  overflow: 'hidden',
  backgroundColor: '$backgroundContrast',
  borderRadius: 6,
  boxShadow: '$lg',
  zIndex: 9999,
});

export const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: 5,
});

export const StyledItem = styled(SelectPrimitive.Item, {
  all: 'unset',
  fontSize: 13,
  lineHeight: 1,
  color: '$primary',
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 25,
  padding: '0 35px 0 25px',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: '$accents7',
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    backgroundColor: '$primaryLight',
    color: '$primaryLightContrast',
  },
});

export const StyledLabel = styled(SelectPrimitive.Label, {
  padding: '0 25px',
  fontSize: 12,
  lineHeight: '25px',
  color: '$accents9',
});

export const StyledSeparator = styled(SelectPrimitive.Separator, {
  height: 1,
  backgroundColor: '$primarySolidHover',
  margin: 5,
});

export const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const scrollButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 25,
  backgroundColor: '$backgroundContrast',
  color: '$primary',
  cursor: 'default',
};

export const StyledScrollUpButton = styled(SelectPrimitive.ScrollUpButton, scrollButtonStyles);

export const StyledScrollDownButton = styled(SelectPrimitive.ScrollDownButton, scrollButtonStyles);
