/* eslint-disable @typescript-eslint/indent */
import { Container, styled } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

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

const SwiperSlideStyled = styled(SwiperSlide, {
  variants: {
    cardType: {
      coverCard: {
        width: '280px',
        '@xs': { width: '480px' },
      },
      card: {
        width: '164px',
        '@xs': { width: '210px' },
        '@sm': { width: '244px' },
        '@lg': { width: '280px' },
      },
      peopleCard: {
        width: '160px',
      },
    },
  },
});

const SwiperStyled = styled(Swiper, {
  width: '100%',
  '& div': {
    '&.swiper-wrapper': {
      margin: '0 0 1.5rem 5px',
    },
  },
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
      <Container
        fluid
        responsive={false}
        justify="flex-start"
        alignItems="center"
        css={{ m: 0, p: 0 }}
      >
        {coverItem && coverItem?.length > 0 && (
          <SwiperStyled
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
                  <SwiperSlideStyled key={`${item.id}-${index}-card`} cardType="coverCard">
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
                  </SwiperSlideStyled>
                );
              })}
          </SwiperStyled>
        )}
      </Container>
    );
  }

  return (
    <div className="flex justify-start items-center w-full">
      {items && items?.length > 0 ? (
        <SwiperStyled
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
                  ? `/anime/${item.id}/overview`
                  : itemsType === 'people'
                  ? `/people/${item.id}/overview`
                  : item?.mediaType === 'movie' || itemsType === 'movie'
                  ? `/movies/${item.id}/`
                  : `/tv-shows/${item.id}/`;
              return (
                <SwiperSlideStyled
                  key={`${item.id}-${index}-card`}
                  cardType={item?.mediaType === 'people' ? 'peopleCard' : 'card'}
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
                </SwiperSlideStyled>
              );
            })}
        </SwiperStyled>
      ) : null}
    </div>
  );
};

export default MediaListCard;
