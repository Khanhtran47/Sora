import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/elements/Dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '~/components/elements/Sheet';

const DialogPage = () => {
  return (
    <>
      <Link
        showAnchorIcon
        underline="hover"
        isExternal
        href="https://www.radix-ui.com/docs/primitives/components/dialog#api-reference"
      >
        API Reference
      </Link>
      <p className="text-base tracking-wide md:text-lg">Dialog</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="ghost" aria-label="dropdown">
            Open
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <p className="text-base tracking-wide md:text-lg">Sheet</p>
      <div className="flex flex-row gap-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="ghost" aria-label="dropdown">
              Top
            </Button>
          </SheetTrigger>
          <SheetContent side="top" hideCloseButton>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="ghost" aria-label="dropdown">
              Right
            </Button>
          </SheetTrigger>
          <SheetContent side="right" hideCloseButton>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="ghost" aria-label="dropdown">
              Bottom
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" hideCloseButton>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="ghost" aria-label="dropdown">
              Left
            </Button>
          </SheetTrigger>
          <SheetContent side="left" hideCloseButton>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default DialogPage;
