import { Image } from '@nextui-org/image';
import { isRouteErrorResponse, useParams, useRouteError } from '@remix-run/react';
import { type ErrorResponse } from '@remix-run/router';
import { getErrorMessage } from '~/utils';

import errorGif from '~/assets/images/404.gif';

type StatusHandler = (info: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
}) => JSX.Element | null;

function ErrorBoundary(props: {
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null;
}) {
  const {
    defaultStatusHandler = ({ error }) => {
      let message;
      switch (error.status) {
        case 401:
          message = (
            <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>
          );
          break;
        case 404:
          message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
          break;
        default:
          throw new Error(error.data || error.statusText);
      }
      return <p>{message}</p>;
    },
    statusHandlers,
    unexpectedErrorHandler = (error) => {
      const isProd = process.env.NODE_ENV === 'production';
      return (
        <>
          <h1 className="text-center text-danger">Some thing went wrong</h1>
          {!isProd ? <p>{getErrorMessage(error)}</p> : null}
        </>
      );
    },
  } = props;
  const error = useRouteError();
  const params = useParams();

  if (typeof document !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return (
    <div className="text-h2 container mx-auto flex items-center justify-center p-20">
      <div className="mt-32 flex flex-col items-center justify-center gap-y-4">
        <Image width={480} src={errorGif} alt="404" className="object-cover" />
        {isRouteErrorResponse(error) ? (
          <>
            <h1 className="text-center text-warning">
              {error.status} {error.statusText}
            </h1>
            {(statusHandlers?.[error.status] ?? defaultStatusHandler)({
              error,
              params,
            })}
          </>
        ) : (
          unexpectedErrorHandler(error)
        )}
      </div>
    </div>
  );
}

export default ErrorBoundary;
