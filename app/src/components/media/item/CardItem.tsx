import { Card, Grid, Loading, Row, Spacer, Text, Tooltip } from '@nextui-org/react';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { IMedia } from '~/services/tmdb/tmdb.types';

const CardItemHover = ({ item }: { item: IMedia }) => {
  const { title, overview, releaseDate, voteAverage, mediaType, posterPath } = item;
  const { loading, colorDarkenLighten } = useColorDarkenLighten(posterPath);
  // TODO: add spinner on loading color

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

const CardItem = ({ item }: { item: IMedia }) => {
  // const [style, setStyle] = React.useState<React.CSSProperties>({ display: 'block' });
  const { title, posterPath } = item;
  const { isDark, colorDarkenLighten } = useColorDarkenLighten(posterPath);

  return (
    <>
      <Card
        as="div"
        variant="flat"
        css={{ borderWidth: 0 }}
        // onMouseEnter={() => {
        //   setStyle({ display: 'none' });
        // }}
        // onMouseLeave={() => {
        //   setStyle({ display: 'block' });
        // }}
        className={isDark ? 'bg-black/70' : 'bg-white/70'}
        role="figure"
      >
        <Card.Image
          src={posterPath || ''}
          objectFit="cover"
          width="100%"
          height="auto"
          alt={title}
          showSkeleton
          maxDelay={10000}
          loading="lazy"
          title={title}
        />
        {/* <Card.Footer
        isBlurred
        css={{
          position: 'absolute',
          bgBlur: isDark ? 'rgb(0 0 0 / 0.8)' : 'rgb(255 255 255 / 0.8)',
          bottom: 0,
          zIndex: 1,
          height: '80px',
          alignItems: 'center',
          '@sm': {
            height: '100px',
            ...style,
          },
        }}
        className={isDark ? 'bg-black/30' : 'bg-white/30'}
      >

      </Card.Footer> */}
      </Card>
      <Spacer y={0.25} />
      <Tooltip
        placement="bottom"
        content={<CardItemHover item={item} />}
        rounded
        shadow
        className="!w-fit"
      >
        <Text
          size={14}
          b
          css={{
            padding: '0 0.25rem',
            '@xs': {
              fontSize: '16px',
            },
            '@sm': {
              fontSize: '18px',
            },
            '&:hover': {
              color: colorDarkenLighten,
            },
          }}
        >
          {title}
        </Text>
      </Tooltip>
      <Spacer y={1} />
    </>
  );
};

export default CardItem;
