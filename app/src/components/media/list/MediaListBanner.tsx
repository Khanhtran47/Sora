/* eslint-disable arrow-body-style */
import * as React from 'react';
import { Grid, Button } from '@nextui-org/react';
import { Pagination, Virtual } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

import { IMedia } from '~/services/tmdb/tmdb.types';
import useMediaQuery from '~/hooks/useMediaQuery';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';
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
        aria-label="Previous"
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
