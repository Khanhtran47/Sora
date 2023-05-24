import { Image } from '@nextui-org/image';
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
    <div className="mt-32 flex flex-col items-center justify-center gap-y-4">
      <Image width={480} src={pageNotFound} alt="404" className="object-cover" />
      <h1 className="text-center text-warning">
        {caught.status} {caught.statusText} {message}
      </h1>
    </div>
  );
};

export default CatchBoundaryView;
