import { RouteMatch, useLocation } from '@remix-run/react';
import { Grid, Spacer, Text } from '@nextui-org/react';

interface IBreadCrumbProps {
  matches: RouteMatch[];
}

const BreadCrumb = (props: IBreadCrumbProps) => {
  const { matches } = props;
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
        padding: 0,
        margin: '0 0 15px 0',
        zIndex: 1,
      }}
    >
      {matches
        // skip routes that don't have a breadcrumb
        .filter((match) => match.handle && match.handle.breadcrumb)
        // render breadcrumbs!
        .map((match, index) => (
          <Text
            color="primary"
            span
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            {index ? (
              <>
                <Spacer x={0.5} />
                <span> ❱ </span>
                <Spacer x={0.5} />
              </>
            ) : null}
            {match?.handle?.breadcrumb(match)}
          </Text>
        ))}
    </Grid.Container>
  );
};

export default BreadCrumb;
