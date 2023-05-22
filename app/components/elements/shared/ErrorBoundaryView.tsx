import { Image } from '@nextui-org/react';

import errorGif from '~/assets/images/404.gif';

interface IErrorBoundary {
  error: Error;
}

const ErrorBoundary = ({ error }: IErrorBoundary) => {
  const isProd = process.env.NODE_ENV === 'production' && process.env.DEPLOY_ENV === 'production';
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <Image
        autoResize
        width={480}
        src={errorGif}
        alt="404"
        objectFit="cover"
        css={{
          marginTop: '20px',
        }}
      />
      <h1 className="text-center text-danger">Some thing went wrong</h1>
      <h4 className="text-center text-danger">
        {isProd ? 'We are already working on fixing-it' : error.message}
      </h4>
      {!isProd ? <p>{error.stack}</p> : null}
    </div>
  );
};

export default ErrorBoundary;
