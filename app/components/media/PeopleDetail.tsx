/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
// import { Link } from '@remix-run/react';
import {
  Row,
  Image as NextImage,
  Link as NextLink,
  useTheme,
  Spacer,
  Avatar,
} from '@nextui-org/react';
import { Player } from '@lottiefiles/react-lottie-player';
import Image, { MimeType } from 'remix-image';
import { IPeopleDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import { useMediaQuery } from '@react-hookz/web';

import Flex from '~/components/styles/Flex.styles';
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
  const profilePath = detail?.profile_path
    ? TMDB?.profileUrl(detail?.profile_path || '', 'h632')
    : undefined;
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
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
          src={profilePath}
          objectFit="cover"
          width={isSm ? '50%' : '70%'}
          height="auto"
          alt={detail?.name}
          maxDelay={10000}
          loading="lazy"
          title={detail?.name}
          css={{
            minWidth: 'auto !important',
          }}
          containerCss={{
            borderRadius: '0.75rem',
          }}
          loaderUrl="/api/image"
          placeholder="empty"
          responsive={[
            {
              size: {
                width: 164,
                height: 245,
              },
              maxWidth: 375,
            },
            {
              size: {
                width: 294,
                height: 440,
              },
              maxWidth: 650,
            },
            {
              size: {
                width: 192,
                height: 287,
              },
              maxWidth: 960,
            },
            {
              size: {
                width: 201,
                height: 301,
              },
              maxWidth: 1280,
            },
            {
              size: {
                width: 222,
                height: 333,
              },
              maxWidth: 1400,
            },
            {
              size: {
                width: 310,
                height: 465,
              },
            },
          ]}
          options={{
            contentType: MimeType.WEBP,
          }}
        />
      ) : (
        <Row align="center" justify="center">
          <Avatar
            icon={<PhotoIcon width={48} height={48} />}
            pointer
            css={{
              width: `${isSm ? '50%' : '70%'} !important`,
              minWidth: 'auto !important',
              minHeight: '250px !important',
              size: '$20',
              borderRadius: '0.75rem !important',
            }}
          />
        </Row>
      )}
      <Spacer y={1} />{' '}
      <H3 h3 css={{ textAlign: 'center' }}>
        <strong>{detail?.name}</strong>
      </H3>
      <Spacer y={1} />
      {externalIds &&
        detail &&
        (externalIds.facebookId ||
          externalIds.instagramId ||
          externalIds.twitterId ||
          detail.homepage) && (
          <>
            <Row justify="center" fluid gap={1}>
              {externalIds.facebookId && (
                <>
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
                  <Spacer x={1} />
                </>
              )}
              {externalIds.instagramId && (
                <>
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
                  <Spacer x={1} />
                </>
              )}
              {externalIds.twitterId && (
                <>
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
                  <Spacer x={1} />
                </>
              )}
              {detail.homepage && (
                <>
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
                  <Spacer x={1} />
                </>
              )}
            </Row>
            <Spacer y={1} />
          </>
        )}
      <Row
        fluid
        css={{
          justifyContent: 'flex-start',
          '@xs': {
            justifyContent: 'center',
          },
        }}
      >
        <H4
          h4
          css={{
            wdith: '100%',
            '@xs': {
              width: '70%',
            },
          }}
        >
          <strong>Personal Info</strong>
        </H4>
      </Row>
      <Spacer y={1} />
      <Row
        align="center"
        fluid
        css={{
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
          '@xs': {
            flexDirection: 'column',
            justifyContent: 'center',
          },
        }}
      >
        <Flex
          direction="column"
          justify="start"
          css={{
            marginBottom: '0.5rem !important',
            '@xs': {
              margin: 0,
              width: '70%',
            },
          }}
        >
          <H5 h5>
            <strong>Known For</strong>
            <br />
          </H5>
          <H6 h6>{detail?.known_for_department}</H6>
        </Flex>
        <Spacer y={1} />
        <Flex
          direction="column"
          justify="start"
          css={{
            marginBottom: '0.5rem !important',
            '@xs': {
              margin: 0,
              width: '70%',
            },
          }}
        >
          <H5 h5>
            <strong>Gender</strong>
            <br />
          </H5>
          <H6 h6>{gender}</H6>
        </Flex>
        <Spacer y={1} />
        <Flex
          direction="column"
          justify="start"
          css={{
            marginBottom: '0.5rem !important',
            '@xs': {
              margin: 0,
              width: '70%',
            },
          }}
        >
          <H5 h5>
            <strong>Birthday</strong>
            <br />
          </H5>
          <H6 h6>{detail?.birthday}</H6>
        </Flex>
        <Spacer y={1} />
        <Flex
          direction="column"
          justify="start"
          css={{
            marginBottom: '0.5rem !important',
            '@xs': {
              margin: 0,
              width: '70%',
            },
          }}
        >
          <H5 h5>
            <strong>Place of Birth</strong>
            <br />
          </H5>
          <H6 h6>{detail?.place_of_birth}</H6>
        </Flex>
        <Spacer y={1} />
        {!isSm && (
          <Flex
            direction="column"
            justify="start"
            css={{
              marginBottom: '0.5rem !important',
              '@xs': {
                margin: 0,
                width: '70%',
              },
            }}
          >
            <H5 h5>
              <strong>Also Known As</strong>
              <br />
            </H5>
            <H6 h6>
              {detail?.also_known_as?.map((name) => (
                <>
                  <span key={name}>{name}</span>
                  <br />
                </>
              ))}
            </H6>
            <Spacer y={1} />
          </Flex>
        )}
      </Row>
    </>
  );
};

export default PeopleDetail;
