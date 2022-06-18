import * as React from 'react';
import { Link } from '@remix-run/react';
import { Button, Text } from '@nextui-org/react';

// interface IAboutProps {}

const About = () => (
  <>
    <Text>Hello again !</Text>
    <Button>
      <Link to="/">
        <Text>Go to the main page</Text>
      </Link>
    </Button>
  </>
);

export default About;
