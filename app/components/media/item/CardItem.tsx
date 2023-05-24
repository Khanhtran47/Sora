import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Tooltip } from '@nextui-org/react';
import { useIntersectionObserver, useMeasure } from '@react-hookz/web';
import { Link, useFetcher, useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { MimeType } from 'remix-image';
import { tv } from 'tailwind-variants';

import type { IMedia, Title } from '~/types/media';
import type { ITrailer } from '~/services/consumet/anilist/anilist.types';
import useCardHoverStore from '~/store/card/useCardHoverStore';
import { useLayout } from '~/store/layout/useLayout';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import Image from '~/components/elements/Image';
import {
  ScrollArea,
  ScrollBar,
  ScrollCorner,
  ScrollViewport,
} from '~/components/elements/ScrollArea';
import type { Trailer } from '~/components/elements/dialog/WatchTrailerModal';
import Rating from '~/components/elements/shared/Rating';
import PhotoIcon from '~/assets/icons/PhotoIcon';

import CardItemHover from './CardItemHover';

interface ICardItemProps {
  backdropPath: string;
  character: string;
  color?: string;
  episodeNumber?: number;
  episodeTitle?: string;
  genreIds: number[];
  genresAnime: string[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  id: number;
  isCoverCard?: boolean;
  isCreditsCard?: boolean;
  isEpisodeCard?: boolean;
  isSliderCard?: boolean;
  job: string;
  knownFor?: IMedia[];
  linkTo?: string;
  mediaType: 'movie' | 'tv' | 'anime' | 'people';
  overview: string;
  posterPath: string;
  releaseDate: string | number;
  title: string | Title;
  trailer?: ITrailer;
  voteAverage: number;
}

const cardItemStyles = tv({
  slots: {
    base: '!w-[164px]',
    body: 'aspect-[2/3]',
    imageContainer: '',
    image: 'aspect-[2/3]',
    content: '',
    footer: '',
  },
  variants: {
    listViewType: {
      card: {
        base: '!w-[164px] hover:shadow-[0_0_0_1px] hover:shadow-primary-200 sm:!w-[180px] md:!w-[200px] lg:!w-[244px] xl:!w-[264px]',
        body: 'aspect-[2/3] w-full overflow-hidden p-0',
        imageContainer: 'w-full',
        image: 'z-0 aspect-[2/3] !min-h-[auto] !min-w-[auto] !transition-[transform,_opacity]',
        footer:
          'flex min-h-[4.875rem] max-w-[164px] flex-col items-start justify-start sm:max-w-[210px] md:max-w-[200px] lg:max-w-[244px] xl:max-w-[264px]',
      },
      detail: {
        base: '!w-full hover:shadow-[0_0_0_1px] hover:shadow-primary-200 sm:!w-[480px]',
        body: 'flex !h-[174px] w-full !flex-row !overflow-hidden p-0 sm:aspect-[5/3] sm:!h-[auto]',
        imageContainer: 'w-[116px] sm:w-2/5',
        image: 'z-0 !h-[174px] !min-h-[auto] !min-w-[116px] sm:aspect-[2/3] sm:!h-[auto]',
        content: 'flex grow flex-col gap-y-4 p-3 sm:w-3/5',
        footer:
          'absolute bottom-0 flex !w-[116px] justify-center !rounded-br-none border-t border-border bg-background/[0.6] backdrop-blur-md sm:!w-2/5',
      },
      table: {
        base: '!w-full hover:shadow-[0_0_0_1px] hover:shadow-primary-200',
        body: 'flex !h-[174px] w-full !flex-row !overflow-hidden p-0',
        imageContainer: 'w-[116px]',
        image: 'z-0 !h-[174px] !min-h-[auto] !min-w-[116px]',
        content: 'flex grow flex-col gap-y-4 p-3',
        footer: '',
      },
      coverCard: {
        base: '!w-[280px] hover:shadow-[0_0_0_1px] hover:shadow-primary-200 sm:!w-[480px]',
        body: 'aspect-[16/9] w-full overflow-hidden p-0',
        image:
          'z-0 aspect-[16/9] !min-h-[auto] !min-w-[auto] overflow-hidden !transition-[transform,_opacity]',
        footer:
          'absolute bottom-0 flex justify-center border-t border-border bg-background/[0.6] backdrop-blur-md',
      },
      people: {
        base: '!w-[164px] hover:shadow-[0_0_0_1px] hover:shadow-primary-200',
        body: 'aspect-[2/3] w-full overflow-hidden p-0',
        imageContainer: 'w-full',
        image:
          'z-0 aspect-[2/3] !min-h-[auto] !min-w-[auto] overflow-hidden !transition-[transform,_opacity]',
        footer: 'flex min-h-[5.25rem] max-w-[164px] flex-col items-start justify-start',
      },
    },
  },
  compoundVariants: [],
  compoundSlots: [],
});

const CardItem = (props: ICardItemProps) => {
  const {
    backdropPath,
    character,
    color,
    episodeNumber,
    episodeTitle,
    genreIds,
    genresAnime,
    genresMovie,
    genresTv,
    id,
    isCoverCard,
    isCreditsCard,
    isEpisodeCard,
    isSliderCard,
    job,
    knownFor,
    linkTo,
    mediaType,
    overview,
    posterPath,
    releaseDate,
    title,
    trailer,
    voteAverage,
  } = props;
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const setIsCardPlaying = useCardHoverStore((state) => state.setIsCardPlaying);
  const [trailerCard, setTrailerCard] = useState<Trailer>({});
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { isPlayTrailer, listViewType } = useSoraSettings();
  const [size, imageRef] = useMeasure<HTMLAnchorElement>();
  const { viewportRef } = useLayout((scrollState) => scrollState);
  useEffect(() => {
    if (fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailerCard(officialTrailer);
    }
  }, [fetcher.data]);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardIntersection = useIntersectionObserver(cardRef, {
    root: viewportRef,
    rootMargin: '1500px 650px 1500px 650px',
  });
  const inView = useMemo(() => {
    if (isSliderCard) {
      return true;
    }
    return cardIntersection?.isIntersecting;
  }, [cardIntersection, isSliderCard]);

  const titleItem =
    typeof title === 'string'
      ? title
      : title?.userPreferred || title?.english || title?.romaji || title?.native;
  const { base, body, imageContainer, image, content, footer } = cardItemStyles({
    listViewType: isCoverCard
      ? 'coverCard'
      : mediaType === 'people'
      ? 'people'
      : isSliderCard || isEpisodeCard
      ? 'card'
      : isCreditsCard
      ? 'table'
      : listViewType?.value === 'card'
      ? 'card'
      : listViewType?.value === 'detail'
      ? 'detail'
      : listViewType?.value === 'table'
      ? 'table'
      : 'card',
  });

  if (isCoverCard) {
    return (
      <Card as="div" isHoverable isPressable className={base()} role="figure" ref={cardRef}>
        <CardBody className={body()}>
          <Link to={linkTo || '/'} ref={imageRef}>
            {size ? (
              <Image
                src={backdropPath}
                width="100%"
                alt={titleItem}
                title={titleItem}
                className={image()}
                loaderUrl="/api/image"
                placeholder="empty"
                loading="lazy"
                disableSkeleton={false}
                isZoomed={!isSliderCard}
                decoding={inView ? 'async' : 'auto'}
                options={{ contentType: MimeType.WEBP }}
                responsive={[
                  {
                    size: {
                      width: Math.round(size?.width),
                      height: Math.round(size?.height),
                    },
                  },
                ]}
              />
            ) : null}
          </Link>
        </CardBody>
        <CardFooter className={footer()}>
          <h5 className="font-semibold">{titleItem}</h5>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card
      as="div"
      isHoverable
      isPressable
      className={base()}
      role="figure"
      style={{ opacity: isTooltipVisible && !isMobile ? 0 : 1 }}
      ref={cardRef}
    >
      <CardBody className={body()}>
        <Link to={linkTo || '/'} className={imageContainer()} ref={imageRef}>
          {size && !isTooltipVisible && inView ? (
            posterPath ? (
              <Image
                src={posterPath || ''}
                width="100%"
                alt={titleItem}
                title={titleItem}
                loading="lazy"
                className={image()}
                decoding={inView ? 'async' : 'auto'}
                disableSkeleton={false}
                isZoomed={
                  (listViewType.value === 'card' || mediaType === 'people') &&
                  !isSliderCard &&
                  !isCreditsCard
                }
                loaderUrl="/api/image"
                placeholder="empty"
                options={{ contentType: MimeType.WEBP }}
                responsive={[
                  {
                    size: {
                      width: Math.round(size?.width),
                      height: Math.round(size?.height),
                    },
                  },
                ]}
              />
            ) : (
              <Avatar
                radius="xl"
                icon={<PhotoIcon width={48} height={48} />}
                classNames={{
                  base: 'z-0 w-full h-full aspect-[2/3]',
                }}
              />
            )
          ) : null}
        </Link>
        {listViewType.value === 'detail' &&
        !isCreditsCard &&
        !isSliderCard &&
        !isEpisodeCard &&
        mediaType !== 'people' &&
        inView ? (
          <div className={content()}>
            <div className="flex h-6 flex-row items-center justify-between">
              <h6 className="hidden 2xs:block">
                {`${mediaType.charAt(0).toUpperCase()}${mediaType.slice(1)} • ${releaseDate}`}
              </h6>
              <Rating
                ratingType={mediaType}
                rating={mediaType === 'anime' ? voteAverage : voteAverage.toFixed(1)}
              />
            </div>
            <ScrollArea
              type="hover"
              scrollHideDelay={400}
              style={{
                height: 'calc(100% - 5rem)',
                width: '100%',
              }}
            >
              <ScrollViewport>
                <p dangerouslySetInnerHTML={{ __html: overview || '' }} className="pr-4 text-sm" />
              </ScrollViewport>
              <ScrollBar />
              <ScrollCorner />
            </ScrollArea>
            <div className="flex flex-row items-center justify-start gap-x-3">
              {mediaType === 'anime'
                ? genresAnime?.slice(0, 2).map((genre) => (
                    <Button
                      key={genre}
                      type="button"
                      color="primary"
                      variant="flat"
                      size="xs"
                      onPress={() => navigate(`/discover/anime?genres=${genre}`)}
                    >
                      {genre}
                    </Button>
                  ))
                : genreIds?.slice(0, 2).map((genreId) => {
                    if (mediaType === 'movie') {
                      return (
                        <Button
                          key={genreId}
                          type="button"
                          color="primary"
                          variant="flat"
                          size="xs"
                          onPress={() =>
                            navigate(`/discover/movies?with_genres=${genresMovie?.[genreId]}`)
                          }
                        >
                          {genresMovie?.[genreId]}
                        </Button>
                      );
                    }
                    return (
                      <Button
                        key={genreId}
                        type="button"
                        color="primary"
                        variant="flat"
                        size="xs"
                        onPress={() =>
                          navigate(`/discover/tv-shows?with_genres=${genresTv?.[genreId]}`)
                        }
                      >
                        {genresTv?.[genreId]}
                      </Button>
                    );
                  })}
            </div>
          </div>
        ) : (listViewType.value === 'table' || isCreditsCard) &&
          !isSliderCard &&
          !isEpisodeCard &&
          mediaType !== 'people' &&
          inView ? (
          <div className={content()}>
            <Link to={linkTo || '/'} className="text-lg font-bold text-foreground">
              {titleItem}
            </Link>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-start gap-x-3">
                {mediaType === 'anime'
                  ? genresAnime?.slice(0, 2).map((genre, index) => (
                      <Button
                        key={genre}
                        type="button"
                        color="primary"
                        variant="flat"
                        size="xs"
                        onPress={() => navigate(`/discover/anime?genres=${genre}`)}
                        className={index === 1 ? '!hidden sm:!flex' : ''}
                      >
                        {genre}
                      </Button>
                    ))
                  : genreIds?.slice(0, 2).map((genreId, index) => {
                      if (mediaType === 'movie') {
                        return (
                          <Button
                            key={genreId}
                            type="button"
                            color="primary"
                            variant="flat"
                            size="xs"
                            onPress={() =>
                              navigate(`/discover/movies?with_genres=${genresMovie?.[genreId]}`)
                            }
                            className={index === 1 ? '!hidden sm:!flex' : ''}
                          >
                            {genresMovie?.[genreId]}
                          </Button>
                        );
                      }
                      return (
                        <Button
                          key={genreId}
                          type="button"
                          color="primary"
                          variant="flat"
                          size="xs"
                          onPress={() =>
                            navigate(`/discover/tv-shows?with_genres=${genresTv?.[genreId]}`)
                          }
                          className={index === 1 ? '!hidden sm:flex' : ''}
                        >
                          {genresTv?.[genreId]}
                        </Button>
                      );
                    })}
              </div>
              <div className="flex h-6 flex-row items-center justify-between gap-x-3">
                <h6 className="hidden sm:block">
                  {`${mediaType.charAt(0).toUpperCase()}${mediaType.slice(1)} • ${releaseDate}`}
                </h6>
                <Rating
                  ratingType={mediaType}
                  rating={mediaType === 'anime' ? voteAverage : voteAverage.toFixed(1)}
                  className="hidden 2xs:flex"
                />
              </div>
            </div>
            <ScrollArea
              type="hover"
              scrollHideDelay={400}
              style={{
                height: 'calc(100% - 5rem)',
                width: '100%',
                boxShadow: 'none',
              }}
            >
              <ScrollViewport>
                <p dangerouslySetInnerHTML={{ __html: overview || '' }} className="pr-4 text-sm" />
              </ScrollViewport>
              <ScrollBar />
              <ScrollCorner />
            </ScrollArea>
          </div>
        ) : null}
      </CardBody>
      {(listViewType.value === 'card' || mediaType === 'people' || isSliderCard || isEpisodeCard) &&
      !isCreditsCard &&
      inView ? (
        <Tooltip
          placement="top"
          animated={false}
          content={
            <motion.div
              initial={{ scaleX: 0.6, scaleY: 1.1 }}
              animate={{ scaleX: 1, scaleY: 1 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl bg-neutral/60 shadow-md backdrop-blur-md"
            >
              <CardItemHover
                backdropPath={backdropPath}
                genreIds={genreIds}
                genresAnime={genresAnime}
                genresMovie={genresMovie}
                genresTv={genresTv}
                mediaType={mediaType}
                overview={overview}
                releaseDate={releaseDate}
                title={titleItem || ''}
                trailer={trailer || trailerCard}
                voteAverage={voteAverage}
              />
            </motion.div>
          }
          rounded
          isDisabled={isMobile || mediaType === 'people' || isEpisodeCard}
          // shadow
          hideArrow
          offset={-70}
          enterDelay={300}
          visible={false}
          className="!w-fit"
          css={
            isEpisodeCard || mediaType === 'people'
              ? { p: 0 }
              : { zIndex: 2999, backgroundColor: 'transparent', boxShadow: 'none' }
          }
          onVisibleChange={(visible) => {
            if (visible) {
              if (mediaType !== 'people' && !isEpisodeCard) {
                setIsTooltipVisible(true);
                if (isPlayTrailer.value && mediaType !== 'anime') {
                  fetcher.load(`/${mediaType === 'movie' ? 'movies' : 'tv-shows'}/${id}/videos`);
                }
              }
            } else {
              setIsTooltipVisible(false);
              setIsCardPlaying(false);
            }
          }}
        >
          <CardFooter className={footer()}>
            <h5
              className="!line-clamp-2 w-full font-semibold"
              style={{
                ...(color ? { color } : null),
                minWidth: `${mediaType === 'people' ? '100px' : '150px'}`,
              }}
            >
              {titleItem}
            </h5>
            {isEpisodeCard ? (
              <p className="line-clamp-2 w-full text-left text-sm text-foreground/60">
                EP {episodeNumber} - {episodeTitle}
              </p>
            ) : null}
            {mediaType === 'people' ? (
              <>
                {knownFor ? (
                  <p className="line-clamp-2 w-full text-left text-sm text-foreground/60">
                    {knownFor?.map((movie, index) => (
                      <>
                        {movie?.title || movie?.originalTitle || movie?.name || movie?.originalName}
                        {knownFor?.length && (index < knownFor?.length - 1 ? ', ' : '')}
                      </>
                    ))}
                  </p>
                ) : null}
                {character ? (
                  <p className="line-clamp-2 w-full text-left text-sm text-foreground/60">
                    {character}
                  </p>
                ) : null}
                {job ? (
                  <p className="line-clamp-2 w-full text-left text-sm text-foreground/60">{job}</p>
                ) : null}
              </>
            ) : null}
          </CardFooter>
        </Tooltip>
      ) : listViewType.value === 'detail' &&
        !isSliderCard &&
        !isEpisodeCard &&
        !isCreditsCard &&
        inView ? (
        <Link to={linkTo || '/'}>
          <CardFooter className={footer()}>
            <h5 className="line-clamp-2 font-semibold">{titleItem}</h5>
          </CardFooter>
        </Link>
      ) : null}
    </Card>
  );
};

export default CardItem;
