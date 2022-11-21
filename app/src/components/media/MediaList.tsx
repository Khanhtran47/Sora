import { useState, Suspense } from 'react';
import { Button, Row, Spacer, Loading } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { ClientOnly } from 'remix-utils';
import { AnimatePresence, motion } from 'framer-motion';

import { IMedia, ILanguage } from '~/services/tmdb/tmdb.types';

import FilterIcon from '~/src/assets/icons/FilterIcon.js';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';
import ViewGridIcon from '~/src/assets/icons/ViewGridIcon.js';
import ViewTableIcon from '~/src/assets/icons/ViewTableIcon.js';

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
  showFilterButton?: boolean;
  showListTypeChangeButton?: boolean;
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
  languages?: ILanguage[];
}

const MediaList = (props: IMediaListProps) => {
  const {
    listName,
    items,
    showFilterButton,
    showListTypeChangeButton,
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
    languages,
  } = props;
  let { listType } = props;
  let list;
  const { t } = useTranslation();

  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);
  const [slideProgress, setSlideProgress] = useState<number>(0);
  const [displayType, setDisplayType] = useState<string>(listType as string);
  const [showFilter, setShowFilter] = useState<boolean>(false);

  if (!listType && typeof window !== 'undefined') {
    listType =
      (localStorage.getItem('listType') as 'table' | 'slider-card' | 'slider-banner' | 'grid') ??
      'grid';
  }

  const filterChangeHandler = (value: string) => {
    setDisplayType(value);
    localStorage.setItem('listType', value);
  };

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
      css={{ width: '100%', maxWidth: '1920px' }}
    >
      {listName || showFilterButton || showListTypeChangeButton ? (
        <Flex direction="row" justify="between" align="center" wrap="wrap" css={{ width: '100%' }}>
          {listName && (
            <H3 h3 css={{ margin: '20px 0 20px 0' }}>
              {listName}
            </H3>
          )}
          {showFilterButton || showListTypeChangeButton ? (
            <Flex direction="row" justify="end" align="center" css={{ gap: '$5' }}>
              {showFilterButton ? (
                <Button
                  auto
                  color="primary"
                  bordered={!showFilter}
                  icon={<FilterIcon />}
                  onClick={() => setShowFilter(!showFilter)}
                />
              ) : null}
              {showListTypeChangeButton ? (
                <Button.Group css={{ margin: 0 }}>
                  <Button
                    type="button"
                    onClick={() => filterChangeHandler('grid')}
                    icon={<ViewGridIcon width={40} height={40} />}
                    {...(displayType === 'grid' ? {} : { ghost: true })}
                  />
                  <Button
                    type="button"
                    onClick={() => filterChangeHandler('table')}
                    icon={<ViewTableIcon width={40} height={40} />}
                    {...(displayType === 'table' ? {} : { ghost: true })}
                  />
                </Button.Group>
              ) : null}
            </Flex>
          ) : null}
        </Flex>
      ) : null}
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
      <AnimatePresence>
        {showFilter && mediaType && (
          <ClientOnly fallback={<Loading type="default" />}>
            {() => (
              <Suspense fallback={<Loading type="default" />}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{ width: '100%' }}
                >
                  <Filter
                    genres={mediaType === 'movie' ? genresMovie : genresTv}
                    mediaType={mediaType}
                    languages={languages}
                  />
                </motion.div>
              </Suspense>
            )}
          </ClientOnly>
        )}
      </AnimatePresence>
      {list}
    </Flex>
  );
};

export default MediaList;
