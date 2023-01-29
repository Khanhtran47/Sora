import Svg from '~/components/styles/Svg.styles';

const Bold = ({ color }: { color: string }) => (
  <g>
    <path
      d="M14.55 22.42C14.22 22.42 13.91 22.2 13.82 21.86C13.72 21.46 13.95 21.05 14.35 20.94C18.41 19.87 21.24 16.19 21.24 11.99C21.24 6.89 17.09 2.74 11.99 2.74C7.66 2.74 4.82 5.27 3.49 6.8H6.43C6.84 6.8 7.18 7.14 7.18 7.55C7.18 7.96 6.86 8.31 6.44 8.31H2.01C1.94 8.31 1.87 8.3 1.8 8.28C1.71 8.25 1.63 8.21 1.56 8.16C1.47 8.1 1.4 8.02 1.35 7.93C1.3 7.83 1.26 7.73 1.25 7.62C1.25 7.59 1.25 7.57 1.25 7.54V3C1.25 2.59 1.59 2.25 2 2.25C2.41 2.25 2.75 2.59 2.75 3V5.39C4.38 3.64 7.45 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 16.88 19.46 21.16 14.74 22.4C14.68 22.41 14.61 22.42 14.55 22.42Z"
      fill={color}
    />
    <path
      d="M11.29 22.73C11.27 22.73 11.24 22.73 11.22 22.72C10.15 22.65 9.1 22.41 8.1 22.02C7.81 21.91 7.62 21.62 7.62 21.31C7.62 21.22 7.64 21.13 7.67 21.05C7.82 20.67 8.26 20.47 8.64 20.62C9.5 20.96 10.41 21.16 11.33 21.23H11.34C11.74 21.25 12.04 21.59 12.04 21.99C12.04 22 12.04 22.02 12.04 22.03C12.01 22.42 11.68 22.73 11.29 22.73ZM5.78 20.58C5.61 20.58 5.45 20.53 5.31 20.42C4.47 19.75 3.74 18.96 3.13 18.07C3.04 17.94 2.99 17.8 2.99 17.65C2.99 17.4 3.11 17.17 3.32 17.03C3.65 16.8 4.14 16.89 4.36 17.22C4.89 17.99 5.52 18.67 6.25 19.24C6.42 19.38 6.53 19.59 6.53 19.82C6.53 19.99 6.48 20.16 6.37 20.3C6.23 20.48 6.01 20.58 5.78 20.58ZM2.44 15.7C2.11 15.7 1.82 15.49 1.73 15.18C1.41 14.15 1.25 13.08 1.25 12C1.25 11.59 1.59 11.25 2 11.25C2.41 11.25 2.75 11.59 2.75 12C2.75 12.93 2.89 13.85 3.16 14.73C3.18 14.8 3.19 14.88 3.19 14.96C3.19 15.29 2.98 15.57 2.67 15.67C2.59 15.69 2.52 15.7 2.44 15.7Z"
      fill={color}
    />
    <path
      d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
      fill={color}
    />
  </g>
);
const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g>
    <path
      d="M14.55 21.67C18.84 20.54 22 16.64 22 12C22 6.48 17.56 2 12 2C5.33 2 2 7.56 2 7.56M2 7.56V3M2 7.56H4.01H6.44"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12C2 17.52 6.48 22 12 22"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="3 3"
    />
  </g>
);

interface IRefreshProps {
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

const RefreshIcon = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: IRefreshProps) => {
  switch (filled) {
    case false:
      return (
        <Svg
          className=""
          width={width || size}
          height={height || size}
          viewBox="0 0 24 24"
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
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          css={{
            display: 'inline',
          }}
          {...props}
        >
          <Bold color={fill} />;
        </Svg>
      );
  }
};

RefreshIcon.displayName = 'RefreshIcon';

export default RefreshIcon;
