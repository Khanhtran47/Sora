import { Player } from '@lottiefiles/react-lottie-player';
import { Avatar, Image as NextImage, Link as NextLink, Spacer, useTheme } from '@nextui-org/react';
import { useMeasure } from '@react-hookz/web';
import Image, { MimeType } from 'remix-image';

import type { IPeopleDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import PhotoIcon from '~/assets/icons/PhotoIcon';
import ExternalLinkBlack from '~/assets/lotties/external-link-black.json';
import ExternalLinkWhite from '~/assets/lotties/external-link-white.json';
import FacebookBlack from '~/assets/lotties/lottieflow-social-networks-15-4-000000-easey.json';
import FacebookWhite from '~/assets/lotties/lottieflow-social-networks-15-4-FFFFFF-easey.json';
import InstagramBlack from '~/assets/lotties/lottieflow-social-networks-15-5-000000-easey.json';
import InstagramWhite from '~/assets/lotties/lottieflow-social-networks-15-5-FFFFFF-easey.json';
import TwitterBlack from '~/assets/lotties/lottieflow-social-networks-15-10-000000-easey.json';
import TwitterWhite from '~/assets/lotties/lottieflow-social-networks-15-10-FFFFFF-easey.json';

interface IPeopleDetailProps {
  detail: IPeopleDetail | undefined;
  externalIds: {
    facebookId: null | string;
    instagramId: string | null;
    twitterId: null | string;
  };
}

const PeopleDetail = (props: IPeopleDetailProps) => {
  const { detail, externalIds } = props;
  const { isDark } = useTheme();
  const [size, imageRef] = useMeasure<HTMLImageElement>();
  const profilePath = detail?.profile_path
    ? TMDB?.profileUrl(detail?.profile_path || '', 'h632')
    : undefined;
  let gender = '';
  switch (detail?.gender) {
    case 0:
      gender = 'Not specified';
      break;
    case 1:
      gender = 'Female';
      break;
    case 2:
      gender = 'Male';
      break;
    case 3:
      gender = 'Non-Binary';
      break;
    default:
  }
  return (
    <>
      {profilePath ? (
        <NextImage
          // @ts-ignore
          as={Image}
          ref={imageRef}
          src={profilePath}
          objectFit="cover"
          width="100%"
          height="auto"
          alt={detail?.name}
          maxDelay={10000}
          loading="lazy"
          title={detail?.name}
          css={{
            aspectRatio: '2 / 3',
            minWidth: '100% !important',
            minHeight: 'auto !important',
          }}
          containerCss={{
            borderRadius: '0.75rem',
            width: '50% !important',
            '@xs': { width: '70% !important' },
          }}
          loaderUrl="/api/image"
          placeholder="empty"
          responsive={[
            {
              size: {
                width: Math.round(size?.width || 0),
                height: Math.round(size?.height || 0),
              },
            },
          ]}
          options={{
            contentType: MimeType.WEBP,
          }}
        />
      ) : (
        <div className="flex items-center justify-center">
          <Avatar
            icon={<PhotoIcon width={48} height={48} />}
            pointer
            css={{
              width: '50% !important',
              minWidth: 'auto !important',
              minHeight: 'auto !important',
              height: 'auto !important',
              size: '$20',
              borderRadius: '0.75rem !important',
              '@xs': { width: '70% !important' },
              aspectRatio: '2 / 3',
            }}
          />
        </div>
      )}
      <Spacer y={1} />
      <h3 className="text-center">{detail?.name}</h3>
      <Spacer y={1} />
      {externalIds &&
        detail &&
        (externalIds.facebookId ||
          externalIds.instagramId ||
          externalIds.twitterId ||
          detail.homepage) && (
          <>
            <div className="flex w-full justify-center gap-4">
              {externalIds.facebookId ? (
                <NextLink
                  href={`https://facebook.com/${externalIds.facebookId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Player
                    src={isDark ? FacebookWhite : FacebookBlack}
                    hover
                    autoplay={false}
                    speed={0.75}
                    className="h-7 w-7"
                    loop
                  />
                </NextLink>
              ) : null}
              {externalIds.instagramId ? (
                <NextLink
                  href={`https://instagram.com/${externalIds.instagramId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Player
                    src={isDark ? InstagramWhite : InstagramBlack}
                    hover
                    autoplay={false}
                    speed={0.75}
                    className="h-7 w-7"
                    loop
                  />
                </NextLink>
              ) : null}
              {externalIds.twitterId ? (
                <NextLink
                  href={`https://twitter.com/${externalIds.twitterId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Player
                    src={isDark ? TwitterWhite : TwitterBlack}
                    hover
                    autoplay={false}
                    speed={0.75}
                    className="h-7 w-7"
                    loop
                  />
                </NextLink>
              ) : null}
              {detail.homepage ? (
                <NextLink href={detail?.homepage} target="_blank" rel="noopener noreferrer">
                  <Player
                    src={isDark ? ExternalLinkWhite : ExternalLinkBlack}
                    hover
                    autoplay={false}
                    speed={0.75}
                    className="h-7 w-7"
                    loop
                  />
                </NextLink>
              ) : null}
            </div>
            <Spacer y={1} />
          </>
        )}
      <div className="flex w-full justify-start sm:justify-center ">
        <h4 className="w-full sm:w-[70%]">
          <strong>Personal Info</strong>
        </h4>
      </div>
      <Spacer y={1} />
      <div className="flex flex-col flex-wrap items-start justify-start gap-y-4 sm:items-center">
        <div className="mb-2 flex flex-row items-center justify-start gap-x-6 sm:m-0 sm:w-[70%] sm:flex-col sm:items-start">
          <h5>Known For</h5>
          <p>{detail?.known_for_department}</p>
        </div>
        <div className="mb-2 flex flex-row items-center justify-start gap-x-6 sm:m-0 sm:w-[70%] sm:flex-col sm:items-start">
          <h5>Gender</h5>
          <p>{gender}</p>
        </div>
        <div className="mb-2 flex flex-row items-center justify-start gap-x-6 sm:m-0 sm:w-[70%] sm:flex-col sm:items-start">
          <h5>Birthday</h5>
          <p>{detail?.birthday}</p>
        </div>
        <div className="mb-2 flex flex-row items-center justify-start gap-x-6 sm:m-0 sm:w-[70%] sm:flex-col sm:items-start">
          <h5>Place of Birth</h5>
          <p>{detail?.place_of_birth}</p>
        </div>
        <div className="mb-2 flex flex-row items-start justify-start gap-x-6 sm:m-0 sm:w-[70%] sm:flex-col">
          <h5>Also Known As</h5>
          <p>
            {detail?.also_known_as?.map((name) => (
              <>
                <span key={name}>{name}</span>
                <br />
              </>
            ))}
          </p>
        </div>
      </div>
    </>
  );
};

export default PeopleDetail;
