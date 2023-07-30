import { forwardRef } from 'react';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Skeleton } from '@nextui-org/skeleton';
import { useHover } from '@react-aria/interactions';
import { AnimatePresence, motion } from 'framer-motion';
import { MimeType } from 'remix-image';
import { useHydrated } from 'remix-utils';
import { tv } from 'tailwind-variants';

import type { Title } from '~/types/media';
import AspectRatio from '~/components/elements/AspectRatio';
import Image from '~/components/elements/Image';

interface IBannerItemCompactProps {
  backdropPath: string;
  title: string | Title;
  active?: boolean;
}

const bannerCompactStyles = tv({
  base: [
    'min-h-[135px] min-w-[240px] origin-[center_right] transform-gpu overflow-hidden border-0 transition-all duration-200 ease-in-out',
    "after:absolute after:left-0 after:top-0 after:z-10 after:h-[135px] after:bg-gradient-to-r after:from-default after:to-transparent after:transition-all after:duration-400 after:ease-in-out after:content-['']",
    'data-[pressed=true]:scale-105',
  ],
  variants: {
    active: {
      true: [
        'translate-x-0 scale-100 after:w-[200px] after:opacity-100',
        'data-[hover=true]:translate-x-0 data-[hover=true]:scale-100',
      ],
      false: [
        'translate-x-[-10px] scale-x-[1.125] scale-y-[1.03] after:w-[150px] after:opacity-0 hover:after:opacity-100',
        'data-[hover=true]:translate-x-[-5px] data-[hover=true]:scale-x-[1.075] data-[hover=true]:scale-y-[1.015]',
      ],
    },
  },
});

const BannerItemCompact = forwardRef<HTMLDivElement, IBannerItemCompactProps>(
  (props, forwardedRef) => {
    const { backdropPath, title, active } = props;
    const { hoverProps, isHovered } = useHover({});
    const isHydrated = useHydrated();
    const titleItem =
      typeof title === 'string'
        ? title
        : title?.userPreferred || title?.english || title?.romaji || title?.native;
    return (
      <AspectRatio ratio={16 / 9} {...hoverProps}>
        {isHydrated ? (
          <Card
            className={bannerCompactStyles({ active })}
            role="figure"
            isPressable
            isHoverable
            style={{ position: 'unset' }}
          >
            <CardBody className="p-0">
              <Image
                src={backdropPath}
                width="100%"
                height="auto"
                alt={titleItem}
                title={titleItem}
                className="min-h-[135px] min-w-[240px] object-cover"
                placeholder="empty"
                options={{
                  contentType: MimeType.WEBP,
                }}
                responsive={[
                  {
                    size: {
                      width: 240,
                      height: 135,
                    },
                  },
                ]}
              />
            </CardBody>
            <CardFooter className="absolute bottom-0 z-20 h-full w-[160px] items-center justify-start pl-6">
              <AnimatePresence>
                {isHovered || active ? (
                  <motion.h6
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="m-0 line-clamp-3 text-left font-bold text-default-foreground"
                  >
                    {titleItem?.length && titleItem.length > 40
                      ? `${titleItem?.slice(0, 40)}...`
                      : titleItem}
                  </motion.h6>
                ) : null}
              </AnimatePresence>
            </CardFooter>
          </Card>
        ) : (
          <Skeleton className="h-full w-full" />
        )}
        {active ? (
          <div className="absolute bottom-0 z-20 h-[10px] w-full overflow-hidden">
            <div
              ref={forwardedRef}
              className="float-left h-full animate-progressBarStripes rounded-r-[3px] bg-primary bg-[length:40px_40px]"
              style={{
                width: 0,
                backgroundImage:
                  'linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)',
              }}
            />
          </div>
        ) : null}
      </AspectRatio>
    );
  },
);

BannerItemCompact.displayName = 'BannerItemCompact';

export default BannerItemCompact;
