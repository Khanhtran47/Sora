/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
import { useState, useMemo } from 'react';
import { json, redirect } from '@remix-run/node';
import type { LoaderArgs, ActionArgs, MetaFunction } from '@remix-run/node';
import {
  NavLink,
  useFetcher,
  useLoaderData,
  useSearchParams,
  useLocation,
  useNavigate,
} from '@remix-run/react';
import { useWindowSize } from '@react-hookz/web';
import { motion } from 'framer-motion';
import { Badge, Container, Spacer, Button, Modal } from '@nextui-org/react';
import type { CacheEntry } from 'cachified';
import { badRequest } from 'remix-utils';

import { getAllCacheKeys, lruCache, searchCacheKeys } from '~/services/lru-cache';
import { getUserFromCookie } from '~/services/supabase';

import { useDoubleCheck } from '~/hooks/useDoubleCheck';

import ErrorBoundaryView from '~/components/ErrorBoundaryView';
import { H2, H3, H5 } from '~/components/styles/Text.styles';
import SearchForm from '~/components/elements/SearchForm';

const loader = async ({ request }: LoaderArgs) => {
  const cookie = request.headers.get('Cookie');
  if (!cookie) {
    throw redirect('/sign-in');
  }
  const user = await getUserFromCookie(cookie as string);
  if (!user) {
    throw redirect('/sign-in');
  }
  const admin = process.env.ADMIN_ID?.split(',');
  if (user && !admin?.includes(user.id)) {
    throw redirect('/');
  }
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

const CacheKeyRow = ({
  cacheKey,
  handleOpenDetailCache,
}: {
  cacheKey: string;
  handleOpenDetailCache: (cacheKey: string) => void;
}) => {
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
      <Button auto light onPress={() => handleOpenDetailCache(cacheKey)}>
        {cacheKey}
      </Button>
    </div>
  );
};

const CacheAdminRoute = () => {
  const { cacheKeys } = useLoaderData<typeof loader>();
  const [showDetailCache, setShowDetailCache] = useState(false);
  const [currentCacheKey, setCurrentCacheKey] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const query = searchParams.get('query') ?? '';
  const currentCache = useMemo(() => {
    if (currentCacheKey) {
      return cacheKeys.find((cacheKey) => cacheKey.key === currentCacheKey);
    }
    return null;
  }, [currentCacheKey, cacheKeys]);
  const handleShowDetailCache = (cacheKey: string) => {
    setCurrentCacheKey(cacheKey);
    setShowDetailCache(true);
  };
  const closeHandler = () => {
    setShowDetailCache(false);
  };
  const onSubmit = (value: string) => {
    navigate(`/cache/admin?query=${value}`);
  };

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
        <SearchForm
          onSubmit={onSubmit}
          textOnButton="Search"
          textPlaceHolder="Search cache key"
          defaultValue={query}
        />
        <Spacer x={1} />
        <div className="flex flex-col gap-4">
          {cacheKeys.map((cacheKey) => (
            <CacheKeyRow
              key={cacheKey.key}
              cacheKey={cacheKey.key}
              handleOpenDetailCache={(key) => handleShowDetailCache(key)}
            />
          ))}
        </div>
      </Container>
      <Modal
        closeButton
        scroll
        blur
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        open={showDetailCache}
        onClose={closeHandler}
        className="!max-w-fit"
        // noPadding
        // autoMargin={false}
        width={width && width < 720 ? `${width}px` : '720px'}
      >
        <Modal.Header css={{ display: 'flex', flexFlow: 'row wrap' }}>
          <H3 h3 id="modal-title">
            Cache detail
          </H3>
        </Modal.Header>
        <Modal.Body>
          {currentCache ? (
            <div className="flex flex-col gap-4" id="modal-description">
              <H5>
                Cache Key: <span>{currentCache.key}</span>
              </H5>
              <H5>
                Cache TTL: <span>{currentCache.data.metadata.ttl}</span>
              </H5>
              <H5>
                Cache Stale While Revalidate: <span>{currentCache.data.metadata.swr}</span>
              </H5>
              <H5>
                Cache Created At: <span>{currentCache.data.metadata.createdTime}</span>
              </H5>
              <H5>
                Cache Data: <span>{JSON.stringify(currentCache.data.value)}</span>
              </H5>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={closeHandler}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.main>
  );
};

const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default CacheAdminRoute;
export { loader, action, meta, handle, ErrorBoundary };
