import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/typography" key="design-typography">
      Typography
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Typography',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const TypographyPage = () => {
  return (
    <>
      <h2>Typography</h2>
      <br />
      <p className="text-base tracking-wide md:text-lg">Display</p>
      <span className="text-display">Almost before we knew it, we had left the ground.</span>
      {/* <p className="text-base tracking-wide md:text-lg">Numeric</p>
      <span>
        1 AU = 1,495978707x10
        <sup>11</sup> m
      </span>
      <p className="text-base tracking-wide md:text-lg">Mono</p>
      <span>console.log(foobar)</span> */}
      <br />
      <p className="text-base tracking-wide md:text-lg">H1</p>
      <h1>Almost before we knew it, we had left the ground.</h1>
      <p className="text-base tracking-wide md:text-lg">H2</p>
      <h2>Almost before we knew it, we had left the ground.</h2>
      <p className="text-base tracking-wide md:text-lg">H3</p>
      <h3>Almost before we knew it, we had left the ground.</h3>
      <p className="text-base tracking-wide md:text-lg">H4</p>
      <h4>Almost before we knew it, we had left the ground.</h4>
      <p className="text-base tracking-wide md:text-lg">H5</p>
      <h5>Almost before we knew it, we had left the ground.</h5>
      <p className="text-base tracking-wide md:text-lg">H6</p>
      <h6>Almost before we knew it, we had left the ground.</h6>
      <br />
      <p className="text-base tracking-wide md:text-lg">Text size 4xl</p>
      <p className="text-4xl">Almost before we knew it, we had left the ground.</p>
      <p className="text-base tracking-wide md:text-lg">Text size 3xl</p>
      <p className="text-3xl">Almost before we knew it, we had left the ground.</p>
      <p className="text-base tracking-wide md:text-lg">Text size 2xl</p>
      <p className="text-2xl">Almost before we knew it, we had left the ground.</p>
      <p className="text-base tracking-wide md:text-lg">Text size xl</p>
      <p className="text-xl">Almost before we knew it, we had left the ground.</p>
      <p className="text-base tracking-wide md:text-lg">Text size lg</p>
      <p className="text-lg">Almost before we knew it, we had left the ground.</p>
      <p className="text-base tracking-wide md:text-lg">Text size base</p>
      <p className="text-base">Almost before we knew it, we had left the ground.</p>
      <p className="text-base tracking-wide md:text-lg">Text size sm</p>
      <p className="text-sm">Almost before we knew it, we had left the ground.</p>
      <p className="text-base tracking-wide md:text-lg">Text size xs</p>
      <p className="text-xs">Almost before we knew it, we had left the ground.</p>
      <br />
      <p className="text-base tracking-wide md:text-lg">Colors</p>
      <p className="text-lg text-primary">Almost before we knew it, we had left the ground.</p>
      <p className="text-lg text-secondary">Almost before we knew it, we had left the ground.</p>
      <p className="text-lg text-success">Almost before we knew it, we had left the ground.</p>
      <p className="text-lg text-warning">Almost before we knew it, we had left the ground.</p>
      <p className="text-lg text-danger">Almost before we knew it, we had left the ground.</p>
      <p className="text-gradient text-lg">Almost before we knew it, we had left the ground.</p>
      <br />
      <p className="text-base tracking-wide md:text-lg">Strong</p>
      <strong>Almost before we knew it, we had left the ground.</strong>
      <p className="text-base tracking-wide md:text-lg">EM</p>
      <em>Almost before we knew it, we had left the ground.</em>
      {/* <p className="text-base tracking-wide md:text-lg">BigNum</p>
      <span>
        1 AU = 1,495978707x10
        <sup>11</sup> m
      </span>
      <p className="text-base tracking-wide md:text-lg">BigNum Outline</p>
      <span>
        1 AU = 1,495978707x10
        <sup>11</sup> m
      </span>
      <span>
        1 AU = 1,495978707x10
        <sup>11</sup> m
      </span> */}
    </>
  );
};

export default TypographyPage;
