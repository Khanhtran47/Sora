import { Grid, Image, Text, useTheme } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import useMediaQuery from '~/hooks/useMediaQuery';
import { IMedia } from '~/services/tmdb/tmdb.types';

interface IRowItem {
  item: IMedia;
}
const RowItem = ({ item }: IRowItem) => {
  const isXs = useMediaQuery(425, 'max');
  const { isDark } = useTheme();

  const href = (item.mediaType === 'movie' ? '/movies/' : '/tv-shows/') + item.id;
  const year = item.releaseDate ? new Date(item.releaseDate).getFullYear() : undefined;
  const overview = item.overview && isXs ? `${item.overview.substring(0, 100)}...` : item.overview;

  return (
    <Grid.Container
      gap={1}
      alignItems="flex-start"
      css={{
        padding: '0',
        marginBottom: '1.5rem',
        boxShadow: `${isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)'} 0px 5px 0.5rem`,
        borderRadius: '0.5rem',
        maxHeight: '15rem',
      }}
    >
      <Grid xl={1} lg={2} sm={3} xs={4} css={{ padding: '$0' }}>
        <Link to={href}>
          <Image
            showSkeleton
            src={item.posterPath || ''}
            alt={item.title}
            css={{ maxHeight: '15rem', borderRadius: '0.5rem 0 0 0.5rem' }}
          />
        </Link>
      </Grid>
      <Grid xl={11} lg={10} sm={9} xs={8}>
        <Grid.Container css={{ marginRight: `${isXs ? '0.15rem' : '1rem'}` }}>
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
          <Grid xs={12}>
            <Text size="$sm" css={{ textAlign: 'justify' }}>
              {overview}
            </Text>
          </Grid>
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
