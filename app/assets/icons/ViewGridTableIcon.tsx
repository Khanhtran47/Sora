const Bold = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <>
    <rect
      x="6"
      y="6"
      width="36"
      height="36"
      rx="3"
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <rect
      x="13"
      y="13"
      width="8"
      height="8"
      fill="#FFF"
      stroke="#FFF"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <rect
      x="13"
      y="27"
      width="8"
      height="8"
      fill="#FFF"
      stroke="#FFF"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path
      d="M27 28L35 28"
      stroke="#FFF"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27 35H35"
      stroke="#FFF"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27 13L35 13"
      stroke="#FFF"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27 20L35 20"
      stroke="#FFF"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <>
    <rect
      x="13"
      y="13"
      width="8"
      height="8"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <rect
      x="13"
      y="27"
      width="8"
      height="8"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path
      d="M27 28L35 28"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27 35H35"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27 13L35 13"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27 20L35 20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

interface IViewGridTableProps {
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

const ViewGridTable = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: IViewGridTableProps) => {
  switch (filled) {
    case false:
      return (
        <svg
          className={className}
          width={width || size}
          height={height || size}
          viewBox="0 0 48 48"
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
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            display: 'inline',
          }}
          {...props}
        >
          <Bold color={fill} strokeWidth={1.5} />;
        </svg>
      );
  }
};

ViewGridTable.displayName = 'ViewGridTableIcon';

export default ViewGridTable;
