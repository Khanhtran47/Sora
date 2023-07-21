import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import { Switch } from '@nextui-org/switch';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/elements/Select';
import Search from '~/assets/icons/SearchIcon';
import Settings from '~/assets/icons/SettingsIcon';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/button" key="design-button">
      Button
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Button',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const ButtonPage = () => {
  const [size, setSize] = useState('md');
  const [radius, setRadius] = useState('xl');
  const [isFullWidth, setIsFullWidth] = useState(true);
  return (
    <>
      <h2>Button</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://nextui-docs-v2.vercel.app/docs/components/button#api"
      >
        API Reference
      </Link>
      <p className="text-base tracking-wide md:text-lg">Default</p>
      <Button>Default</Button>
      <p className="text-base tracking-wide md:text-lg">Disabled</p>
      <Button isDisabled>Disabled</Button>
      <p className="text-base tracking-wide md:text-lg">Sizes</p>
      <Select defaultValue="md" value={size} onValueChange={(value) => setSize(value)}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Button size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="xs">xs</SelectItem>
          <SelectItem value="sm">sm</SelectItem>
          <SelectItem value="md">md</SelectItem>
          <SelectItem value="lg">lg</SelectItem>
          <SelectItem value="xl">xl</SelectItem>
        </SelectContent>
      </Select>
      <Button size={size as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined}>{size}</Button>
      <p className="text-base tracking-wide md:text-lg">Radius</p>
      <Select defaultValue="xl" value={radius} onValueChange={(value) => setRadius(value)}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Button size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">none</SelectItem>
          <SelectItem value="base">base</SelectItem>
          <SelectItem value="sm">sm</SelectItem>
          <SelectItem value="md">md</SelectItem>
          <SelectItem value="lg">lg</SelectItem>
          <SelectItem value="xl">xl</SelectItem>
          <SelectItem value="2xl">2xl</SelectItem>
          <SelectItem value="3xl">3xl</SelectItem>
          <SelectItem value="full">full</SelectItem>
        </SelectContent>
      </Select>
      <Button
        radius={
          radius as 'base' | 'md' | 'xl' | 'sm' | 'lg' | '2xl' | '3xl' | 'none' | 'full' | undefined
        }
      >
        {radius}
      </Button>
      <p className="text-base tracking-wide md:text-lg">Icons</p>
      <Button startContent={<Search />} endContent={<Settings />}>
        Button
      </Button>
      <Button isIconOnly>
        <Settings />
      </Button>
      <p className="text-base tracking-wide md:text-lg">Loading</p>
      <Button isDisabled isLoading>
        Loading
      </Button>
      <p className="text-base tracking-wide md:text-lg">Disable Ripple Animation</p>
      <Button disableRipple>Button</Button>
      <p className="text-base tracking-wide md:text-lg">Full Width</p>
      <Switch isSelected={isFullWidth} onValueChange={(value) => setIsFullWidth(value)} />
      <Button fullWidth={isFullWidth}>Button</Button>
      <p className="text-base tracking-wide md:text-lg">Colors</p>
      <div className="flex flex-row flex-wrap items-center justify-start gap-4">
        <Button>Default</Button>
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="success">Success</Button>
        <Button color="warning">Warning</Button>
        <Button color="danger">Danger</Button>
        <Button className="bg-gradient-to-tr from-primary to-secondary">Custom colors</Button>
      </div>
      <p className="text-base tracking-wide md:text-lg">Variants</p>
      <div className="flex flex-row flex-wrap items-center justify-start gap-4">
        <Button variant="solid">Solid</Button>
        <Button variant="solid" color="primary">
          Solid
        </Button>
        <Button variant="solid" color="secondary">
          Solid
        </Button>
        <Button variant="solid" color="success">
          Solid
        </Button>
        <Button variant="solid" color="warning">
          Solid
        </Button>
        <Button variant="solid" color="danger">
          Solid
        </Button>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-start gap-4">
        <Button variant="bordered">Bordered</Button>
        <Button variant="bordered" color="primary">
          Bordered
        </Button>
        <Button variant="bordered" color="secondary">
          Bordered
        </Button>
        <Button variant="bordered" color="success">
          Bordered
        </Button>
        <Button variant="bordered" color="warning">
          Bordered
        </Button>
        <Button variant="bordered" color="danger">
          Bordered
        </Button>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-start gap-4">
        <Button variant="light">Light</Button>
        <Button variant="light" color="primary">
          Light
        </Button>
        <Button variant="light" color="secondary">
          Light
        </Button>
        <Button variant="light" color="success">
          Light
        </Button>
        <Button variant="light" color="warning">
          Light
        </Button>
        <Button variant="light" color="danger">
          Light
        </Button>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-start gap-4">
        <Button variant="flat">flat</Button>
        <Button variant="flat" color="primary">
          flat
        </Button>
        <Button variant="flat" color="secondary">
          flat
        </Button>
        <Button variant="flat" color="success">
          flat
        </Button>
        <Button variant="flat" color="warning">
          flat
        </Button>
        <Button variant="flat" color="danger">
          flat
        </Button>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-start gap-4">
        <Button variant="faded">faded</Button>
        <Button variant="faded" color="primary">
          faded
        </Button>
        <Button variant="faded" color="secondary">
          faded
        </Button>
        <Button variant="faded" color="success">
          faded
        </Button>
        <Button variant="faded" color="warning">
          faded
        </Button>
        <Button variant="faded" color="danger">
          faded
        </Button>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-start gap-4">
        <Button variant="shadow">shadow</Button>
        <Button variant="shadow" color="primary">
          shadow
        </Button>
        <Button variant="shadow" color="secondary">
          shadow
        </Button>
        <Button variant="shadow" color="success">
          shadow
        </Button>
        <Button variant="shadow" color="warning">
          shadow
        </Button>
        <Button variant="shadow" color="danger">
          shadow
        </Button>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-start gap-4">
        <Button variant="ghost">ghost</Button>
        <Button variant="ghost" color="primary">
          ghost
        </Button>
        <Button variant="ghost" color="secondary">
          ghost
        </Button>
        <Button variant="ghost" color="success">
          ghost
        </Button>
        <Button variant="ghost" color="warning">
          ghost
        </Button>
        <Button variant="ghost" color="danger">
          ghost
        </Button>
      </div>
    </>
  );
};

export default ButtonPage;
