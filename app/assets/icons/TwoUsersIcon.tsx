const Bold = ({ color }: { color: string }) => (
  <g transform="translate(2 3)">
    <path
      d="M0,14.918c0-2.447,3.386-3.06,7.349-3.06,3.985,0,7.349.634,7.349,3.083S11.313,18,7.349,18C3.364,18,0,17.366,0,14.918Zm16.633.475c.341-3.112-2.366-4.588-3.067-4.927a.053.053,0,0,1-.033-.054.041.041,0,0,1,.037-.028,18.394,18.394,0,0,1,3.748.319,3.193,3.193,0,0,1,2.462,1.468,2.106,2.106,0,0,1,0,1.877c-.532,1.123-2.246,1.485-2.912,1.578l-.03,0A.208.208,0,0,1,16.633,15.393ZM2.487,4.763A4.8,4.8,0,0,1,7.349,0a4.8,4.8,0,0,1,4.863,4.763A4.8,4.8,0,0,1,7.349,9.525,4.8,4.8,0,0,1,2.487,4.763ZM13.719,8.822a4.069,4.069,0,0,1-.56-.052.177.177,0,0,1-.122-.274,6.432,6.432,0,0,0-.1-7.439.11.11,0,0,1-.018-.123.148.148,0,0,1,.095-.056A4.2,4.2,0,0,1,13.834.8a4.045,4.045,0,0,1,3.957,5.076A4.04,4.04,0,0,1,13.83,8.823Z"
      fill={color}
    />
  </g>
);
const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(2 2.5)">
    <path
      d="M0,6.594A3.3,3.3,0,0,0,3.3,3.3,3.3,3.3,0,0,0,0,0"
      transform="translate(14.02 1.819)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M0,0A10.9,10.9,0,0,1,1.617.233,2.664,2.664,0,0,1,3.562,1.346a1.568,1.568,0,0,1,0,1.345A2.683,2.683,0,0,1,1.617,3.809"
      transform="translate(15.536 11.996)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M6.841,0c3.69,0,6.842.559,6.842,2.792S10.551,5.6,6.841,5.6C3.151,5.6,0,5.046,0,2.812S3.131,0,6.841,0Z"
      transform="translate(0.75 12.706)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M4.384,8.769A4.385,4.385,0,1,1,8.769,4.384,4.369,4.369,0,0,1,4.384,8.769Z"
      transform="translate(3.207 0.75)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

interface ITwoUsersProps {
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
   * The class name of the icon
   * @default ''
   * @type string
   * */
  className?: string;
}

const TwoUsers = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: ITwoUsersProps) => {
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
          <Light color={fill} strokeWidth={2} />
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

TwoUsers.displayName = 'TwoUsersIcon';

export default TwoUsers;
