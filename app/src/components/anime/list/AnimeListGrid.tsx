import { Grid } from '@nextui-org/react';
// import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';

import useMediaQuery from '~/hooks/useMediaQuery';
import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';
import AnimeItem from '../item';

const AnimeListGrid = ({ items }: { items: IAnimeResult[] }) => {
  const isXs = useMediaQuery(370);
  return (
    <Grid.Container gap={1} justify="flex-start" alignItems="stretch" wrap="wrap">
      {items?.length > 0 &&
        items.map((item, index) => (
          <Grid
            key={item.id}
            as="div"
            xs={isXs ? 12 : 6}
            sm={4}
            md={3}
            lg={2.4}
            xl={2}
            justify={isXs ? 'center' : 'flex-start'}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1 * index }}
            >
              {/* <Link to={href}> */}
              <AnimeItem key={item.id} type="card" item={item} />
              {/* </Link> */}
            </motion.div>
          </Grid>
        ))}
    </Grid.Container>
  );
};

export default AnimeListGrid;
