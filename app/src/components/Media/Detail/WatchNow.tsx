import { Button, Text } from '@nextui-org/react';
import { Link } from '@remix-run/react';

interface IProps {
  type: 'movie' | 'tv';
  id?: number;
}

const WatchNow = ({ type, id }: IProps) => (
  <Button
    auto
    shadow
    rounded
    color="gradient"
    size="xs"
    css={{
      width: '100%',
      margin: '0.5rem 0 0.5rem 0',
      '@xs': {
        marginTop: '4vh',
      },
      '@sm': {
        marginTop: '2vh',
      },
    }}
  >
    <Link prefetch="intent" to={`/${type === 'movie' ? 'movies' : 'tv-shows'}/watch/${id}`}>
      <Text
        size={12}
        weight="bold"
        transform="uppercase"
        css={{
          '@xs': {
            fontSize: '18px',
          },
          '@sm': {
            fontSize: '20px',
          },
        }}
      >
        Watch now
      </Text>
    </Link>
  </Button>
);

export default WatchNow;
