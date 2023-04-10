/* eslint-disable no-nested-ternary */
import { Spacer } from '@nextui-org/react';
import AnilistStatIcon from '~/assets/icons/AnilistStatIcon';

import { H6 } from '~/components/styles/Text.styles';
import Flex from '~/components/styles/Flex.styles';

interface IRatingProps {
  rating: number | string | undefined;
  ratingType?: 'movie' | 'tv' | 'anime' | 'people';
  color?: string;
}

const Rating = (props: IRatingProps) => {
  const { rating, ratingType, color } = props;
  if (ratingType === 'movie' || ratingType === 'tv') {
    return (
      <Flex direction="row" align="center">
        <H6
          h6
          weight="semibold"
          css={{
            backgroundColor: '#3ec2c2',
            borderRadius: '$xs',
            padding: '0 0.25rem 0 0.25rem',
            marginRight: '0.5rem',
            color: '#fff',
          }}
        >
          TMDb
        </H6>
        <H6 h6 weight="semibold" css={color ? { color } : {}}>
          {rating}
        </H6>
      </Flex>
    );
  }
  return (
    <Flex direction="row" align="center">
      {Number(rating) > 75 ? (
        <AnilistStatIcon stat="good" />
      ) : Number(rating) > 60 ? (
        <AnilistStatIcon stat="average" />
      ) : (
        <AnilistStatIcon stat="bad" />
      )}
      <Spacer x={0.25} />
      <H6 weight="semibold">{rating}%</H6>
    </Flex>
  );
};

export default Rating;
