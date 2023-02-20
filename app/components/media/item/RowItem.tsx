/* eslint-disable no-nested-ternary */
import { Grid, Image, Text, useTheme } from '@nextui-org/react';
import { Link } from '@remix-run/react';

import Rating from '~/components/elements/shared/Rating';
import { IMedia } from '~/types/media';

interface IRowItem {
  item: IMedia;
  containerWidth: number;
  simplified?: boolean;
}

const RowItem = ({ item, containerWidth, simplified }: IRowItem) => {
  const isHs = containerWidth <= 360; // hyper small :v
  const isXs = containerWidth <= 425; // extra small
  const isSm = containerWidth <= 650;

  const { isDark } = useTheme();

  const href = (item.mediaType === 'movie' ? '/movies/' : '/tv-shows/') + item.id;
  const year = item.releaseDate ? new Date(item.releaseDate).getFullYear() : undefined;

  const outerContainerCss = {
    padding: '0',
    marginBottom: '2rem',
    boxShadow: `${isDark ? 'rgba(50, 50, 50, 0.5)' : 'rgba(0, 0, 0, 0.35)'} 0 3px 0.5rem`,
    borderRadius: '0.5rem',
    maxHeight: '15rem',
    maxWidth: '1400px',
  };

  if (simplified) {
    return (
      <Grid.Container gap={2} alignItems="flex-start" css={outerContainerCss}>
        <Grid xs={2} sm={1.5}>
          <Text>{year ?? '-'}</Text>
        </Grid>
        <Grid xs={1.5} sm={1}>
          o
        </Grid>
        <Grid xs={8.5} sm={9.5}>
          <Link to={href}>
            <Text weight="bold">{item.title}</Text>
          </Link>
        </Grid>
      </Grid.Container>
    );
  }

  return (
    <Grid.Container gap={2} alignItems="flex-start" css={outerContainerCss}>
      <Grid xl={1} lg={1.5} md={2} sm={2.5} xs={4} css={{ padding: '$0' }}>
        <Link to={href}>
          <Image
            showSkeleton
            src={item.posterPath || ''}
            alt={item.title}
            css={{ maxHeight: '15rem', borderRadius: '0.5rem 0 0 0.5rem' }}
          />
        </Link>
      </Grid>
      <Grid xl={11} lg={10.5} md={10} sm={9.5} xs={8}>
        <Grid.Container css={{ marginRight: `${isXs ? '0.15rem' : '1rem'}` }}>
          <Grid xs={12}>
            <Link to={href}>
              <Text h1 size="$md">
                {item.title}
              </Text>
            </Link>
          </Grid>

          <Grid xs={12}>
            <Text
              h6
              css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >{`${item.originalTitle} (${year})`}</Text>
          </Grid>
          <Grid xs={12}>
            <Text
              size="$sm"
              css={{
                textAlign: 'justify',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                display: '-webkit-box',
                '-webkit-line-clamp': `${isHs ? 2 : isXs ? 3 : isSm ? 4 : 5}`,
                '-webkit-box-orient': 'vertical',
              }}
            >
              {item.overview}
            </Text>
          </Grid>
          <Grid xs={6} css={{ alignItems: 'center', marginTop: '0.1rem' }}>
            <Rating rating={item.voteAverage?.toFixed(1)} ratingType={item.mediaType} />
          </Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
};

export default RowItem;
