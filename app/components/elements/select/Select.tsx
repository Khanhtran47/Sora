import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

import {
  StyledContent,
  StyledIcon,
  StyledItem,
  StyledItemIndicator,
  StyledLabel,
  StyledScrollDownButton,
  StyledScrollUpButton,
  StyledSeparator,
  StyledTrigger,
  StyledViewport,
} from './Select.styles';

const Content = ({ children, ...props }: { children: React.ReactNode }) => (
  <SelectPrimitive.Portal>
    <StyledContent {...props}>{children}</StyledContent>
  </SelectPrimitive.Portal>
);

// Exports
export const Select = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger;
export const SelectValue = SelectPrimitive.Value;
export const SelectIcon = StyledIcon;
export const SelectContent = Content;
export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItem = StyledItem;
export const SelectItemText = SelectPrimitive.ItemText;
export const SelectItemIndicator = StyledItemIndicator;
export const SelectLabel = StyledLabel;
export const SelectSeparator = StyledSeparator;
export const SelectScrollUpButton = StyledScrollUpButton;
export const SelectScrollDownButton = StyledScrollDownButton;
