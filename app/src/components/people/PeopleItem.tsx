import * as React from 'react';
// import { Link } from '@remix-run/react';
import { Grid, Card, Text, Row, Tooltip, Loading, useTheme } from '@nextui-org/react';
import { IPeople } from '~/services/tmdb/tmdb.types';
import { useColor } from 'color-thief-react';
import tinycolor from 'tinycolor2';

import TMDB from '~/utils/media';

interface IPeopleItem {
  item: IPeople;
}

const CardItemHover = ({ item }: { item: IPeople }) => {
  const { isDark } = useTheme();
  const {
    name,
    // known_for: knownFor,
  } = item;
  const profilePath = TMDB?.profileUrl(item?.profile_path || '', 'w185');
  // TODO: add spinner on loading color
  const {
    data,
    loading,
    // error,
  } = useColor(`https://api.allorigins.win/raw?url=${encodeURIComponent(profilePath)}`, 'hex', {
    crossOrigin: 'anonymous',
  });
  let colorDarkenLighten = '';
  if (isDark) {
    colorDarkenLighten = !tinycolor(data).isLight()
      ? tinycolor(data).brighten(70).saturate(70).toString()
      : tinycolor(data).saturate(70).toString();
  } else {
    colorDarkenLighten = !tinycolor(data).isDark()
      ? tinycolor(data).darken().saturate(100).toString()
      : tinycolor(data).saturate(70).toString();
  }
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
              {name}
            </Text>
          </Row>
          {/* {overview && (
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
      </Grid.Container> */}
        </>
      )}
    </Grid.Container>
  );
};

const CardItem = ({ item }: { item: IPeople }) => {
  const [style, setStyle] = React.useState<React.CSSProperties>({ display: 'block' });
  const { isDark } = useTheme();
  // TODO: add spinner on loading color
  const { name } = item;
  const profilePath = TMDB?.profileUrl(item?.profile_path || '', 'w185');
  const {
    data,
    loading,
    // error,
  } = useColor(`https://api.allorigins.win/raw?url=${encodeURIComponent(profilePath)}`, 'hex', {
    crossOrigin: 'anonymous',
  });
  let colorDarkenLighten = '';
  if (isDark) {
    colorDarkenLighten = !tinycolor(data).isLight()
      ? tinycolor(data).brighten(70).saturate(70).toString()
      : tinycolor(data).saturate(70).toString();
  } else {
    colorDarkenLighten = !tinycolor(data).isDark()
      ? tinycolor(data).darken().saturate(100).toString()
      : tinycolor(data).saturate(70).toString();
  }

  return (
    <Tooltip
      placement="bottom"
      content={<CardItemHover item={item} />}
      rounded
      shadow
      className="!w-fit"
    >
      <Card
        as="div"
        variant="flat"
        css={{ borderWidth: 0 }}
        onMouseEnter={() => {
          setStyle({ display: 'none' });
        }}
        onMouseLeave={() => {
          setStyle({ display: 'block' });
        }}
        className={isDark ? 'bg-black/70' : 'bg-white/70'}
      >
        <Card.Image
          src={profilePath}
          objectFit="cover"
          width="100%"
          height={340}
          alt="Card image background"
        />
        <Card.Footer
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
          {loading ? (
            <Loading type="points-opacity" />
          ) : (
            <Text
              size={14}
              b
              transform="uppercase"
              color={colorDarkenLighten}
              css={{
                '@xs': {
                  fontSize: '16px',
                },
                '@sm': {
                  fontSize: '18px',
                },
              }}
            >
              {name}
            </Text>
          )}
        </Card.Footer>
      </Card>
    </Tooltip>
  );
};

const PeopleItem = (props: IPeopleItem) => {
  const { item } = props;
  return <CardItem item={item} />;
};

export default PeopleItem;
