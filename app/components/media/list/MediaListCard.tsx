/* eslint-disable @typescript-eslint/indent */
import { Link } from '@remix-run/react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { tv } from 'tailwind-variants';

import type { IMedia } from '~/types/media';

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

const swiperSlideStyles = tv({
  variants: {
    cardType: {
      coverCard: '!w-[280px] sm:!w-[480px]',
      card: 'nextui-sm:!w-[244px] !w-[164px] sm:!w-[210px] 2xl:!w-[280px]',
      peopleCard: '!w-[160px]',
    },
  },
});

const swiperStyles = tv({
  base: 'w-full [&_.swiper-wrapper]:m-[0_0_1.5rem_1px]',
});

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

  if (isCoverCard) {
    return (
      <div className="flex w-full items-center justify-start">
        {coverItem && coverItem?.length > 0 && (
          <Swiper
            className={swiperStyles()}
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
              coverItem.map((item, index) => {
                const href = `/collections/${item.id}`;
                return (
                  <SwiperSlide
                    className={swiperSlideStyles({
                      cardType: 'coverCard',
                    })}
                    key={`${item.id}-${index}-card`}
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
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-start">
      {items && items?.length > 0 ? (
        <Swiper
          className={swiperStyles()}
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
            items.map((item, index) => {
              const href =
                itemsType && itemsType === 'episode'
                  ? `/anime/${item.id}/episode/${item.episodeNumber}/watch?provider=${provider}`
                  : itemsType === 'anime'
                  ? `/anime/${item.id}/`
                  : itemsType === 'people'
                  ? `/people/${item.id}/`
                  : item?.mediaType === 'movie' || itemsType === 'movie'
                  ? `/movies/${item.id}/`
                  : `/tv-shows/${item.id}/`;
              return (
                <SwiperSlide
                  key={`${item.id}-${index}-card`}
                  className={swiperSlideStyles({
                    cardType: item?.mediaType === 'people' ? 'peopleCard' : 'card',
                  })}
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
      ) : null}
    </div>
  );
};

export default MediaListCard;
