/* eslint-disable import/prefer-default-export */
import { lruCache } from '~/services/lru-cache';
import { env } from 'process';

export interface IAniSkipResponse {
  found: boolean;
  results: IAniskipResults[];
  message: string;
  statusCode: number;
}

interface IAniskipResults {
  interval: IInterval;
  skipType: string;
  skipId: string;
  episodeLength: number;
}

interface IInterval {
  startTime: number;
  endTime: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetcher = async <T = any>(url: string): Promise<T> => {
  if (lruCache) {
    const cached = lruCache.get<T>(url);
    if (cached) {
      console.info('\x1b[32m%s\x1b[0m', '[cached]', url);
      return cached;
    }
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(JSON.stringify(await res.json()));
  const data = await res.json();

  if (lruCache) lruCache.set(url, data);

  return data;
};

export const getAniskip = async (
  id: number,
  episodeNumber: number,
  episodeLength?: number,
): Promise<IAniSkipResponse | undefined> => {
  try {
    const url = `${
      env.ANISKIP_API_URL
    }/skip-times/${id}/${episodeNumber}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=${
      episodeLength || 0
    }`;
    const fetched = await fetcher<IAniSkipResponse>(url);
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
