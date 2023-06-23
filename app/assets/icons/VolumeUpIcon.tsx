const Bold = ({ color }: { color: string }) => (
  <g transform="translate(1 3)">
    <path
      d="M9.677,18a2.693,2.693,0,0,1-1.588-.676l-3.526-2.94H2.752A2.645,2.645,0,0,1,.145,11.8a27.953,27.953,0,0,1,0-5.677,2.7,2.7,0,0,1,2.607-2.51H4.563l3.46-2.9A3.014,3.014,0,0,1,9.758,0a2.548,2.548,0,0,1,2.368,1.956,10.232,10.232,0,0,1,.231,1.495l.048.442a96.7,96.7,0,0,1,0,10.216l-.048.458a9.034,9.034,0,0,1-.224,1.453A2.54,2.54,0,0,1,9.782,18Zm8.614-.22a.957.957,0,0,1-.23-1.308A13.405,13.405,0,0,0,20.165,9,13.4,13.4,0,0,0,18.06,1.529.958.958,0,0,1,18.29.221a.9.9,0,0,1,1.277.236A15.319,15.319,0,0,1,22,9a15.318,15.318,0,0,1-2.433,8.544.912.912,0,0,1-.753.4A.9.9,0,0,1,18.291,17.78Zm-3.162-3.038a.957.957,0,0,1-.23-1.308A7.957,7.957,0,0,0,16.143,9,7.955,7.955,0,0,0,14.9,4.566a.957.957,0,0,1,.229-1.308.907.907,0,0,1,1.279.237A9.878,9.878,0,0,1,17.978,9a9.878,9.878,0,0,1-1.571,5.505.9.9,0,0,1-1.278.237Z"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(1.6 4)">
    <path
      d="M10.871,12.892a12.254,12.254,0,0,1-.252,1.759A1.728,1.728,0,0,1,8.98,16a1.963,1.963,0,0,1-1.143-.471L4.07,12.469h-2.1A1.831,1.831,0,0,1,.141,10.644a25.553,25.553,0,0,1,0-5.35A1.882,1.882,0,0,1,1.972,3.532h2.1L7.759.525A2.264,2.264,0,0,1,8.98,0a1.729,1.729,0,0,1,1.639,1.349,13.9,13.9,0,0,1,.252,1.76A93.1,93.1,0,0,1,10.871,12.892Z"
      transform="translate(0 0.25)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M0,0A8.794,8.794,0,0,1,1.453,5.008,8.791,8.791,0,0,1,0,10.015"
      transform="translate(14.843 3.06)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M0,0A14.165,14.165,0,0,1,2.341,8.068,14.169,14.169,0,0,1,0,16.137"
      transform="translate(18.274 0)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

interface IVolumneUpProps {
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

const VolumeUp = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: IVolumneUpProps) => {
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

VolumeUp.displayName = 'VolumeUpIcon';

export default VolumeUp;
