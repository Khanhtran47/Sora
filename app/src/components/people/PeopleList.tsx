/* eslint-disable no-nested-ternary */
import { Grid, Table, Text, Button, Row } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useState } from 'react';
// import SwiperCore, { Autoplay } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
// import { Player } from '@lottiefiles/react-lottie-player';

import { IPeople } from '~/services/tmdb/tmdb.types';

import useMediaQuery from '~/hooks/useMediaQuery';

// import arrowRight from '~/src/assets/lotties/lottieflow-arrow-08-2-0072F5-easey.json';

import PeopleItem from './PeopleItem';

/**
 * PeopleList type:
 * table
 * slider of cards
 * slider of banners
 * grid of cards
 */
interface IPeopleListProps {
  listType?: 'table' | 'slider-card' | 'slider-banner' | 'grid';
  listName?: string | (() => never);
  items: IPeople[];
  showMoreList?: boolean;
  onClickViewMore?: () => void;
  cardType?: 'people' | 'cast';
}

const PeopleListGrid = ({ items }: { items: IPeople[] }) => {
  const isXs = useMediaQuery(650);
  const gap = isXs ? 1 : 3;
  return (
    <Grid.Container gap={gap} justify="flex-start" alignItems="stretch">
      {items?.length > 0 &&
        items.map((item) => {
          const href = `/people/${item.id}/overview`;
          return (
            <Grid xs={6} sm={4} md={3} lg={2} key={item.id}>
              <Link
                to={href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
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
        const href = `/people/${item.id}/overview`;
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

const PeopleListCard = ({ items, type }: { items: IPeople[]; type?: 'people' | 'cast' }) => {
  const isXs = useMediaQuery(650);
  const isSm = useMediaQuery(960);
  const isMd = useMediaQuery(1280);
  const isLg = useMediaQuery(1400);
  const gap = isXs ? 1 : 2;
  const castWidth = {
    width: `${isXs ? '55%' : isSm ? '45%' : isMd ? '35%' : isLg ? '25%' : '20%'}`,
  };
  const peopleWidth = {
    width: `${isXs ? '40%' : isSm ? '30%' : isMd ? '20%' : isLg ? '15%' : '12%'}`,
  };

  return (
    <Grid.Container gap={gap} justify="flex-start" alignItems="center">
      {items?.length > 0 && (
        <Swiper grabCursor spaceBetween={10} slidesPerView="auto">
          {items.map((item, i) => {
            const href = `/people/${item.id}/overview`;
            return (
              <SwiperSlide key={i} style={type === 'people' ? peopleWidth : castWidth}>
                <Link
                  to={href}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <PeopleItem item={item} />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </Grid.Container>
  );
};

const PeopleList = (props: IPeopleListProps) => {
  const { listType, listName, items, showMoreList, onClickViewMore, cardType } = props;
  const [displayType] = useState<string>(listType as string);

  let list;

  switch (displayType) {
    case 'grid':
      list = <PeopleListGrid items={items} />;
      break;
    case 'table':
      list = <PeopleListTable items={items} />;
      break;
    case 'slider-card':
      list = <PeopleListCard items={items} type={cardType || 'people'} />;
      break;
    default:
  }

  return (
    <>
      {(listName || showMoreList) && (
        <Row
          fluid
          justify="space-between"
          wrap="nowrap"
          align="center"
          css={{ margin: '20px 0 20px 0' }}
        >
          {listName && (
            <Text
              h1
              size={20}
              css={{
                margin: 0,
                '@xs': {
                  fontSize: '24px',
                },
                '@sm': {
                  fontSize: '28px',
                },
                '@md': {
                  fontSize: '32px',
                },
              }}
            >
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
              }}
            >
              View more
            </Button>
          )}
        </Row>
      )}
      {list}
    </>
  );
};

export default PeopleList;
