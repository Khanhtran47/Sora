import * as React from 'react';
import { Button, Row, Spacer } from '@nextui-org/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IMedia } from '~/services/tmdb/tmdb.types';

import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';

import { MediaListTable, MediaListCard, MediaListBanner, MediaListGrid } from './list';
import Filter from '../elements/filter/Filter';
import { H3 } from '../styles/Text.styles';
import Flex from '../styles/Flex.styles';

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
  items?: IMedia[];
  showFilter?: boolean;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  mediaType?: 'movie' | 'tv';
  showMoreList?: boolean;
  onClickViewMore?: () => void;
  cardType?: 'media' | 'similar-movie' | 'similar-tv';
  navigationButtons?: boolean;
  isCoverCard?: boolean;
  coverItem?: { id: number; name: string; backdropPath: string }[];
  virtual?: boolean;
  itemsType?: 'movie' | 'tv';
}

const MediaList = (props: IMediaListProps) => {
  const {
    listName,
    items,
    showFilter,
    genresMovie,
    genresTv,
    mediaType,
    showMoreList,
    onClickViewMore,
    cardType,
    navigationButtons,
    isCoverCard,
    coverItem,
    virtual,
    itemsType,
  } = props;
  let { listType } = props;

  const [prevEl, setPrevEl] = React.useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = React.useState<HTMLElement | null>(null);
  const [slideProgress, setSlideProgress] = React.useState<number>(0);

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
      list = (
        <MediaListGrid
          items={items}
          genresMovie={genresMovie}
          genresTv={genresTv}
          isCoverCard={isCoverCard}
          coverItem={coverItem}
          virtual={virtual}
          itemsType={itemsType}
        />
      );
      break;
    case 'table':
      list = <MediaListTable items={items} />;
      break;
    case 'slider-banner':
      list = <MediaListBanner items={items} genresMovie={genresMovie} genresTv={genresTv} />;
      break;
    case 'slider-card':
      list = (
        <MediaListCard
          items={items}
          type={cardType || 'media'}
          navigation={{ nextEl, prevEl }}
          genresMovie={genresMovie}
          genresTv={genresTv}
          setSlideProgress={setSlideProgress}
          isCoverCard={isCoverCard}
          coverItem={coverItem}
          virtual={virtual}
        />
      );
      break;
    default:
  }

  return (
    <Flex
      direction="column"
      justify="center"
      align={
        listType === 'grid' || listType === 'table' || listType === 'slider-banner'
          ? 'center'
          : 'start'
      }
      css={{ width: '100%' }}
    >
      {listName && (
        <H3 h3 css={{ margin: '20px 0 20px 0' }}>
          {listName}
        </H3>
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
              marginBottom: '$12',
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
              }}
            >
              <Button
                auto
                color="primary"
                rounded
                ghost
                ref={(node) => setPrevEl(node)}
                css={{
                  width: '44px',
                  height: '44px',
                  padding: 0,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: '0.8',
                  },
                }}
                aria-label="Previous"
                disabled={slideProgress === 0}
              >
                <ChevronLeftIcon />
              </Button>
              <Spacer x={0.25} />
              <Button
                auto
                color="primary"
                rounded
                ghost
                ref={(node) => setNextEl(node)}
                css={{
                  width: '44px',
                  height: '44px',
                  padding: 0,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: '0.8',
                  },
                }}
                aria-label="Next"
                disabled={slideProgress === 1}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          )}
        </Row>
      )}
      {showFilter && mediaType && (
        <Filter
          onChange={filterChangeHandler}
          genres={mediaType === 'movie' ? genresMovie : genresTv}
          listType={displayType}
          mediaType={mediaType}
        />
      )}
      {list}
    </Flex>
  );
};

export default MediaList;
