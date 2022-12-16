/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import { Grid } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import useMediaQuery from '~/hooks/useMediaQuery';
import { IMedia } from '~/types/media';
import MediaItem from '../item';

interface IMediaListCardProps {
  coverItem?: { id: number; name: string; backdropPath: string }[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  isCoverCard?: boolean;
  items?: IMedia[];
  itemsType?: 'movie' | 'tv' | 'anime' | 'people' | 'episode';
  navigation?: { nextEl?: string | HTMLElement | null; prevEl?: string | HTMLElement | null };
  provider?: string;
  setSlideProgress?: React.Dispatch<React.SetStateAction<number>>;
  virtual?: boolean;
}

const MediaListCard = (props: IMediaListCardProps) => {
  const {
    coverItem,
    genresMovie,
    genresTv,
    isCoverCard,
    items,
    itemsType,
    navigation,
    provider,
    setSlideProgress,
    virtual,
  } = props;
  const isSm = useMediaQuery('(max-width: 650px)');
  const isMd = useMediaQuery('(max-width: 960px)');
  const isLg = useMediaQuery('(max-width: 1400px)');
  const gap = isSm ? 1 : 2;

  if (isCoverCard) {
    return (
      <Grid.Container gap={gap} justify="flex-start" alignItems="center">
        {coverItem && coverItem?.length > 0 && (
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
            {coverItem &&
              coverItem.map((item, i) => {
                const href = `/collections/${item.id}`;
                return (
                  <SwiperSlide
                    key={i}
                    style={{
                      width: isSm ? '280px' : '480px',
                    }}
                  >
                    <Link to={href} style={{ display: 'flex', padding: '0.5rem 0' }}>
                      <MediaItem
                        backdropPath={item?.backdropPath}
                        isCoverCard={isCoverCard}
                        key={item.id}
                        title={item?.name}
                        type="card"
                        virtual={virtual}
                      />
                    </Link>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        )}
      </Grid.Container>
    );
  }

  return (
    <Grid.Container gap={gap} justify="flex-start" alignItems="center">
      {items && items?.length > 0 && (
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
          {items &&
            items.map((item, i) => {
              const href =
                itemsType && itemsType === 'episode'
                  ? `/anime/${item.id}/episode/${item.episodeNumber}?provider=${provider}`
                  : itemsType === 'anime'
                  ? `/anime/${item.id}/overview`
                  : itemsType === 'people'
                  ? `/people/${item.id}/overview`
                  : item?.mediaType === 'movie' || itemsType === 'movie'
                  ? `/movies/${item.id}/`
                  : `/tv-shows/${item.id}/`;
              return (
                <SwiperSlide
                  key={i}
                  style={{
                    width: `${
                      item?.mediaType === 'people'
                        ? '160px'
                        : isSm
                        ? '164px'
                        : isMd
                        ? '210px'
                        : isLg
                        ? '244px'
                        : '280px'
                    }`,
                  }}
                >
                  <Link to={href} style={{ display: 'flex', padding: '0.5rem 0' }}>
                    <MediaItem
                      backdropPath={item?.backdropPath}
                      character={item?.character}
                      color={item?.color}
                      episodeNumber={item?.episodeNumber}
                      episodeTitle={item?.episodeTitle}
                      genreIds={item?.genreIds}
                      genresAnime={item?.genresAnime}
                      genresMovie={genresMovie}
                      genresTv={genresTv}
                      id={item?.id}
                      job={item?.job}
                      key={item.id}
                      knownFor={item?.knownFor}
                      mediaType={item?.mediaType}
                      overview={item?.overview}
                      posterPath={item?.posterPath}
                      releaseDate={item?.releaseDate}
                      title={item?.title}
                      trailer={item?.trailer}
                      type={itemsType === 'episode' ? itemsType : 'card'}
                      virtual={virtual}
                      voteAverage={item?.voteAverage}
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
