import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import tinycolor from 'tinycolor2';

export default function useColorDarkenLighten(color?: string) {
  const { theme } = useTheme();
  const isDark = useMemo(() => {
    const darkTheme = [
      'dark',
      'synthwave',
      'dracula',
      'night',
      'halloween',
      'forest',
      'business',
      'coffee',
      'luxury',
    ];
    if (theme) {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return darkTheme.includes(theme) || theme.includes('dark');
    }
    return false;
  }, [theme]);
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
