const Bold = ({ color }: { color: string }) => (
  <g>
    <path
      d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM6.5 12.57H9.27C9.68 12.57 10.02 12.91 10.02 13.32C10.02 13.73 9.68 14.07 9.27 14.07H6.5C6.09 14.07 5.75 13.73 5.75 13.32C5.75 12.91 6.09 12.57 6.5 12.57ZM12.97 17.83H6.5C6.09 17.83 5.75 17.49 5.75 17.08C5.75 16.67 6.09 16.33 6.5 16.33H12.97C13.38 16.33 13.72 16.67 13.72 17.08C13.72 17.49 13.39 17.83 12.97 17.83ZM17.5 17.83H15.65C15.24 17.83 14.9 17.49 14.9 17.08C14.9 16.67 15.24 16.33 15.65 16.33H17.5C17.91 16.33 18.25 16.67 18.25 17.08C18.25 17.49 17.91 17.83 17.5 17.83ZM17.5 14.07H11.97C11.56 14.07 11.22 13.73 11.22 13.32C11.22 12.91 11.56 12.57 11.97 12.57H17.5C17.91 12.57 18.25 12.91 18.25 13.32C18.25 13.73 17.91 14.07 17.5 14.07Z"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g>
    <path
      d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 17.0801H15.65"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.97 17.0801H6.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 13.3201H11.97"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.27 13.3201H6.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

interface ISubtitleProps {
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

const Subtitle = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: ISubtitleProps) => {
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

Subtitle.displayName = 'SubtitleIcon';

export default Subtitle;
