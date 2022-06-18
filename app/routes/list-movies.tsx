import * as React from 'react';
import { Link } from '@remix-run/react';
import { Text } from '@nextui-org/react';

// interface IListMoviesProps {}

const ListMovies = () => (
  <>
    <Text h1>List Movies Page</Text>
    <Link to="/movie" color="secondary">
      Go to the movie detail page
    </Link>
  </>
);

export default ListMovies;
