import { Button } from '@nextui-org/button';
import { Badge } from '@nextui-org/react';
import { NavLink } from '@remix-run/react';

export const handle = {
  breadcrumb: () => (
    <NavLink to="/design-system/button" aria-label="Player Page">
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
          Button
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Button',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const ButtonComponent = () => {
  return (
    <>
      <Button
        color="primary"
        radius="full"
        // size="xs"
        // variant="flat"
        onPress={() => console.log('clicked')}
      >
        Button
      </Button>
    </>
  );
};

export default ButtonComponent;
