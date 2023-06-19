import { forwardRef } from 'react';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { useHover } from '@react-aria/interactions';
import { AnimatePresence, motion } from 'framer-motion';
import { Image, MimeType } from 'remix-image';
import { tv } from 'tailwind-variants';

import type { Title } from '~/types/media';
import AspectRatio from '~/components/elements/AspectRatio';

// import Image from '~/components/elements/Image';

interface IBannerItemCompactProps {
  backdropPath: string;
  title: string | Title;
  active?: boolean;
}

const bannerCompactStyles = tv({
  base: "after:from-default after:duration-400 min-h-[135px] min-w-[240px] origin-center overflow-hidden border-0 after:absolute after:left-0 after:top-0 after:z-10 after:h-[135px] after:bg-gradient-to-r after:to-transparent after:transition-all after:ease-in-out after:content-['']",
  variants: {
    active: {
      true: 'after:w-[200px] after:opacity-100',
      false: 'after:w-[150px] after:opacity-0 hover:after:opacity-100',
    },
  },
});

const BannerItemCompact = forwardRef<HTMLDivElement, IBannerItemCompactProps>(
  (props, forwardedRef) => {
    const { backdropPath, title, active } = props;
    const { hoverProps, isHovered } = useHover({});
    const titleItem =
      typeof title === 'string'
        ? title
        : title?.userPreferred || title?.english || title?.romaji || title?.native;
    const variants = {
      normal: { scaleX: 1.125, scaleY: 1.03, x: -10 },
      hover: { scaleX: 1.075, scaleY: 1.015, x: -5 },
      active: { scaleX: 1, scaleY: 1, x: 0 },
    };
    return (
      <AspectRatio ratio={16 / 9} {...hoverProps}>
        <Card
          as={motion.div}
          initial={{ scaleX: 1.125, scaleY: 1.03, x: -10 }}
          animate={
            active || (active && isHovered) ? 'active' : isHovered && !active ? 'hover' : 'normal'
          }
          variants={variants}
          // @ts-ignore
          transition={{ duration: 0.1, ease: 'easeOut' }}
          className={bannerCompactStyles({ active })}
          isPressable
          role="figure"
          // @ts-ignore
          style={{ position: 'unset', originX: 1, originY: 0.5 }}
        >
          <CardBody className="p-0">
            <Image
              src={backdropPath}
              width="100%"
              height="auto"
              alt={titleItem}
              title={titleItem}
              className="min-h-[135px] min-w-[240px]"
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
          <CardFooter className="absolute bottom-0 z-20 h-full w-[70%] items-center justify-start pl-6">
            <AnimatePresence>
              {isHovered || active ? (
                <motion.h6
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1, ease: 'easeOut' }}
                  className="text-default-foreground m-0 line-clamp-3 font-bold"
                >
                  {titleItem?.length && titleItem.length > 40
                    ? `${titleItem?.slice(0, 40)}...`
                    : titleItem}
                </motion.h6>
              ) : null}
            </AnimatePresence>
          </CardFooter>
        </Card>
        {active ? (
          <div className="absolute bottom-0 z-20 h-[10px] w-full overflow-hidden">
            <div
              ref={forwardedRef}
              className="animate-progressBarStripes bg-primary float-left h-full rounded-r-[3px] bg-[length:40px_40px]"
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
