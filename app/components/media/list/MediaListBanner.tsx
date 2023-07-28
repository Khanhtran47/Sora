import { forwardRef, useEffect, useRef, useState } from 'react';
import { Button } from '@nextui-org/button';
import { useMediaQuery } from '@react-hookz/web';
import { Autoplay, Pagination, Thumbs, type Swiper } from 'swiper';
import { Swiper as SwiperReact, SwiperSlide, useSwiper } from 'swiper/react';

import type { IMedia } from '~/types/media';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import ChevronLeftIcon from '~/assets/icons/ChevronLeftIcon';
import ChevronRightIcon from '~/assets/icons/ChevronRightIcon';
import PlayIcon from '~/assets/icons/PlayIcon';
import StopIcon from '~/assets/icons/StopIcon';

import MediaItem from '../item';
import BannerItemCompact from '../item/BannerItemCompact';

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
          color="default"
          radius="full"
          variant="ghost"
          isIconOnly
          onPress={() => {
            isPlayTrailer.set(!isPlayTrailer.value);
            if (isPlayTrailer.value && !swiper.autoplay.running) {
              swiper.autoplay.start();
              swiper.autoplay.resume();
            } else if (!isPlayTrailer.value && swiper.autoplay.running) {
              swiper.autoplay.stop();
            }
          }}
          className="absolute bottom-20 right-[35px] z-[90] h-11 w-11 cursor-pointer hover:opacity-80 2xl:bottom-[200px]"
          aria-label="Play Trailer"
        >
          {isPlayTrailer.value ? (
            <StopIcon fill="currentColor" />
          ) : (
            <PlayIcon fill="currentColor" filled />
          )}
        </Button>
        <div className="hidden sm:block 2xl:hidden">
          <Button
            type="button"
            color="default"
            radius="full"
            variant="ghost"
            isIconOnly
            onPress={() => swiper.slidePrev()}
            className="absolute bottom-[10px] right-[85px] z-[90] h-11 w-11 cursor-pointer hover:opacity-80 2xl:bottom-[200px]"
            aria-label="Previous"
            disabled={slideProgress === 0}
          >
            <ChevronLeftIcon fill="currentColor" />
          </Button>
          <Button
            type="button"
            color="default"
            radius="full"
            variant="ghost"
            isIconOnly
            onPress={() => swiper.slideNext()}
            className="absolute bottom-[10px] right-[35px] z-[90] h-11 w-11 cursor-pointer hover:opacity-80"
            aria-label="Next"
            disabled={slideProgress === 1}
          >
            <ChevronRightIcon fill="currentColor" />
          </Button>
          <div
            className="absolute bottom-[150px] right-[35px] z-[90] flex h-12 w-12 items-center justify-center text-default-foreground 2xl:bottom-[270px]"
            ref={forwardedRef}
          >
            <svg
              viewBox="0 0 48 48"
              style={{
                // @ts-ignore
                '--progress': 1,
                strokeDashoffset: 'calc(125.6 * (var(--progress)))',
                strokeDasharray: '125.6',
              }}
              className="absolute left-0 top-0 z-10 h-full w-full rotate-90 fill-none stroke-default stroke-2"
            >
              <circle cx="24" cy="24" r="20" />
            </svg>
            <span />
          </div>
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
        color="default"
        variant="flat"
        className="absolute left-[2px] top-[60px] z-[90] m-0 h-11 w-min min-w-0 cursor-pointer rounded-small bg-background/60 p-0 backdrop-blur-md"
        isIconOnly
        onPress={() => swiper.slidePrev()}
        aria-label="Previous"
      >
        <ChevronLeftIcon
          fill="currentColor"
          filled
          className="scale-75 opacity-80 transition-all duration-200 ease-linear hover:scale-100 hover:opacity-100"
        />
      </Button>
      <Button
        type="button"
        color="default"
        variant="flat"
        className="absolute right-[2px] top-[60px] z-[90] m-0 h-11 w-min min-w-0 cursor-pointer rounded-small bg-background/60 p-0 backdrop-blur-md"
        isIconOnly
        onPress={() => swiper.slideNext()}
        aria-label="Next"
      >
        <ChevronRightIcon
          fill="currentColor"
          filled
          className="scale-75 opacity-80 transition-all duration-200 ease-linear hover:scale-100 hover:opacity-100"
        />
      </Button>
    </div>
  );
};

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
    <section className="relative m-0 box-border flex h-full w-full max-w-screen-4xl flex-wrap items-center justify-center p-0">
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
                },
              },
              1400: {
                spaceBetween: 0,
                slidesPerView: 1,
                pagination: {
                  enabled: false,
                  dynamicBullets: true,
                },
              },
            }}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            style={{ width: '100%' }}
            onAutoplayTimeLeft={(_, timeLeft, percentage) => {
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
          <SwiperReact
            grabCursor
            cssMode
            spaceBetween={15}
            slidesPerView="auto"
            slidesPerGroup={1}
            slidesPerGroupAuto
            watchSlidesProgress
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            className="!absolute bottom-[15px] left-0 !hidden min-h-[150px] w-full 2xl:!block"
          >
            {items.map((item, index) => (
              <SwiperSlide
                key={`${item.id}-${index}-banner-thumb`}
                className={`mx-1 my-2 !h-[135px] !w-[240px] overflow-hidden rounded-large border-4 transition-opacity duration-300 ease-out ${
                  isPlayTrailer.value
                    ? `opacity-20 hover:opacity-70 ${activeIndex === index ? 'opacity-90' : ''}`
                    : 'opacity-100'
                } ${
                  activeIndex === index
                    ? 'border-primary'
                    : 'border-transparent hover:border-primary-600'
                }`}
              >
                <BannerItemCompact
                  ref={progressRef}
                  backdropPath={item?.backdropPath || ''}
                  title={item?.title || ''}
                  active={activeIndex === index}
                />
              </SwiperSlide>
            ))}
            <CustomNavigationThumbs slot="container-end" />
          </SwiperReact>
        </>
      )}
    </section>
  );
};

export default MediaListBanner;
