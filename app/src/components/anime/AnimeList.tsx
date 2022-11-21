import { Button, Row, Spacer } from '@nextui-org/react';
import { useState } from 'react';
// import { useTranslation } from 'react-i18next';

import { IAnimeResult, IAnimeEpisode } from '~/services/consumet/anilist/anilist.types';

import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';

import { AnimeListCard, AnimeListBanner, AnimeListGrid } from './list';
import { H3 } from '../styles/Text.styles';
import Flex from '../styles/Flex.styles';
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
  items: IAnimeResult[] | IAnimeEpisode[];
  // showFilterButton?: boolean;
  showMoreList?: boolean;
  onClickViewMore?: () => void;
  navigationButtons?: boolean;
  hasNextPage?: boolean;
  routeName?: string;
  virtual?: boolean;
  itemType?: 'banner' | 'card' | 'episode-card';
  provider?: string;
}

const AnimeList = (props: IAnimeListProps) => {
  const {
    listName,
    items,
    // showFilterButton,
    showMoreList,
    onClickViewMore,
    navigationButtons,
    hasNextPage,
    routeName,
    virtual,
    itemType,
    provider,
  } = props;
  let { listType } = props;

  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);
  const [slideProgress, setSlideProgress] = useState<number>(0);

  if (!listType && typeof window !== 'undefined') {
    listType =
      (localStorage.getItem('listType') as 'table' | 'slider-card' | 'slider-banner' | 'grid') ??
      'grid';
  }

  const [
    displayType,
    // setDisplayType
  ] = useState<string>(listType as string);
  // const { t } = useTranslation();

  // const filterChangeHandler = (value: string) => {
  //   setDisplayType(value);
  //   localStorage.setItem('listType', value);
  // };

  let list;

  switch (displayType) {
    case 'grid':
      list = (
        <AnimeListGrid
          items={items}
          hasNextPage={hasNextPage}
          routeName={routeName}
          virtual={virtual}
          itemType={itemType}
          provider={provider}
        />
      );
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
          virtual={virtual}
          itemType={itemType}
          provider={provider}
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
      {(showMoreList || navigationButtons) && (
        <Row fluid justify="space-between" wrap="nowrap" align="center">
          {showMoreList && (
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
              View More
            </Button>
          )}
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
      {/* {showFilterButton && mediaType && genres && (
        <Filter
          onChange={filterChangeHandler}
          genres={genres}
          listType={displayType}
          mediaType={mediaType}
        />
      )} */}
      {list}
    </Flex>
  );
};

export default AnimeList;
