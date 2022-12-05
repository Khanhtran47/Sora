import { Text, Image } from '@nextui-org/react';

import errorGif from '../assets/images/404.gif';

interface IErrorBoundary {
  error: Error;
  isProd: boolean;
}

const ErrorBoundary = ({ error, isProd }: IErrorBoundary) => (
  <>
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
  </>
);

export default ErrorBoundary;
