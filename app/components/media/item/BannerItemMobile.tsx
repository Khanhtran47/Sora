import { useRef } from 'react';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Badge } from '@nextui-org/react';
import { useIntersectionObserver, useMeasure } from '@react-hookz/web';
import { Link } from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';
import Image, { MimeType } from 'remix-image';

import type { Title } from '~/types/media';
import { useLayout } from '~/store/layout/useLayout';
import AspectRatio from '~/components/elements/AspectRatio';
import Star from '~/assets/icons/StarIcon';

interface IBannerItemMobileProps {
  active?: boolean;
  posterPath: string;
  genreIds: number[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  id: number | string;
  mediaType: 'movie' | 'tv' | 'anime' | 'people';
  title: string | Title;
  voteAverage: number;
  genresAnime: string[];
}

const BannerItemMobile = (props: IBannerItemMobileProps) => {
  const {
    active,
    posterPath,
    genreIds,
    genresMovie,
    genresTv,
    id,
    mediaType,
    title,
    voteAverage,
    genresAnime,
  } = props;
  const { viewportRef } = useLayout((state) => state);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardIntersection = useIntersectionObserver(cardRef, { root: viewportRef });
  const [size, bannerRef] = useMeasure<HTMLDivElement>();
  const titleItem =
    typeof title === 'string'
      ? title
      : title?.userPreferred || title?.english || title?.romaji || title?.native;

  return (
    <AspectRatio ratio={4 / 5} ref={bannerRef} className="mt-8">
      <Link
        to={`/${
          mediaType === 'movie' ? 'movies/' : mediaType === 'tv' ? 'tv-shows/' : 'anime/'
        }${id}/${mediaType === 'anime' ? 'overview' : ''}`}
      >
        <Card
          as="div"
          ref={cardRef}
          isPressable
          className={`h-full w-full rounded-b-none border-0 ${!active ? 'mt-6' : ''}`}
          role="figure"
        >
          <CardBody className="overflow-hidden p-0 after:absolute after:bottom-0 after:left-0 after:h-[calc(100%/2)] after:w-full after:bg-gradient-to-b after:from-transparent after:to-background after:content-['']">
            <AnimatePresence>
              {size ? (
                <motion.div
                  initial={{ opacity: 0, scale: 1.2, y: 40 }}
                  animate={
                    active ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0.3, scale: 1.2, y: 40 }
                  }
                  exit={{ opacity: 0, scale: 1.2, y: 40 }}
                  transition={{ duration: 0.5 }}
                  style={{ overflow: 'hidden' }}
                >
                  <Image
                    src={posterPath || ''}
                    loading="lazy"
                    decoding={cardIntersection?.isIntersecting ? 'auto' : 'async'}
                    width="100%"
                    height="auto"
                    className="aspect-[4/5] object-cover opacity-80"
                    alt={titleItem}
                    title={titleItem}
                    loaderUrl="/api/image"
                    placeholder="empty"
                    responsive={[
                      {
                        size: {
                          width: size?.width,
                          height: (size?.width || 0) * (5 / 4),
                        },
                      },
                    ]}
                    options={{
                      contentType: MimeType.WEBP,
                    }}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </CardBody>
          <CardFooter className="absolute bottom-1 z-[1]">
            <div className="flex w-full flex-col items-center justify-center gap-4 py-3">
              <h2 className="mb-0 text-center font-semibold">{titleItem}</h2>
              <div className="m-0 flex w-full flex-row gap-x-2">
                <Badge variant="flat" color="primary" css={{ border: 0 }}>
                  <Star filled width={16} height={16} />
                  {mediaType === 'anime' ? voteAverage : Number(voteAverage.toFixed(1))}
                </Badge>
                {mediaType === 'anime' ? (
                  <Badge variant="flat" color="primary" css={{ border: 0 }}>
                    {genresAnime[0]}
                  </Badge>
                ) : mediaType === 'movie' ? (
                  <Badge variant="flat" color="primary" css={{ border: 0 }}>
                    {genresMovie?.[genreIds[0]]}
                  </Badge>
                ) : (
                  <Badge variant="flat" color="primary" css={{ border: 0 }}>
                    {genresTv?.[genreIds[0]]}
                  </Badge>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </AspectRatio>
  );
};

export default BannerItemMobile;
