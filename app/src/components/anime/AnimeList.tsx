import * as React from 'react';
import { Text, Button, Row } from '@nextui-org/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';
import {
  AnimeListCard,
  AnimeListBanner,
  // AnimeListGrid
} from './list';
// import Filter from '../elements/filter/Filter';

/**
 * AnimeList type:
 * table
 * slider of cards
 * slider of banners
 * grid of cards
 */
interface IAnimeListProps {
  listType?: 'table' | 'slider-card' | 'slider-banner' | 'grid';
  listName?: string | (() => never);
  items: IAnimeResult[];
  // showFilter?: boolean;
  showMoreList?: boolean;
  onClickViewMore?: () => void;
  navigationButtons?: boolean;
}

const AnimeList = (props: IAnimeListProps) => {
  const {
    listName,
    items,
    // showFilter,
    showMoreList,
    onClickViewMore,
    navigationButtons,
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

  const [
    displayType,
    // setDisplayType
  ] = useState<string>(listType as string);
  const { t } = useTranslation();

  // const filterChangeHandler = (value: string) => {
  //   setDisplayType(value);
  //   localStorage.setItem('listType', value);
  // };

  let list;

  switch (displayType) {
    // case 'grid':
    //   list = <AnimeListGrid items={items} />;
    //   break;
    case 'slider-banner':
      list = <AnimeListBanner items={items} />;
      break;
    case 'slider-card':
      list = (
        <AnimeListCard
          items={items}
          navigation={{ nextEl, prevEl }}
          setSlideProgress={setSlideProgress}
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
                // color: 'var(--nextui-colors-primary)',
              }}
            >
              <button
                type="button"
                ref={(node) => setPrevEl(node)}
                style={{
                  color: 'var(--nextui-colors-primary)',
                }}
                className="cursor-pointer hover:opacity-80 disabled:cursor-default disabled:!text-[#787F85]"
                aria-label="Previous"
                disabled={slideProgress === 0}
              >
                <ChevronLeftIcon width={48} height={48} />
              </button>
              <button
                type="button"
                ref={(node) => setNextEl(node)}
                style={{
                  color: 'var(--nextui-colors-primary)',
                }}
                className="cursor-pointer hover:opacity-80 disabled:cursor-default disabled:!text-[#787F85]"
                aria-label="Next"
                disabled={slideProgress === 1}
              >
                <ChevronRightIcon width={48} height={48} />
              </button>
            </div>
          )}
        </Row>
      )}
      {/* {showFilter && mediaType && genres && (
        <Filter
          onChange={filterChangeHandler}
          genres={genres}
          listType={displayType}
          mediaType={mediaType}
        />
      )} */}
      {list}
    </>
  );
};

export default AnimeList;
