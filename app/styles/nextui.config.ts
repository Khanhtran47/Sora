import { createTheme } from '@nextui-org/react';

export const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      backgroundTransparent: 'rgba(255, 255, 255, 0)',
    },
  },
});

export const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      backgroundTransparent: 'rgba(0, 0, 0, 0)',
    },
  },
});

export const bumblebeeTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      // background colors
      background: '$white',
      backgroundAlpha: 'rgba(255, 255, 255, 0.8)',
      foreground: '$black',
      backgroundContrast: '$white',
      backgroundTransparent: 'rgba(0, 0, 0, 0)',

      // brand colors
      primaryLight: '#FBEAAB',
      primaryLightHover: '#F5D880',
      primaryLightActive: '#ECC45F',
      primaryLightContrast: '#C08921',
      primary: '#e0a82e',
      primaryBorder: '#E0A82E',
      primaryBorderHover: '#C08921',
      primarySolidHover: '#A16C17',
      primarySolidContrast: '$white',
      primaryShadow: '#E0A82E',

      secondaryLight: '#FEFAD5',
      secondaryLightHover: '#FEF4AB',
      secondaryLightActive: '#FDEC81',
      secondaryLightContrast: '#90730E',
      secondary: '#f9d72f',
      secondaryBorder: '#F9D72F',
      secondaryBorderHover: '#D6B422',
      secondarySolidHover: '#B39317',
      secondaryShadow: '#F9D72F',
    },
  },
  className: 'bumblebee-theme',
});

export const autumnTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      // background colors
      background: '#f1f1f1',
      backgroundAlpha: 'rgba(255, 255, 255, 0.8)',
      foreground: '$black',
      backgroundContrast: '#826A5C',
      backgroundTransparent: 'rgba(0, 0, 0, 0)',

      // brand colors
      primaryLight: '#F39694',
      primaryLightHover: '#DC5B63',
      primaryLightActive: '#BA3148',
      primaryLightContrast: '#78022C',
      primary: '#8C0327',
      primaryBorder: '#8C0327',
      primaryBorderHover: '#78022C',
      primarySolidHover: '#64012E',
      primarySolidContrast: '$white',
      primaryShadow: '#8C0327',

      secondaryLight: '#FDE8DD',
      secondaryLightHover: '#FBCDBC',
      secondaryLightActive: '#F3A898',
      secondaryLightContrast: '#7D1932',
      secondary: '#D85251',
      secondaryBorder: '#D85251',
      secondaryBorderHover: '#B93B45',
      secondarySolidHover: '#9B283B',
      secondaryShadow: '#D85251',

      success: '#499380',
      warning: '#E97F14',
      error: '#DF1A2F',
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
      backgroundAlpha: 'rgb(226, 216, 179, 0.8)',
      foreground: '$black',
      backgroundContrast: '#7d7259',
      backgroundTransparent: 'rgba(0, 0, 0, 0)',

      // brand colors
      primaryLight: '#FDE2D7',
      primaryLightHover: '#FACDC1',
      primaryLightActive: '#F5B9B0',
      primaryLightContrast: '#CD6C70',
      primary: '#ef9995',
      primaryBorder: '#EF9995',
      primaryBorderHover: '#CD6C70',
      primarySolidHover: '#AC4B57',
      primarySolidContrast: '$white',
      primaryShadow: '#EF9995',

      secondaryLight: '#F2FCF2',
      secondaryLightHover: '#E6F9E8',
      secondaryLightActive: '#D3EFD9',
      secondaryLightContrast: '#347562',
      secondary: '#a4cbb4',
      secondaryBorder: '#A4CBB4',
      secondaryBorderHover: '#77AE93',
      secondarySolidHover: '#529279',
      secondaryShadow: '#A4CBB4',

      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
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
      foreground: '#d1c7db',
      backgroundContrast: '#1F1A23',
      backgroundTransparent: 'rgba(255, 255, 255, 0)',

      // brand colors
      primaryLight: '#FEAEC9',
      primaryLightHover: '#FC86B9',
      primaryLightActive: '#FA67B5',
      primaryLightContrast: '#D427A5',
      primary: '#f736b0',
      primaryBorder: '#F736B0',
      primaryBorderHover: '#D427A5',
      primarySolidHover: '#B11B98',
      primarySolidContrast: '$white',
      primaryShadow: '#F736B0',

      secondaryLight: '#DDFEFE',
      secondaryLightHover: '#BDF8FD',
      secondaryLightActive: '#9BEDFB',
      secondaryLightContrast: '#1C558C',
      secondary: '#58c7f3',
      secondaryBorder: '#58C7F3',
      secondaryBorderHover: '#409ED0',
      secondarySolidHover: '#2C78AE',
      secondaryShadow: '#58C7F3',

      success: '#2DB4A4',
      warning: '#DAA507',
      error: '#FA1B0F',
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
      foreground: '$white',
      backgroundContrast: '#1E293B',
      backgroundTransparent: 'rgba(255, 255, 255, 0)',

      // brand colors
      primaryLight: '#AFF5FE',
      primaryLightHover: '#87E8FC',
      primaryLightActive: '#69D7FA',
      primaryLightContrast: '#2894D5',
      primary: '#38bdf8',
      primaryBorder: '#38BDF8',
      primaryBorderHover: '#2894D5',
      primarySolidHover: '#1C70B2',
      primarySolidContrast: '$white',
      primaryShadow: '#38BDF8',

      secondaryLight: '#E6E9FE',
      secondaryLightHover: '#CDD3FE',
      secondaryLightActive: '#B4BCFC',
      secondaryLightContrast: '#292F8F',
      secondary: '#818CF8',
      secondaryBorder: '#818CF8',
      secondaryBorderHover: '#5E68D5',
      secondarySolidHover: '#4149B2',
      secondaryShadow: '#818CF8',

      success: '#2DB4A4',
      warning: '#DAA507',
      error: '#FA1B0F',
      text: '#b6c5f0',
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
      foreground: '#f8f8f2',
      backgroundContrast: '#414558',
      backgroundTransparent: 'rgba(255, 255, 255, 0)',

      // brand colors
      primaryLight: '#FFC9D8',
      primaryLightHover: '#FFAECC',
      primaryLightActive: '#FF9ACA',
      primaryLightContrast: '#DB58B0',
      primary: '#ff79c6',
      primaryBorder: '#FF79C6',
      primaryBorderHover: '#DB58B0',
      primarySolidHover: '#B73C9B',
      primarySolidContrast: '$white',
      primaryShadow: '#FF79C6',

      secondaryLight: '#F5E9FE',
      secondaryLightHover: '#EBD4FE',
      secondaryLightActive: '#DDBEFD',
      secondaryLightContrast: '#4A2E90',
      secondary: '#bd93f9',
      secondaryBorder: '#BD93F9',
      secondaryBorderHover: '#926BD6',
      secondarySolidHover: '#6C4AB3',
      secondaryShadow: '#BD93F9',

      success: '#50fa7b',
      warning: '#f1fa8c',
      error: '#ff5555',
    },
  },
  className: 'dracula-theme',
});
