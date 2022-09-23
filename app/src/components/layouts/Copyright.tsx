/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Text, Link, Container, Image as NextImage } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import KleeCute from '../../assets/images/klee-avatar.jpg';

const Copyright = () => (
  <Container
    fluid
    display="flex"
    justify="center"
    direction="column"
    alignItems="center"
    css={{
      padding: '60px 0 60px 0',
      '@sm': {
        padding: '60px 0 30px 88px',
      },
    }}
  >
    <NextImage
      // @ts-ignore
      as={Image}
      alt="Klee Cute"
      title="Klee Cute"
      src={KleeCute}
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
    <Link href="https://remix-watchmovie.vercel.app/">
      <Text h5 css={{ marginTop: '1rem' }}>
        © Remix Movie
      </Text>
    </Link>{' '}
  </Container>
);

export default Copyright;
