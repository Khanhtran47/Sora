import { Grid, Table, Button, Link } from '@nextui-org/react';
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
      items.map((item) => (
        <Grid xs={12} sm={3} key={item.id}>
          <Link href={`/${item.mediaType}/${item.id}`}>
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
      {items.map((item) => (
        <Table.Row key={item.id}>
          <Table.Cell>
            <Link href={`/${item.mediaType}/${item.id}`} block color="secondary">
              {item.title}
            </Link>
          </Table.Cell>
          <Table.Cell>{item.voteAverage}</Table.Cell>
          <Table.Cell>{item.mediaType}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
    <Table.Pagination shadow noMargin align="center" rowsPerPage={5} onPageChange={() => {}} />
  </Table>
);

const MediaList = (props: IMediaList) => {
  const { listType, listName, items } = props;
  const [displayType, setDisplayType] = useState(listType);

  let list;

  if (displayType === 'grid') {
    list = <MediaListGrid items={items} />;
  } else {
    list = <MediaListTable items={items} />;
  }

  const changeListTypeHandler = () => {
    if (displayType === 'grid') setDisplayType('table');
    if (displayType === 'table') setDisplayType('grid');
  };
  return (
    <>
      {listName && <h4>{listName}</h4>}
      <Button type="button" onClick={changeListTypeHandler}>
        Change
      </Button>
      {list}
    </>
  );
};

export default MediaList;
