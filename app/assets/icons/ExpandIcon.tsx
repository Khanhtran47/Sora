const Bold = ({ color }: { color: string }) => (
  <g transform="scale(-1 1) translate(-23 -1)">
    <path
      d="M11 16.15V18.85C11 21.1 10.1 22 7.85 22H5.15C2.9 22 2 21.1 2 18.85V16.15C2 13.9 2.9 13 5.15 13H7.85C10.1 13 11 13.9 11 16.15Z"
      fill={color}
    />
    <path
      d="M16.48 2H8.52C5.47 2 3 4.47 3 7.52V10.5C3 11.05 3.45 11.5 4 11.5H8.5C10.71 11.5 12.5 13.29 12.5 15.5V20C12.5 20.55 12.95 21 13.5 21H16.48C19.93 21 22 18.94 22 15.48V7.52C22 4.47 19.53 2 16.48 2ZM18.76 9.99C18.76 10.4 18.42 10.74 18.01 10.74C17.6 10.74 17.26 10.4 17.26 9.99V7.79L13.53 11.53C13.38 11.68 13.19 11.75 13 11.75C12.81 11.75 12.62 11.68 12.47 11.53C12.18 11.24 12.18 10.76 12.47 10.47L16.2 6.72H14C13.58 6.72 13.25 6.39 13.25 5.97C13.25 5.56 13.58 5.22 14 5.22H18.01C18.1 5.22 18.19 5.25 18.27 5.28C18.3 5.29 18.32 5.3 18.34 5.31C18.4 5.34 18.45 5.37 18.5 5.42C18.52 5.43 18.54 5.45 18.56 5.47C18.61 5.53 18.65 5.59 18.69 5.66C18.69 5.67 18.7 5.68 18.7 5.69C18.74 5.77 18.75 5.86 18.75 5.95C18.76 5.96 18.76 5.96 18.76 5.97V9.99Z"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="scale(-1 1) translate(-23 -1)">
    <path
      d="M2 9.98V9C2 4 4 2 9 2H15C20 2 22 4 22 9V15C22 20 20 22 15 22H14"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 11L18.01 5.97998H14"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.01 5.97998V9.98998"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 16.15V18.85C11 21.1 10.1 22 7.85 22H5.15C2.9 22 2 21.1 2 18.85V16.15C2 13.9 2.9 13 5.15 13H7.85C10.1 13 11 13.9 11 16.15Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

interface IExpandProps {
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

const Expand = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: IExpandProps) => {
  switch (filled) {
    case false:
      return (
        <svg
          className=""
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
          className=""
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

Expand.displayName = 'ExpandIcon';

export default Expand;
