import { forwardRef, useState } from 'react';
import { Image as NextuiImage, type ImageProps as NextuiImageProps } from '@nextui-org/image';
import { Image as RemixImage, type ImageProps as RemixImageProps } from 'remix-image';

// @ts-ignore
type UseImageProps = NextuiImageProps & RemixImageProps;

export interface ImageProps extends Omit<UseImageProps, 'ref' | 'isBlurred' | 'as'> {}

const Image = forwardRef<React.ElementRef<typeof NextuiImage>, ImageProps>(
  ({ loaderUrl, dprVariants, options, responsive, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    if (process.env.RESPONSIVE_IMAGES === 'ON') {
      const loaderUrlImage =
        loaderUrl ||
        (process.env.NODE_ENV === 'development' ? '/api/image' : window.process.env.IMAGE_PROXY);
      return (
        <NextuiImage
          ref={ref}
          as={RemixImage}
          isLoading={isLoading}
          data-loaded={!isLoading}
          onLoadingComplete={() => setIsLoading(false)}
          loaderUrl={loaderUrlImage}
          dprVariants={dprVariants}
          options={options}
          responsive={responsive}
          {...props}
        />
      );
    }
    return <NextuiImage as="img" ref={ref} {...props} />;
  },
);
Image.displayName = NextuiImage.displayName;

export default Image;
