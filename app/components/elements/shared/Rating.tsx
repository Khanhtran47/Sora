import { cnBase } from 'tailwind-variants';

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
        <h6 className="rounded-xl bg-[#3ec2c2] px-1 text-white">TMDb</h6>
        <h6 style={color ? { color } : {}}>{rating}</h6>
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
      <h6 style={color ? { color } : {}}>{rating}%</h6>
    </div>
  );
};

export default Rating;
