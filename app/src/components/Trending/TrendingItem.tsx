import { Card, Col, Text, Grid } from '@nextui-org/react';
import { Link } from '@remix-run/react';

import { TMDB, IFilm } from '~/models/tmdb.types';

interface ITrendingItemProps {
  item: IFilm;
}

const TrendingItem = ({ item }: ITrendingItemProps) => {
  const title = item.title || item.original_name || 'Not found';
  const posterUrl = TMDB.poster(item.poster_path, 'w500');

  return (
    <Grid md={3} sm={3} xs={2}>
      <Link to="/movie">
        <Card css={{ w: '100%' }}>
          <Card.Header css={{ position: 'absolute', zIndex: 1, top: 5 }}>
            <Col>
              <Text size={12} weight="bold" transform="uppercase" color="#ffffffAA">
                Trending
              </Text>
              <Text h4 color="white">
                {title}
              </Text>
            </Col>
          </Card.Header>
          <Card.Image src={posterUrl} objectFit="cover" width="100%" height="auto" alt={title} />
        </Card>
      </Link>
    </Grid>
  );
};

export default TrendingItem;
