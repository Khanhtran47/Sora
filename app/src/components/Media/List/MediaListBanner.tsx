import { Grid } from '@nextui-org/react';
import SwiperCore, { Autoplay } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IMedia } from '~/services/tmdb/tmdb.types';
import MediaItem from '../Item';

const MediaListBanner = ({ items }: { items: IMedia[] }) => {
  SwiperCore.use([Autoplay]);
  return (
    <Grid.Container gap={1} justify="flex-start" css={{ margin: 0, padding: 0, width: '100%' }}>
      {items?.length > 0 && (
        <Swiper grabCursor spaceBetween={0} slidesPerView={1} autoplay={{ delay: 10000 }}>
          {items.slice(0, 10).map((item, i) => (
            <SwiperSlide key={i}>
              <MediaItem type="banner" item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Grid.Container>
  );
};

export default MediaListBanner;
