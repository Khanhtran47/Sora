export function setMetaThemeColor(color: string) {
  const metaThemeColor = document.querySelector('meta[name=theme-color]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', color);
  }
}

export function getBackgroundTitleBarColor(isHydrated: boolean) {
  if (isHydrated) {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--theme-background-title-bar');
  }
  return 'hsl(0, 0%, 0%)';
}
