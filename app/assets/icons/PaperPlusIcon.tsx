const Bold = ({ color }: { color: string }) => (
  <g transform="translate(3.5 2)">
    <path
      d="M4.674,20A4.7,4.7,0,0,1,0,15.29V4.51A4.493,4.493,0,0,1,4.465,0H9.752a.458.458,0,0,1,.455.46V3.68a3.341,3.341,0,0,0,3.308,3.34c.423,0,.794,0,1.122.006.257,0,.481,0,.68,0,.141,0,.323,0,.521,0,.229,0,.486-.005.716-.005A.448.448,0,0,1,17,7.47v8.04A4.478,4.478,0,0,1,12.544,20Zm.455-9.01a.742.742,0,0,0,.742.74h1.7V13.46a.738.738,0,1,0,1.475,0V11.73h1.713a.745.745,0,0,0,0-1.49H9.05V8.51a.738.738,0,1,0-1.475,0v1.73h-1.7A.747.747,0,0,0,5.129,10.99Zm8.518-5.431a2.017,2.017,0,0,1-2-2.017V.906a.472.472,0,0,1,.814-.334l3.986,4.187a.477.477,0,0,1-.339.807h-.645C14.824,5.568,14.161,5.565,13.647,5.559Z"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(3.5 2)">
    <path
      d="M10.486,0H3.834A3.82,3.82,0,0,0,0,3.729V14.578a3.713,3.713,0,0,0,3.834,3.775h7.988a3.769,3.769,0,0,0,3.73-3.775v-9.3Z"
      transform="translate(0.75 0.762)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M0,0V2.909A2.575,2.575,0,0,0,2.569,5.484c1.316,0,2.663,0,2.754,0"
      transform="translate(10.974 0.75)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M4.9.5H0"
      transform="translate(5.893 10.414)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M.5,4.9V0"
      transform="translate(7.844 8.464)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

interface IPaperPlusProps {
  /**
   * The color of the icon
   * @default 'currentColor'
   */
  fill?: string;
  /**
   * The fill of the icon
   * @default false
   * @type boolean
   */
  filled?: boolean;
  /**
   * The size of the icon
   * @default 24
   * @type number
   */
  size?: number;
  /**
   * The height of the icon
   * @default 24
   * @type number
   */
  height?: number;
  /**
   * The width of the icon
   * @default 24
   * @type number
   * */
  width?: number;
  /**
   * The className of the icon
   * @default ''
   * @type string
   * */
  className?: string;
}

const PaperPlus = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: IPaperPlusProps) => {
  switch (filled) {
    case false:
      return (
        <svg
          className={className}
          width={width || size}
          height={height || size}
          viewBox="0 0 22 22"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            display: 'inline',
          }}
          {...props}
        >
          <Light color={fill} strokeWidth={1.5} />
        </svg>
      );
    default:
      return (
        <svg
          className={className}
          width={width || size}
          height={height || size}
          viewBox="0 0 22 22"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            display: 'inline',
          }}
          {...props}
        >
          <Bold color={fill} />;
        </svg>
      );
  }
};

PaperPlus.displayName = 'PaperPlusIcon';

export default PaperPlus;
