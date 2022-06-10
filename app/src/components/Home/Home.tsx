import { Link } from '@remix-run/react';

import Typography from '@mui/material/Typography';
import { Container } from '@nextui-org/react';
import { IFilm } from '~/models/tmdb.types';
import Trending from '../Trending/Trending';

interface IHomeProps {
  trendingItems: IFilm[];
}

const Home = ({ trendingItems }: IHomeProps): JSX.Element => (
  <Container fluid>
    <Typography variant="h4" component="h1" gutterBottom>
      Hello World !!!
    </Typography>
    <Trending items={trendingItems} />
    <Link to="/about" color="secondary">
      Go to the about page
    </Link>
  </Container>
);

export default Home;
