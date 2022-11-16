/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Link, Container, Image as NextImage } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import { H5 } from '~/src/components/styles/Text.styles';
import LogoFooter from '~/src/assets/images/logo_footer.png';

const Copyright = () => (
  <Container
    fluid
    display="flex"
    justify="center"
    direction="column"
    alignItems="center"
    css={{
      padding: '60px 0 60px 0',
    }}
  >
    <NextImage
      // @ts-ignore
      as={Image}
      alt="Klee Cute"
      title="Klee Cute"
      src={LogoFooter}
      width="76px"
      height="76px"
      css={{
        borderRadius: '50%',
      }}
      loaderUrl="/api/image"
      placeholder="blur"
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

export default Copyright;
