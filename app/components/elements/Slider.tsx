import * as React from 'react';
import { Badge } from '@nextui-org/badge';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { useHover } from '@react-aria/interactions';
import { cn } from '~/utils';
import { tv } from 'tailwind-variants';

const sliderStyles = tv({
  slots: {
    track:
      'relative w-full grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2',
    range: 'absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
    thumb:
      'focus-visible:ring-ring block h-5 w-5 rounded-full border-2 bg-background ring-offset-background transition-colors hover:cursor-grab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  },
  variants: {
    color: {
      default: {
        track: 'bg-default-50',
        range: 'bg-default',
        thumb: 'border-foreground',
      },
      primary: {
        track: 'bg-primary-50',
        range: 'bg-primary',
        thumb: 'border-foreground',
      },
      secondary: {
        track: 'bg-secondary-50',
        range: 'bg-secondary',
        thumb: 'border-foreground',
      },
      success: {
        track: 'bg-success-50',
        range: 'bg-success',
        thumb: 'border-foreground',
      },
      warning: {
        track: 'bg-warning-50',
        range: 'bg-warning',
        thumb: 'border-foreground',
      },
      danger: {
        track: 'bg-danger-50',
        range: 'bg-danger',
        thumb: 'border-foreground',
      },
      gradient: {
        track: 'bg-default',
        range: 'bg-gradient-to-r from-primary to-secondary',
        thumb: 'border-foreground',
      },
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    showValueOnHover?: boolean;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gradient';
  }
>(
  (
    { className, defaultValue, value, showValueOnHover = false, color = 'default', ...props },
    ref,
  ) => {
    const hasRange = Array.isArray(defaultValue || value);
    const thumbsArray = hasRange ? defaultValue || value : [defaultValue || value];
    const [isFirstThumbInvisible, setIsFirstThumbInvisible] = React.useState(true);
    const [isSecondThumbInvisible, setIsSecondThumbInvisible] = React.useState(true);
    const { hoverProps: firstThumbProps } = useHover({
      onHoverStart: () => setIsFirstThumbInvisible(false),
      onHoverEnd: () => setIsFirstThumbInvisible(true),
    });
    const { hoverProps: secondThumbProps } = useHover({
      onHoverStart: () => setIsSecondThumbInvisible(false),
      onHoverEnd: () => setIsSecondThumbInvisible(true),
    });
    const { track, range, thumb } = sliderStyles({ color });
    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center data-[orientation=horizontal]:h-10 data-[orientation=vertical]:h-24 data-[orientation=vertical]:w-10 data-[orientation=vertical]:flex-col',
          className,
        )}
        defaultValue={defaultValue}
        value={value}
        {...props}
      >
        <SliderPrimitive.Track className={track()}>
          <SliderPrimitive.Range className={range()} />
        </SliderPrimitive.Track>
        {thumbsArray?.map((value, index) => (
          <SliderPrimitive.Thumb key={index} className={thumb()}>
            {showValueOnHover ? (
              <Badge
                content={value}
                variant="flat"
                size="sm"
                color={color === 'gradient' ? 'default' : color}
                isInvisible={index === 0 ? isFirstThumbInvisible : isSecondThumbInvisible}
                disableOutline
                placement="top-right"
                classNames={{
                  base: '',
                  badge: 'right-[60%] top-[-100%]',
                }}
              >
                <div className="h-5 w-5" {...(index === 0 ? firstThumbProps : secondThumbProps)} />
              </Badge>
            ) : null}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export default Slider;
