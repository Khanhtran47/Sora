import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import { MimeType } from 'remix-image';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import Image from '~/components/elements/Image';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/card" key="design-card">
      Card
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Card',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const CardPage = () => {
  return (
    <>
      <h2>Card</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://nextui-docs-v2.vercel.app/docs/components/card#api"
      >
        API Reference
      </Link>
      <p className="text-base tracking-wide md:text-lg">Default</p>
      <Card className="max-w-md">
        <CardBody>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed</p>
        </CardBody>
      </Card>
      <p className="text-base tracking-wide md:text-lg">With Divider</p>
      <Card className="max-w-md">
        <CardHeader className="border-b border-default-200">
          <strong>Description</strong>
        </CardHeader>
        <CardBody className="py-8">
          <p>The Object constructor creates an object wrapper for the given value.</p>
        </CardBody>
        <CardFooter className="border-t border-default-200">
          <p>
            When called in a non-constructor context, Object behaves identically to{' '}
            {/* <Code color="primary">new Object()</Code>. */}
          </p>
        </CardFooter>
      </Card>
      <p className="text-base tracking-wide md:text-lg">With Footer</p>
      <Card className="max-w-md p-4">
        <CardHeader className="flex gap-3">
          {' '}
          <Image
            alt="nextui logo"
            height={34}
            radius="lg"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={34}
          />
          <div className="flex flex-col">
            <b className="text-lg">NextUI</b>
            <p className="text-default-500">nextui.org</p>
          </div>
        </CardHeader>
        <CardBody className="py-2">
          <p>Make beautiful websites regardless of your design experience.</p>
        </CardBody>
        <CardFooter>
          <Link isExternal showAnchorIcon href="https://github.com/nextui-org/nextui">
            Visit source code on GitHub.
          </Link>
        </CardFooter>
      </Card>
      <p className="text-base tracking-wide md:text-lg">With Abs Image Header</p>
      <Card className="max-w-[330px]">
        <CardHeader className="absolute top-2 z-20">
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase text-white/60">What to watch</p>
            <p className="text-2xl text-white">Stream the Apple event</p>
          </div>
        </CardHeader>
        <Image
          alt="Card background"
          classNames={{
            img: 'h-[440px] w-full object-cover',
          }}
          height={440}
          src={'https://storiesv2.nextui.org/static/media/apple-event.64d9fae8.jpeg'}
          width={330}
        />
      </Card>
      <p className="text-base tracking-wide md:text-lg">With Abs Image Header Footer</p>
      <Card className="w-[330px] bg-zinc-100 dark:bg-zinc-100">
        <CardHeader className="absolute top-2 z-10">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase text-black/40">New</p>
            <h4 className="text-3xl font-medium text-black">HomePod mini</h4>
            <p className="pr-1.5 text-sm text-black/80">
              Room-filling sound, Intelligent assistant. Smart home control. Works seamlessly with
              iPhone. Check it out
            </p>
          </div>
        </CardHeader>
        <Image
          alt="Card background"
          classNames={{
            img: 'h-[440px] w-full object-contain pt-10',
          }}
          height={440}
          src={'https://storiesv2.nextui.org/static/media/homepod.1229711c.jpeg'}
          width={300}
        />
        <CardFooter className="absolute bottom-0 z-10 justify-between">
          <div>
            <p className="text-xs text-black/80">Available soon.</p>
            <p className="text-xs text-black/80">Get notified.</p>
          </div>
          <Button radius="full">Notify Me</Button>
        </CardFooter>
      </Card>
      <p className="text-base tracking-wide md:text-lg">Cover Image</p>
      <Card isFooterBlurred className="h-[400px] w-[330px] sm:col-span-5">
        <CardHeader className="absolute top-1 z-10 flex-col items-start">
          <p className="text-xs font-bold uppercase text-white/60">New</p>
          <h4 className="text-2xl font-medium text-black">Acme camera</h4>
        </CardHeader>
        <img
          alt="Card example background"
          className="h-full w-full -translate-y-10 scale-125 object-cover"
          src="https://nextui.org/images/card-example-6.jpeg"
        />
        <CardFooter className="absolute bottom-0 z-10 justify-between border-t border-slate-300 bg-white/30">
          <div>
            <p className="text-xs text-black">Available soon.</p>
            <p className="text-xs text-black">Get notified.</p>
          </div>
          <Button color="secondary" radius="full" size="sm" variant="flat">
            Notify Me
          </Button>
        </CardFooter>
      </Card>
      <p className="text-base tracking-wide md:text-lg">Center Image</p>
      <Card className="max-w-fit px-0 py-4">
        <CardHeader className="flex-col !items-start px-4 pb-0 pt-2">
          <p className="text-xs font-bold uppercase">Daily Mix</p>
          <small className="text-default-500">12 Tracks</small>
          <h4 className="text-lg font-bold">Frontend Radio</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            disableSkeleton={false}
            alt="Card background"
            src={'https://storiesv2.nextui.org/static/media/local-image-1.35051865.jpeg'}
            width={300}
            loading="lazy"
            placeholder="empty"
            options={{ contentType: MimeType.WEBP }}
            responsive={[{ size: { width: 300, height: 180 } }]}
          />
        </CardBody>
      </Card>
      <p className="text-base tracking-wide md:text-lg">With Abs Custom Size Image Header</p>
      <Card className="max-w-[330px]">
        <CardHeader className="absolute top-2 z-20">
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase text-white/60">What to watch</p>
            <p className="text-2xl text-white">Stream the Apple event</p>
          </div>
        </CardHeader>
        <Image
          alt="Card background"
          className="h-[440px] w-full object-cover"
          src={'https://storiesv2.nextui.org/static/media/apple-event.64d9fae8.jpeg'}
          isZoomed
          disableSkeleton={false}
          loading="lazy"
          height={440}
          width={330}
          placeholder="empty"
          options={{ contentType: MimeType.WEBP }}
          responsive={[{ size: { width: 330, height: 440 } }]}
        />
      </Card>
    </>
  );
};

export default CardPage;
