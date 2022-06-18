import * as React from 'react';
import { Link } from '@remix-run/react';
import { Text } from '@nextui-org/react';

// interface IListTvShowsProps {}

const ListTvShows = () => (
  <>
    <Text h1>List Tv Shows Page</Text>
    <Link to="/tv-show" color="secondary">
      Go to the tv show detail page
    </Link>
  </>
);

export default ListTvShows;
