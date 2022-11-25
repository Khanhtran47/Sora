import { useTheme } from '@nextui-org/react';
import { useColor } from 'color-thief-react';
import tinycolor from 'tinycolor2';

/**
 * This hook returns lighten or darken color of a poster image
 * @param imageUrl the path to poster image
 * @returns an object containing isDark, loading, error colorDarkenLighten
 */
export default function useColorDarkenLighten(imageUrl?: string) {
  const { isDark } = useTheme();

  const { data, loading, error } = useColor(
    `https://corsproxy.io/?${encodeURIComponent(imageUrl || '')}`,
    'hex',
    {
      crossOrigin: 'anonymous',
    },
  );
  let colorDarkenLighten = '';
  let colorBackground = '';
  if (isDark) {
    colorDarkenLighten = !tinycolor(data).isLight()
      ? tinycolor(data).brighten(70).saturate(70).toString()
      : tinycolor(data).saturate(70).toString();
    colorBackground = !tinycolor(data).isLight()
      ? tinycolor(data).saturate(70).spin(180).toString()
      : tinycolor(data).darken(70).saturate(70).spin(180).toString();
  } else {
    colorDarkenLighten = !tinycolor(data).isDark()
      ? tinycolor(data).darken().saturate(100).toString()
      : tinycolor(data).saturate(70).toString();
    colorBackground = !tinycolor(data).isDark()
      ? tinycolor(data).saturate(70).spin(180).toString()
      : tinycolor(data).brighten(70).saturate(70).spin(180).toString();
  }

  return { isDark, loading, error, colorDarkenLighten, colorBackground };
}
