import { Grid } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import useMediaQuery from '~/hooks/useMediaQuery';
import { IMedia } from '~/services/tmdb/tmdb.types';
import MediaItem from '../item';

const MediaListGrid = ({ items }: { items: IMedia[] }) => {
  const isXs = useMediaQuery(650);
  const gap = isXs ? 1 : 2;
  return (
    <Grid.Container gap={gap} justify="flex-start" alignItems="stretch">
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

export default MediaListGrid;
