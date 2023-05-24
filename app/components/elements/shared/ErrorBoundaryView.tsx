import { Image } from '@nextui-org/image';

import errorGif from '~/assets/images/404.gif';

interface IErrorBoundary {
  error: Error;
}

const ErrorBoundary = ({ error }: IErrorBoundary) => {
  const isProd = process.env.NODE_ENV === 'production';
  return (
    <div className="mt-32 flex flex-col items-center justify-center gap-y-4">
      <Image width={480} src={errorGif} alt="404" className="object-cover" />
      <h1 className="text-center text-danger">Some thing went wrong</h1>
      <h4 className="text-center text-danger">
        {isProd ? 'We are already working on fixing-it' : error.message}
      </h4>
      {!isProd ? <p>{error.stack}</p> : null}
    </div>
  );
};

export default ErrorBoundary;
