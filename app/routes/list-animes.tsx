import * as React from 'react';
import { Link } from '@remix-run/react';
import { Text } from '@nextui-org/react';

// interface IListAnimesProps {}

const ListAnimes = () => (
  <>
    <Text h1>List Animes Page</Text>
    <Link to="/anime" color="secondary">
      Go to the anime detail page
    </Link>
  </>
);

export default ListAnimes;
