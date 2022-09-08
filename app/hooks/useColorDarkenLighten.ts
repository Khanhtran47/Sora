import { useTheme } from '@nextui-org/react';
import { useColor } from 'color-thief-react';
import tinycolor from 'tinycolor2';

/**
 * This hook returns lighten or darken color of a poster image
 * @param posterPath the path to poster image
 * @returns an object containing isDark, loading, error colorDarkenLighten
 */
export default function useColorDarkenLighten(posterPath?: string) {
  const { isDark } = useTheme();

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

  return { isDark, loading, error, colorDarkenLighten };
}
