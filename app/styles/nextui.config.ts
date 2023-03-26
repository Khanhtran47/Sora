import { createTheme } from '@nextui-org/react';

export const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      backgroundTransparent: 'rgba(0, 0, 0, 0)',
      backgroundAlpha: 'rgba(255, 255, 255, 0.5)',
      backgroundLight: 'rgba(255, 255, 255, 0.2)',
      backgroundContrast: '#f6f7ff',
      backgroundContrastAlpha: 'rgba(246, 247, 255, 0.6)',
      backgroundContrastLight: 'rgba(246, 247, 255, 0.2)',
      textAlpha: 'rgba(17, 24, 28, 0.6)',
    },
  },
});

export const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      backgroundTransparent: 'rgba(0, 0, 0, 0)',
      backgroundAlpha: 'rgba(0, 0, 0, 0.6)',
      backgroundLight: 'rgba(0, 0, 0, 0.2)',
      backgroundContrastAlpha: 'rgba(22, 24, 26, 0.6)',
      backgroundContrastLight: 'rgba(22, 24, 26, 0.2)',
      textAlpha: 'rgba(236, 237, 238, 0.6)',
    },
  },
});

export const bumblebeeTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      // background colors
      background: '#FEFAEA',
      backgroundAlpha: 'rgb(254, 250, 234, 0.5)',
      backgroundLight: 'rgb(254, 250, 234, 0.2)',
      backgroundContrast: '#fffdf4',
      backgroundContrastAlpha: 'rgba(255,253,244, 0.6)',
      backgroundContrastLight: 'rgba(255,253,244, 0.2)',
      foreground: '$black',
      backgroundTransparent: 'rgba(0, 0, 0, 0)',
      textAlpha: 'rgba(17, 24, 28, 0.6)',

      // brand colors
      primaryLight: '#FBEAAB',
      primaryLightHover: '#F5D880',
      primaryLightActive: '#ECC45F',
      primaryLightContrast: '#C08921',
      primary: '#C08921',
      primaryBorder: '#E0A82E',
      primaryBorderHover: '#C08921',
      primarySolidHover: '#A16C17',
      primarySolidContrast: '$white',
      primaryShadow: '#E0A82E',

      secondaryLight: '#FEF4AB',
      secondaryLightHover: '#FDEC81',
      secondaryLightActive: '#FBE462',
      secondaryLightContrast: '#D6B422',
      secondary: '#D6B422',
      secondaryBorder: '#F9D72F',
      secondaryBorderHover: '#D6B422',
      secondarySolidHover: '#B39317',
      secondarySolidContrast: '$white',
      secondaryShadow: '#F9D72F',

      gradient: 'linear-gradient(112deg,#D6B422 -20.3%, #C08921 70.46%)',
      link: '#A16C17',
    },
  },
  className: 'bumblebee-theme',
});

export const autumnTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      // background colors
      background: '#FCE6E3',
      backgroundAlpha: 'rgba(252, 230, 227, 0.5)',
      backgroundLight: 'rgba(252, 230, 227, 0.2)',
      foreground: '$black',
      backgroundContrast: '#fff2f2',
      backgroundContrastAlpha: 'rgba(255,242,242, 0.6)',
      backgroundContrastLight: 'rgba(255,242,242, 0.2)',
      backgroundTransparent: 'rgba(0, 0, 0, 0)',
      textAlpha: 'rgba(17, 24, 28, 0.6)',

      // brand colors
      primaryLight: '#F39694',
      primaryLightHover: '#DC5B63',
      primaryLightActive: '#BA3148',
      primaryLightContrast: '#78022C',
      primary: '#78022C',
      primaryBorder: '#8C0327',
      primaryBorderHover: '#78022C',
      primarySolidHover: '#64012E',
      primarySolidContrast: '$white',
      primaryShadow: '#8C0327',

      secondaryLight: '#FBCDBC',
      secondaryLightHover: '#F3A898',
      secondaryLightActive: '#E7857B',
      secondaryLightContrast: '#B93B45',
      secondary: '#B93B45',
      secondaryBorder: '#D85251',
      secondaryBorderHover: '#B93B45',
      secondarySolidHover: '#9B283B',
      secondarySolidContrast: '$white',
      secondaryShadow: '#D85251',

      success: '#499380',
      warning: '#E97F14',
      error: '#DF1A2F',
      gradient: 'linear-gradient(112deg,#B93B45 -20.3%, #78022C 70.46%)',
      link: '#64012E',
    },
  },
  className: 'autumn-theme',
});

export const retroTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      // background colors
      background: '#e2d8b3',
      backgroundAlpha: 'rgb(226, 216, 179, 0.5)',
      backgroundLight: 'rgb(226, 216, 179, 0.2)',
      foreground: '$black',
      backgroundContrast: '#c8bb9e',
      backgroundContrastAlpha: 'rgba(200,187,158, 0.6)',
      backgroundContrastLight: 'rgba(200,187,158, 0.2)',
      backgroundTransparent: 'rgba(0, 0, 0, 0)',
      textAlpha: 'rgba(17, 24, 28, 0.6)',

      // brand colors
      primaryLight: '#FDE2D7',
      primaryLightHover: '#FACDC1',
      primaryLightActive: '#F5B9B0',
      primaryLightContrast: '#CD6C70',
      primary: '#CD6C70',
      primaryBorder: '#EF9995',
      primaryBorderHover: '#CD6C70',
      primarySolidHover: '#AC4B57',
      primarySolidContrast: '$white',
      primaryShadow: '#EF9995',

      secondaryLight: '#E6F9E8',
      secondaryLightHover: '#D3EFD9',
      secondaryLightActive: '#BFDFC9',
      secondaryLightContrast: '#77AE93',
      secondary: '#77AE93',
      secondaryBorder: '#A4CBB4',
      secondaryBorderHover: '#77AE93',
      secondarySolidHover: '#529279',
      secondarySolidContrast: '$white',
      secondaryShadow: '#A4CBB4',

      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
      gradient: 'linear-gradient(112deg,#77AE93 -20.3%, #CD6C70 70.46%)',
      link: '#AC4B57',
    },
  },
  className: 'retro-theme',
});

export const synthwaveTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      // background
      background: '#2d365f',
      backgroundAlpha: 'rgb(45, 54, 95, 0.6)',
      backgroundLight: 'rgb(45, 54, 95, 0.2)',
      foreground: '#d1c7db',
      backgroundContrast: '#1F1A23',
      backgroundContrastAlpha: 'rgba(31,26,35, 0.6)',
      backgroundContrastLight: 'rgba(31,26,35, 0.2)',
      backgroundTransparent: 'rgba(255, 255, 255, 0)',
      textAlpha: 'rgba(236, 237, 238, 0.6)',

      // brand colors
      primaryLight: '#FEAEC9',
      primaryLightHover: '#FC86B9',
      primaryLightActive: '#FA67B5',
      primaryLightContrast: '#D427A5',
      primary: '#D427A5',
      primaryBorder: '#F736B0',
      primaryBorderHover: '#D427A5',
      primarySolidHover: '#B11B98',
      primarySolidContrast: '$white',
      primaryShadow: '#F736B0',

      secondaryLight: '#BDF8FD',
      secondaryLightHover: '#9BEDFB',
      secondaryLightActive: '#81DEF7',
      secondaryLightContrast: '#409ED0',
      secondary: '#409ED0',
      secondaryBorder: '#58C7F3',
      secondaryBorderHover: '#409ED0',
      secondarySolidHover: '#2C78AE',
      secondarySolidContrast: '$white',
      secondaryShadow: '#58C7F3',

      success: '#2DB4A4',
      warning: '#DAA507',
      error: '#FA1B0F',
      gradient: 'linear-gradient(112deg,#409ED0 -20.3%, #D427A5 70.46%)',
      link: '#B11B98',
    },
  },
  className: 'synthwave-theme',
});

export const nightTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      // background
      background: '#101729',
      backgroundAlpha: 'rgb(16, 23, 41, 0.6)',
      backgroundLight: 'rgb(16, 23, 41, 0.2)',
      foreground: '$white',
      backgroundContrast: '#1E293B',
      backgroundContrastAlpha: 'rgba(30,41,59, 0.6)',
      backgroundContrastLight: 'rgba(30,41,59, 0.2)',
      backgroundTransparent: 'rgba(255, 255, 255, 0)',
      text: '#b6c5f0',
      textAlpha: 'rgba(182, 197, 240, 0.6)',

      // brand colors
      primaryLight: '#AFF5FE',
      primaryLightHover: '#87E8FC',
      primaryLightActive: '#69D7FA',
      primaryLightContrast: '#2894D5',
      primary: '#2894D5',
      primaryBorder: '#38BDF8',
      primaryBorderHover: '#2894D5',
      primarySolidHover: '#1C70B2',
      primarySolidContrast: '$white',
      primaryShadow: '#38BDF8',

      secondaryLight: '#CDD3FE',
      secondaryLightHover: '#B4BCFC',
      secondaryLightActive: '#A0A9FA',
      secondaryLightContrast: '#5E68D5',
      secondary: '#5E68D5',
      secondaryBorder: '#818CF8',
      secondaryBorderHover: '#5E68D5',
      secondarySolidHover: '#4149B2',
      secondarySolidContrast: '$white',
      secondaryShadow: '#818CF8',

      success: '#2DB4A4',
      warning: '#DAA507',
      error: '#FA1B0F',
      gradient: 'linear-gradient(112deg,#5E68D5 -20.3%, #2894D5 70.46%)',
      link: '#1C70B2',
    },
  },
  className: 'night-theme',
});

export const draculaTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      // background
      background: '#272935',
      backgroundAlpha: 'rgb(39, 41, 53, 0.6)',
      backgroundLight: 'rgb(39, 41, 53, 0.2)',
      foreground: '#f8f8f2',
      backgroundContrast: '#414558',
      backgroundContrastAlpha: 'rgba(65,69,88, 0.6)',
      backgroundContrastLight: 'rgba(65,69,88, 0.2)',
      backgroundTransparent: 'rgba(255, 255, 255, 0)',
      textAlpha: 'rgba(236, 237, 238, 0.6)',

      // brand colors
      primaryLight: '#FFC9D8',
      primaryLightHover: '#FFAECC',
      primaryLightActive: '#FF9ACA',
      primaryLightContrast: '#DB58B0',
      primary: '#DB58B0',
      primaryBorder: '#FF79C6',
      primaryBorderHover: '#DB58B0',
      primarySolidHover: '#B73C9B',
      primarySolidContrast: '$white',
      primaryShadow: '#FF79C6',

      secondaryLight: '#EBD4FE',
      secondaryLightHover: '#DDBEFD',
      secondaryLightActive: '#D1AEFB',
      secondaryLightContrast: '#926BD6',
      secondary: '#926BD6',
      secondaryBorder: '#BD93F9',
      secondaryBorderHover: '#926BD6',
      secondarySolidHover: '#6C4AB3',
      secondarySolidContrast: '$white',
      secondaryShadow: '#BD93F9',

      success: '#50fa7b',
      warning: '#f1fa8c',
      error: '#ff5555',
      gradient: 'linear-gradient(112deg,#926BD6 -20.3%, #DB58B0 70.46%)',
      link: '#B73C9B',
    },
  },
  className: 'dracula-theme',
});
