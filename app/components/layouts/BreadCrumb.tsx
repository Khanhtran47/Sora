import { Grid, Spacer } from '@nextui-org/react';
import { useLocation, useMatches } from '@remix-run/react';

import Flex from '~/components/styles/Flex.styles';

const BreadCrumb = () => {
  const matches = useMatches();
  const location = useLocation();
  if (
    location.pathname === '/' ||
    location.pathname === '/anime' ||
    location.pathname === '/movies' ||
    location.pathname === '/tv-shows'
  )
    return null;
  return (
    <Grid.Container
      justify="flex-start"
      alignItems="center"
      gap={2}
      wrap="wrap"
      css={{
        width: 'fit-content',
        height: 'auto',
        padding: '0 $sm',
        margin: '0 0 15px 0',
        zIndex: 1,
        '@xs': {
          padding: 0,
        },
      }}
    >
      {matches
        // skip routes that don't have a breadcrumb
        .filter((match) => match.handle && match.handle.breadcrumb)
        // render breadcrumbs!
        .map((match, index) => (
          <Flex
            direction="row"
            justify="start"
            align="center"
            wrap="wrap"
            key={match.id}
            style={{ color: 'var(--nextui-colors-primarySolidHover)' }}
          >
            {index ? (
              <>
                <Spacer x={0.25} />
                <span> ❱ </span>
                <Spacer x={0.25} />
              </>
            ) : null}
            {match?.handle?.breadcrumb(match)}
          </Flex>
        ))}
    </Grid.Container>
  );
};

export default BreadCrumb;
