import { RouteMatch } from '@remix-run/react';
import { Grid, useTheme, styled } from '@nextui-org/react';

interface IBreadCrumbProps {
  matches: RouteMatch[];
}

const AppBar = styled(Grid.Container, {
  zIndex: 999,
  position: 'fixed',
});

const BreadCrumb = (props: IBreadCrumbProps) => {
  const { matches } = props;
  const { isDark } = useTheme();
  return (
    <AppBar
      justify="space-between"
      alignItems="center"
      color="inherit"
      className={`flex justify-between backdrop-blur-md border-b ${
        isDark ? 'bg-black/70 border-b-slate-700' : ' border-b-slate-300 bg-white/70'
      }`}
      gap={2}
      wrap="nowrap"
      css={{
        width: '100%',
        height: 20,
        padding: 0,
        margin: '64px 0 0 64px',
      }}
    >
      {matches
        // skip routes that don't have a breadcrumb
        .filter((match) => match.handle && match.handle.breadcrumb)
        // render breadcrumbs!
        .map((match, index) => (
          <span key={index}>
            {index ? <span> ❱ </span> : null}
            {match?.handle?.breadcrumb(match)}
          </span>
        ))}
    </AppBar>
  );
};

export default BreadCrumb;
