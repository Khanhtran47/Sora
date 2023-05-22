const Bold = ({ color }: { color: string }) => (
  <g transform="translate(7 6)">
    <path
      d="M9.631,7.131c-.057.058-.27.306-.469.51a21.69,21.69,0,0,1-5.8,4.024A4.617,4.617,0,0,1,2.188,12a1.933,1.933,0,0,1-.9-.218,1.874,1.874,0,0,1-.795-.9A9.84,9.84,0,0,1,.242,9.814,23.979,23.979,0,0,1,0,6.008,27.724,27.724,0,0,1,.213,2.319,8.495,8.495,0,0,1,.554.992,1.785,1.785,0,0,1,2.132,0h.057A4.879,4.879,0,0,1,3.509.409,21.69,21.69,0,0,1,9.177,4.375a5.66,5.66,0,0,1,.482.554A1.783,1.783,0,0,1,10,5.993a1.875,1.875,0,0,1-.369,1.138"
      fill={color}
    />
  </g>
);
const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(8.5 19) rotate(-90)">
    <path
      d="M14,0,7,7,0,0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

interface IChevronRightProps {
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

const ChevronRight = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: IChevronRightProps) => {
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

ChevronRight.displayName = 'ChevronRightIcon';

export default ChevronRight;
