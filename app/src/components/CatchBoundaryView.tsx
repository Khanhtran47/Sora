import { Text, Image } from '@nextui-org/react';
import { ThrownResponse } from '@remix-run/react';

import pageNotFound from '../assets/images/404.gif';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CatchBoundaryView = ({ caught }: { caught: ThrownResponse<number, any> }) => {
  let message;
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>;
      break;
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <>
      <Text h1 color="warning" css={{ textAlign: 'center', pt: '88px' }}>
        {caught.status} {caught.statusText} {message}
      </Text>
      <Image
        autoResize
        width={480}
        src={pageNotFound}
        alt="404"
        objectFit="cover"
        css={{
          marginTop: '20px',
        }}
      />
    </>
  );
};

export default CatchBoundaryView;
