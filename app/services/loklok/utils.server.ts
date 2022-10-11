export const LOKLOK_URL = 'https://loklok.vercel.app/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetcher = async <T = any>(url: string): Promise<T> => {
  const res = await fetch(url);

  // throw error here
  if (!res.ok)
    throw new Error(`fetcher (loklok-server): ${url}${JSON.stringify(await res.json())}`);

  return res.json();
};
