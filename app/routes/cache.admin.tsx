/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
import { json } from '@remix-run/node';
import type { LoaderArgs, ActionArgs, MetaFunction } from '@remix-run/node';
import {
  // Form,
  NavLink,
  useFetcher,
  useLoaderData,
  // useSearchParams,
  // useSubmit,
  useLocation,
} from '@remix-run/react';
// import { useDebouncedCallback } from '@react-hookz/web';
import { motion } from 'framer-motion';
import { Badge, Container, Spacer, Button } from '@nextui-org/react';
import type { CacheEntry } from 'cachified';
import { badRequest } from 'remix-utils';

import { getAllCacheKeys, lruCache, searchCacheKeys } from '~/services/lru-cache';

import { useDoubleCheck } from '~/hooks/useDoubleCheck';

import ErrorBoundaryView from '~/components/ErrorBoundaryView';
import { H2, H3 } from '~/components/styles/Text.styles';

const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');
  let cacheKeys: { key: string; data: CacheEntry<unknown> }[];
  if (typeof query === 'string') {
    cacheKeys = await searchCacheKeys(query);
  } else {
    cacheKeys = await getAllCacheKeys();
  }
  return json({ cacheKeys });
};

const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const cacheKey = formData.get('cacheKey') as string;
  if (typeof cacheKey !== 'string') {
    throw badRequest({ message: 'Invalid cache key' });
  }
  lruCache.delete(cacheKey);
  return json({ success: true });
};

const meta: MetaFunction = () => ({
  title: 'Cache Admin',
  description: 'Cache Admin',
});

const handle = {
  breadcrumb: () => (
    <NavLink to="/cache/admin" arial-lable="Cache Admin">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Cache Admin
        </Badge>
      )}
    </NavLink>
  ),
};

const CacheKeyRow = ({ cacheKey }: { cacheKey: string }) => {
  const fetcher = useFetcher();
  const dc = useDoubleCheck();
  return (
    <div className="flex items-center gap-2 font-mono">
      <fetcher.Form method="post">
        <input type="hidden" name="cacheKey" value={cacheKey} />
        {/* @ts-ignore */}
        <Button ghost color="error" auto {...dc.getButtonProps({ type: 'submit' })}>
          {fetcher.state === 'idle' ? (dc.doubleCheck ? 'You sure?' : 'Delete') : 'Deleting...'}
        </Button>
      </fetcher.Form>
      {cacheKey}
    </div>
  );
};

const CacheAdminRoute = () => {
  const { cacheKeys } = useLoaderData<typeof loader>();
  console.log('🚀 ~ file: cache.admin.tsx:92 ~ CacheAdminRoute ~ cacheKeys:', cacheKeys);
  // const [searchParams] = useSearchParams();
  // const submit = useSubmit();
  const location = useLocation();
  // const query = searchParams.get('query') ?? '';
  // const handleFormChange = useDebouncedCallback(
  //   (form: HTMLFormElement) => submit(form),
  //   [],
  //   400,
  //   600,
  // );

  return (
    <motion.main
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          maxWidth: '1920px',
          padding: '0 $sm',
          '@xs': { padding: 0 },
        }}
      >
        <H2 h2 css={{ '@xsMax': { fontSize: '1.75rem !important' } }}>
          Cache Admin
        </H2>
        <Spacer x={1} />
        <div className="flex flex-col gap-4">
          <H3>LRU Cache:</H3>
          {cacheKeys.map((cacheKey) => (
            <CacheKeyRow key={cacheKey.key} cacheKey={cacheKey.key} />
          ))}
        </div>
      </Container>
    </motion.main>
  );
};

const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default CacheAdminRoute;
export { loader, action, meta, handle, ErrorBoundary };
