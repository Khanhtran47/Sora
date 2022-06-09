import * as React from 'react';
import { Link } from 'remix';
import Typography from '@mui/material/Typography';

// interface IListMoviesProps {}

const ListMovies = () => (
  <>
    <Typography variant="h4" component="h1" gutterBottom>
      List Movies Page
    </Typography>
    <Link to="/movie" color="secondary">
      Go to the movie detail page
    </Link>
  </>
);

export default ListMovies;
