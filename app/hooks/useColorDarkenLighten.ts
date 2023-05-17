import { useMemo } from 'react';
import { useTheme } from '@nextui-org/react';
import tinycolor from 'tinycolor2';

/**
 * It takes a color and returns a darkenLightenColor, backgroundColor, backgroundInvestColor, and
 * saturatedColor based on the color's brightness and the theme's isDark value.
 * @param {string} [color] - the color you want to darken or lighten
 * @returns An object with the following properties:
 */
export default function useColorDarkenLighten(color?: string) {
  const { isDark } = useTheme();
  const brightnessColor = (tinycolor(color).getBrightness() / 255) * 100;
  const darkenLightenColor = useMemo(() => {
    if (isDark) {
      return brightnessColor > 70
        ? tinycolor(color)
            .darken(brightnessColor - 70)
            .toString()
        : tinycolor(color)
            .lighten(70 - brightnessColor)
            .toString();
    }
    return brightnessColor > 30
      ? tinycolor(color)
          .darken(brightnessColor - 30)
          .toString()
      : tinycolor(color)
          .lighten(30 - brightnessColor)
          .toString();
  }, [brightnessColor, color, isDark]);

  const backgroundColor = useMemo(() => {
    if (isDark) {
      return brightnessColor > 30
        ? tinycolor(color)
            .darken(brightnessColor - 30)
            .toString()
        : tinycolor(color)
            .lighten(30 - brightnessColor)
            .toString();
    }
    return brightnessColor > 70
      ? tinycolor(color)
          .darken(brightnessColor - 70)
          .toString()
      : tinycolor(color)
          .lighten(70 - brightnessColor)
          .toString();
  }, [brightnessColor, color, isDark]);

  const backgroundInvertColor = useMemo(() => {
    if (isDark) {
      return brightnessColor > 30
        ? tinycolor(color)
            .darken(brightnessColor - 30)
            .spin(180)
            .toString()
        : tinycolor(color)
            .lighten(30 - brightnessColor)
            .spin(180)
            .toString();
    }
    return brightnessColor > 70
      ? tinycolor(color)
          .darken(brightnessColor - 70)
          .spin(180)
          .toString()
      : tinycolor(color)
          .lighten(70 - brightnessColor)
          .spin(180)
          .toString();
  }, [brightnessColor, color, isDark]);

  const saturatedColor = useMemo(() => {
    if (isDark) {
      return brightnessColor > 70
        ? tinycolor(color)
            .darken(brightnessColor - 70)
            .saturate(70)
            .toString()
        : tinycolor(color)
            .lighten(70 - brightnessColor)
            .saturate(70)
            .toString();
    }
    return brightnessColor > 30
      ? tinycolor(color)
          .darken(brightnessColor - 30)
          .saturate(70)
          .toString()
      : tinycolor(color)
          .lighten(30 - brightnessColor)
          .saturate(70)
          .toString();
  }, [brightnessColor, color, isDark]);

  const invertColor = useMemo(() => {
    if (isDark) {
      return brightnessColor > 70
        ? tinycolor(color)
            .darken(brightnessColor - 70)
            .saturate(70)
            .spin(180)
            .toString()
        : tinycolor(color)
            .lighten(70 - brightnessColor)
            .saturate(70)
            .spin(180)
            .toString();
    }
    return brightnessColor > 30
      ? tinycolor(color)
          .darken(brightnessColor - 30)
          .saturate(70)
          .spin(180)
          .toString()
      : tinycolor(color)
          .lighten(30 - brightnessColor)
          .saturate(70)
          .spin(180)
          .toString();
  }, [brightnessColor, color, isDark]);

  return {
    isDark,
    darkenLightenColor,
    backgroundColor,
    backgroundInvertColor,
    saturatedColor,
    invertColor,
  };
}
