/* eslint-disable no-nested-ternary */
import { Grid } from '@nextui-org/react';
// import { Link } from '@remix-run/react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import useMediaQuery from '~/hooks/useMediaQuery';
import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';
import AnimeItem from '../item';

const AnimeListCard = ({
  items,
  navigation,
  setSlideProgress,
}: {
  items: IAnimeResult[];
  navigation?: {
    nextEl?: string | HTMLElement | null;
    prevEl?: string | HTMLElement | null;
  };
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
          {items.map((item, i) => (
            <SwiperSlide key={i} style={{ width: `${isSm ? '164px' : isLg ? '210px' : '240px'}` }}>
              {/* <Link to={href}> */}
              <AnimeItem key={item.id} item={item} type="card" />
              {/* </Link> */}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Grid.Container>
  );
};

export default AnimeListCard;
