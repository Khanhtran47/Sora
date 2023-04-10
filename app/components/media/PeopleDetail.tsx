/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
// import { Link } from '@remix-run/react';
import { Image as NextImage, Link as NextLink, useTheme, Spacer, Avatar } from '@nextui-org/react';
import { Player } from '@lottiefiles/react-lottie-player';
import Image, { MimeType } from 'remix-image';
import { useMeasure } from '@react-hookz/web';

import { IPeopleDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';

import { H3, H4, H5, H6 } from '~/components/styles/Text.styles';

import PhotoIcon from '~/assets/icons/PhotoIcon';
import FacebookBlack from '~/assets/lotties/lottieflow-social-networks-15-4-000000-easey.json';
import FacebookWhite from '~/assets/lotties/lottieflow-social-networks-15-4-FFFFFF-easey.json';
import TwitterBlack from '~/assets/lotties/lottieflow-social-networks-15-10-000000-easey.json';
import TwitterWhite from '~/assets/lotties/lottieflow-social-networks-15-10-FFFFFF-easey.json';
import InstagramBlack from '~/assets/lotties/lottieflow-social-networks-15-5-000000-easey.json';
import InstagramWhite from '~/assets/lotties/lottieflow-social-networks-15-5-FFFFFF-easey.json';
import ExternalLinkBlack from '~/assets/lotties/external-link-black.json';
import ExternalLinkWhite from '~/assets/lotties/external-link-white.json';

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
      <H3 h3 css={{ textAlign: 'center' }} weight="bold">
        {detail?.name}
      </H3>
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
                    className="w-7 h-7"
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
                    className="w-7 h-7"
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
                    className="w-7 h-7"
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
                    className="w-7 h-7"
                    loop
                  />
                </NextLink>
              ) : null}
            </div>
            <Spacer y={1} />
          </>
        )}
      <div className="flex w-full justify-start sm:justify-center ">
        <H4
          h4
          css={{
            width: '100%',
            '@xs': {
              width: '70%',
            },
          }}
        >
          <strong>Personal Info</strong>
        </H4>
      </div>
      <Spacer y={1} />
      <div className="flex flex-col justify-start flex-wrap items-start sm:items-center gap-y-4">
        <div className="flex flex-row items-center gap-x-6 sm:flex-col sm:items-start justify-start mb-2 sm:m-0 sm:w-[70%]">
          <H5 h5 weight="bold">
            Known For
          </H5>
          <H6 h6>{detail?.known_for_department}</H6>
        </div>
        <div className="flex flex-row items-center gap-x-6 sm:flex-col sm:items-start justify-start mb-2 sm:m-0 sm:w-[70%]">
          <H5 h5 weight="bold">
            Gender
          </H5>
          <H6 h6>{gender}</H6>
        </div>
        <div className="flex flex-row items-center gap-x-6 sm:flex-col sm:items-start justify-start mb-2 sm:m-0 sm:w-[70%]">
          <H5 h5 weight="bold">
            Birthday
          </H5>
          <H6 h6>{detail?.birthday}</H6>
        </div>
        <div className="flex flex-row items-center gap-x-6 sm:flex-col sm:items-start justify-start mb-2 sm:m-0 sm:w-[70%]">
          <H5 h5 weight="bold">
            Place of Birth
          </H5>
          <H6 h6>{detail?.place_of_birth}</H6>
        </div>
        <div className="flex flex-row items-start gap-x-6 sm:flex-col justify-start mb-2 sm:m-0 sm:w-[70%]">
          <H5 h5 weight="bold">
            Also Known As
          </H5>
          <H6 h6>
            {detail?.also_known_as?.map((name) => (
              <>
                <span key={name}>{name}</span>
                <br />
              </>
            ))}
          </H6>
        </div>
      </div>
    </>
  );
};

export default PeopleDetail;
