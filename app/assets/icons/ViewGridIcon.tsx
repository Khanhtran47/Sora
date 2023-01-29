import Svg from '~/components/styles/Svg.styles';

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
      x="27"
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
    <rect
      x="27"
      y="27"
      width="8"
      height="8"
      fill="#FFF"
      stroke="#FFF"
      strokeWidth={strokeWidth}
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
      x="27"
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
    <rect
      x="27"
      y="27"
      width="8"
      height="8"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </>
);

interface IViewGridProps {
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

const ViewGrid = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: IViewGridProps) => {
  switch (filled) {
    case false:
      return (
        <Svg
          className=""
          width={width || size}
          height={height || size}
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          css={{
            display: 'inline',
          }}
          {...props}
        >
          <Light color={fill} strokeWidth={1.5} />
        </Svg>
      );
    default:
      return (
        <Svg
          className=""
          width={width || size}
          height={height || size}
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          css={{
            display: 'inline',
          }}
          {...props}
        >
          <Bold color={fill} strokeWidth={1.5} />;
        </Svg>
      );
  }
};

ViewGrid.displayName = 'ViewGridIcon';

export default ViewGrid;
