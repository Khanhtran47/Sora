import { Grid } from '@nextui-org/react';

import { IFilm } from '~/models/tmdb.types';
import TrendingItem from './TrendingItem';

interface ITrendingProps {
  items: IFilm[];
}

const Trending = ({ items }: ITrendingProps) => (
  <section>
    <h4>Today Trending</h4>
    <Grid.Container gap={1} justify="center">
      {items?.length > 0 && items.map((item) => <TrendingItem key={item.id} item={item} />)}
    </Grid.Container>
  </section>
);

export default Trending;
