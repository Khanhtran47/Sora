import type { MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { NavLink, useLocation, Outlet } from '@remix-run/react';
import { Container, Badge } from '@nextui-org/react';

import TabLink from '~/components/elements/tab/TabLink';

export const meta: MetaFunction = () => ({
  title: 'Test Route',
  description: 'This page for testing components and other things',
  'og:title': 'Test Route',
  'og:description': 'This page for testing components and other things',
});

export const loader = async () => {
  // redirect to home page if in production
  if (process.env.VERCEL_ENV === 'production') {
    return redirect('/');
  }
  return {};
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/test" aria-label="Test Page">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Test
        </Badge>
      )}
    </NavLink>
  ),
  getSitemapEntries: () => null,
};

const testingPage = [
  { pageName: 'Design System', pageLink: '/design-system' },
  { pageName: 'Player', pageLink: '/player' },
];

const TestRoute = () => {
  const location = useLocation();
  if (location.pathname === '/test/player')
    return (
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          padding: '0 $sm',
          '@xs': {
            padding: 0,
          },
        }}
      >
        <Outlet />
      </Container>
    );
  return (
    <Container
      fluid
      display="flex"
      justify="flex-start"
      direction="column"
      css={{
        padding: '0 $sm',
        '@xs': {
          padding: 0,
        },
      }}
    >
      <TabLink pages={testingPage} linkTo="/test" />
      <Outlet />
    </Container>
  );
};

export default TestRoute;
