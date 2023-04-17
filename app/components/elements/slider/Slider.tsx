/* eslint-disable @typescript-eslint/no-explicit-any */
import type * as SliderPrimitive from '@radix-ui/react-slider';
import { forwardRef, useState } from 'react';
import { Badge, type CSS, styled } from '@nextui-org/react';
import { useHover } from '@react-aria/interactions';

import { StyledSlider, StyledTrack, StyledRange, StyledThumb } from './Slider.styles';

type SliderPrimitiveProps = React.ComponentProps<typeof SliderPrimitive.Root>;
type SliderProps = SliderPrimitiveProps & { css?: CSS };

const Thumb = styled('div', {
  display: 'block',
  width: 20,
  height: 20,
});

const Slider = forwardRef<React.ElementRef<typeof StyledSlider>, SliderProps>(
  (props, forwardedRef) => {
    const hasRange = Array.isArray(props.defaultValue || (props as any).value);
    const thumbsArray = hasRange
      ? props.defaultValue || (props as any).value
      : [props.defaultValue || (props as any).value];
    const [isFirstThumbInvisible, setIsFirstThumbInvisible] = useState(true);
    const [isSecondThumbInvisible, setIsSecondThumbInvisible] = useState(true);

    const { hoverProps: firstThumbProps } = useHover({
      onHoverStart: () => setIsFirstThumbInvisible(false),
      onHoverEnd: () => setIsFirstThumbInvisible(true),
    });
    const { hoverProps: secondThumbProps } = useHover({
      onHoverStart: () => setIsSecondThumbInvisible(false),
      onHoverEnd: () => setIsSecondThumbInvisible(true),
    });

    return (
      <StyledSlider {...props} ref={forwardedRef}>
        <StyledTrack>
          <StyledRange />
        </StyledTrack>
        {thumbsArray.map((value: any, i: number) => (
          <StyledThumb key={i}>
            <Badge
              content={value}
              css={{ p: 0, minWidth: '30px' }}
              horizontalOffset="45%"
              verticalOffset="-100%"
              size="sm"
              color="primary"
              variant="flat"
              isSquared
              isInvisible={i === 0 ? isFirstThumbInvisible : isSecondThumbInvisible}
              disableOutline
            >
              <Thumb {...(i === 0 ? firstThumbProps : secondThumbProps)} />
            </Badge>
          </StyledThumb>
        ))}
      </StyledSlider>
    );
  },
);

Slider.displayName = 'Slider';

export default Slider;
