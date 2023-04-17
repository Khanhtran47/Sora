import { Badge, Container } from '@nextui-org/react';
import { redirect, type MetaFunction } from '@remix-run/node';
import { NavLink, Outlet } from '@remix-run/react';

const testingPage = [
  { pageName: 'Design System', pageLink: '/design-system' },
  { pageName: 'Player', pageLink: '/player' },
];

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
  showTabLink: true,
  tabLinkPages: testingPage,
  tabLinkTo: () => '/test',
  hideTabLinkWithLocation: (locationPathname: string) => {
    if (locationPathname === '/test/player') {
      return true;
    }
    return false;
  },
};

const TestRoute = () => (
  <Container
    fluid
    responsive={false}
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

export default TestRoute;
