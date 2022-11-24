/* eslint-disable @typescript-eslint/indent */
/* eslint-disable arrow-body-style */
import { useState } from 'react';
import { Grid, Button, styled } from '@nextui-org/react';
import { Virtual, Thumbs, FreeMode } from 'swiper';
import { Swiper as SwiperReact, SwiperSlide, useSwiper } from 'swiper/react';
import type { Swiper } from 'swiper';

import { IMedia } from '~/services/tmdb/tmdb.types';
import useMediaQuery from '~/hooks/useMediaQuery';
import useLocalStorage from '~/hooks/useLocalStorage';

import PlayIcon from '~/src/assets/icons/PlayIcon.js';
import StopIcon from '~/src/assets/icons/StopIcon.js';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';

import MediaItem from '../item';

const CustomNavigation = ({ slot }: { slot: 'container-end' }) => {
  const swiper = useSwiper();
  const [slideProgress, setSlideProgress] = useState<number>(0);
  const [isPlayTrailer, setIsPlayTrailer] = useLocalStorage('playTrailer', false);

  swiper.on('slideChange', (e) => {
    setSlideProgress(e.progress);
  });

  return (
    <div slot={slot}>
      <Button
        auto
        color="primary"
        rounded
        ghost
        icon={
          isPlayTrailer ? <StopIcon fill="currentColor" /> : <PlayIcon fill="currentColor" filled />
        }
        onClick={() => setIsPlayTrailer(!isPlayTrailer)}
        css={{
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          position: 'absolute',
          bottom: '80px',
          right: '35px',
          zIndex: '90',
          '&:hover': {
            opacity: '0.8',
          },
          '@lgMin': { bottom: '270px' },
        }}
        aria-label="Play Trailer"
      />
      <Button
        auto
        color="primary"
        rounded
        ghost
        icon={<ChevronLeftIcon fill="currentColor" />}
        onClick={() => swiper.slidePrev()}
        css={{
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          position: 'absolute',
          bottom: '10px',
          right: '85px',
          zIndex: '90',
          '&:hover': {
            opacity: '0.8',
          },
          '@lgMin': { bottom: '200px' },
        }}
        aria-label="Previous"
        disabled={slideProgress === 0}
      />
      <Button
        auto
        color="primary"
        rounded
        ghost
        icon={<ChevronRightIcon fill="currentColor" />}
        onClick={() => swiper.slideNext()}
        css={{
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          position: 'absolute',
          bottom: '10px',
          right: '35px',
          zIndex: '90',
          '&:hover': {
            opacity: '0.8',
          },
          '@lgMin': { bottom: '200px' },
        }}
        aria-label="Next"
        disabled={slideProgress === 1}
      />
    </div>
  );
};

const SwiperSlideStyled = styled(SwiperSlide, {
  width: '240px',
  opacity: 0.5,
  '&.swiper-slide-thumb-active': {
    opacity: 1,
  },
});

const MediaListBanner = ({
  items,
  genresMovie,
  genresTv,
}: {
  items?: IMedia[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
}) => {
  const isSm = useMediaQuery('(max-width: 650px)');
  const isXl = useMediaQuery('(max-width: 1400px)');
  const [thumbsSwiper, setThumbsSwiper] = useState<Swiper | null>(null);

  return (
    <Grid.Container
      gap={1}
      justify="center"
      alignItems="center"
      css={{
        margin: 0,
        padding: 0,
        width: '100%',
        maxWidth: '1920px',
        position: 'relative',
      }}
    >
      {items && items?.length > 0 && (
        <>
          <SwiperReact
            modules={[Virtual, Thumbs, FreeMode]}
            grabCursor
            spaceBetween={isSm ? 10 : 0}
            slidesPerView={isSm ? 1.075 : 1}
            thumbs={isXl ? undefined : { swiper: thumbsSwiper }}
            virtual
            style={{ width: '100%' }}
          >
            {items.map((item, index) => (
              <SwiperSlide key={index} virtualIndex={index} style={{ width: '100%' }}>
                {({ isActive }) => (
                  <MediaItem
                    type="banner"
                    item={item}
                    genresMovie={genresMovie}
                    genresTv={genresTv}
                    active={isActive}
                  />
                )}
              </SwiperSlide>
            ))}
            {!isSm && <CustomNavigation slot="container-end" />}
          </SwiperReact>
          {!isXl ? (
            <SwiperReact
              grabCursor
              spaceBetween={10}
              slidesPerView="auto"
              freeMode
              watchSlidesProgress
              modules={[FreeMode, Thumbs]}
              onSwiper={setThumbsSwiper}
              style={{
                position: 'absolute',
                bottom: '15px',
                left: '0',
                width: '100%',
                padding: '1rem 0.5rem',
              }}
            >
              {items.map((item, index) => (
                <SwiperSlideStyled key={index}>
                  {({ isActive }) => (
                    <MediaItem
                      type="banner"
                      compact
                      item={item}
                      genresMovie={genresMovie}
                      genresTv={genresTv}
                      active={isActive}
                    />
                  )}
                </SwiperSlideStyled>
              ))}
            </SwiperReact>
          ) : null}
        </>
      )}
    </Grid.Container>
  );
};

export default MediaListBanner;
