/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Container, Link, Image as NextImage } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

import { H5 } from '~/components/styles/Text.styles';
import LogoFooter from '~/assets/images/logo_footer.png';

const Footer = () => (
  <Container
    fluid
    responsive={false}
    display="flex"
    justify="center"
    direction="column"
    alignItems="center"
    css={{
      padding: '60px 0 60px 0',
      '@sm': {
        borderBottomLeftRadius: '$xl',
      },
    }}
  >
    <NextImage
      // @ts-ignore
      as={Image}
      alt="Logo Footer"
      title="Logo Footer"
      src={LogoFooter}
      width="76px"
      height="76px"
      css={{
        borderRadius: '50%',
      }}
      loading="lazy"
      loaderUrl="/api/image"
      placeholder="empty"
      responsive={[
        {
          size: {
            width: 76,
            height: 76,
          },
        },
      ]}
      options={{
        contentType: MimeType.WEBP,
      }}
    />
    <H5 h5 css={{ marginTop: '1rem' }}>
      <Link href="https://sora-anime.vercel.app/" aria-label="Website Link">
        © Sora
      </Link>
    </H5>
  </Container>
);

export default Footer;
