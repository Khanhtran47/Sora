import { useLocalStorageValue } from '@react-hookz/web';

function useSoraSettings() {
  const currentSubtitleFontColor = useLocalStorageValue('sora-settings_subtitle_font-color', {
    defaultValue: 'White',
  });
  const currentSubtitleFontSize = useLocalStorageValue('sora-settings_subtitle_font-size', {
    defaultValue: '100%',
  });
  const currentSubtitleBackgroundColor = useLocalStorageValue(
    'sora-settings_subtitle_background-color',
    {
      defaultValue: 'Black',
    },
  );
  const currentSubtitleBackgroundOpacity = useLocalStorageValue(
    'sora-settings_subtitle_background-opacity',
    {
      defaultValue: '0%',
    },
  );
  const currentSubtitleWindowColor = useLocalStorageValue('sora-settings_subtitle_window-color', {
    defaultValue: 'Black',
  });
  const currentSubtitleWindowOpacity = useLocalStorageValue(
    'sora-settings_subtitle_window-opacity',
    {
      defaultValue: '0%',
    },
  );
  const currentSubtitleTextEffects = useLocalStorageValue('sora-settings_subtitle_text-effect', {
    defaultValue: 'Outline',
  });
  const autoShowSubtitle = useLocalStorageValue('sora-settings_subtitle_auto-show', {
    defaultValue: false,
  });
  const showFilter = useLocalStorageValue('sora-settings_layout_show-filter', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const isMutedTrailer = useLocalStorageValue('sora-settings_experiments_mute-trailer', {
    defaultValue: true,
    initializeWithValue: false,
  });
  const isPlayTrailer = useLocalStorageValue('sora-settings_experiments_play-trailer', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const isAutoSize = useLocalStorageValue('sora-settings_player_auto-size', {
    defaultValue: false,
  });
  const isPicInPic = useLocalStorageValue('sora-settings_player_pic-in-pic', {
    defaultValue: true,
  });
  const isMuted = useLocalStorageValue('sora-settings_player_mute', {
    defaultValue: false,
  });
  const isAutoPlay = useLocalStorageValue('sora-settings_player_auto-play', {
    defaultValue: false,
  });
  const isAutoMini = useLocalStorageValue('sora-settings_player_auto-mini', {
    defaultValue: false,
  });
  const isLoop = useLocalStorageValue('sora-settings_player_loop', {
    defaultValue: false,
  });
  const isScreenshot = useLocalStorageValue('sora-settings_player_screenshot', {
    defaultValue: true,
  });
  const isMiniProgressbar = useLocalStorageValue('sora-settings_player_mini-progressbar', {
    defaultValue: true,
  });
  const isAutoPlayback = useLocalStorageValue('sora-settings_player_auto-playback', {
    defaultValue: true,
  });
  const isAutoPlayNextEpisode = useLocalStorageValue(
    'sora-settings_player_auto-play-next-episode',
    {
      defaultValue: true,
    },
  );
  const isShowSkipOpEdButton = useLocalStorageValue('sora-settings_player_show-skip-op-ed-button', {
    defaultValue: true,
  });
  const isAutoSkipOpEd = useLocalStorageValue('sora-settings_player_auto-skip-op-ed', {
    defaultValue: false,
  });
  const isFastForward = useLocalStorageValue('sora-settings_player-gestures_fast-forward', {
    defaultValue: true,
  });
  const isSwipeFullscreen = useLocalStorageValue('sora-settings_player-gestures_swipe-fullscreen', {
    defaultValue: false,
  });

  return {
    currentSubtitleFontColor,
    currentSubtitleFontSize,
    currentSubtitleBackgroundColor,
    currentSubtitleBackgroundOpacity,
    currentSubtitleWindowColor,
    currentSubtitleWindowOpacity,
    autoShowSubtitle,
    showFilter,
    isMutedTrailer,
    isPlayTrailer,
    isAutoSize,
    isPicInPic,
    isMuted,
    isAutoPlay,
    isAutoMini,
    isLoop,
    isScreenshot,
    isMiniProgressbar,
    isAutoPlayback,
    isAutoPlayNextEpisode,
    isShowSkipOpEdButton,
    isAutoSkipOpEd,
    isFastForward,
    isSwipeFullscreen,
    currentSubtitleTextEffects,
  };
}

// eslint-disable-next-line import/prefer-default-export
export { useSoraSettings };
