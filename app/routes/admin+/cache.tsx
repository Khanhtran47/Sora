import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Spacer } from '@nextui-org/spacer';
import type { PressEvent } from '@react-aria/interactions';
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { mergeMeta } from '~/utils';
import type { CacheEntry } from 'cachified';
import { motion } from 'framer-motion';

import type { Handle } from '~/types/handle';
import { getUserFromCookie } from '~/services/supabase';
import { getAllCacheKeys, lruCache, searchCacheKeys } from '~/utils/server/cache.server';
import { redirectWithToast } from '~/utils/server/toast-session.server';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/elements/Dialog';
import SearchForm from '~/components/elements/SearchForm';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookie = request.headers.get('Cookie');
  if (!cookie) {
    return redirectWithToast(request, '/sign-in', {
      title: 'Access Denied',
      type: 'error',
      description: 'You need to login to access this page',
    });
  }
  const user = await getUserFromCookie(cookie as string);
  if (!user) {
    return redirectWithToast(request, '/sign-in', {
      title: 'Access Denied',
      type: 'error',
      description: 'You need to login to access this page',
    });
  }
  const admin = process.env.ADMIN_ID?.split(',');
  if (user && !admin?.includes(user.id)) {
    return redirectWithToast(request, '/', {
      title: 'Access Denied',
      type: 'error',
      description: "You don't have permission to access this page.",
    });
  }
  const url = new URL(request.url);
  const query = url.searchParams.get('query');
  let cacheKeys: Array<string>;
  if (typeof query === 'string') {
    cacheKeys = await searchCacheKeys(query);
  } else {
    cacheKeys = await getAllCacheKeys();
  }
  return json({ cacheKeys });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const cacheKey = formData.get('cacheKey') as string;
  if (typeof cacheKey !== 'string') {
    return json({ message: 'Invalid cache key' }, { status: 400 });
  }
  lruCache.delete(cacheKey);
  return json({ success: true });
};

export const meta = mergeMeta(() => [
  { title: 'Cache Management' },
  { name: 'description', content: 'Cache Management' },
]);

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/admin/cache" key="cache-admin">
      Cache Management
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Cache Management',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const CacheKeyRow = ({ cacheKey }: { cacheKey: string }) => {
  const fetcher = useFetcher();
  const fetchCacheData = useFetcher<{
    cacheKey: string;
    value: CacheEntry<unknown>;
  }>();
  const [doubleCheck, setDoubleCheck] = useState(false);
  const [IsShowDetailCache, setIsShowDetailCache] = useState(false);
  const [cacheValue, setCacheValue] = useState<CacheEntry<unknown> | null>(null);
  const closeHandler = () => {
    setIsShowDetailCache(false);
  };
  const handleOpenDetailCache = (cacheKey: string, e: PressEvent) => {
    if (e.pointerType === 'keyboard') {
      setIsShowDetailCache(true);
    }
    fetchCacheData.load(`/admin/cache/${cacheKey}`);
  };
  useEffect(() => {
    if (fetchCacheData.data && fetchCacheData.data.cacheKey) {
      // @ts-expect-error
      setCacheValue(fetchCacheData.data.value);
    }
  }, [fetchCacheData.data]);
  return (
    <div className="flex items-center gap-2 font-mono">
      <fetcher.Form method="post">
        <input type="hidden" name="cacheKey" value={cacheKey} />
        <Button
          variant="ghost"
          color="danger"
          onBlur={() => setDoubleCheck(false)}
          onPress={(e) => {
            const target = e.target as HTMLFormElement;
            if (doubleCheck) {
              fetcher.submit(target?.form);
            } else {
              setDoubleCheck(true);
            }
          }}
        >
          {fetcher.state === 'idle' ? (doubleCheck ? 'You sure?' : 'Delete') : 'Deleting...'}
        </Button>
      </fetcher.Form>
      <Dialog open={IsShowDetailCache} onOpenChange={setIsShowDetailCache}>
        <DialogTrigger asChild>
          <Button variant="light" onPress={(e) => handleOpenDetailCache(cacheKey, e)}>
            {cacheKey}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle id="modal-title">Cache detail</DialogTitle>
          </DialogHeader>
          {cacheValue && cacheKey ? (
            <div className="flex flex-col gap-4" id="modal-description">
              <h5>
                Cache Key: <span>{cacheKey}</span>
              </h5>
              <h5>
                Cache TTL: <span>{cacheValue.metadata.ttl}</span>
              </h5>
              <h5>
                Cache Stale While Revalidate: <span>{cacheValue.metadata.swr}</span>
              </h5>
              <h5>
                Cache Created At: <span>{cacheValue.metadata.createdTime}</span>
              </h5>
              <h5>
                Cache Data: <span>{JSON.stringify(cacheValue.value)}</span>
              </h5>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="flat" color="danger" onPress={closeHandler}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CacheAdminRoute = () => {
  const { cacheKeys } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = searchParams.get('query') ?? '';
  const onSubmit = (value: string) => {
    navigate(`/admin/cache?query=${value}`);
  };

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center px-3 sm:px-5"
    >
      <h2>Cache Management</h2>
      <SearchForm
        onSubmit={onSubmit}
        textOnButton="Search"
        textPlaceHolder="Search cache key"
        defaultValue={query}
      />
      <Spacer x={5} />
      <div className="flex w-full flex-col gap-4">
        {cacheKeys.map((cacheKey) => (
          <CacheKeyRow key={cacheKey} cacheKey={cacheKey} />
        ))}
      </div>
    </motion.div>
  );
};

export function ErrorBoundary({ error }: { error: Error }) {
  // eslint-disable-next-line no-console
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export default CacheAdminRoute;
