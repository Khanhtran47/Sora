import { Spacer } from '@nextui-org/react';
import { useLocation, useMatches } from '@remix-run/react';

const BreadCrumb = () => {
  const matches = useMatches();
  const location = useLocation();
  if (
    location.pathname === '/' ||
    location.pathname === '/anime' ||
    location.pathname === '/movies' ||
    location.pathname === '/tv-shows'
  )
    return null;
  return (
    <div className="z-[1] mb-4 flex h-auto w-fit flex-row flex-wrap items-center justify-start gap-4 sm:py-2">
      {matches
        // skip routes that don't have a breadcrumb
        .filter((match) => match.handle && match.handle.breadcrumb)
        // render breadcrumbs!
        .map((match, index) => (
          <div
            key={match.id}
            className="flex flex-row flex-wrap items-center justify-start text-primary-700"
          >
            {index ? (
              <>
                <Spacer x={0.25} />
                <span> ❱ </span>
                <Spacer x={0.25} />
              </>
            ) : null}
            {match?.handle?.breadcrumb(match)}
          </div>
        ))}
    </div>
  );
};

export default BreadCrumb;
