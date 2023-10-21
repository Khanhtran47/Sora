import type { LoaderFunctionArgs } from '@remix-run/node';

import { redirectWithToast } from '~/utils/server/toast-session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return redirectWithToast(request, '/', {
    title: 'Access Denied',
    type: 'error',
    description: "You don't have permission to access this page.",
  });
};

const TestPage = () => {
  return (
    <div>
      <h1>Test Page</h1>
    </div>
  );
};

export default TestPage;
