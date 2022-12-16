import { useState, Suspense } from 'react';
import { Button, Row, Spacer, Loading, Pagination, Tooltip } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { ClientOnly } from 'remix-utils';
import { AnimatePresence, motion } from 'framer-motion';

import { IMedia } from '~/types/media';
import { ILanguage } from '~/services/tmdb/tmdb.types';
import useMediaQuery from '~/hooks/useMediaQuery';
import useLocalStorage from '~/hooks/useLocalStorage';

import FilterIcon from '~/src/assets/icons/FilterIcon.js';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';
import ViewGridIcon from '~/src/assets/icons/ViewGridIcon.js';
import ViewTableIcon from '~/src/assets/icons/ViewTableIcon.js';

import { MediaListTable, MediaListCard, MediaListBanner, MediaListGrid } from './list';
import Filter from '../elements/filter/Filter';
import { H2 } from '../styles/Text.styles';
import Flex from '../styles/Flex.styles';

/**
 * MediaList type:
 * table
 * slider of cards
 * slider of banners
 * grid of cards
 */
interface IMediaListProps {
  coverItem?: { id: number; name: string; backdropPath: string }[]; // require when cover card is true, value is cover items to show
  currentPage?: number; // require when pagination is true, loading type is page, value is current page
  genresMovie?: { [id: string]: string }; // pass genres movie object
  genresTv?: { [id: string]: string }; // pass genres tv object
  hasNextPage?: boolean; // require when loading type is scroll, value is true if there is a next page
  isCoverCard?: boolean; // value is true if the cover card is active
  items?: IMedia[]; // value is items to show
  itemsType?: 'movie' | 'tv' | 'anime' | 'people' | 'episode'; // value is type of items to show, help to show the correct url, item type and item title
  languages?: ILanguage[]; // pass languages object
  listName?: string | (() => never); // value is name of the list
  listType?: 'table' | 'slider-card' | 'slider-banner' | 'grid'; // value is type of list to show
  loadingType?: 'page' | 'scroll'; // value is type of loading to show
  mediaType?: 'movie' | 'tv' | 'anime'; // value is type of media to show, help for filter type
  navigationButtons?: boolean; // value is true if the navigation buttons are active
  onClickViewMore?: () => void; // require when view more button is true, value is function to execute when view more button is clicked
  onPageChangeHandler?: (page: number) => void; // require when pagination is true, value is function to execute when page is changed
  provider?: string; // value is provider name, help to show the correct url for episode itemsType
  routeName?: string; // value is route name, help to load the correct route when scrolling
  showFilterButton?: boolean; // value is true if the filter button is active
  showListTypeChangeButton?: boolean; // value is true if the list type change button is active
  showMoreList?: boolean; // value is true if the view more button is active
  showPagination?: boolean; // value is true if the pagination is active
  totalPages?: number; // require when pagination is true, value is total pages
  virtual?: boolean; // value is true if the list is virtual
}

const MediaList = (props: IMediaListProps) => {
  const {
    coverItem,
    currentPage,
    genresMovie,
    genresTv,
    hasNextPage,
    isCoverCard,
    items,
    itemsType,
    languages,
    listName,
    loadingType,
    mediaType,
    navigationButtons,
    onClickViewMore,
    onPageChangeHandler,
    provider,
    routeName,
    showFilterButton,
    showListTypeChangeButton,
    showMoreList,
    showPagination,
    totalPages,
    virtual,
  } = props;
  let { listType } = props;
  let list;
  const { t } = useTranslation();

  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);
  const [slideProgress, setSlideProgress] = useState<number>(0);
  const [displayType, setDisplayType] = useState<string>(listType as string);
  const [showFilter, setShowFilter] = useLocalStorage('showFilter', false);
  const isXs = useMediaQuery('(max-width: 650px)');

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
          coverItem={coverItem}
          genresMovie={genresMovie}
          genresTv={genresTv}
          hasNextPage={hasNextPage}
          isCoverCard={isCoverCard}
          items={items}
          itemsType={itemsType}
          loadingType={loadingType}
          provider={provider}
          routeName={routeName}
          virtual={virtual}
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
          coverItem={coverItem}
          genresMovie={genresMovie}
          genresTv={genresTv}
          isCoverCard={isCoverCard}
          items={items}
          itemsType={itemsType}
          navigation={{ nextEl, prevEl }}
          provider={provider}
          setSlideProgress={setSlideProgress}
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
            <H2
              h2
              css={{
                margin: '20px 0 20px 0',
                '@xsMax': {
                  fontSize: '1.75rem !important',
                },
              }}
            >
              {listName}
            </H2>
          )}
          {showFilterButton || showListTypeChangeButton ? (
            <Flex direction="row" justify="end" align="center" css={{ gap: '$5' }}>
              {showFilterButton ? (
                <Tooltip content={t('show-hide-filter')}>
                  <Button
                    auto
                    color="primary"
                    bordered={!showFilter}
                    icon={<FilterIcon />}
                    onClick={() => setShowFilter(!showFilter)}
                  />
                </Tooltip>
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
      {showPagination && totalPages && totalPages > 1 ? (
        <Pagination
          total={totalPages}
          initialPage={currentPage}
          // shadow
          onChange={onPageChangeHandler}
          css={{ marginTop: '30px' }}
          {...(isXs && { size: 'xs' })}
        />
      ) : null}
    </Flex>
  );
};

export default MediaList;
