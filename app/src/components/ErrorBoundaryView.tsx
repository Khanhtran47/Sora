import { Text, Image } from '@nextui-org/react';

import errorGif from '../assets/images/404.gif';

interface IErrorBoundary {
  error: Error;
  isProd: boolean;
}

const ErrorBoundary = ({ error, isProd }: IErrorBoundary) => (
  <>
    <Text h1 color="warning" css={{ textAlign: 'center', pt: '88px' }}>
      Some thing went wrong
    </Text>
    <Text h4 color="warning" css={{ textAlign: 'center' }}>
      {isProd ? 'We are already working on fixing-it' : error.message}
    </Text>
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
    <Text
      h1
      size={20}
      css={{
        textAlign: 'center',
      }}
      weight="bold"
    />
  </>
);

export default ErrorBoundary;
