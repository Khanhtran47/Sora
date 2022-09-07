/* eslint-disable no-nested-ternary */
import { Grid } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { Swiper, SwiperSlide } from 'swiper/react';

import useMediaQuery from '~/hooks/useMediaQuery';
import { IMedia } from '~/services/tmdb/tmdb.types';
import MediaItem from '../item';

const MediaListCard = ({
  items,
  type,
}: {
  items: IMedia[];
  type?: 'media' | 'similar-tv' | 'similar-movie';
}) => {
  const isXs = useMediaQuery(650);
  const isSm = useMediaQuery(960);
  const isMd = useMediaQuery(1280);
  const isLg = useMediaQuery(1400);
  const gap = isXs ? 1 : 2;
  const mediaWidth = {
    width: `${isXs ? '40%' : isSm ? '30%' : isMd ? '20%' : isLg ? '15%' : '12%'}`,
  };
  const similarWidth = {
    width: `${isXs ? '55%' : isSm ? '45%' : isMd ? '35%' : isLg ? '25%' : '20%'}`,
  };

  return (
    <Grid.Container gap={gap} justify="flex-start" alignItems="center">
      {items?.length > 0 && (
        <Swiper grabCursor spaceBetween={10} slidesPerView="auto">
          {items.map((item, i) => {
            const href =
              (item.mediaType === 'movie' || type === 'similar-movie' ? '/movies/' : '/tv-shows/') +
              item.id;
            return (
              <SwiperSlide key={i} style={type === 'media' ? mediaWidth : similarWidth}>
                <Link to={href}>
                  <MediaItem key={item.id} type="card" item={item} />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </Grid.Container>
  );
};

export default MediaListCard;
