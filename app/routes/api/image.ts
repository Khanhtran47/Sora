import os from 'os';
import path from 'path';
import BaseCache from '@next-boost/hybrid-disk-cache';
import type { LoaderFunction } from '@remix-run/node';
import { sharpTransformer } from 'remix-image-sharp';
import {
  Cache,
  CacheStatus,
  fetchResolver,
  fsResolver,
  imageLoader,
  type CacheConfig,
  type Resolver,
} from 'remix-image/server';

import { authenticate } from '~/services/supabase';

export const fetchImage: Resolver = async (asset, url, options, basePath) => {
  if (url.startsWith('/') && (url.length === 1 || url[1] !== '/')) {
    return fsResolver(asset, url, options, basePath);
  } else {
    return fetchResolver(asset, url, options, basePath);
  }
};

export interface DiskCacheConfig extends CacheConfig {
  /**
   * Path: the relative path where the cache should be stored
   */
  path: string;
}

export class CustomDiskCache extends Cache {
  config: DiskCacheConfig;
  cache: BaseCache;

  constructor(config: Partial<DiskCacheConfig> | null | undefined = {}) {
    super();

    this.config = {
      path: config?.path ?? 'tmp/img',
      ttl: config?.ttl ?? 24 * 60 * 60 * 30,
      tbd: config?.tbd ?? 365 * 24 * 60 * 60,
    };

    this.cache = new BaseCache(this.config);
  }

  async status(key: string): Promise<CacheStatus> {
    return (await this.cache.has(key)) as CacheStatus;
  }

  async has(key: string): Promise<boolean> {
    return (await this.status(key)) !== CacheStatus.MISS;
  }

  async get(key: string): Promise<Uint8Array | null> {
    if (!(await this.has(key))) {
      return null;
    }

    const cacheValue = (await this.cache.get(key))!;

    await this.cache.set(key, cacheValue);

    return cacheValue;
  }

  async set(key: string, resultImg: Uint8Array): Promise<void> {
    await this.cache.set(key, resultImg as Buffer);
  }

  async clear(): Promise<void> {
    await this.cache.purge();
  }
}

const vercelUrl = process.env.VERCEL_URL || '';
const fixedVercelUrl = vercelUrl.startsWith('https') ? vercelUrl : `https://${vercelUrl}`;

const config = {
  selfUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : fixedVercelUrl,
  cache: new CustomDiskCache({
    path: path.join(os.tmpdir(), 'img'),
  }),
  redirectOnFail: true,
  resolver: fetchImage,
  transformer: sharpTransformer,
  basePath: process.env.NODE_ENV === 'development' ? 'public' : '/',
  verbose: false,
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticate(request, undefined, true);
  return imageLoader(config, request);
};
