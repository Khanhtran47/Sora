const Bold = ({ color }: { color: string }) => (
  <g transform="translate(2 1.999)">
    <path
      d="M10,20a10,10,0,1,1,7.074-2.929A10.011,10.011,0,0,1,10,20Zm0-7.069a.871.871,0,0,0-.87.869.875.875,0,1,0,.87-.869Zm0-7.6a.892.892,0,0,0-.88.88v4.42a.875.875,0,0,0,1.751,0V6.21A.876.876,0,0,0,10,5.33Z"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(2 2)">
    <path
      d="M9.25,0A9.25,9.25,0,1,1,0,9.25,9.25,9.25,0,0,1,9.25,0Z"
      transform="translate(0.75 0.75)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M.5,0V4.419"
      transform="translate(9.495 6.204)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M.5.5H.5"
      transform="translate(9.5 13.296)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

interface IInfoProps {
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

const Info = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: IInfoProps) => {
  switch (filled) {
    case false:
      return (
        <svg
          className={className}
          width={width || size}
          height={height || size}
          viewBox="0 0 24 24"
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
          viewBox="0 0 24 24"
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

Info.displayName = 'InfoIcon';

export default Info;
