const Bold = ({ color }: { color: string }) => (
  <g transform="translate(6 7)">
    <path
      d="M4.869,9.631c-.058-.057-.306-.27-.51-.469a21.69,21.69,0,0,1-4.024-5.8A4.617,4.617,0,0,1,0,2.188a1.933,1.933,0,0,1,.218-.9A1.874,1.874,0,0,1,1.122.5,9.84,9.84,0,0,1,2.186.242,23.979,23.979,0,0,1,5.992,0,27.724,27.724,0,0,1,9.681.213a8.495,8.495,0,0,1,1.327.341A1.785,1.785,0,0,1,12,2.132v.057a4.879,4.879,0,0,1-.409,1.321A21.69,21.69,0,0,1,7.625,9.177a5.66,5.66,0,0,1-.554.482A1.783,1.783,0,0,1,6.007,10a1.875,1.875,0,0,1-1.138-.369"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(5 8.5)">
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

interface IChevronDownProps {
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

const ChevronDown = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: IChevronDownProps) => {
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

ChevronDown.displayName = 'ChevronDownIcon';

export default ChevronDown;
