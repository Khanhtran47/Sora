import * as React from 'react';
import { useParams } from '@remix-run/react';
import { Text } from '@nextui-org/react';

const SearchRoute = () => {
  const { searchId } = useParams();
  return <Text> This is search {searchId} route</Text>;
};

export default SearchRoute;
