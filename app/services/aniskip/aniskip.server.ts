/* eslint-disable import/prefer-default-export */
import { fetcher, lruCache } from '~/services/lru-cache';

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

export const getAniskip = async (
  id: number,
  episodeNumber: number,
  episodeLength?: number,
): Promise<IAniSkipResponse | undefined> => {
  try {
    const url = `https://api.aniskip.com/v2/skip-times/${id}/${episodeNumber}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=${
      episodeLength || 0
    }`;
    const fetched = await fetcher<IAniSkipResponse>({
      url,
      key: `aniskip-${id}-${episodeNumber}`,
      ttl: 1000 * 60 * 60 * 24 * 7,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 30,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
