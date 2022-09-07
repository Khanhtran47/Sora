import { Grid, Image, Text } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import useMediaQuery from '~/hooks/useMediaQuery';
import { IMedia } from '~/services/tmdb/tmdb.types';

interface IRowItem {
  item: IMedia;
}
const RowItem = ({ item }: IRowItem) => {
  const href = (item.mediaType === 'movie' ? '/movies/' : '/tv-shows/') + item.id;
  const year = item.releaseDate ? new Date(item.releaseDate).getFullYear() : undefined;
  const isXs = useMediaQuery(425, 'max');

  return (
    <Grid.Container
      gap={1}
      alignItems="flex-start"
      css={{
        marginBottom: '1rem',
      }}
    >
      <Grid lg={1.5} sm={3} xs={4}>
        <Link to={href}>
          <Image
            showSkeleton
            src={item.posterPath || ''}
            alt={item.title}
            css={{ maxHeight: '15rem' }}
          />
        </Link>
      </Grid>
      <Grid lg={10.5} sm={9} xs={8}>
        <Grid.Container>
          <Grid xs={12}>
            <Link to={href}>
              <Text h1 size="$md">
                {item.title}
              </Text>
            </Link>
          </Grid>

          <Grid xs={12}>
            <Text h6>{`${item.originalTitle} (${year})`}</Text>
          </Grid>
          {!isXs && (
            <Grid xs={12}>
              <Text size="$sm">{item.overview}</Text>
            </Grid>
          )}
          <Grid xs={6} css={{ alignItems: 'center' }}>
            <Text
              weight="bold"
              size="$xs"
              css={{
                backgroundColor: '#dba314',
                borderRadius: '$xs',
                padding: '0 0.25rem 0 0.25rem',
                marginRight: '0.5rem',
              }}
            >
              IMDb
            </Text>
            <Text size="$sm" weight="bold">
              {item.voteAverage}
            </Text>
          </Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
};

export default RowItem;
