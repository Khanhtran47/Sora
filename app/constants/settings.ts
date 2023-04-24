const settingsTab = [
  {
    id: 'general-tab',
    title: 'general',
    disabled: false,
  },
  {
    id: 'appearance-tab',
    title: 'appearance',
    disabled: false,
  },
  // {
  //   id: 'account-tab',
  //   title: 'account',
  //   disabled: true,
  // },
  {
    id: 'player-tab',
    title: 'player',
    disabled: false,
  },
  {
    id: 'about-tab',
    title: 'about',
    disabled: false,
  },
];

const listThemes = [
  {
    id: 'light',
    title: 'Light',
    color: '#f6f7ff',
    colorHover: '#7b81b7',
  },
  {
    id: 'dark',
    title: 'Dark',
    color: '#16181a',
    colorHover: '#0b0e12',
  },
  {
    id: 'bumblebee',
    title: 'Bumblebee',
    color: '#C08921',
    colorHover: '#A16C17',
  },
  {
    id: 'synthwave',
    title: 'Synthwave',
    color: '#D427A5',
    colorHover: '#B11B98',
  },
  {
    id: 'retro',
    title: 'Retro',
    color: '#CD6C70',
    colorHover: '#AC4B57',
  },
  {
    id: 'dracula',
    title: 'Dracula',
    color: '#DB58B0',
    colorHover: '#B73C9B',
  },
  {
    id: 'autumn',
    title: 'Autumn',
    color: '#78022C',
    colorHover: '#64012E',
  },
  {
    id: 'night',
    title: 'Night',
    color: '#2894D5',
    colorHover: '#1C70B2',
  },
];

const listSubtitleFontColor = [
  'White',
  'Blue',
  'Purple',
  'Green',
  'Yellow',
  'Red',
  'Cyan',
  'Pink',
  'Black',
];

const listSubtitleFontSize = ['50%', '75%', '100%', '125%', '150%', '175%', '200%', '300%'];

const listSubtitleBackgroundColor = [
  'White',
  'Blue',
  'Purple',
  'Green',
  'Yellow',
  'Red',
  'Cyan',
  'Pink',
  'Black',
];

const listSubtitleBackgroundOpacity = ['0%', '25%', '50%', '75%', '100%'];

const listSubtitleWindowColor = [
  'White',
  'Blue',
  'Purple',
  'Green',
  'Yellow',
  'Red',
  'Cyan',
  'Pink',
  'Black',
];

const listSubtitleWindowOpacity = ['0%', '25%', '50%', '75%', '100%'];

const listSubtitleTextEffects = ['None', 'Drop Shadow', 'Raised', 'Depressed', 'Outline'];

const listSidebarActiveStyleMode = ['rounded-all', 'rounded-one-side', 'pill-all', 'pill-one-side'];
const listListViewType = ['card', 'detail', 'table'];
const listListLoadingType = ['pagination', 'infinite-scroll'];

export {
  settingsTab,
  listThemes,
  listSubtitleFontColor,
  listSubtitleFontSize,
  listSubtitleBackgroundColor,
  listSubtitleBackgroundOpacity,
  listSubtitleWindowColor,
  listSubtitleWindowOpacity,
  listSubtitleTextEffects,
  listSidebarActiveStyleMode,
  listListViewType,
  listListLoadingType,
};
