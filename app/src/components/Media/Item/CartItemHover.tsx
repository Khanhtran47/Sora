import { Grid, Loading, Row, Text, useTheme } from '@nextui-org/react';

import useColorImage from '~/hooks/useColorImage';
import { IMedia } from '~/services/tmdb/tmdb.types';

const CardItemHover = ({ item }: { item: IMedia }) => {
  const { isDark } = useTheme();
  const { title, overview, releaseDate, voteAverage, mediaType, posterPath } = item;
  // TODO: add spinner on loading color
  const { loading, colorDarkenLighten } = useColorImage(posterPath, isDark);
  return (
    <Grid.Container
      css={{
        width: 'inherit',
        padding: '0.75rem',
        minWidth: '100px',
        maxWidth: '350px',
      }}
    >
      {loading ? (
        <Loading type="points-opacity" />
      ) : (
        <>
          <Row justify="center" align="center">
            <Text size={18} b color={colorDarkenLighten}>
              {title}
            </Text>
          </Row>
          {overview && (
            <Row>
              <Text>{`${overview?.substring(0, 100)}...`}</Text>
            </Row>
          )}
          <Grid.Container justify="space-between" alignContent="center">
            {releaseDate && (
              <Grid>
                <Text>{`${mediaType === 'movie' ? 'Movie' : 'TV-Shows'} • ${releaseDate}`}</Text>
              </Grid>
            )}
            {voteAverage && (
              <Grid>
                <Text>{`Vote Average: ${voteAverage}`}</Text>
              </Grid>
            )}
          </Grid.Container>
        </>
      )}
    </Grid.Container>
  );
};

export default CardItemHover;
