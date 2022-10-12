/* eslint-disable no-nested-ternary */
import { Grid } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import useMediaQuery from '~/hooks/useMediaQuery';
import { IMedia } from '~/services/tmdb/tmdb.types';
import MediaItem from '../item';

const MediaListCard = ({
  items,
  type,
  navigation,
  genresMovie,
  genresTv,
  setSlideProgress,
}: {
  items: IMedia[];
  type?: 'media' | 'similar-tv' | 'similar-movie';
  navigation?: {
    nextEl?: string | HTMLElement | null;
    prevEl?: string | HTMLElement | null;
  };
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  setSlideProgress?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const isSm = useMediaQuery(650);
  const isLg = useMediaQuery(1400);
  const gap = isSm ? 1 : 2;

  return (
    <Grid.Container gap={gap} justify="flex-start" alignItems="center">
      {items?.length > 0 && (
        <Swiper
          modules={[Navigation]}
          grabCursor
          spaceBetween={10}
          slidesPerView="auto"
          slidesPerGroup={1}
          slidesPerGroupAuto
          navigation={navigation}
          onSlideChange={(swiper) => {
            if (setSlideProgress) {
              setSlideProgress(swiper.progress);
            }
          }}
        >
          {items.map((item, i) => {
            const href = `${
              item.mediaType === 'movie' || type === 'similar-movie' ? '/movies/' : '/tv-shows/'
            }${item.id}/`;
            return (
              <SwiperSlide
                key={i}
                style={{ width: `${isSm ? '164px' : isLg ? '210px' : '240px'}` }}
              >
                <Link to={href} style={{ display: 'flex', padding: '0.5rem 0' }}>
                  <MediaItem
                    key={item.id}
                    type="card"
                    item={item}
                    genresMovie={genresMovie}
                    genresTv={genresTv}
                  />
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
