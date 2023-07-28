import { isMobile } from 'react-device-detect';
import { FreeMode, Navigation } from 'swiper';
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
  itemsType?: 'movie' | 'tv' | 'anime' | 'people' | 'episode' | 'movie-tv';
  navigation?: { nextEl?: string | HTMLElement | null; prevEl?: string | HTMLElement | null };
  provider?: string;
  setSlideProgress?: React.Dispatch<React.SetStateAction<number>>;
}

const swiperSlideStyles = tv({
  variants: {
    cardType: {
      coverCard: '!w-[290px] sm:!w-[490px]',
      card: '!w-[168px] sm:!w-[190px] md:!w-[210px] lg:!w-[250px] xl:!w-[270px]',
      peopleCard: '!w-[168px]',
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
  } = props;

  if (isCoverCard) {
    return (
      <div className="flex w-full items-center justify-start">
        {coverItem && coverItem?.length > 0 && (
          <Swiper
            className={swiperStyles()}
            modules={[Navigation, FreeMode]}
            grabCursor
            freeMode={{
              enabled: isMobile,
              sticky: true,
              minimumVelocity: 0.1,
              momentum: true,
              momentumVelocityRatio: 1,
              momentumRatio: 1,
              momentumBounce: true,
              momentumBounceRatio: 1,
            }}
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
                const href = `/lists/${item.id}`;
                return (
                  <SwiperSlide
                    className={swiperSlideStyles({
                      cardType: 'coverCard',
                    })}
                    key={`${item.id}-${index}-cover-card`}
                  >
                    <MediaItem
                      backdropPath={item?.backdropPath}
                      isCoverCard={isCoverCard}
                      isSliderCard
                      linkTo={href}
                      title={item?.name}
                      type="card"
                    />
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
          modules={[Navigation, FreeMode]}
          grabCursor
          freeMode={{
            enabled: isMobile,
            sticky: true,
            minimumVelocity: 0.1,
            momentum: true,
            momentumVelocityRatio: 1,
            momentumRatio: 1,
            momentumBounce: true,
            momentumBounceRatio: 1,
          }}
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
                  : itemsType === 'movie'
                  ? `/movies/${item.id}/`
                  : itemsType === 'tv'
                  ? `/tv-shows/${item.id}/`
                  : itemsType === 'movie-tv' && item?.mediaType === 'movie'
                  ? `/movies/${item.id}/`
                  : itemsType === 'movie-tv' && item?.mediaType === 'tv'
                  ? `/tv-shows/${item.id}/`
                  : '/';

              return (
                <SwiperSlide
                  key={`${item.id}-${index}-card-${itemsType}`}
                  className={swiperSlideStyles({
                    cardType: item?.mediaType === 'people' ? 'peopleCard' : 'card',
                  })}
                >
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
                    isSliderCard
                    job={item?.job}
                    linkTo={href}
                    knownFor={item?.knownFor}
                    mediaType={item?.mediaType}
                    overview={item?.overview}
                    posterPath={item?.posterPath}
                    releaseDate={item?.releaseDate}
                    title={item?.title}
                    trailer={item?.trailer}
                    type={itemsType === 'episode' ? itemsType : 'card'}
                    voteAverage={item?.voteAverage}
                  />
                </SwiperSlide>
              );
            })}
        </Swiper>
      ) : null}
    </div>
  );
};

export default MediaListCard;
