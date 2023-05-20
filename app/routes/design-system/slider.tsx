import { useState } from 'react';
import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import { NavLink } from '@remix-run/react';

import Slider from '~/components/elements/Slider';

export const handle = {
  breadcrumb: () => (
    <NavLink to="/design-system/slider" aria-label="Slider Page">
      {({ isActive }) => (
        <Chip
          color="primary"
          variant="flat"
          size="sm"
          className={`${
            isActive ? 'opacity-100' : 'opacity-70'
          } duration-250 ease-in-out transition-opacity hover:opacity-80`}
        >
          Slider
        </Chip>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Slider',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const SliderPage = () => {
  const [horizontalValue, setHorizontalValue] = useState([33]);
  const [verticalValue, setVerticalValue] = useState([33]);
  const [multipleValue, setMultipleValue] = useState([33, 66]);
  return (
    <>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://www.radix-ui.com/docs/primitives/components/slider#api-reference"
      >
        API Reference
      </Link>
      <p className="text-base tracking-wide md:text-lg">Horizontal</p>
      <Slider
        defaultValue={horizontalValue}
        max={100}
        onValueChange={setHorizontalValue}
        showValueOnHover
        step={1}
        value={horizontalValue}
      />
      <p className="text-base tracking-wide md:text-lg">Vertical</p>
      <Slider
        defaultValue={verticalValue}
        max={100}
        onValueChange={setVerticalValue}
        showValueOnHover
        orientation="vertical"
        step={1}
        value={verticalValue}
      />
      <p className="text-base tracking-wide md:text-lg">Multiple thumbs</p>
      <Slider
        defaultValue={multipleValue}
        max={100}
        onValueChange={setMultipleValue}
        showValueOnHover
        step={1}
        value={multipleValue}
      />
      <p className="text-base tracking-wide md:text-lg">Colors</p>
      <Slider defaultValue={[33]} max={100} step={1} color="neutral" />
      <Slider defaultValue={[33]} max={100} step={1} color="primary" />
      <Slider defaultValue={[33]} max={100} step={1} color="secondary" />
      <Slider defaultValue={[33]} max={100} step={1} color="success" />
      <Slider defaultValue={[33]} max={100} step={1} color="warning" />
      <Slider defaultValue={[33]} max={100} step={1} color="danger" />
      <Slider defaultValue={[33]} max={100} step={1} color="gradient" />
    </>
  );
};

export default SliderPage;
