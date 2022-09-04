/* eslint-disable @typescript-eslint/indent */
// import { Link } from '@remix-run/react';
import { Text, Row, Image, Link as NextLink, useTheme, Spacer } from '@nextui-org/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { IPeopleDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import useMediaQuery from '~/hooks/useMediaQuery';

import FacebookBlack from '../../assets/lotties/lottieflow-social-networks-15-4-000000-easey.json';
import FacebookWhite from '../../assets/lotties/lottieflow-social-networks-15-4-FFFFFF-easey.json';
import TwitterBlack from '../../assets/lotties/lottieflow-social-networks-15-10-000000-easey.json';
import TwitterWhite from '../../assets/lotties/lottieflow-social-networks-15-10-FFFFFF-easey.json';
import InstagramBlack from '../../assets/lotties/lottieflow-social-networks-15-5-000000-easey.json';
import InstagramWhite from '../../assets/lotties/lottieflow-social-networks-15-5-FFFFFF-easey.json';
import ExternalLinkBlack from '../../assets/lotties/external-link-black.json';
import ExternalLinkWhite from '../../assets/lotties/external-link-white.json';

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
  const profilePath = TMDB?.profileUrl(detail?.profile_path || '', 'h632');
  const isSm = useMediaQuery(650, 'max');
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
      <Image
        src={profilePath || ''}
        objectFit="cover"
        width={isSm ? '50%' : '70%'}
        height="auto"
        alt={detail?.name}
        showSkeleton
        maxDelay={10000}
        loading="lazy"
        title={detail?.name}
        containerCss={{
          borderRadius: '0.75rem',
        }}
      />
      <Spacer y={1} />
      <Text
        h3
        size={16}
        css={{
          margin: 0,
          textAlign: 'center',
          '@xs': {
            fontSize: '18px',
          },
          '@sm': {
            fontSize: '20px',
          },
          '@md': {
            fontSize: '24px',
          },
        }}
      >
        <strong>{detail?.name}</strong>
      </Text>
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
        <Text
          h4
          size={14}
          css={{
            wdith: '100%',
            margin: 0,
            '@xs': {
              width: '70%',
              fontSize: '16px',
            },
            '@sm': {
              fontSize: '18px',
            },
            '@md': {
              fontSize: '20px',
            },
          }}
        >
          <strong>Personal Info</strong>
        </Text>
      </Row>
      <Spacer y={1} />
      <Row
        align="center"
        fluid
        css={{
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          flexDirection: 'row',
          '@xs': {
            flexDirection: 'column',
            justifyContent: 'center',
          },
        }}
      >
        <Text
          h4
          size={12}
          css={{
            marginBottom: '0.5rem',
            '@xs': {
              margin: 0,
              width: '70%',
              fontSize: '14px',
            },
            '@sm': {
              margin: 0,
              fontSize: '16px',
            },
            '@md': {
              margin: 0,
              fontSize: '18px',
            },
          }}
        >
          <strong>Known For</strong>
          <br />
          {detail?.known_for_department}
        </Text>
        <Spacer y={1} />
        {/* TODO: Known Credits */}
        <Text
          h4
          size={12}
          css={{
            marginBottom: '0.5rem',
            '@xs': {
              margin: 0,
              width: '70%',
              fontSize: '14px',
            },
            '@sm': {
              margin: 0,
              fontSize: '16px',
            },
            '@md': {
              margin: 0,
              fontSize: '18px',
            },
          }}
        >
          <strong>Gender</strong>
          <br />
          {gender}
        </Text>
        <Spacer y={1} />
        <Text
          h4
          size={12}
          css={{
            marginBottom: '0.5rem',
            '@xs': {
              margin: 0,
              width: '70%',
              fontSize: '14px',
            },
            '@sm': {
              margin: 0,
              fontSize: '16px',
            },
            '@md': {
              margin: 0,
              fontSize: '18px',
            },
          }}
        >
          <strong>Birthday</strong>
          <br />
          {detail?.birthday}
        </Text>
        <Spacer y={1} />
        <Text
          h4
          size={12}
          css={{
            marginBottom: '0.5rem',
            '@xs': {
              margin: 0,
              width: '70%',
              fontSize: '14px',
            },
            '@sm': {
              margin: 0,
              fontSize: '16px',
            },
            '@md': {
              margin: 0,
              fontSize: '18px',
            },
          }}
        >
          <strong>Place of Birth</strong>
          <br />
          {detail?.place_of_birth}
        </Text>
        <Spacer y={1} />
        {!isSm && (
          <>
            <Text
              h4
              size={12}
              css={{
                marginBottom: '0.5rem',
                '@xs': {
                  margin: 0,
                  width: '70%',
                  fontSize: '14px',
                },
                '@sm': {
                  margin: 0,
                  fontSize: '16px',
                },
                '@md': {
                  margin: 0,
                  fontSize: '18px',
                },
              }}
            >
              <strong>Also Known As</strong>
              <br />
              {detail?.also_known_as?.map((name) => (
                <>
                  <span key={name}>{name}</span>
                  <br />
                </>
              ))}
            </Text>
            <Spacer y={1} />
          </>
        )}
      </Row>
    </>
  );
};

export default PeopleDetail;
