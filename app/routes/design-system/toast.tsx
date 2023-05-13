import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import { NavLink } from '@remix-run/react';
import { toast } from 'sonner';

import Info from '~/assets/icons/InfoIcon';

export const handle = {
  breadcrumb: () => (
    <NavLink to="/design-system/toast" aria-label="Toast Page">
      {({ isActive }) => (
        <Chip
          color="primary"
          variant="flat"
          size="sm"
          className={`${
            isActive ? 'opacity-100' : 'opacity-70'
          } duration-250 ease-in-out transition-opacity hover:opacity-80`}
        >
          Toast
        </Chip>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Toast',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const ToastPage = () => {
  return (
    <>
      <h2>Toast</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        href="https://github.com/emilkowalski/sonner#usage"
      >
        API Reference
      </Link>
      <Button onPress={() => toast('This is a toast', { duration: Infinity })}>Show toast</Button>
      <Button
        onPress={() =>
          toast('This is a toast', {
            description: 'This is a toast description',
            icon: <Info className="h-5 w-5" />,
            duration: Infinity,
          })
        }
      >
        Show toast with description
      </Button>
      <Button
        onPress={() =>
          toast.success('This is a success toast', {
            description: 'This is a toast description',
            duration: Infinity,
          })
        }
      >
        Show success toast
      </Button>
      <Button
        onPress={() =>
          toast.error('This is a error toast', {
            description: 'This is a toast description',
            duration: Infinity,
          })
        }
      >
        Show error toast
      </Button>
      <Button
        onPress={() =>
          toast('This is a action toast', {
            action: {
              label: 'Undo',
              // eslint-disable-next-line no-console
              onClick: () => console.log('Undo'),
            },
            duration: Infinity,
          })
        }
      >
        Show action toast
      </Button>
      <Button
        onPress={() =>
          toast.promise(
            () =>
              new Promise((resolve) => {
                setTimeout(resolve, 2000);
              }),
            {
              loading: 'Loading...',
              success: 'Success',
              error: 'Error',
              duration: Infinity,
            },
          )
        }
      >
        Show promise toast
      </Button>
    </>
  );
};

export default ToastPage;
