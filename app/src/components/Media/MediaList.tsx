import { Grid, Table, Text, Radio, Spacer, Container } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import SwiperCore, { Autoplay } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IMedia } from '~/models/tmdb.types';
import MediaItem from './MediaItem';

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
}

const MediaListGrid = ({ items }: { items: IMedia[] }) => (
  <Grid.Container gap={3} justify="flex-start" alignItems="center">
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

const MediaListBanner = ({ items }: { items: IMedia[] }) => {
  SwiperCore.use([Autoplay]);
  return (
    <Grid.Container gap={1} justify="flex-start" css={{ margin: 0, padding: 0, width: '100%' }}>
      {items?.length > 0 && (
        <Swiper grabCursor spaceBetween={0} slidesPerView={1} autoplay={{ delay: 4500 }}>
          {items.slice(0, 10).map((item, i) => (
            <SwiperSlide key={i} className="w-fit">
              <MediaItem key={item.id} type="banner" item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Grid.Container>
  );
};

// const MediaListCard = ({ items }: { items: IMedia[] }) => ();

const MediaList = (props: IMediaListProps) => {
  const { listType, listName, items, showFilter } = props;
  const [displayType, setDisplayType] = useState<string>(listType as string);

  let list;

  switch (displayType) {
    case 'grid':
      list = <MediaListGrid items={items} />;
      break;
    case 'table':
      list = <MediaListTable items={items} />;
      break;
    case 'slider-banner':
      list = <MediaListBanner items={items} />;
      break;
    // case 'sliderCard':
    //   list = <MediaListCard items={items} />;
    //   break;
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
      {showFilter && (
        <Container fluid>
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
        </Container>
      )}
      {list}
    </>
  );
};

export default MediaList;
