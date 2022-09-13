/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import {
  Grid,
  Text,
  Row,
  Tooltip,
  Loading,
  Spacer,
  Avatar,
  styled,
  useTheme,
} from '@nextui-org/react';
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
  // const [style, setStyle] = React.useState<React.CSSProperties>({ display: 'block' });
  const { isDark } = useTheme();
  const { name } = item;
  const profilePath = TMDB?.profileUrl(item?.profile_path || '', 'w185');
  const {
    data,
    // loading,
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
  const CustomAvatar = styled(Avatar, {
    variants: {
      color: {
        customColor: {
          '.nextui-avatar-bg': {
            bg: colorDarkenLighten,
          },
        },
      },
    },
  });

  return (
    <>
      <CustomAvatar
        css={{
          size: '$40',
          cursor: 'pointer',
        }}
        src={profilePath}
        color="customColor"
        bordered
        zoomed
        alt={name}
        title={name}
      />
      <Spacer y={1} />
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
            width: '100%',
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
          {name}
        </Text>
      </Tooltip>
    </>
  );
};

const PeopleItem = (props: IPeopleItem) => {
  const { item } = props;
  return <CardItem item={item} />;
};

export default PeopleItem;
