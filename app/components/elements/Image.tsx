import { forwardRef, useState } from 'react';
import { Image as NextuiImage, type ImageProps as NextuiImageProps } from '@nextui-org/image';
import { Image as RemixImage, type ImageProps as RemixImageProps } from 'remix-image';

// @ts-ignore
type UseImageProps = NextuiImageProps & RemixImageProps;

export interface ImageProps extends Omit<UseImageProps, 'ref' | 'isBlurred' | 'as'> {}

const Image = forwardRef<React.ElementRef<typeof NextuiImage>, ImageProps>(
  ({ style, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
      <NextuiImage
        ref={ref}
        as={RemixImage}
        isLoading={isLoading}
        data-loaded={!isLoading}
        onLoadingComplete={() => setIsLoading(false)}
        style={{
          transitionProperty: 'transform, opacity, filter !important',
          ...style,
        }}
        {...props}
      />
    );
  },
);
Image.displayName = NextuiImage.displayName;

export default Image;
