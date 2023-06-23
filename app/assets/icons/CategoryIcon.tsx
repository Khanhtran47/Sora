const Bold = ({ color }: { color: string }) => (
  <g transform="translate(2 2)">
    <path
      d="M14.081,20a2.549,2.549,0,0,1-2.541-2.56V14.031a2.543,2.543,0,0,1,2.541-2.561h3.38A2.549,2.549,0,0,1,20,14.031v3.408A2.554,2.554,0,0,1,17.46,20ZM2.54,20A2.555,2.555,0,0,1,0,17.439V14.031A2.549,2.549,0,0,1,2.54,11.47H5.92a2.543,2.543,0,0,1,2.54,2.561v3.408A2.548,2.548,0,0,1,5.92,20ZM14.081,8.53A2.542,2.542,0,0,1,11.54,5.97V2.561A2.549,2.549,0,0,1,14.081,0h3.38A2.554,2.554,0,0,1,20,2.561V5.97a2.548,2.548,0,0,1-2.54,2.56ZM2.54,8.53A2.548,2.548,0,0,1,0,5.97V2.561A2.555,2.555,0,0,1,2.54,0H5.92A2.549,2.549,0,0,1,8.46,2.561V5.97A2.542,2.542,0,0,1,5.92,8.53Z"
      transform="translate(0 0)"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(2 2)">
    <path
      d="M2.449,0H5.716A2.459,2.459,0,0,1,8.163,2.47V5.764a2.46,2.46,0,0,1-2.448,2.47H2.449A2.46,2.46,0,0,1,0,5.764V2.47A2.46,2.46,0,0,1,2.449,0Z"
      transform="translate(11.837 0)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M2.449,0H5.714A2.46,2.46,0,0,1,8.163,2.47V5.764a2.46,2.46,0,0,1-2.449,2.47H2.449A2.46,2.46,0,0,1,0,5.764V2.47A2.46,2.46,0,0,1,2.449,0Z"
      transform="translate(0 0)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M2.449,0H5.714A2.46,2.46,0,0,1,8.163,2.471V5.764a2.46,2.46,0,0,1-2.449,2.47H2.449A2.46,2.46,0,0,1,0,5.764V2.471A2.46,2.46,0,0,1,2.449,0Z"
      transform="translate(0 11.766)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M2.449,0H5.716A2.46,2.46,0,0,1,8.163,2.471V5.764a2.459,2.459,0,0,1-2.448,2.47H2.449A2.46,2.46,0,0,1,0,5.764V2.471A2.46,2.46,0,0,1,2.449,0Z"
      transform="translate(11.837 11.766)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

interface ICategoryProps {
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
   * The class name of the icon
   * @default ''
   * @type string
   * */
  className?: string;
}

const Category = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: ICategoryProps) => {
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
          <Light color={fill} strokeWidth={2} />
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

Category.displayName = 'CategoryIcon';

export default Category;
