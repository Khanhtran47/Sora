import os from 'os';
import path from 'path';
import type { LoaderFunction } from '@remix-run/node';
import type { Resolver } from 'remix-image/server';
import { imageLoader, DiskCache, fsResolver, fetchResolver } from 'remix-image/server';
import { sharpTransformer } from 'remix-image-sharp';

export const fetchImage: Resolver = async (asset, url, options, basePath) => {
  if (url.startsWith('/') && (url.length === 1 || url[1] !== '/')) {
    return fsResolver(asset, url, options, basePath);
  } else {
    return fetchResolver(asset, url, options, basePath);
  }
};

const vercelUrl = process.env.VERCEL_URL || '';
const fixedVercelUrl = vercelUrl.startsWith('https') ? vercelUrl : `https://${vercelUrl}`;

const config = {
  selfUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : fixedVercelUrl,
  cache: new DiskCache({
    path: path.join(os.tmpdir(), 'img'),
  }),
  redirectOnFail: true,
  resolver: fetchImage,
  transformer: sharpTransformer,
  basePath: process.env.NODE_ENV === 'development' ? 'public' : '/',
};

export const loader: LoaderFunction = ({ request }) => {
  return imageLoader(config, request);
};
