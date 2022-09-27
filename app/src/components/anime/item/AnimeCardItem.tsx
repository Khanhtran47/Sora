/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card, Loading, Spacer, Text, Tooltip, Avatar } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import { useInView } from 'react-intersection-observer';
import { ClientOnly } from 'remix-utils';
import { motion } from 'framer-motion';

import useMediaQuery from '~/hooks/useMediaQuery';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';
import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

import CardItemHover from './AnimeCardItemHover';

const AnimeCardItem = ({ item }: { item: IAnimeResult }) => {
  const { title, image } = item;
  const { isDark, colorDarkenLighten } = useColorDarkenLighten(image);
  const { ref, inView } = useInView({
    rootMargin: '500px 200px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
    triggerOnce: true,
  });
  const isSm = useMediaQuery(650, 'max');
  const isLg = useMediaQuery(1400, 'max');

  return (
    <>
      <Card
        as="div"
        isHoverable
        isPressable
        css={{
          borderWidth: 0,
          filter: 'var(--nextui-dropShadows-md)',
        }}
        className={isDark ? 'bg-black/70' : 'bg-white/70'}
        role="figure"
        ref={ref}
      >
        {inView && (
          <Card.Body css={{ p: 0 }}>
            {image ? (
              <Card.Image
                // @ts-ignore
                as={Image}
                src={image || ''}
                objectFit="cover"
                width="100%"
                height="auto"
                alt={title?.userPreferred || title?.english || title?.romaji || title?.native}
                title={title?.userPreferred || title?.english || title?.romaji || title?.native}
                css={{
                  minWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'} !important`,
                  minHeight: `${isSm ? '245px' : isLg ? '357px' : '410px'} !important`,
                }}
                loaderUrl="/api/image"
                placeholder="blur"
                options={{
                  contentType: MimeType.WEBP,
                }}
                responsive={[
                  {
                    size: {
                      width: 164,
                      height: 245,
                    },
                    maxWidth: 650,
                  },
                  {
                    size: {
                      width: 210,
                      height: 357,
                    },
                    maxWidth: 1280,
                  },
                  {
                    size: {
                      width: 240,
                      height: 410,
                    },
                  },
                ]}
              />
            ) : (
              <Avatar
                icon={<PhotoIcon width={48} height={48} />}
                pointer
                css={{
                  minWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'} !important`,
                  minHeight: `${isSm ? '245px' : isLg ? '357px' : '410px'} !important`,
                  size: '$20',
                  borderRadius: '0 !important',
                }}
              />
            )}
          </Card.Body>
        )}
        <Tooltip
          placement="top"
          content={
            <ClientOnly fallback={<Loading type="default" />}>
              {() => (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
                >
                  <CardItemHover item={item} />
                </motion.div>
              )}
            </ClientOnly>
          }
          rounded
          shadow
          hideArrow
          offset={0}
          className="!w-fit"
        >
          <Card.Footer
            css={{
              justifyItems: 'flex-start',
              flexDirection: 'column',
              alignItems: 'flex-start',
              minHeight: '4.875rem',
              maxWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'}`,
            }}
          >
            <Text
              size={14}
              b
              css={{
                minWidth: `${isSm ? '130px' : isLg ? '180px' : '210px'}`,
                padding: '0 0.25rem',
                '@xs': {
                  fontSize: '16px',
                },
                '@sm': {
                  fontSize: '18px',
                },
                '&:hover': {
                  color: colorDarkenLighten,
                },
              }}
            >
              {title?.userPreferred || title?.english || title?.romaji || title?.native}
            </Text>
          </Card.Footer>
        </Tooltip>
      </Card>

      <Spacer y={1} />
    </>
  );
};

export default AnimeCardItem;
