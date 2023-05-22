const Bold = ({ color }: { color: string }) => (
  <g transform="translate(2 3)">
    <path
      d="M13.122,14.4a3.439,3.439,0,1,1,3.439,3.379A3.41,3.41,0,0,1,13.122,14.4ZM1.508,15.921a1.482,1.482,0,1,1,0-2.963H8.083a1.482,1.482,0,1,1,0,2.963ZM0,3.379A3.409,3.409,0,0,1,3.439,0,3.409,3.409,0,0,1,6.878,3.379,3.409,3.409,0,0,1,3.439,6.758,3.41,3.41,0,0,1,0,3.379ZM11.918,4.86a1.481,1.481,0,1,1,0-2.962h6.575a1.481,1.481,0,1,1,0,2.962Z"
      transform="translate(0 0)"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(2 2.5)">
    <path
      d="M7.234.588H0"
      transform="translate(0.883 14.898)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M5.76,2.88A2.88,2.88,0,1,1,2.88,0,2.88,2.88,0,0,1,5.76,2.88Z"
      transform="translate(13.358 12.607)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M0,.588H7.235"
      transform="translate(11.883 3.174)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M0,2.88A2.88,2.88,0,1,0,2.88,0,2.879,2.879,0,0,0,0,2.88Z"
      transform="translate(0.883 0.882)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

interface IFilterProps {
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
}

const Filter = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: IFilterProps) => {
  switch (filled) {
    case false:
      return (
        <svg
          className=""
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
          className=""
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

Filter.displayName = 'FilterIcon';

export default Filter;
