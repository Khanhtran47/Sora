/* eslint-disable no-nested-ternary */
import { Spacer } from '@nextui-org/react';
import AnilistStatIcon from '~/src/assets/icons/AnilistStatIcon.js';

import { H5 } from '~/src/components/styles/Text.styles';

interface IRatingProps {
  rating: number;
  ratingType?: 'movie' | 'tv' | 'anime' | 'people';
}

const Rating = (props: IRatingProps) => {
  const { rating, ratingType } = props;
  if (ratingType === 'movie' || ratingType === 'tv') {
    return (
      <>
        <H5
          h5
          weight="bold"
          css={{
            backgroundColor: '#3ec2c2',
            borderRadius: '$xs',
            padding: '0 0.25rem 0 0.25rem',
            marginRight: '0.5rem',
          }}
        >
          TMDb
        </H5>
        <H5 h5 weight="bold">
          {rating}
        </H5>
      </>
    );
  }
  return (
    <>
      {Number(rating) > 75 ? (
        <AnilistStatIcon stat="good" />
      ) : Number(rating) > 60 ? (
        <AnilistStatIcon stat="average" />
      ) : (
        <AnilistStatIcon stat="bad" />
      )}
      <Spacer x={0.25} />
      <H5 weight="bold">{rating}%</H5>
    </>
  );
};

export default Rating;
