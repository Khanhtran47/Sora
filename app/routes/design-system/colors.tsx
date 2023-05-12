import { Chip } from '@nextui-org/chip';
import { NavLink } from '@remix-run/react';

export const handle = {
  breadcrumb: () => (
    <NavLink to="/design-system/colors" aria-label="Colors Page">
      {({ isActive }) => (
        <Chip
          color="primary"
          variant="flat"
          size="sm"
          className={`${
            isActive ? 'opacity-100' : 'opacity-70'
          } duration-250 ease-in-out transition-opacity hover:opacity-80`}
        >
          Colors
        </Chip>
      )}
    </NavLink>
  ),
  miniTitle: () => ({
    title: 'Colors',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const Colors = () => {
  return (
    <>
      <h2 className="m-0">Semantic colors</h2>
      <div className="flex flex-col gap-3">
        Layout:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-background text-foreground shadow-lg">
            background
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-foreground text-background shadow-lg">
            foreground
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-border text-content3-foreground shadow-lg">
            border
          </div>
        </div>
        Content:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-content1 text-content1-foreground shadow-lg">
            content1
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-content2 text-content2-foreground shadow-lg">
            content2
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-content3 text-content3-foreground shadow-lg">
            content3
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-content4 text-content4-foreground shadow-lg">
            content4
          </div>
        </div>
        Base:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-neutral text-neutral-foreground shadow-lg">
            neutral
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
            primary
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shadow-lg">
            secondary
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-success text-success-foreground shadow-lg">
            success
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-warning text-warning-foreground shadow-lg">
            warning
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-danger text-danger-foreground shadow-lg">
            danger
          </div>
        </div>
        Neutral:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-neutral-50 text-neutral-900 shadow-lg">
            neutral-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900 shadow-lg">
            neutral-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-neutral-200 text-neutral-800 shadow-lg">
            neutral-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-neutral-300 text-neutral-800 shadow-lg">
            neutral-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-neutral-400 text-neutral-800 shadow-lg">
            neutral-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-neutral-500 text-neutral-foreground shadow-lg">
            neutral-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-neutral-600 text-neutral-50 shadow-lg">
            neutral-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-neutral-700 text-neutral-100 shadow-lg">
            neutral-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-neutral-800 text-neutral-100 shadow-lg">
            neutral-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-neutral-900 text-neutral-100 shadow-lg">
            neutral-900
          </div>
        </div>
        Primary:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-primary-50 text-primary-900 shadow-lg">
            primary-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-primary-100 text-primary-900 shadow-lg">
            primary-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-primary-200 text-primary-800 shadow-lg">
            primary-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-primary-300 text-primary-800 shadow-lg">
            primary-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-primary-400 text-primary-800 shadow-lg">
            primary-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-primary-500 text-primary-foreground shadow-lg">
            primary-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-primary-600 text-primary-50 shadow-lg">
            primary-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-primary-700 text-primary-100 shadow-lg">
            primary-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-primary-800 text-primary-100 shadow-lg">
            primary-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-primary-900 text-primary-100 shadow-lg">
            primary-900
          </div>
        </div>
        Secondary:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-secondary-50 text-secondary-900 shadow-lg">
            secondary-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-secondary-100 text-secondary-900 shadow-lg">
            secondary-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-secondary-200 text-secondary-800 shadow-lg">
            secondary-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-secondary-300 text-secondary-800 shadow-lg">
            secondary-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-secondary-400 text-secondary-800 shadow-lg">
            secondary-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-secondary-500 text-secondary-foreground shadow-lg">
            secondary-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-secondary-600 text-secondary-50 shadow-lg">
            secondary-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-secondary-700 text-secondary-100 shadow-lg">
            secondary-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-secondary-800 text-secondary-100 shadow-lg">
            secondary-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-secondary-900 text-secondary-100 shadow-lg">
            secondary-900
          </div>
        </div>
        Success:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-success-50 text-success-900 shadow-lg">
            success-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-success-100 text-success-900 shadow-lg">
            success-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-success-200 text-success-800 shadow-lg">
            success-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-success-300 text-success-800 shadow-lg">
            success-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-success-400 text-success-800 shadow-lg">
            success-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-success-500 text-success-foreground shadow-lg">
            success-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-success-600 text-success-50 shadow-lg">
            success-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-success-700 text-success-100 shadow-lg">
            success-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-success-800 text-success-100 shadow-lg">
            success-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-success-900 text-success-100 shadow-lg">
            success-900
          </div>
        </div>
        Warning:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-warning-50 text-warning-900 shadow-lg">
            warning-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-warning-100 text-warning-900 shadow-lg">
            warning-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-warning-200 text-warning-800 shadow-lg">
            warning-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-warning-300 text-warning-800 shadow-lg">
            warning-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-warning-400 text-warning-800 shadow-lg">
            warning-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-warning-500 text-warning-foreground shadow-lg">
            warning-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-warning-600 text-warning-50 shadow-lg">
            warning-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-warning-700 text-warning-100 shadow-lg">
            warning-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-warning-800 text-warning-100 shadow-lg">
            warning-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-warning-900 text-warning-100 shadow-lg">
            warning-900
          </div>
        </div>
        Danger:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-danger-50 text-danger-900 shadow-lg">
            danger-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-danger-100 text-danger-900 shadow-lg">
            danger-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-danger-200 text-danger-800 shadow-lg">
            danger-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-danger-300 text-danger-800 shadow-lg">
            danger-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-danger-400 text-danger-800 shadow-lg">
            danger-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-danger-500 text-danger-foreground shadow-lg">
            danger-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-danger-600 text-danger-50 shadow-lg">
            danger-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-danger-700 text-danger-100 shadow-lg">
            danger-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-danger-800 text-danger-100 shadow-lg">
            danger-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-danger-900 text-danger-100 shadow-lg">
            danger-900
          </div>
        </div>
      </div>
      <h2 className="m-0">Common colors</h2>
      <div className="flex flex-col gap-3">
        App colors
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-white text-black shadow-lg">
            #FFFFFF
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-black text-white shadow-lg">
            #000000
          </div>
        </div>
        Blue
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-blue-50 text-black shadow-lg">
            #E6F1FE
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-blue-100 text-black shadow-lg">
            #CCE3FD
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-blue-200 text-black shadow-lg">
            #99C7FB
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-blue-300 text-black shadow-lg">
            #66AAF9
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-blue-400 text-black shadow-lg">
            #338EF7
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-blue-500 text-black shadow-lg">
            #0072F5
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg">
            #005BC4
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-blue-700 text-white shadow-lg">
            #004493
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-blue-800 text-white shadow-lg">
            #002E62
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-blue-900 text-white shadow-lg">
            #001731
          </div>
        </div>
        Purple
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-purple-50 text-black shadow-lg">
            #F2EAFA
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-purple-100 text-black shadow-lg">
            #E4D4F4
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-purple-200 text-black shadow-lg">
            #C9A9E9
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-purple-300 text-black shadow-lg">
            #AE7EDE
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-purple-400 text-black shadow-lg">
            #9353D3
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-purple-500 text-black shadow-lg">
            #7828C8
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-purple-600 text-white shadow-lg">
            #6020A0
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-purple-700 text-white shadow-lg">
            #481878
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-purple-800 text-white shadow-lg">
            #301050
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-purple-900 text-white shadow-lg">
            #180828
          </div>
        </div>
        Green
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-green-50 text-black shadow-lg">
            #E8FAF0
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-green-100 text-black shadow-lg">
            #D1F4E0
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-green-200 text-black shadow-lg">
            #A2E9C1
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-green-300 text-black shadow-lg">
            #74DFA2
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-green-400 text-black shadow-lg">
            #45D483
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-green-500 text-black shadow-lg">
            #17C964
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-green-600 text-white shadow-lg">
            #12A150
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-green-700 text-white shadow-lg">
            #0E793C
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-green-800 text-white shadow-lg">
            #095028
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-green-900 text-white shadow-lg">
            #052814
          </div>
        </div>
        Red
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-red-50 text-black shadow-lg">
            #FEE7EF
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-red-100 text-black shadow-lg">
            #FDD0DF
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-red-200 text-black shadow-lg">
            #FAA0BF
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-red-300 text-black shadow-lg">
            #F871A0
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-red-400 text-black shadow-lg">
            #F54180
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-red-500 text-black shadow-lg">
            #F31260
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg">
            #C20E4D
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-red-700 text-white shadow-lg">
            #920B3A
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-red-800 text-white shadow-lg">
            #610726
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-red-900 text-white shadow-lg">
            #310413
          </div>
        </div>
        Pink
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-pink-50 text-black shadow-lg">
            #FFEDFA
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-pink-100 text-black shadow-lg">
            #FFDCF5
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-pink-200 text-black shadow-lg">
            #FFB8EB
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-pink-300 text-black shadow-lg">
            #FF95E1
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-pink-400 text-black shadow-lg">
            #FF71D7
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-pink-500 text-black shadow-lg">
            #FF4ECD
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-pink-600 text-white shadow-lg">
            #CC3EA4
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-pink-700 text-white shadow-lg">
            #992F7B
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-pink-800 text-white shadow-lg">
            #661F52
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-pink-900 text-white shadow-lg">
            #331029
          </div>
        </div>
        Yellow
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-yellow-50 text-black shadow-lg">
            #FEF6E9
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-yellow-100 text-black shadow-lg">
            #FDEDD3
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-yellow-200 text-black shadow-lg">
            #FBDBA7
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-yellow-300 text-black shadow-lg">
            #F9C97C
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-yellow-400 text-black shadow-lg">
            #F7B750
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-yellow-500 text-black shadow-lg">
            #F5A524
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-yellow-600 text-white shadow-lg">
            #C4841D
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-yellow-700 text-white shadow-lg">
            #936316
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-yellow-800 text-white shadow-lg">
            #62420E
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-yellow-900 text-white shadow-lg">
            #312107
          </div>
        </div>
        Cyan
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-cyan-50 text-black shadow-lg">
            #F0FCFF
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-cyan-100 text-black shadow-lg">
            #E6FAFE
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-cyan-200 text-black shadow-lg">
            #D7F8FE
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-cyan-300 text-black shadow-lg">
            #C3F4FD
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-cyan-400 text-black shadow-lg">
            #A5EEFD
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-cyan-500 text-black shadow-lg">
            #7EE7FC
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-cyan-600 text-white shadow-lg">
            #06B7DB
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-cyan-700 text-white shadow-lg">
            #09AACD
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-cyan-800 text-white shadow-lg">
            #0E8AAA
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-cyan-900 text-white shadow-lg">
            #053B48
          </div>
        </div>
      </div>
    </>
  );
};

export default Colors;
