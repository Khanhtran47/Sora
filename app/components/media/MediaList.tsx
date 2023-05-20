import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Spacer, Tooltip } from '@nextui-org/react';
import { useMediaQuery } from '@react-hookz/web';
import { useTranslation } from 'react-i18next';
import { tv } from 'tailwind-variants';

import type { IMedia } from '~/types/media';
import type { ILanguage } from '~/services/tmdb/tmdb.types';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '~/components/elements/Sheet';
import Filter from '~/components/elements/shared/Filter';
import ListViewChangeButton from '~/components/elements/shared/ListViewChangeButton';
import ChevronLeftIcon from '~/assets/icons/ChevronLeftIcon';
import ChevronRightIcon from '~/assets/icons/ChevronRightIcon';
import FilterIcon from '~/assets/icons/FilterIcon';

import { MediaListBanner, MediaListCard, MediaListGrid } from './list';

interface IMediaListProps {
  /**
   * Require when cover card is true, value is cover items to show
   * @type {Array<{ id: number; name: string; backdropPath: string }>}
   * @memberof IMediaListProps
   * @example
   * [
   *  {
   *    id: 1,
   *    name: 'Movie name',
   *    backdropPath: '/backdrop/path'
   *  }
   * ]
   */
  coverItem?: { id: number; name: string; backdropPath: string }[];
  /**
   * Require when pagination is true, loading type is page, value is current page
   * @type {number}
   * @memberof IMediaListProps
   * @example
   * 1
   * 2
   * 3
   * ...
   * 10
   */
  currentPage?: number;
  /**
   * Pass genres movie object
   * @type {{ [id: string]: string }}
   * @memberof IMediaListProps
   * @example
   * {
   *  '1': 'Action',
   *  '2': 'Adventure',
   *  '3': 'Animation',
   *  '4': 'Comedy',
   * }
   */
  genresMovie?: { [id: string]: string };
  /**
   * Pass genres tv object
   * @type {{ [id: string]: string }}
   * @memberof IMediaListProps
   * @example
   * {
   *  '1': 'Action',
   *  '2': 'Adventure',
   *  '3': 'Animation',
   *  '4': 'Comedy',
   * }
   */
  genresTv?: { [id: string]: string };
  /**
   * Require when loading type is scroll, value is true if there is a next page
   * @type {boolean}
   * @memberof IMediaListProps
   * @example
   * true
   * false
   */
  hasNextPage?: boolean;
  /**
   * Value is true if the cover card is active
   * @type {boolean}
   * @memberof IMediaListProps
   * @example
   * true
   * false
   */
  isCoverCard?: boolean;
  /**
   * Value is items to show
   * @type {Array<IMedia>}
   * @memberof IMediaListProps
   * @see IMedia
   */
  items?: IMedia[];
  /**
   * Value is type of items to show, help to show the correct url, item type and item title
   * @type {'movie' | 'tv' | 'anime' | 'people' | 'episode' | 'movie-tv'}
   * @memberof IMediaListProps
   * @example
   * 'movie'
   * 'tv'
   * 'anime'
   * 'people'
   * 'episode'
   * 'movie-tv'
   */
  itemsType?: 'movie' | 'tv' | 'anime' | 'people' | 'episode' | 'movie-tv';
  /**
   * Pass languages object
   * @type {Array<ILanguage>}
   * @memberof IMediaListProps
   * @see ILanguage
   */
  languages?: ILanguage[];
  /**
   * Value is name of the list
   * @type {string | (() => never)}
   * @memberof IMediaListProps
   * @example
   * 'Popular Movies'
   * t('Popular Movies')
   */
  listName?: string | (() => never);
  /**
   * Value is type of list to show
   * @type {'slider-card' | 'slider-banner' | 'grid'}
   * @memberof IMediaListProps
   * @example
   * 'slider-card'
   * 'slider-banner'
   * 'grid'
   */
  listType?: 'slider-card' | 'slider-banner' | 'grid';
  /**
   * Value is true if the navigation buttons are active
   * @type {boolean}
   * @memberof IMediaListProps
   * @example
   * true
   * false
   */
  navigationButtons?: boolean;
  /**
   * Require when view more button is true, value is function to execute when view more button is clicked
   * @memberof IMediaListProps
   * @example
   * () => console.log('View more button is clicked')
   */
  onClickViewMore?: () => void;
  /**
   * Value is provider name, help to show the correct url for episode itemsType
   * @type {string}
   * @memberof IMediaListProps
   * @example
   * 'Gogo'
   * 'Zoro'
   */
  provider?: string;
  /**
   * Value is route name, help to load the correct route when scrolling in scroll loading type
   * @type {string}
   * @memberof IMediaListProps
   * @example
   * '/anime/popular'
   */
  routeName?: string;
  /**
   * Value is true if the filter button is active
   * @type {boolean}
   * @memberof IMediaListProps
   * @example
   * true
   * false
   */
  showFilterButton?: boolean;
  /**
   * Value is true if the list type change button is active
   * @type {boolean}
   * @memberof IMediaListProps
   * @example
   * true
   * false
   */
  showListTypeChangeButton?: boolean;
  /**
   * Value is true if the view more button is active
   * @type {boolean}
   * @memberof IMediaListProps
   * @example
   * true
   * false
   */
  showMoreList?: boolean;
  /**
   * Require when pagination is true, value is total pages
   * @type {number}
   * @memberof IMediaListProps
   * @example
   * 10
   * 20
   * 30
   * ...
   */
  totalPages?: number;
  /**
   * Value is true if scroll to top list after changing page
   * @type {boolean}
   * @memberof IMediaListProps
   * @example
   * true
   * false
   */
  scrollToTopListAfterChangePage?: boolean;
}

const mediaListStyles = tv({
  base: 'flex w-full max-w-screen-4xl flex-col justify-center',
  variants: {
    gap: {
      none: 'gap-0',
      normal: 'gap-2',
      grid: 'gap-6',
    },
    alignItems: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
    },
  },
  defaultVariants: {
    gap: 'normal',
    alignItems: 'start',
  },
});

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
    navigationButtons,
    onClickViewMore,
    provider,
    scrollToTopListAfterChangePage,
    showFilterButton,
    showListTypeChangeButton,
    showMoreList,
    totalPages,
    listType,
  } = props;
  let list;
  const { t } = useTranslation();
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);
  const [slideProgress, setSlideProgress] = useState<number>(0);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });

  switch (listType) {
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
          provider={provider}
          totalPages={totalPages}
          currentPage={currentPage}
          listType={listType}
          scrollToTopListAfterChangePage={scrollToTopListAfterChangePage}
        />
      );
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
        />
      );
      break;
    default:
  }

  return (
    <div
      className={mediaListStyles({
        gap: listType === 'grid' ? 'grid' : 'normal',
        alignItems: listType === 'grid' || listType === 'slider-banner' ? 'center' : 'start',
      })}
    >
      {listName || showFilterButton || showListTypeChangeButton ? (
        <div className="mt-5 flex w-full flex-row flex-wrap items-center justify-between gap-3">
          {listName ? <h2>{listName}</h2> : null}
          {showFilterButton || showListTypeChangeButton ? (
            <div className="flex flex-row items-center justify-end gap-3">
              {showFilterButton ? (
                <Sheet open={showFilter} onOpenChange={setShowFilter}>
                  <Tooltip content={t('show-hide-filter')}>
                    <SheetTrigger asChild>
                      <Button
                        type="button"
                        color="primary"
                        variant={showFilter ? 'flat' : 'solid'}
                        isIconOnly
                      >
                        <FilterIcon />
                      </Button>
                    </SheetTrigger>
                  </Tooltip>
                  <SheetContent
                    swipeDownToClose={isSm}
                    side={isSm ? 'bottom' : 'right'}
                    size={isSm ? 'xl' : 'sm'}
                    open={showFilter}
                    hideCloseButton
                    onOpenChange={() => setShowFilter(!showFilter)}
                    className="!px-0 md:!px-0"
                  >
                    <SheetTitle className="px-0 md:px-6">Filters</SheetTitle>
                    <Spacer y={0.5} />
                    <Filter
                      genres={itemsType === 'movie' ? genresMovie : genresTv}
                      mediaType={itemsType as 'movie' | 'tv' | 'anime'}
                      languages={languages}
                    />
                  </SheetContent>
                </Sheet>
              ) : null}
              {showListTypeChangeButton ? <ListViewChangeButton /> : null}
            </div>
          ) : null}
        </div>
      ) : null}
      {showMoreList ? (
        <div className="mb-2 flex w-full flex-row flex-wrap items-center justify-between">
          <Button
            type="button"
            size={isSm ? 'sm' : 'md'}
            radius="full"
            variant="solid"
            onPress={onClickViewMore}
          >
            {t('viewMore')}
          </Button>
          {navigationButtons ? (
            <div className="flex flex-row gap-x-2">
              <Button
                type="button"
                radius="full"
                variant="solid"
                ref={(node) => setPrevEl(node)}
                className="h-8 w-8 cursor-pointer p-0 hover:opacity-80 sm:h-10 sm:w-10"
                aria-label="Previous"
                isDisabled={slideProgress === 0}
                isIconOnly
              >
                <ChevronLeftIcon height={isSm ? 18 : 24} width={isSm ? 18 : 24} />
              </Button>
              <Button
                type="button"
                radius="full"
                variant="solid"
                ref={(node) => setNextEl(node)}
                className="h-8 w-8 cursor-pointer p-0 hover:opacity-80 sm:h-10 sm:w-10"
                aria-label="Next"
                isDisabled={slideProgress === 1}
                isIconOnly
              >
                <ChevronRightIcon height={isSm ? 18 : 24} width={isSm ? 18 : 24} />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      {list}
    </div>
  );
};

export default MediaList;
