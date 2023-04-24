import { cnBase } from 'tailwind-variants';

import { H6 } from '~/components/styles/Text.styles';
import AnilistStatIcon from '~/assets/icons/AnilistStatIcon';

interface IRatingProps {
  rating: number | string | undefined;
  ratingType?: 'movie' | 'tv' | 'anime' | 'people';
  color?: string;
  className?: string;
}

const Rating = (props: IRatingProps) => {
  const { rating, ratingType, color, className } = props;
  if (ratingType === 'movie' || ratingType === 'tv') {
    return (
      <div className={cnBase('flex flex-row items-center gap-x-2', className)}>
        <H6
          h6
          weight="semibold"
          css={{
            backgroundColor: '#3ec2c2',
            borderRadius: '$xs',
            padding: '0 0.25rem 0 0.25rem',
            color: '#fff',
          }}
        >
          TMDb
        </H6>
        <H6 h6 weight="semibold" css={color ? { color } : {}}>
          {rating}
        </H6>
      </div>
    );
  }
  return (
    <div className={cnBase('flex flex-row items-center gap-x-2', className)}>
      {Number(rating) > 75 ? (
        <AnilistStatIcon stat="good" />
      ) : Number(rating) > 60 ? (
        <AnilistStatIcon stat="average" />
      ) : (
        <AnilistStatIcon stat="bad" />
      )}
      <H6 weight="semibold" css={color ? { color } : {}}>
        {rating}%
      </H6>
    </div>
  );
};

export default Rating;
