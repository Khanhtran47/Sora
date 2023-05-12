import { Image, Text } from '@nextui-org/react';

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
      <Text h1 color="error" css={{ textAlign: 'center' }}>
        Some thing went wrong
      </Text>
      <Text h4 color="error" css={{ textAlign: 'center' }}>
        {isProd ? 'We are already working on fixing-it' : error.message}
      </Text>
      {!isProd ? (
        <Text as="p" size={14} css={{}}>
          {error.stack}
        </Text>
      ) : null}
    </div>
  );
};

export default ErrorBoundary;
