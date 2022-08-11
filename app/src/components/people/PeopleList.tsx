import { Grid, Table, Text } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useState } from 'react';
// import SwiperCore, { Autoplay } from 'swiper/core';
// import { Swiper, SwiperSlide } from 'swiper/react';

import { IPeople } from '~/services/tmdb/tmdb.types';

import useMediaQuery from '~/hooks/useMediaQuery';

import PeopleItem from './PeopleItem';
import Filter from '../filter/Filter';

/**
 * PeopleList type:
 * table
 * slider of cards
 * slider of banners
 * grid of cards
 */
interface IPeopleListProps {
  listType?: 'table' | 'slider-card' | 'slider-banner' | 'grid';
  listName?: string;
  items: IPeople[];
  showFilter?: boolean;
  genres?: { [id: string]: string };
  mediaType?: 'movie' | 'tv';
}

const PeopleListGrid = ({ items }: { items: IPeople[] }) => {
  const isXs = useMediaQuery(650);
  const gap = isXs ? 1 : 3;
  return (
    <Grid.Container gap={gap} justify="flex-start" alignItems="center">
      {items?.length > 0 &&
        items.map((item) => {
          const href = `/people/${item.id}`;
          return (
            <Grid xs={6} sm={4} md={3} lg={2} key={item.id}>
              <Link to={href}>
                <PeopleItem key={item.id} item={item} />
              </Link>
            </Grid>
          );
        })}
    </Grid.Container>
  );
};

const PeopleListTable = ({ items }: { items: IPeople[] }) => (
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
      <Table.Column>Name</Table.Column>
      <Table.Column>Popularity</Table.Column>
    </Table.Header>
    <Table.Body>
      {items.map((item) => {
        const href = `/people/${item.id}`;
        return (
          <Table.Row key={item.id}>
            <Table.Cell>
              <Link to={href}>{item.name}</Link>
            </Table.Cell>
            <Table.Cell>{item.popularity}</Table.Cell>
          </Table.Row>
        );
      })}
    </Table.Body>
  </Table>
);

// const PeopleListCard = ({ items }: { items: IPeople[] }) => ();

const PeopleList = (props: IPeopleListProps) => {
  const { listType, listName, items, showFilter, genres, mediaType } = props;
  const [displayType, setDisplayType] = useState<string>(listType as string);

  let list;

  switch (displayType) {
    case 'grid':
      list = <PeopleListGrid items={items} />;
      break;
    case 'table':
      list = <PeopleListTable items={items} />;
      break;
    // case 'sliderCard':
    //   list = <PeopleListCard items={items} />;
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
      {showFilter && mediaType && genres && (
        <Filter onChange={setDisplayType} listType={displayType} />
      )}
      {list}
    </>
  );
};

export default PeopleList;
