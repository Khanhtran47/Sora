import * as React from 'react';
import { Text, Button, Row, Spacer } from '@nextui-org/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';
import { AnimeListCard, AnimeListBanner, AnimeListGrid } from './list';
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
  hasNextPage?: boolean;
  routeName?: string;
}

const AnimeList = (props: IAnimeListProps) => {
  const {
    listName,
    items,
    // showFilter,
    showMoreList,
    onClickViewMore,
    navigationButtons,
    hasNextPage,
    routeName,
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
    case 'grid':
      list = <AnimeListGrid items={items} hasNextPage={hasNextPage} routeName={routeName} />;
      break;
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
