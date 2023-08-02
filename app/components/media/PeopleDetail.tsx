import { Player } from '@lottiefiles/react-lottie-player';
import { Link } from '@nextui-org/link';
import { Spacer } from '@nextui-org/spacer';
import { useMeasure } from '@react-hookz/web';
import { useTranslation } from 'react-i18next';
import { MimeType } from 'remix-image';

import type { IPeopleDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import Image from '~/components/elements/Image';
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
  const { t } = useTranslation();
  const { isDark } = useColorDarkenLighten();
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
        <Image
          ref={imageRef}
          src={profilePath}
          width="100%"
          height="auto"
          alt={detail?.name}
          loading="lazy"
          title={detail?.name}
          classNames={{
            wrapper: 'flex justify-center w-1/2 m-auto',
            img: 'aspect-[2/3] min-h-[auto]',
          }}
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
        <div className="flex w-full items-center justify-center">
          <div className="z-0 flex aspect-[2/3] h-auto w-1/2 items-center justify-center rounded-large bg-default">
            <PhotoIcon width={36} height={36} />
          </div>
        </div>
      )}
      <Spacer y={5} />
      <h3 className="text-center">{detail?.name}</h3>
      <Spacer y={5} />
      {externalIds &&
        detail &&
        (externalIds.facebookId ||
          externalIds.instagramId ||
          externalIds.twitterId ||
          detail.homepage) && (
          <>
            <div className="flex w-full justify-center gap-4">
              {externalIds.facebookId ? (
                <Link href={`https://facebook.com/${externalIds.facebookId}`} isExternal>
                  <Player
                    src={isDark ? FacebookWhite : FacebookBlack}
                    hover
                    autoplay={false}
                    speed={0.75}
                    className="h-7 w-7"
                    loop
                  />
                </Link>
              ) : null}
              {externalIds.instagramId ? (
                <Link href={`https://instagram.com/${externalIds.instagramId}/`} isExternal>
                  <Player
                    src={isDark ? InstagramWhite : InstagramBlack}
                    hover
                    autoplay={false}
                    speed={0.75}
                    className="h-7 w-7"
                    loop
                  />
                </Link>
              ) : null}
              {externalIds.twitterId ? (
                <Link href={`https://twitter.com/${externalIds.twitterId}`} isExternal>
                  <Player
                    src={isDark ? TwitterWhite : TwitterBlack}
                    hover
                    autoplay={false}
                    speed={0.75}
                    className="h-7 w-7"
                    loop
                  />
                </Link>
              ) : null}
              {detail.homepage ? (
                <Link href={detail?.homepage} isExternal>
                  <Player
                    src={isDark ? ExternalLinkWhite : ExternalLinkBlack}
                    hover
                    autoplay={false}
                    speed={0.75}
                    className="h-7 w-7"
                    loop
                  />
                </Link>
              ) : null}
            </div>
            <Spacer y={5} />
          </>
        )}
      <div className="flex w-full justify-start sm:justify-center">
        <h4 className="w-full sm:w-[70%]">
          <strong>{t('personal-info')}</strong>
        </h4>
      </div>
      <Spacer y={5} />
      <div className="flex flex-col flex-wrap items-start justify-start gap-y-4 sm:items-center">
        <div className="mb-2 flex flex-row items-center justify-start gap-x-6 sm:m-0 sm:w-[70%] sm:flex-col sm:items-start">
          <h5>{t('known-for')}</h5>
          <p>{detail?.known_for_department}</p>
        </div>
        <div className="mb-2 flex flex-row items-center justify-start gap-x-6 sm:m-0 sm:w-[70%] sm:flex-col sm:items-start">
          <h5>{t('gender')}</h5>
          <p>{gender}</p>
        </div>
        <div className="mb-2 flex flex-row items-center justify-start gap-x-6 sm:m-0 sm:w-[70%] sm:flex-col sm:items-start">
          <h5>{t('birthday')}</h5>
          <p>{detail?.birthday}</p>
        </div>
        <div className="mb-2 flex flex-row items-center justify-start gap-x-6 sm:m-0 sm:w-[70%] sm:flex-col sm:items-start">
          <h5>{t('place-of-birth')}</h5>
          <p>{detail?.place_of_birth}</p>
        </div>
        <div className="mb-2 flex flex-row items-start justify-start gap-x-6 sm:m-0 sm:w-[70%] sm:flex-col">
          <h5>{t('also-known-as')}</h5>
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
