const Bold = ({ color }: { color: string }) => (
  <g transform="translate(6 7)">
    <path
      d="M7.131.369c.058.057.306.27.51.469a21.69,21.69,0,0,1,4.024,5.8A4.617,4.617,0,0,1,12,7.812a1.933,1.933,0,0,1-.218.9,1.874,1.874,0,0,1-.9.795,9.84,9.84,0,0,1-1.064.256A23.979,23.979,0,0,1,6.008,10a27.724,27.724,0,0,1-3.689-.213A8.495,8.495,0,0,1,.992,9.446,1.785,1.785,0,0,1,0,7.868V7.812A4.879,4.879,0,0,1,.409,6.491,21.69,21.69,0,0,1,4.375.823,5.66,5.66,0,0,1,4.929.341,1.783,1.783,0,0,1,5.993,0,1.875,1.875,0,0,1,7.131.369"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(19 15.5) rotate(180)">
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

interface IChevronUpProps {
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

const ChevronUp = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: IChevronUpProps) => {
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

ChevronUp.displayName = 'ChevronUpIcon';

export default ChevronUp;
