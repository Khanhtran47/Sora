import { useLocalStorageValue } from '@react-hookz/web';

function useSoraSettings() {
  const currentSubtitleFontColor = useLocalStorageValue('sora_settings-subtitle-font_color', {
    defaultValue: 'White',
  });
  const currentSubtitleFontSize = useLocalStorageValue('sora_settings-subtitle-font_size', {
    defaultValue: '100%',
  });
  const currentSubtitleBackgroundColor = useLocalStorageValue(
    'sora_settings-subtitle-background_color',
    {
      defaultValue: 'Black',
    },
  );
  const currentSubtitleBackgroundOpacity = useLocalStorageValue(
    'sora_settings-subtitle-background_opacity',
    {
      defaultValue: '0%',
    },
  );
  const currentSubtitleWindowColor = useLocalStorageValue('sora_settings-subtitle-window_color', {
    defaultValue: 'Black',
  });
  const currentSubtitleWindowOpacity = useLocalStorageValue(
    'sora_settings-subtitle-window_opacity',
    {
      defaultValue: '0%',
    },
  );
  const currentSubtitleTextEffects = useLocalStorageValue('sora_settings-subtitle-text_effect', {
    defaultValue: 'Outline',
  });
  const autoShowSubtitle = useLocalStorageValue('sora_settings-subtitle-auto_show', {
    defaultValue: false,
  });
  // const showFilter = useLocalStorageValue('sora_settings-layout-show-filter', {
  //   defaultValue: false,
  //   initializeWithValue: false,
  // });
  const isMutedTrailer = useLocalStorageValue('sora_settings-list-mute_trailer', {
    defaultValue: true,
    initializeWithValue: false,
  });
  const isPlayTrailer = useLocalStorageValue('sora_settings-list-play_trailer', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const isFetchLogo = useLocalStorageValue('sora_settings-list-fetch_logo', {
    defaultValue: false,
  });
  const isShowSpotlight = useLocalStorageValue('sora_settings-list-show_spotlight', {
    defaultValue: false,
  });
  const isAutoSize = useLocalStorageValue('sora_settings-player-auto_size', {
    defaultValue: false,
  });
  const isPicInPic = useLocalStorageValue('sora_settings-player-pic_in_pic', {
    defaultValue: true,
  });
  const isMuted = useLocalStorageValue('sora_settings-player-mute', {
    defaultValue: false,
  });
  const isAutoPlay = useLocalStorageValue('sora_settings-player-auto_play', {
    defaultValue: false,
  });
  const isAutoMini = useLocalStorageValue('sora_settings-player-auto_mini', {
    defaultValue: false,
  });
  const isLoop = useLocalStorageValue('sora_settings-player-loop', {
    defaultValue: false,
  });
  const isScreenshot = useLocalStorageValue('sora_settings-player-screenshot', {
    defaultValue: true,
  });
  const isMiniProgressBar = useLocalStorageValue('sora_settings-player-mini_progress_bar', {
    defaultValue: true,
  });
  const isAutoPlayback = useLocalStorageValue('sora_settings-player-auto_playback', {
    defaultValue: true,
  });
  const isAutoPlayNextEpisode = useLocalStorageValue(
    'sora_settings-player-auto_play_next_episode',
    {
      defaultValue: true,
    },
  );
  const isShowSkipOpEdButton = useLocalStorageValue('sora_settings-player-show_skip_op_ed_button', {
    defaultValue: true,
  });
  const isAutoSkipOpEd = useLocalStorageValue('sora_settings-player-auto_skip_op_ed', {
    defaultValue: false,
  });
  const isFastForward = useLocalStorageValue('sora_settings-player-fast_forward', {
    defaultValue: true,
  });
  // const isSwipeFullscreen = useLocalStorageValue('sora_settings_player-gestures_swipe-fullscreen', {
  //   defaultValue: false,
  // });
  const sidebarStyleMode = useLocalStorageValue('sora_settings-layout-sidebar-style_mode', {
    defaultValue: 'rounded-all',
  });
  const sidebarMiniMode = useLocalStorageValue('sora_settings-layout-sidebar-mini_mode', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const sidebarHoverMode = useLocalStorageValue('sora_settings-layout-sidebar-hover_mode', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const sidebarBoxedMode = useLocalStorageValue('sora_settings-layout-sidebar-boxed_mode', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const sidebarSheetMode = useLocalStorageValue('sora_settings-layout-sidebar-sheet_mode', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const listViewType = useLocalStorageValue<'table' | 'card' | 'detail'>(
    'sora_settings-layout-list_view',
    {
      defaultValue: 'card',
      initializeWithValue: false,
    },
  );
  const listLoadingType = useLocalStorageValue('sora_settings-layout-list-loading_type', {
    defaultValue: 'pagination',
    initializeWithValue: false,
  });
  const autoSwitchSubtitle = useLocalStorageValue('sora_settings-subtitle-auto_switch', {
    defaultValue: true,
  });
  const isShowBreadcrumb = useLocalStorageValue('sora_settings-layout-header-show_breadcrumb', {
    defaultValue: true,
    initializeWithValue: false,
  });
  const isShowTopPagination = useLocalStorageValue(
    'sora_settings-layout-list-show-top-pagination',
    {
      defaultValue: false,
      initializeWithValue: false,
    },
  );
  const isLightDarkThemeOnly = useLocalStorageValue('sora_settings-layout-theme-light_dark_only', {
    defaultValue: true,
  });
  const currentThemeColor = useLocalStorageValue('sora_settings-layout-theme-color', {
    defaultValue: 'blue',
    initializeWithValue: false,
  });

  return {
    currentSubtitleFontColor,
    currentSubtitleFontSize,
    currentSubtitleBackgroundColor,
    currentSubtitleBackgroundOpacity,
    currentSubtitleWindowColor,
    currentSubtitleWindowOpacity,
    autoShowSubtitle,
    // showFilter,
    isMutedTrailer,
    isPlayTrailer,
    isAutoSize,
    isPicInPic,
    isMuted,
    isAutoPlay,
    isAutoMini,
    isLoop,
    isScreenshot,
    isMiniProgressBar,
    isAutoPlayback,
    isAutoPlayNextEpisode,
    isShowSkipOpEdButton,
    isAutoSkipOpEd,
    isFastForward,
    // isSwipeFullscreen,
    currentSubtitleTextEffects,
    sidebarStyleMode,
    sidebarMiniMode,
    sidebarHoverMode,
    sidebarBoxedMode,
    sidebarSheetMode,
    listViewType,
    listLoadingType,
    autoSwitchSubtitle,
    isShowBreadcrumb,
    isShowTopPagination,
    isLightDarkThemeOnly,
    currentThemeColor,
    isFetchLogo,
    isShowSpotlight,
  };
}

export { useSoraSettings };
