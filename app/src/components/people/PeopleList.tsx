/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { Grid, Text, Button, Row } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IPeople } from '~/services/tmdb/tmdb.types';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon.js';
import ChevronLeftIcon from '~/src/assets/icons/ChevronLeftIcon.js';
import useMediaQuery from '~/hooks/useMediaQuery';

import PeopleItem from './PeopleItem';

/**
 * PeopleList type:
 * slider of cards
 * grid of cards
 */
interface IPeopleListProps {
  listType?: 'table' | 'slider-card' | 'slider-banner' | 'grid';
  listName?: string | (() => never);
  items: IPeople[];
  showMoreList?: boolean;
  onClickViewMore?: () => void;
  navigationButtons?: boolean;
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

const PeopleListCard = ({
  items,
  navigation,
}: {
  items: IPeople[];
  navigation?: {
    nextEl?: string | HTMLElement | null;
    prevEl?: string | HTMLElement | null;
  };
}) => {
  const isSm = useMediaQuery(960);
  const gap = isSm ? 1 : 2;

  return (
    <Grid.Container gap={gap} justify="flex-start" alignItems="center">
      {items?.length > 0 && (
        <Swiper
          modules={[Navigation]}
          grabCursor
          spaceBetween={10}
          slidesPerView="auto"
          navigation={navigation}
        >
          {items.map((item, i) => {
            const href = `/people/${item.id}/overview`;
            return (
              <SwiperSlide key={i} style={{ width: '160px' }}>
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
  const { listType, listName, items, showMoreList, onClickViewMore, navigationButtons } = props;
  const [displayType] = useState<string>(listType as string);

  const [prevEl, setPrevEl] = React.useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = React.useState<HTMLElement | null>(null);

  let list;

  switch (displayType) {
    case 'grid':
      list = <PeopleListGrid items={items} />;
      break;
    case 'slider-card':
      list = <PeopleListCard items={items} navigation={{ nextEl, prevEl }} />;
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
        <Row fluid justify="space-between" wrap="nowrap" align="center">
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
            View more
          </Button>
          {navigationButtons && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 'var(--nextui-space-12)',
                color: 'var(--nextui-colors-primaryLightContrast)',
              }}
            >
              <div
                ref={(node) => setPrevEl(node)}
                style={{
                  cursor: 'pointer',
                }}
              >
                <ChevronLeftIcon width={48} height={48} />
              </div>
              <div
                ref={(node) => setNextEl(node)}
                style={{
                  cursor: 'pointer',
                }}
              >
                <ChevronRightIcon width={48} height={48} />
              </div>
            </div>
          )}
        </Row>
      )}
      {list}
    </>
  );
};

export default PeopleList;
