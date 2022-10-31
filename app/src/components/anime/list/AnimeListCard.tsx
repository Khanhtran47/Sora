/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import { Grid } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import useMediaQuery from '~/hooks/useMediaQuery';
import { IAnimeResult, IAnimeEpisode } from '~/services/consumet/anilist/anilist.types';
import AnimeItem from '../item';

const AnimeListCard = ({
  items,
  navigation,
  setSlideProgress,
  virtual,
  itemType,
  provider,
}: {
  items: IAnimeResult[] | IAnimeEpisode[];
  navigation?: {
    nextEl?: string | HTMLElement | null;
    prevEl?: string | HTMLElement | null;
  };
  setSlideProgress?: React.Dispatch<React.SetStateAction<number>>;
  virtual?: boolean;
  itemType?: 'banner' | 'card' | 'episode-card';
  provider?: string;
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
              <Link
                to={
                  itemType && itemType === 'episode-card'
                    ? `/anime/${item.id}/episode/${
                        (item as IAnimeEpisode).episodeId
                      }?provider=${provider}&episode=${(item as IAnimeEpisode).episodeNumber}`
                    : `/anime/${item.id}/overview`
                }
                style={{ display: 'flex', padding: '0.5rem 0' }}
              >
                <AnimeItem key={item.id} item={item} type={itemType || 'card'} virtual={virtual} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Grid.Container>
  );
};

export default AnimeListCard;
