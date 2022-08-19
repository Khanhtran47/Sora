/* eslint-disable no-nested-ternary */
import { Grid, Table, Text, Button } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';

import { IMedia } from '~/services/tmdb/tmdb.types';

import useMediaQuery from '~/hooks/useMediaQuery';

import MediaItem from './MediaItem';
import Filter from '../filter/Filter';

/**
 * MediaList type:
 * table
 * slider of cards
 * slider of banners
 * grid of cards
 */
interface IMediaListProps {
  listType?: 'table' | 'slider-card' | 'slider-banner' | 'grid';
  listName?: string;
  items: IMedia[];
  showFilter?: boolean;
  genres?: { [id: string]: string };
  mediaType?: 'movie' | 'tv';
  showMoreList?: boolean;
  onClickViewMore?: () => void;
  cardType?: 'media' | 'similar-movie' | 'similar-tv';
  handlerWatchTrailer?: (id: number, type: 'movie' | 'tv') => void;
}

const MediaListGrid = ({ items }: { items: IMedia[] }) => {
  const isXs = useMediaQuery(650);
  const gap = isXs ? 1 : 2;
  return (
    <Grid.Container gap={gap} justify="flex-start" alignItems="center">
      {items?.length > 0 &&
        items.map((item) => {
          const href = (item.mediaType === 'movie' ? '/movies/' : '/tv-shows/') + item.id;
          return (
            <Grid xs={6} sm={4} md={3} lg={2} key={item.id}>
              <Link to={href}>
                <MediaItem key={item.id} type="card" item={item} />
              </Link>
            </Grid>
          );
        })}
    </Grid.Container>
  );
};

const MediaListTable = ({ items }: { items: IMedia[] }) => (
  <Table
    bordered
    striped
    color="secondary"
    aria-label="Example pagination table"
    css={{
      height: 'auto',
      minWidth: '100%',
    }}
  >
    <Table.Header>
      <Table.Column>Title</Table.Column>
      <Table.Column>Vote</Table.Column>
    </Table.Header>
    <Table.Body>
      {items.map((item) => {
        const href = (item.mediaType === 'movie' ? '/movies/' : '/tv-shows/') + item.id;
        return (
          <Table.Row key={item.id}>
            <Table.Cell>
              <Link to={href}>{item.title}</Link>
            </Table.Cell>
            <Table.Cell>{item.voteAverage}</Table.Cell>
          </Table.Row>
        );
      })}
    </Table.Body>
  </Table>
);

const MediaListBanner = ({
  items,
  handlerWatchTrailer,
}: {
  items: IMedia[];
  handlerWatchTrailer?: (id: number, type: 'movie' | 'tv') => void;
}) => {
  SwiperCore.use([Autoplay, Pagination, Navigation]);
  return (
    <Grid.Container
      gap={1}
      justify="flex-start"
      css={{
        margin: 0,
        padding: 0,
        width: '100%',
        '&.swiper-button-prev': {
          left: '80px',
        },
      }}
    >
      {items?.length > 0 && (
        <Swiper
          grabCursor
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 18000 }}
          pagination={{
            type: 'bullets',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-gray-500',
          }}
          navigation
        >
          {items.slice(0, 10).map((item, i) => (
            <SwiperSlide key={i}>
              <MediaItem type="banner" item={item} handlerWatchTrailer={handlerWatchTrailer} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Grid.Container>
  );
};

const MediaListCard = ({
  items,
  type,
}: {
  items: IMedia[];
  type?: 'media' | 'similar-tv' | 'similar-movie';
}) => {
  const isXs = useMediaQuery(650);
  const isSm = useMediaQuery(960);
  const isMd = useMediaQuery(1280);
  const isLg = useMediaQuery(1400);
  const gap = isXs ? 1 : 2;
  const mediaWidth = {
    width: `${isXs ? '40%' : isSm ? '30%' : isMd ? '20%' : isLg ? '15%' : '12%'}`,
  };
  const similarWidth = {
    width: `${isXs ? '55%' : isSm ? '45%' : isMd ? '35%' : isLg ? '25%' : '20%'}`,
  };

  return (
    <Grid.Container gap={gap} justify="flex-start" alignItems="center">
      {items?.length > 0 && (
        <Swiper grabCursor spaceBetween={10} slidesPerView="auto">
          {items.map((item, i) => {
            const href =
              (item.mediaType === 'movie' || type === 'similar-movie' ? '/movies/' : '/tv-shows/') +
              item.id;
            return (
              <SwiperSlide key={i} style={type === 'media' ? mediaWidth : similarWidth}>
                <Link to={href}>
                  <MediaItem key={item.id} type="card" item={item} />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </Grid.Container>
  );
};

const MediaList = (props: IMediaListProps) => {
  const {
    listType,
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
  const [displayType, setDisplayType] = useState<string>(listType as string);
  const { t } = useTranslation();

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
        <Text h1 size="2rem" css={{ margin: '0 0 20px 0' }}>
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
          onChange={setDisplayType}
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
