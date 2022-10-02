/* eslint-disable @typescript-eslint/indent */
/* eslint-disable arrow-body-style */
import * as React from 'react';
import { Grid, Button } from '@nextui-org/react';
import { Pagination, Virtual } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

import { IMedia } from '~/services/tmdb/tmdb.types';
import useMediaQuery from '~/hooks/useMediaQuery';
import useLocalStorage from '~/hooks/useLocalStorage';
import PlayIcon from '~/src/assets/icons/PlayIcon.js';
import StopIcon from '~/src/assets/icons/StopIcon.js';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';
import MediaItem from '../item';

const CustomNavigation = ({ slot }: { slot: 'container-end' }) => {
  const swiper = useSwiper();
  const [slideProgress, setSlideProgress] = React.useState<number>(0);
  const [isPlayTrailer, setIsPlayTrailer] = useLocalStorage('playTrailer', false);

  swiper.on('slideChange', (e) => {
    setSlideProgress(e.progress);
  });

  return (
    <div slot={slot}>
      <Button
        auto
        color="primary"
        rounded
        ghost
        icon={
          isPlayTrailer ? <StopIcon fill="currentColor" /> : <PlayIcon fill="currentColor" filled />
        }
        onClick={() => setIsPlayTrailer(!isPlayTrailer)}
        css={{
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          position: 'absolute',
          bottom: '80px',
          right: '35px',
          zIndex: '90',
          '&:hover': {
            opacity: '0.8',
          },
        }}
        aria-label="Play Trailer"
      />
      <Button
        auto
        color="primary"
        rounded
        ghost
        icon={<ChevronLeftIcon fill="currentColor" />}
        onClick={() => swiper.slidePrev()}
        css={{
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          position: 'absolute',
          bottom: '10px',
          right: '85px',
          zIndex: '90',
          '&:hover': {
            opacity: '0.8',
          },
        }}
        aria-label="Previous"
        disabled={slideProgress === 0}
      />
      <Button
        auto
        color="primary"
        rounded
        ghost
        icon={<ChevronRightIcon fill="currentColor" />}
        onClick={() => swiper.slideNext()}
        css={{
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          position: 'absolute',
          bottom: '10px',
          right: '35px',
          zIndex: '90',
          '&:hover': {
            opacity: '0.8',
          },
        }}
        aria-label="Next"
        disabled={slideProgress === 1}
      />
    </div>
  );
};

const MediaListBanner = ({
  items,
  genresMovie,
  genresTv,
}: {
  items: IMedia[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
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
          spaceBetween={isSm ? 10 : 0}
          slidesPerView={isSm ? 1.075 : 1}
          pagination={
            isSm
              ? false
              : {
                  type: 'bullets',
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet !bg-gray-500 !w-7 !h-7 !mt-2',
                  renderBullet: (index, className) => {
                    return `<span class="${className}">${index + 1}</span>`;
                  },
                }
          }
          virtual
        >
          {items.map((item, index) => (
            <SwiperSlide key={index} virtualIndex={index}>
              {({ isActive }) => (
                <MediaItem
                  type="banner"
                  item={item}
                  genresMovie={genresMovie}
                  genresTv={genresTv}
                  active={isActive}
                />
              )}
            </SwiperSlide>
          ))}
          {!isSm && <CustomNavigation slot="container-end" />}
        </Swiper>
      )}
    </Grid.Container>
  );
};

export default MediaListBanner;
