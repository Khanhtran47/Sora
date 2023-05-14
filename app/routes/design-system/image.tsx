import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import { NavLink } from '@remix-run/react';
import { MimeType } from 'remix-image';

import Image from '~/components/elements/Image';

export const handle = {
  breadcrumb: () => (
    <NavLink to="/design-system/card" aria-label="Image Page">
      {({ isActive }) => (
        <Chip
          color="primary"
          variant="flat"
          size="sm"
          className={`${
            isActive ? 'opacity-100' : 'opacity-70'
          } duration-250 ease-in-out transition-opacity hover:opacity-80`}
        >
          Image
        </Chip>
      )}
    </NavLink>
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
        radius="xl"
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
        radius="xl"
        loading="lazy"
        disableSkeleton={false}
      />
      <p className="text-base tracking-wide md:text-lg">Skeleton</p>
      <Image
        src={'https://storiesv2.nextui.org/static/media/local-image-1.35051865.jpeg'}
        alt="Image"
        width={400}
        height={300}
        radius="xl"
        loading="lazy"
        disableSkeleton={false}
      />
      <p className="text-base tracking-wide md:text-lg">Custom With Remix Image</p>
      <Image
        src={'https://storiesv2.nextui.org/static/media/local-image-1.35051865.jpeg'}
        alt="Image"
        width={400}
        height={300}
        radius="xl"
        loading="lazy"
        disableSkeleton={false}
        loaderUrl="/api/image"
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
