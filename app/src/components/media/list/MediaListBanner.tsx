import { Grid } from '@nextui-org/react';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IMedia } from '~/services/tmdb/tmdb.types';
import MediaItem from '../item';

const MediaListBanner = ({
  items,
  handlerWatchTrailer,
}: {
  items: IMedia[];
  handlerWatchTrailer?: (id: number, type: 'movie' | 'tv') => void;
}) => {
  SwiperCore.use([Autoplay, Pagination, Navigation]);
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
          grabCursor
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 18000 }}
          pagination={{
            type: 'bullets',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-gray-500',
          }}
          navigation
        >
          {items.slice(0, 10).map((item, i) => (
            <SwiperSlide key={i}>
              <MediaItem type="banner" item={item} handlerWatchTrailer={handlerWatchTrailer} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Grid.Container>
  );
};

export default MediaListBanner;
