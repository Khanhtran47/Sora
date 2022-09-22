/* eslint-disable arrow-body-style */
import * as React from 'react';
import { Grid, Button } from '@nextui-org/react';
import { Pagination, Virtual } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';

import { IMedia } from '~/services/tmdb/tmdb.types';
import useMediaQuery from '~/hooks/useMediaQuery';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';
import { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import MediaItem from '../item';

const CustomNavigation = ({ slot }: { slot: 'container-end' }) => {
  const swiper = useSwiper();
  const [slideProgress, setSlideProgress] = React.useState<number>(0);

  swiper.on('slideChange', (e) => {
    setSlideProgress(e.progress);
  });

  return (
    <div slot={slot}>
      <Button
        auto
        color="primary"
        light
        animated={false}
        icon={<ChevronLeftIcon width={48} height={48} fill="currentColor" />}
        onClick={() => swiper.slidePrev()}
        css={{
          position: 'absolute',
          bottom: '10px',
          right: '80px',
          height: '3rem',
          zIndex: '90',
          '&:hover': {
            opacity: '0.8',
          },
        }}
        disabled={slideProgress === 0}
      />
      <Button
        auto
        color="primary"
        light
        animated={false}
        icon={<ChevronRightIcon width={48} height={48} fill="currentColor" />}
        onClick={() => swiper.slideNext()}
        css={{
          position: 'absolute',
          bottom: '10px',
          right: '30px',
          height: '3rem',
          zIndex: '90',
          '&:hover': {
            opacity: '0.8',
          },
        }}
        disabled={slideProgress === 1}
      />
    </div>
  );
};

const MediaListBanner = ({
  items,
  handlerWatchTrailer,
  handleSlideChangeTransitionEnd,
  handleSlideChangeTransitionStart,
  handleTouchMove,
  genresMovie,
  genresTv,
  setShowTrailer,
  showTrailer,
  trailer,
}: {
  items: IMedia[];
  handlerWatchTrailer?: (id: number, type: 'movie' | 'tv') => void;
  handleSlideChangeTransitionEnd?: (swiper: SwiperClass) => void;
  handleSlideChangeTransitionStart?: (swiper: SwiperClass) => void;
  handleTouchMove?: (swiper: SwiperClass, e: MouseEvent | TouchEvent | PointerEvent) => void;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  setShowTrailer?: React.Dispatch<React.SetStateAction<boolean>>;
  showTrailer?: boolean;
  trailer?: Trailer;
}) => {
  const isSm = useMediaQuery(650, 'max');
  return (
    <Grid.Container
      gap={1}
      justify="flex-start"
      css={{
        margin: 0,
        padding: 0,
        width: '100%',
        '&.swiper-button-prev': {
          left: '80px',
        },
      }}
    >
      {items?.length > 0 && (
        <Swiper
          modules={[Pagination, Virtual]}
          grabCursor
          spaceBetween={0}
          slidesPerView={1}
          pagination={{
            type: 'bullets',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-gray-500 !w-7 !h-7 !mt-2',
            renderBullet: (index, className) => {
              return `<span class="${className}">${index + 1}</span>`;
            },
          }}
          virtual
          onSlideChangeTransitionEnd={(swiper) =>
            handleSlideChangeTransitionEnd && handleSlideChangeTransitionEnd(swiper)
          }
          onSlideChangeTransitionStart={(swiper) =>
            handleSlideChangeTransitionStart && handleSlideChangeTransitionStart(swiper)
          }
          onTouchMove={(swiper, e) => handleTouchMove && handleTouchMove(swiper, e)}
        >
          {items.slice(0, 10).map((item, index) => (
            <SwiperSlide key={index} virtualIndex={index}>
              <MediaItem
                type="banner"
                item={item}
                handlerWatchTrailer={handlerWatchTrailer}
                genresMovie={genresMovie}
                genresTv={genresTv}
                setShowTrailer={setShowTrailer}
                showTrailer={showTrailer}
                trailer={trailer}
              />
            </SwiperSlide>
          ))}
          {!isSm && <CustomNavigation slot="container-end" />}
        </Swiper>
      )}
    </Grid.Container>
  );
};

export default MediaListBanner;
