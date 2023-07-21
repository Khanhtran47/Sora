import { Link } from '@nextui-org/link';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/elements/Select';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/select" key="design-select">
      Select
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Select',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const SelectPage = () => {
  return (
    <>
      <h2>Select</h2>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        isBlock
        href="https://www.radix-ui.com/docs/primitives/components/select#api-reference"
      >
        API Reference
      </Link>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectPage;
