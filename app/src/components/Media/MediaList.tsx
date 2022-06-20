import { Grid, Table, Link, Text, Radio, Spacer, Container } from '@nextui-org/react';
import { useState } from 'react';

import { IMedia } from '~/models/tmdb.types';
import MediaItem from './MediaItem';

/**
 * MediaList type:
 * table
 * slider of cards, slider of banners
 * grid of cards
 */
interface IMediaList {
  listType?: 'table' | 'sliderCard' | 'sliderBanner' | 'grid';
  listName?: string;
  items: IMedia[];
}

const MediaListGrid = ({ items }: { items: IMedia[] }) => (
  <Grid.Container gap={1} justify="center">
    {items?.length > 0 &&
      items.map((item) => {
        const href = (item.mediaType === 'movie' ? '/movies/' : '/tv-shows/') + item.id;
        return (
          <Grid xs={12} sm={3} key={item.id}>
            <Link href={href}>
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
      <Table.Column>Type</Table.Column>
    </Table.Header>
    <Table.Body>
      {items.map((item) => {
        const href = (item.mediaType === 'movie' ? '/movies/' : '/tv-shows/') + item.id;
        return (
          <Table.Row key={item.id}>
            <Table.Cell>
              <Link href={href} block color="secondary">
                {item.title}
              </Link>
            </Table.Cell>
            <Table.Cell>{item.voteAverage}</Table.Cell>
            <Table.Cell>{item.mediaType}</Table.Cell>
          </Table.Row>
        );
      })}
    </Table.Body>
  </Table>
);

const MediaList = (props: IMediaList) => {
  const { listType, listName, items } = props;
  const [displayType, setDisplayType] = useState<string>(listType as string);

  let list;

  if (displayType === 'grid') {
    list = <MediaListGrid items={items} />;
  } else {
    list = <MediaListTable items={items} />;
  }

  return (
    <Container fluid>
      {listName && (
        <Text h1 size="2rem">
          {listName}
        </Text>
      )}
      {/* TODO: better and prettier way to swap list type */}
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
      {list}
    </Container>
  );
};

export default MediaList;
