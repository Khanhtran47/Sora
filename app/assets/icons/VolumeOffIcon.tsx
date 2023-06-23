const Bold = ({ color }: { color: string }) => (
  <g transform="translate(3 3)">
    <path
      d="M.274,18.733a.929.929,0,0,1,0-1.314L3.1,14.593H3.068A2.637,2.637,0,0,1,.443,12.052a27.39,27.39,0,0,1,0-5.6A2.683,2.683,0,0,1,3.068,3.987H4.9L8.392,1.13A3.184,3.184,0,0,1,10.149.42a2.539,2.539,0,0,1,2.382,1.925,8.172,8.172,0,0,1,.234,1.472l.084.677c.014.1.026.2.037.309L17.42.271a.926.926,0,0,1,1.309,1.31L1.58,18.729A.947.947,0,0,1,.924,19,.964.964,0,0,1,.274,18.733Zm9.79-.572a2.746,2.746,0,0,1-1.6-.666l-1.3-1.006a.872.872,0,0,1-.071-1.294c.277-.338,4.648-4.322,4.792-4.463a.843.843,0,0,1,.607-.2c.389.1.464.656.458,1.094-.018,1.273-.06,2.157-.128,2.7l-.048.451a8.6,8.6,0,0,1-.228,1.432,2.546,2.546,0,0,1-2.372,1.952Z"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(3 2.5)">
    <path
      d="M4.1,12.6H1.984A1.845,1.845,0,0,1,.141,10.753a25.917,25.917,0,0,1,0-5.406A1.9,1.9,0,0,1,1.984,3.568H4.1L7.809.53A2.278,2.278,0,0,1,9.039,0a1.742,1.742,0,0,1,1.651,1.363,14.268,14.268,0,0,1,.253,1.777A11.67,11.67,0,0,1,11.069,5.4"
      transform="translate(0.795 1.286)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M4.574,0c-.019,1.336-.065,2.149-.123,2.618A12.555,12.555,0,0,1,4.2,4.394,1.741,1.741,0,0,1,2.548,5.757,1.968,1.968,0,0,1,1.4,5.281L0,4.142"
      transform="translate(7.286 11.691)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M17.148,0,0,17.148"
      transform="translate(0.848 0.794)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

interface IVolumneOffProps {
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

const VolumeOff = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: IVolumneOffProps) => {
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

VolumeOff.displayName = 'VolumeOffIcon';

export default VolumeOff;
