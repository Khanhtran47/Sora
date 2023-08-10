const Bold = ({ color }: { color: string }) => (
  <g transform="translate(2 3)">
    <path
      d="M14.454,17.721a4.445,4.445,0,0,1-.434-.394A17.665,17.665,0,0,1,10.909,12.7a4.061,4.061,0,0,1-.32-1.078V11.57a1.461,1.461,0,0,1,.779-1.288,6.515,6.515,0,0,1,1.04-.28A20.9,20.9,0,0,1,15.3,9.83a17.926,17.926,0,0,1,2.985.2,7.45,7.45,0,0,1,.835.209,1.5,1.5,0,0,1,.709.65,1.633,1.633,0,0,1,.171.732,3.875,3.875,0,0,1-.264.963,17.773,17.773,0,0,1-3.155,4.736c-.16.162-.355.337-.4.382a1.43,1.43,0,0,1-.891.3A1.363,1.363,0,0,1,14.454,17.721Zm-10.94-2.3.257-4.578a.934.934,0,1,1,1.867,0L5.9,15.417a1.191,1.191,0,1,1-2.381,0Zm-1.8-7.444A7.4,7.4,0,0,1,.88,7.764a1.491,1.491,0,0,1-.709-.65A1.62,1.62,0,0,1,0,6.384a3.943,3.943,0,0,1,.262-.963A17.762,17.762,0,0,1,3.418.685c.161-.162.355-.337.4-.383A1.433,1.433,0,0,1,4.712,0a1.368,1.368,0,0,1,.834.278,4.586,4.586,0,0,1,.435.4A17.751,17.751,0,0,1,9.091,5.3a4.108,4.108,0,0,1,.321,1.079v.047a1.464,1.464,0,0,1-.778,1.287A6.442,6.442,0,0,1,7.593,8,20.9,20.9,0,0,1,4.7,8.17,17.926,17.926,0,0,1,1.715,7.973Zm12.647-.811L14.1,2.583a1.191,1.191,0,1,1,2.381,0l-.257,4.579a.934.934,0,1,1-1.867,0Z"
      transform="translate(0 0)"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(2 3)">
    <path
      d="M.556,13.618V0"
      transform="translate(14.284 3.546)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M8.156,0,4.078,4.1,0,0"
      transform="translate(10.762 13.068)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M.556,0V13.618"
      transform="translate(4.356 0.833)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M0,4.1,4.078,0,8.156,4.1"
      transform="translate(0.833 0.832)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

interface ISortProps {
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

const Sort = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: ISortProps) => {
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

Sort.displayName = 'SortIcon';

export default Sort;
