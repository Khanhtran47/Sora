import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/design-system/colors" key="design-colors">
      Colors
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Colors',
    showImage: false,
  }),
  getSitemapEntries: () => null,
};

const ColorsPage = () => {
  return (
    <>
      <h2 className="m-0">Semantic colors</h2>
      <div className="flex flex-col gap-3">
        Layout:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-background text-foreground shadow-lg">
            background
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-foreground text-background shadow-lg">
            foreground
          </div>
          <div className="bg-border flex h-32 w-32 items-center justify-center rounded-medium text-content3-foreground shadow-lg">
            border
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-focus text-primary-foreground shadow-lg">
            focus
          </div>
        </div>
        Content:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-content1 text-content1-foreground shadow-lg">
            content1
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-content2 text-content2-foreground shadow-lg">
            content2
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-content3 text-content3-foreground shadow-lg">
            content3
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-content4 text-content4-foreground shadow-lg">
            content4
          </div>
        </div>
        Base:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-default text-default-foreground shadow-lg">
            default
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-primary text-primary-foreground shadow-lg">
            primary
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-secondary text-secondary-foreground shadow-lg">
            secondary
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-success text-success-foreground shadow-lg">
            success
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-warning text-warning-foreground shadow-lg">
            warning
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-danger text-danger-foreground shadow-lg">
            danger
          </div>
        </div>
        Default:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-default-50 text-default-900 shadow-lg">
            default-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-default-100 text-default-900 shadow-lg">
            default-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-default-200 text-default-800 shadow-lg">
            default-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-default-300 text-default-800 shadow-lg">
            default-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-default-400 text-default-800 shadow-lg">
            default-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-default-500 text-default-foreground shadow-lg">
            default-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-default-600 text-default-50 shadow-lg">
            default-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-default-700 text-default-100 shadow-lg">
            default-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-default-800 text-default-100 shadow-lg">
            default-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-default-900 text-default-100 shadow-lg">
            default-900
          </div>
        </div>
        Primary:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-primary-50 text-primary-900 shadow-lg">
            primary-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-primary-100 text-primary-900 shadow-lg">
            primary-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-primary-200 text-primary-800 shadow-lg">
            primary-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-primary-300 text-primary-800 shadow-lg">
            primary-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-primary-400 text-primary-800 shadow-lg">
            primary-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-primary-500 text-primary-foreground shadow-lg">
            primary-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-primary-600 text-primary-50 shadow-lg">
            primary-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-primary-700 text-primary-100 shadow-lg">
            primary-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-primary-800 text-primary-100 shadow-lg">
            primary-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-primary-900 text-primary-100 shadow-lg">
            primary-900
          </div>
        </div>
        Secondary:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-secondary-50 text-secondary-900 shadow-lg">
            secondary-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-secondary-100 text-secondary-900 shadow-lg">
            secondary-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-secondary-200 text-secondary-800 shadow-lg">
            secondary-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-secondary-300 text-secondary-800 shadow-lg">
            secondary-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-secondary-400 text-secondary-800 shadow-lg">
            secondary-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-secondary-500 text-secondary-foreground shadow-lg">
            secondary-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-secondary-600 text-secondary-50 shadow-lg">
            secondary-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-secondary-700 text-secondary-100 shadow-lg">
            secondary-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-secondary-800 text-secondary-100 shadow-lg">
            secondary-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-secondary-900 text-secondary-100 shadow-lg">
            secondary-900
          </div>
        </div>
        Success:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-success-50 text-success-900 shadow-lg">
            success-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-success-100 text-success-900 shadow-lg">
            success-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-success-200 text-success-800 shadow-lg">
            success-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-success-300 text-success-800 shadow-lg">
            success-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-success-400 text-success-800 shadow-lg">
            success-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-success-500 text-success-foreground shadow-lg">
            success-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-success-600 text-success-50 shadow-lg">
            success-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-success-700 text-success-100 shadow-lg">
            success-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-success-800 text-success-100 shadow-lg">
            success-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-success-900 text-success-100 shadow-lg">
            success-900
          </div>
        </div>
        Warning:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-warning-50 text-warning-900 shadow-lg">
            warning-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-warning-100 text-warning-900 shadow-lg">
            warning-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-warning-200 text-warning-800 shadow-lg">
            warning-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-warning-300 text-warning-800 shadow-lg">
            warning-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-warning-400 text-warning-800 shadow-lg">
            warning-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-warning-500 text-warning-foreground shadow-lg">
            warning-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-warning-600 text-warning-50 shadow-lg">
            warning-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-warning-700 text-warning-100 shadow-lg">
            warning-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-warning-800 text-warning-100 shadow-lg">
            warning-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-warning-900 text-warning-100 shadow-lg">
            warning-900
          </div>
        </div>
        Danger:
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-danger-50 text-danger-900 shadow-lg">
            danger-50
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-danger-100 text-danger-900 shadow-lg">
            danger-100
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-danger-200 text-danger-800 shadow-lg">
            danger-200
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-danger-300 text-danger-800 shadow-lg">
            danger-300
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-danger-400 text-danger-800 shadow-lg">
            danger-400
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-danger-500 text-danger-foreground shadow-lg">
            danger-500
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-danger-600 text-danger-50 shadow-lg">
            danger-600
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-danger-700 text-danger-100 shadow-lg">
            danger-700
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-danger-800 text-danger-100 shadow-lg">
            danger-800
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-danger-900 text-danger-100 shadow-lg">
            danger-900
          </div>
        </div>
      </div>
      <h2 className="m-0">Common colors</h2>
      <div className="flex flex-col gap-3">
        App colors
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-white text-black shadow-lg">
            #FFFFFF
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-black text-white shadow-lg">
            #000000
          </div>
        </div>
        Blue
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-blue-50 text-black shadow-lg">
            #E6F1FE
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-blue-100 text-black shadow-lg">
            #CCE3FD
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-blue-200 text-black shadow-lg">
            #99C7FB
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-blue-300 text-black shadow-lg">
            #66AAF9
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-blue-400 text-black shadow-lg">
            #338EF7
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-blue-500 text-black shadow-lg">
            #0072F5
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-blue-600 text-white shadow-lg">
            #005BC4
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-blue-700 text-white shadow-lg">
            #004493
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-blue-800 text-white shadow-lg">
            #002E62
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-blue-900 text-white shadow-lg">
            #001731
          </div>
        </div>
        Purple
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-purple-50 text-black shadow-lg">
            #F2EAFA
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-purple-100 text-black shadow-lg">
            #E4D4F4
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-purple-200 text-black shadow-lg">
            #C9A9E9
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-purple-300 text-black shadow-lg">
            #AE7EDE
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-purple-400 text-black shadow-lg">
            #9353D3
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-purple-500 text-black shadow-lg">
            #7828C8
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-purple-600 text-white shadow-lg">
            #6020A0
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-purple-700 text-white shadow-lg">
            #481878
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-purple-800 text-white shadow-lg">
            #301050
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-purple-900 text-white shadow-lg">
            #180828
          </div>
        </div>
        Green
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-green-50 text-black shadow-lg">
            #E8FAF0
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-green-100 text-black shadow-lg">
            #D1F4E0
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-green-200 text-black shadow-lg">
            #A2E9C1
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-green-300 text-black shadow-lg">
            #74DFA2
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-green-400 text-black shadow-lg">
            #45D483
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-green-500 text-black shadow-lg">
            #17C964
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-green-600 text-white shadow-lg">
            #12A150
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-green-700 text-white shadow-lg">
            #0E793C
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-green-800 text-white shadow-lg">
            #095028
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-green-900 text-white shadow-lg">
            #052814
          </div>
        </div>
        Red
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-red-50 text-black shadow-lg">
            #FEE7EF
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-red-100 text-black shadow-lg">
            #FDD0DF
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-red-200 text-black shadow-lg">
            #FAA0BF
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-red-300 text-black shadow-lg">
            #F871A0
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-red-400 text-black shadow-lg">
            #F54180
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-red-500 text-black shadow-lg">
            #F31260
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-red-600 text-white shadow-lg">
            #C20E4D
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-red-700 text-white shadow-lg">
            #920B3A
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-red-800 text-white shadow-lg">
            #610726
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-red-900 text-white shadow-lg">
            #310413
          </div>
        </div>
        Pink
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-pink-50 text-black shadow-lg">
            #FFEDFA
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-pink-100 text-black shadow-lg">
            #FFDCF5
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-pink-200 text-black shadow-lg">
            #FFB8EB
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-pink-300 text-black shadow-lg">
            #FF95E1
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-pink-400 text-black shadow-lg">
            #FF71D7
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-pink-500 text-black shadow-lg">
            #FF4ECD
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-pink-600 text-white shadow-lg">
            #CC3EA4
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-pink-700 text-white shadow-lg">
            #992F7B
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-pink-800 text-white shadow-lg">
            #661F52
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-pink-900 text-white shadow-lg">
            #331029
          </div>
        </div>
        Yellow
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-yellow-50 text-black shadow-lg">
            #FEF6E9
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-yellow-100 text-black shadow-lg">
            #FDEDD3
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-yellow-200 text-black shadow-lg">
            #FBDBA7
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-yellow-300 text-black shadow-lg">
            #F9C97C
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-yellow-400 text-black shadow-lg">
            #F7B750
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-yellow-500 text-black shadow-lg">
            #F5A524
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-yellow-600 text-white shadow-lg">
            #C4841D
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-yellow-700 text-white shadow-lg">
            #936316
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-yellow-800 text-white shadow-lg">
            #62420E
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-yellow-900 text-white shadow-lg">
            #312107
          </div>
        </div>
        Cyan
        <div className="mb-4 flex flex-row flex-wrap gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-cyan-50 text-black shadow-lg">
            #F0FCFF
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-cyan-100 text-black shadow-lg">
            #E6FAFE
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-cyan-200 text-black shadow-lg">
            #D7F8FE
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-cyan-300 text-black shadow-lg">
            #C3F4FD
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-cyan-400 text-black shadow-lg">
            #A5EEFD
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-cyan-500 text-black shadow-lg">
            #7EE7FC
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-cyan-600 text-white shadow-lg">
            #06B7DB
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-cyan-700 text-white shadow-lg">
            #09AACD
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-cyan-800 text-white shadow-lg">
            #0E8AAA
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-medium bg-cyan-900 text-white shadow-lg">
            #053B48
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorsPage;
