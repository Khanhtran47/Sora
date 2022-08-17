import { useColor } from 'color-thief-react';
import tinycolor from 'tinycolor2';

const useColorImage = (posterPath?: string, isDark?: boolean) => {
  const { data, loading, error } = useColor(
    `https://api.allorigins.win/raw?url=${encodeURIComponent(posterPath || '')}`,
    'hex',
    {
      crossOrigin: 'anonymous',
    },
  );
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

  return { data, loading, error, colorDarkenLighten };
};

export default useColorImage;
