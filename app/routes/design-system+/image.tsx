import { Link } from '@nextui-org/link';
import { MimeType } from 'remix-image';

import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import Image from '~/components/elements/Image';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/image" key="design-image">
      Image
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Image',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const ImagePage = () => {
  return (
    <>
      <h2>Image</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://remix-image.mcfarl.in/docs/component#optimized-component-image"
      >
        Remix Image API Reference
      </Link>
      <Link showAnchorIcon underline="hover" isExternal isBlock href="#">
        NextUI Image API Reference
      </Link>
      <p className="text-base tracking-wide md:text-lg">Default</p>
      <Image
        src={'https://storiesv2.nextui.org/static/media/local-image-1.35051865.jpeg'}
        alt="Image"
        width={400}
        height={300}
        radius="lg"
        loading="lazy"
        disableSkeleton
      />
      <p className="text-base tracking-wide md:text-lg">Zoom</p>
      <Image
        src={'https://nextui.org/images/card-example-2.jpeg'}
        alt="Image"
        width={400}
        height={300}
        isZoomed
        radius="lg"
        loading="lazy"
        disableSkeleton={false}
      />
      <p className="text-base tracking-wide md:text-lg">Skeleton</p>
      <Image
        src={'https://storiesv2.nextui.org/static/media/local-image-1.35051865.jpeg'}
        alt="Image"
        width={400}
        height={300}
        radius="lg"
        loading="lazy"
        disableSkeleton={false}
      />
      <p className="text-base tracking-wide md:text-lg">Custom With Remix Image</p>
      <Image
        src={'https://storiesv2.nextui.org/static/media/local-image-1.35051865.jpeg'}
        alt="Image"
        width={400}
        height={300}
        radius="lg"
        loading="lazy"
        disableSkeleton={false}
        placeholder="empty"
        options={{ contentType: MimeType.JPEG, quality: 100 }}
        responsive={[
          {
            size: {
              width: 400,
              height: 300,
            },
          },
        ]}
      />
    </>
  );
};

export default ImagePage;
