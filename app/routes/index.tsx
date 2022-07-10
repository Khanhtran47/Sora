import * as React from 'react';
import { Link } from '@remix-run/react';
import { Container, Text } from '@nextui-org/react';

// interface IIndexProps {}

// https://remix.run/guides/routing#index-routes
const Index = () => (
  // Home page
  <Container fluid>
    {/* TODO film trending banner */}
    <Text h1>Hello World !!!</Text>
    <Link to="/about" color="secondary">
      Go to the about page
    </Link>
  </Container>
);

export default Index;
