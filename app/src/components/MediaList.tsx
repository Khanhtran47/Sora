import { Grid, Table, Text, Radio, Spacer, Container } from '@nextui-org/react';
import { useState } from 'react';
import { Link } from '@remix-run/react';
import SwiperCore, { Autoplay } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

import { IMedia } from '~/models/tmdb.types';
import MediaItem from './MediaItem';

/**
 * MediaList type:
 * table
 * slider of cards, slider of banners
 * grid of cards
 */
interface IMediaList {
  listType?: 'table' | 'slider' | 'grid';
  listName?: string;
  items: IMedia[];
  switchListType: boolean;
}

const MediaListGrid = ({ items }: { items: IMedia[] }) => (
  <Grid.Container gap={1} justify="center">
    {items?.length > 0 &&
      items.map((item) => (
        <Grid xs={12} sm={6} md={4} lg={2} key={item.id}>
          <Link to={`/${item.mediaType === 'movie' ? 'movies/' : 'tv-shows/'}${item.id}`}>
            <MediaItem key={item.id} type="card" item={item} />
          </Link>
        </Grid>
      ))}
  </Grid.Container>
);

const MediaListTable = ({ items }: { items: IMedia[] }) => (
  <Table
    bordered
    striped
    color="secondary"
    aria-label="Example pagination  table"
    css={{
      height: 'auto',
      minWidth: '100%',
    }}
  >
    <Table.Header>
      <Table.Column>Title</Table.Column>
      <Table.Column>Vote</Table.Column>
      <Table.Column>Type</Table.Column>
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
            <Table.Cell>{item.mediaType}</Table.Cell>
          </Table.Row>
        );
      })}
    </Table.Body>
  </Table>
);

const MediaListSlider = ({ items }: { items: IMedia[] }) => {
  SwiperCore.use([Autoplay]);
  return (
    <Grid.Container gap={1} justify="flex-start">
      {items?.length > 0 && (
        <Swiper
          grabCursor
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          className="w-9/12 h-full"
        >
          {items.slice(1, 10).map((item, i) => (
            <SwiperSlide key={i}>
              {({ isActive }) => (
                <Link
                  to={`/${item.mediaType === 'movie' ? 'movies/' : 'tv-shows/'}${item.id}`}
                  className={`${isActive ? 'active' : ''}`}
                >
                  <MediaItem key={item.id} type="banner" item={item} />
                </Link>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Grid.Container>
  );
};

const MediaList = (props: IMediaList) => {
  const { listType, listName, items, switchListType } = props;
  const [displayType, setDisplayType] = useState<string>(listType as string);

  let list;

  switch (displayType) {
    case 'grid':
      list = <MediaListGrid items={items} />;
      break;
    case 'table':
      list = <MediaListTable items={items} />;
      break;
    case 'slider':
      list = <MediaListSlider items={items} />;
      break;
    default:
  }

  return (
    <>
      {listName && (
        <Text h1 size="2rem">
          {listName}
        </Text>
      )}
      {/* TODO: better and prettier way to swap list type */}
      {switchListType && (
        <>
          <Radio.Group
            orientation="horizontal"
            label="List type"
            defaultValue="grid"
            onChange={setDisplayType}
          >
            <Radio value="grid" color="secondary" size="sm">
              Grid
            </Radio>
            <Radio value="table" color="success" size="sm">
              Table
            </Radio>
          </Radio.Group>
          <Spacer />
        </>
      )}
      {list}
    </>
  );
};

export default MediaList;
