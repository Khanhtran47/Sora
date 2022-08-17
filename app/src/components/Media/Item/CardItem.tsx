import * as React from 'react';
import { Card, Loading, Tooltip, Text, useTheme } from '@nextui-org/react';
import { IMedia } from '~/services/tmdb/tmdb.types';
import useColorImage from '~/hooks/useColorImage';

import CardItemHover from './CartItemHover';

const CardItem = ({ item }: { item: IMedia }) => {
  const [style, setStyle] = React.useState<React.CSSProperties>({ display: 'block' });
  const { isDark } = useTheme();
  // TODO: add spinner on loading color
  const { title, posterPath } = item;
  const { loading, colorDarkenLighten } = useColorImage(posterPath, isDark);

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
          src={posterPath || ''}
          objectFit="cover"
          width="100%"
          height={340}
          alt="Card image background"
          showSkeleton
          maxDelay={10000}
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
              {title}
            </Text>
          )}
        </Card.Footer>
      </Card>
    </Tooltip>
  );
};

export default CardItem;
