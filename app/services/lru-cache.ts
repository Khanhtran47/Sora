import LRU from 'lru-cache';

// https://www.npmjs.com/package/lru-cache

// eslint-disable-next-line import/no-mutable-exports
let lruCache: LRU<string, unknown>;

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var cache: LRU<string, unknown> | undefined;
}

const options = {
  // let just say 1kb is an object which after being stringified having length of 1000
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  sizeCalculation: (_value: unknown, _key: string) =>
    Math.ceil(JSON.stringify(_value).length / 1000),

  // we won't cache object bigger than 50kb
  maxSize: 50,

  // max nb of objects, less than 250mb
  max: 5000,

  // how long to live in ms
  ttl: 1000 * 60 * 60 * 24, // one day
};

if (process.env.NODE_ENV === 'production') {
  lruCache = new LRU(options);
} else {
  if (!global.cache) {
    global.cache = new LRU(options);
  }
  lruCache = global.cache;
}

// eslint-disable-next-line import/prefer-default-export
export { lruCache };
