import * as React from 'react';
import { Text, Button, Row } from '@nextui-org/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper as SwiperClass } from 'swiper/types';

import { IMedia } from '~/services/tmdb/tmdb.types';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';
import { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import { MediaListTable, MediaListCard, MediaListBanner, MediaListGrid } from './list';
import Filter from '../elements/filter/Filter';

/**
 * MediaList type:
 * table
 * slider of cards
 * slider of banners
 * grid of cards
 */
interface IMediaListProps {
  listType?: 'table' | 'slider-card' | 'slider-banner' | 'grid';
  listName?: string | (() => never);
  items: IMedia[];
  showFilter?: boolean;
  genres?: { [id: string]: string };
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  mediaType?: 'movie' | 'tv';
  showMoreList?: boolean;
  onClickViewMore?: () => void;
  cardType?: 'media' | 'similar-movie' | 'similar-tv';
  handlerWatchTrailer?: (id: number, type: 'movie' | 'tv') => void;
  navigationButtons?: boolean;
  handleSlideChangeTransitionEnd?: (swiper: SwiperClass) => void;
  handleSlideChangeTransitionStart?: (swiper: SwiperClass) => void;
  handleTouchMove?: (swiper: SwiperClass, e: MouseEvent | TouchEvent | PointerEvent) => void;
  setShowTrailer?: React.Dispatch<React.SetStateAction<boolean>>;
  showTrailer?: boolean;
  trailer?: Trailer;
}

const MediaList = (props: IMediaListProps) => {
  const {
    listName,
    items,
    showFilter,
    genres,
    genresMovie,
    genresTv,
    mediaType,
    showMoreList,
    onClickViewMore,
    cardType,
    handlerWatchTrailer,
    navigationButtons,
    handleSlideChangeTransitionEnd,
    handleSlideChangeTransitionStart,
    handleTouchMove,
    setShowTrailer,
    showTrailer,
    trailer,
  } = props;
  let { listType } = props;

  const [prevEl, setPrevEl] = React.useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = React.useState<HTMLElement | null>(null);

  if (!listType && typeof window !== 'undefined') {
    listType =
      (localStorage.getItem('listType') as 'table' | 'slider-card' | 'slider-banner' | 'grid') ??
      'grid';
  }

  const [displayType, setDisplayType] = useState<string>(listType as string);
  const { t } = useTranslation();

  const filterChangeHandler = (value: string) => {
    setDisplayType(value);
    localStorage.setItem('listType', value);
  };

  let list;

  switch (displayType) {
    case 'grid':
      list = <MediaListGrid items={items} />;
      break;
    case 'table':
      list = <MediaListTable items={items} />;
      break;
    case 'slider-banner':
      list = (
        <MediaListBanner
          items={items}
          handlerWatchTrailer={handlerWatchTrailer}
          handleSlideChangeTransitionEnd={handleSlideChangeTransitionEnd}
          handleSlideChangeTransitionStart={handleSlideChangeTransitionStart}
          handleTouchMove={handleTouchMove}
          genresMovie={genresMovie}
          genresTv={genresTv}
          setShowTrailer={setShowTrailer}
          showTrailer={showTrailer}
          trailer={trailer}
        />
      );
      break;
    case 'slider-card':
      list = (
        <MediaListCard
          items={items}
          type={cardType || 'media'}
          navigation={{ nextEl, prevEl }}
          genresMovie={genresMovie}
          genresTv={genresTv}
        />
      );
      break;
    default:
  }

  return (
    <>
      {listName && (
        <Text h1 size="2rem" css={{ margin: '20px 0 20px 0' }}>
          {listName}
        </Text>
      )}
      {showMoreList && (
        <Row fluid justify="space-between" wrap="nowrap" align="center">
          <Button
            auto
            rounded
            ghost
            onClick={onClickViewMore}
            css={{
              maxWidth: '$8',
              marginBottom: '$12', // space[2]
            }}
          >
            {t('viewMore')}
          </Button>
          {navigationButtons && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 'var(--nextui-space-12)',
                color: 'var(--nextui-colors-primary)',
              }}
            >
              <button
                type="button"
                ref={(node) => setPrevEl(node)}
                style={{
                  cursor: 'pointer',
                }}
                className="hover:opacity-80"
              >
                <ChevronLeftIcon width={48} height={48} />
              </button>
              <button
                type="button"
                ref={(node) => setNextEl(node)}
                style={{
                  cursor: 'pointer',
                }}
                className="hover:opacity-80"
              >
                <ChevronRightIcon width={48} height={48} />
              </button>
            </div>
          )}
        </Row>
      )}
      {showFilter && mediaType && genres && (
        <Filter
          onChange={filterChangeHandler}
          genres={genres}
          listType={displayType}
          mediaType={mediaType}
        />
      )}
      {list}
    </>
  );
};

export default MediaList;
