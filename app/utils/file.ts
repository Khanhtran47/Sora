export function getExt(url: string): string | undefined {
  if (url.includes('?')) {
    return getExt(url.split('?')[0]);
  }

  if (url.includes('#')) {
    return getExt(url.split('#')[0]);
  }

  return url.trim().toLowerCase().split('.').pop();
}
