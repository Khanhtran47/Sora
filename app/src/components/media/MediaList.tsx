import { Text, Button } from '@nextui-org/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IMedia } from '~/services/tmdb/tmdb.types';
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
  mediaType?: 'movie' | 'tv';
  showMoreList?: boolean;
  onClickViewMore?: () => void;
  cardType?: 'media' | 'similar-movie' | 'similar-tv';
  handlerWatchTrailer?: (id: number, type: 'movie' | 'tv') => void;
}

const MediaList = (props: IMediaListProps) => {
  const {
    listName,
    items,
    showFilter,
    genres,
    mediaType,
    showMoreList,
    onClickViewMore,
    cardType,
    handlerWatchTrailer,
  } = props;
  let { listType } = props;

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
      list = <MediaListBanner items={items} handlerWatchTrailer={handlerWatchTrailer} />;
      break;
    case 'slider-card':
      list = <MediaListCard items={items} type={cardType || 'media'} />;
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
