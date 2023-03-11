/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable arrow-body-style */
import { useState, useRef, useEffect, forwardRef } from 'react';
import { Grid, Button, Card, styled } from '@nextui-org/react';
import { Thumbs, Pagination, Autoplay } from 'swiper';
import { Swiper as SwiperReact, SwiperSlide, useSwiper } from 'swiper/react';
import type { Swiper } from 'swiper';

import { IMedia } from '~/types/media';
import { useMediaQuery } from '@react-hookz/web';
import { useSoraSettings } from '~/hooks/useLocalStorage';

import PlayIcon from '~/assets/icons/PlayIcon';
import StopIcon from '~/assets/icons/StopIcon';
import ChevronRightIcon from '~/assets/icons/ChevronRightIcon';
import ChevronLeftIcon from '~/assets/icons/ChevronLeftIcon';

import { H5 } from '~/components/styles/Text.styles';
import Svg from '~/components/styles/Svg.styles';
import BannerItemCompact from '../item/BannerItemCompact';
import MediaItem from '../item';

const AutoplayProgressStyled = styled('div', {
  position: 'absolute',
  width: '48px',
  height: '48px',
  bottom: '150px',
  right: '35px',
  zIndex: '90',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$primary',
  '@lgMin': { bottom: '270px' },
  '& svg': {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
    width: '100%',
    height: '100%',
    strokeWidth: 2,
    stroke: '$primary',
    fill: 'none',
    strokeDashoffset: 'calc(125.6 * (var(--progress)))',
    strokeDasharray: '125.6',
    transform: 'rotate(-90deg)',
  },
});

const CustomNavigation = forwardRef<HTMLDivElement, { slot: 'container-end' }>(
  (props, forwardedRef) => {
    const { slot } = props;
    const swiper = useSwiper();
    const [slideProgress, setSlideProgress] = useState<number>(0);

    const { isPlayTrailer } = useSoraSettings();

    swiper.on('slideChange', (e) => {
      setSlideProgress(e.progress);
    });

    return (
      <div slot={slot} className="hidden sm:block">
        <Button
          type="button"
          auto
          color="primary"
          rounded
          ghost
          icon={
            isPlayTrailer.value ? (
              <StopIcon fill="currentColor" />
            ) : (
              <PlayIcon fill="currentColor" filled />
            )
          }
          onPress={() => {
            isPlayTrailer.set(!isPlayTrailer.value);
            if (isPlayTrailer.value && !swiper.autoplay.running) {
              swiper.autoplay.start();
              swiper.autoplay.resume();
            } else if (!isPlayTrailer.value && swiper.autoplay.running) {
              swiper.autoplay.stop();
            }
          }}
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
            '@lgMin': { bottom: '200px' },
          }}
          aria-label="Play Trailer"
        />
        <div className="hidden sm:block 2xl:hidden">
          <Button
            type="button"
            auto
            color="primary"
            rounded
            ghost
            icon={<ChevronLeftIcon fill="currentColor" />}
            onPress={() => swiper.slidePrev()}
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
            type="button"
            auto
            color="primary"
            rounded
            ghost
            icon={<ChevronRightIcon fill="currentColor" />}
            onPress={() => swiper.slideNext()}
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
          <AutoplayProgressStyled className="autoplay-progress" ref={forwardedRef}>
            {/* @ts-ignore */}
            <svg viewBox="0 0 48 48" style={{ '--progress': 1 }}>
              <circle cx="24" cy="24" r="20" />
            </svg>
            <span />
          </AutoplayProgressStyled>
        </div>
      </div>
    );
  },
);

CustomNavigation.displayName = 'CustomNavigation';

const CustomNavigationThumbs = ({ slot }: { slot: 'container-end' }) => {
  const swiper = useSwiper();
  return (
    <div slot={slot} className="hidden sm:block">
      <Button
        type="button"
        auto
        color="primary"
        flat
        className="backdrop-blur-md"
        icon={<ChevronLeftIcon fill="currentColor" filled />}
        onPress={() => swiper.slidePrev()}
        css={{
          p: 0,
          m: 0,
          backgroundColor: '$backgroundAlpha',
          borderRadius: '$xs',
          width: 'min-content',
          height: '44px',
          cursor: 'pointer',
          position: 'absolute',
          top: '60px',
          left: '2px',
          zIndex: '90',
          [`& ${Svg}`]: {
            opacity: '0.8',
            scale: '0.8',
          },
          '&:hover': {
            [`& ${Svg}`]: {
              opacity: 1,
              scale: 1,
            },
          },
        }}
        aria-label="Previous"
      />
      <Button
        type="button"
        auto
        color="primary"
        flat
        className="backdrop-blur-md"
        icon={<ChevronRightIcon fill="currentColor" filled />}
        onPress={() => swiper.slideNext()}
        css={{
          p: 0,
          m: 0,
          backgroundColor: '$backgroundAlpha',
          borderRadius: '$xs',
          width: 'min-content',
          height: '44px',
          cursor: 'pointer',
          position: 'absolute',
          top: '60px',
          right: '2px',
          zIndex: '90',
          [`& ${Svg}`]: {
            opacity: '0.8',
            scale: '0.8',
          },
          '&:hover': {
            [`& ${Svg}`]: {
              opacity: 1,
              scale: 1,
            },
          },
        }}
        aria-label="Next"
      />
    </div>
  );
};

// target React components for Stitches
Card.toString = () => '.card';
Card.Image.toString = () => '.card-image';

const SwiperSlideStyled = styled(SwiperSlide, {
  overflow: 'hidden',
  borderRadius: '$lg',
  width: '240px',
  height: 'auto',
  margin: '8px 4px',
  border: '4px solid transparent',
  '&:hover': {
    border: '4px solid var(--nextui-colors-primarySolidHover)',
  },
  [`& ${Card}`]: {
    transition: 'all 0.4s ease',
    transform: 'scale(1.125, 1.03) translateX(-10px)',
    '&::after': {
      transition: 'all 0.4s ease',
      opacity: 0,
      content: '',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '150px',
      height: '135px',
      backgroundImage: 'linear-gradient(90deg, $background, $backgroundTransparent)',
    },
    '&:hover': {
      transform: 'scale(1.075, 1.015) translateX(-5px)',
      [`& ${H5}`]: {
        display: 'block',
      },
      [`& ${Card.Image}`]: {},
      '&::after': {
        content: '',
        opacity: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '150px',
        height: '135px',
        backgroundImage: 'linear-gradient(90deg, $background, $backgroundTransparent)',
      },
    },
  },
  '&.swiper-slide-thumb-active': {
    border: '4px solid var(--nextui-colors-primary)',
    [`& ${Card}`]: {
      transform: 'scale(1) translateX(0)',
      [`& ${H5}`]: {
        display: 'block',
      },
      '&::after': {
        content: '',
        opacity: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '200px',
        height: '135px',
        backgroundImage: 'linear-gradient(90deg, $background, $backgroundTransparent)',
      },
    },
  },
});

const SwiperReactStyled = styled(SwiperReact, {
  position: 'absolute',
  bottom: '15px',
  left: '0',
  width: '100%',
  minHeight: '150px',
  display: 'none',
  '@lg': {
    display: 'block',
  },
  '& div': {
    '&.swiper-wrapper': {
      marginLeft: 7,
    },
  },
});

interface IMediaListBannerProps {
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  items?: IMedia[];
}

const MediaListBanner = (props: IMediaListBannerProps) => {
  const { genresMovie, genresTv, items } = props;
  const isXl = useMediaQuery('(max-width: 1400px)');
  const [thumbsSwiper, setThumbsSwiper] = useState<Swiper | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const autoplayProgressRef = useRef<HTMLDivElement>(null);
  const { isPlayTrailer } = useSoraSettings();

  useEffect(() => {
    if (
      autoplayProgressRef.current &&
      autoplayProgressRef.current.firstChild &&
      autoplayProgressRef.current.lastChild
    ) {
      // @ts-ignore
      autoplayProgressRef.current.firstChild.style.setProperty('--progress', 1);
      autoplayProgressRef.current.lastChild.textContent = '';
    }
    if (progressRef.current) progressRef.current.style.setProperty('width', '0%');
  }, [isPlayTrailer.value, isXl]);

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
            modules={[Thumbs, Pagination, Autoplay]}
            grabCursor
            spaceBetween={20}
            slidesPerView={1.15}
            centeredSlides
            thumbs={isXl ? undefined : { swiper: thumbsSwiper, multipleActiveThumbs: false }}
            loop
            pagination={{
              enabled: true,
              dynamicBullets: true,
              dynamicMainBullets: 3,
            }}
            breakpoints={{
              650: {
                spaceBetween: 0,
                slidesPerView: 1,
                pagination: {
                  enabled: true,
                  dynamicBullets: true,
                  dynamicMainBullets: 4,
                },
              },
              1400: {
                spaceBetween: 0,
                slidesPerView: 1,
                pagination: {
                  enabled: false,
                  dynamicBullets: true,
                  dynamicMainBullets: 4,
                },
              },
            }}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            style={{ width: '100%' }}
            onAutoplayTimeLeft={(s, timeLeft, percentage) => {
              if (
                autoplayProgressRef.current &&
                autoplayProgressRef.current.firstChild &&
                autoplayProgressRef.current.lastChild
              ) {
                // @ts-ignore
                autoplayProgressRef.current.firstChild.style.setProperty(
                  '--progress',
                  1 - percentage,
                );
                autoplayProgressRef.current.lastChild.textContent = `${Math.ceil(timeLeft / 1000)}`;
              }
              if (progressRef.current) {
                progressRef.current.style.setProperty(
                  'width',
                  `${(Math.abs(percentage) % 1) * 100}%`,
                );
              }
            }}
            onActiveIndexChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
          >
            {items.map((item, index) => (
              <SwiperSlide
                key={`${item.id}-${index}-banner`}
                virtualIndex={index}
                style={{ width: '100%' }}
              >
                {({ isActive }) => (
                  <MediaItem
                    active={isActive}
                    backdropPath={item?.backdropPath}
                    genreIds={item?.genreIds}
                    genresAnime={item?.genresAnime}
                    genresMovie={genresMovie}
                    genresTv={genresTv}
                    id={item?.id}
                    key={`${item.id}-${index}`}
                    mediaType={item?.mediaType}
                    overview={item?.overview}
                    posterPath={item?.posterPath}
                    title={item?.title}
                    trailer={item?.trailer}
                    type="banner"
                    voteAverage={item?.voteAverage}
                  />
                )}
              </SwiperSlide>
            ))}
            <CustomNavigation slot="container-end" ref={autoplayProgressRef} />
          </SwiperReact>
          <SwiperReactStyled
            grabCursor
            cssMode
            spaceBetween={15}
            slidesPerView="auto"
            slidesPerGroup={1}
            slidesPerGroupAuto
            watchSlidesProgress
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
          >
            {items.map((item, index) => (
              <SwiperSlideStyled key={`${item.id}-${index}-banner-thumb`}>
                <BannerItemCompact
                  ref={progressRef}
                  backdropPath={item?.backdropPath || ''}
                  title={item?.title || ''}
                  active={activeIndex === index}
                />
              </SwiperSlideStyled>
            ))}
            <CustomNavigationThumbs slot="container-end" />
          </SwiperReactStyled>
        </>
      )}
    </Grid.Container>
  );
};

export default MediaListBanner;
