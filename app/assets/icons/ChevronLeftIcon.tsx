const Bold = ({ color }: { color: string }) => (
  <g transform="translate(7 6)">
    <path
      d="M.369,4.869c.057-.058.27-.306.469-.51A21.69,21.69,0,0,1,6.633.335,4.617,4.617,0,0,1,7.812,0a1.933,1.933,0,0,1,.9.218,1.874,1.874,0,0,1,.795.9,9.84,9.84,0,0,1,.256,1.064A23.979,23.979,0,0,1,10,5.992a27.724,27.724,0,0,1-.213,3.689,8.495,8.495,0,0,1-.341,1.327A1.785,1.785,0,0,1,7.868,12H7.812a4.879,4.879,0,0,1-1.321-.409A21.69,21.69,0,0,1,.823,7.625a5.66,5.66,0,0,1-.482-.554A1.783,1.783,0,0,1,0,6.007,1.875,1.875,0,0,1,.369,4.869"
      transform="translate(0)"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(15.5 5) rotate(90)">
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

interface IChevronLeftProps {
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

const ChevronLeft = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: IChevronLeftProps) => {
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

ChevronLeft.displayName = 'ChevronLeftIcon';

export default ChevronLeft;
