import { Image } from '@nextui-org/react';
import { type ThrownResponse } from '@remix-run/react';

import pageNotFound from '~/assets/images/404.gif';

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
    <div className="flex flex-col items-center justify-center gap-y-4">
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
      <h1 className="mt-14 text-center text-warning">
        {caught.status} {caught.statusText} {message}
      </h1>
    </div>
  );
};

export default CatchBoundaryView;
