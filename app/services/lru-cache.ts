import { lruCacheAdapter, verboseReporter, type CacheEntry } from 'cachified';
import * as C from 'cachified';
import LRU from 'lru-cache';

// https://www.npmjs.com/package/lru-cache

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var cache: LRU<string, CacheEntry<unknown>> | undefined;
}

const lruOptions = {
  // let just say 1kb is an object which after being stringified having length of 1000
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  sizeCalculation: (_value: unknown, _key: string) =>
    Math.ceil(JSON.stringify(_value).length / 1000),

  // we won't cache object bigger than 800kb
  maxSize: 800,

  // max nb of objects, less than 500mb
  max: 640,
};

// eslint-disable-next-line no-multi-assign
const lru = (global.cache = global.cache
  ? global.cache
  : new LRU<string, CacheEntry<unknown>>(lruOptions));
const lruCache = lruCacheAdapter(lru);

const getAllCacheKeys = async () => [...lru.entries()].map(([key, data]) => ({ key, data }));
const searchCacheKeys = async (search: string) =>
  [...lru.entries()].filter(([key]) => key.includes(search)).map(([key, data]) => ({ key, data }));

async function shouldForceFresh({
  forceFresh,
  request,
  key,
}: {
  forceFresh?: boolean | string;
  request?: Request;
  key: string;
}) {
  if (typeof forceFresh === 'boolean') return forceFresh;
  if (typeof forceFresh === 'string') return forceFresh.split(',').includes(key);
  if (!request) return false;
  const fresh = new URL(request.url).searchParams.get('fresh');
  if (typeof fresh !== 'string') return false;
  if (fresh === '') return true;
  return fresh.split(',').includes(key);
}

async function cachified<Value>({
  request,
  ...options
}: Omit<C.CachifiedOptions<Value>, 'forceFresh'> & {
  request?: Request;
  forceFresh?: boolean | string;
}): Promise<Value> {
  let cachifiedResolved = false;
  const cachifiedPromise = C.cachified({
    reporter: verboseReporter(),
    ...options,
    forceFresh: await shouldForceFresh({
      forceFresh: options.forceFresh,
      request,
      key: options.key,
    }),
    getFreshValue: async (context) => {
      if (!cachifiedResolved) {
        const freshValue = await options.getFreshValue(context);
        return freshValue;
      }
      return options.getFreshValue(context);
    },
  });
  cachifiedResolved = true;
  return cachifiedPromise;
}

async function fetcher<Value>({
  url,
  ...options
}: Omit<C.CachifiedOptions<Value>, 'getFreshValue' | 'forceFresh'> & {
  url: string;
  forceFresh?: boolean | string;
  getFreshValue?: undefined;
}): Promise<Value> {
  const results = await cachified({
    ...options,
    request: undefined,
    getFreshValue: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(JSON.stringify(await res.json()));
      const data = (await res.json()) as Value;
      return data;
    },
  });
  return results;
}

export { lru, lruCache, getAllCacheKeys, searchCacheKeys, shouldForceFresh, cachified, fetcher };
