const Bold = ({ color }: { color: string }) => (
  <g transform="translate(2.5 2)">
    <path
      d="M10.2,20H8.807a2.066,2.066,0,0,1-2.125-2.05A1.9,1.9,0,0,0,4.8,16.13a1.58,1.58,0,0,0-.9.23,2.163,2.163,0,0,1-1.084.3A2.122,2.122,0,0,1,1,15.62l-.7-1.2a2,2,0,0,1-.021-2.05,2.108,2.108,0,0,1,.817-.789,1.653,1.653,0,0,0,.644-.64,1.782,1.782,0,0,0,.19-1.365A1.837,1.837,0,0,0,1.071,8.44,2.045,2.045,0,0,1,.314,5.61L1,4.43a2.123,2.123,0,0,1,2.882-.76,1.894,1.894,0,0,0,.9.224A1.959,1.959,0,0,0,6.446,2.98a1.538,1.538,0,0,0,.236-.88A1.788,1.788,0,0,1,6.968,1.04,2.2,2.2,0,0,1,8.776,0h1.441a2.154,2.154,0,0,1,1.82,1.04A1.781,1.781,0,0,1,12.312,2.1a1.545,1.545,0,0,0,.235.88,1.964,1.964,0,0,0,1.672.914,1.926,1.926,0,0,0,.9-.224,2.111,2.111,0,0,1,2.872.76l.684,1.18a2.027,2.027,0,0,1-.756,2.831,1.829,1.829,0,0,0-.853,1.138,1.771,1.771,0,0,0,.2,1.362,1.571,1.571,0,0,0,.634.64,2.307,2.307,0,0,1,.828.789,2.031,2.031,0,0,1-.02,2.05l-.715,1.2a2.1,2.1,0,0,1-2.893.74,1.621,1.621,0,0,0-.9-.23,1.9,1.9,0,0,0-1.891,1.82A2.061,2.061,0,0,1,10.2,20ZM9.512,7.18a2.87,2.87,0,0,0-2.9,2.83,2.763,2.763,0,0,0,.849,2,2.93,2.93,0,0,0,2.053.821A2.822,2.822,0,0,0,11.55,8.006,2.877,2.877,0,0,0,9.512,7.18Z"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(2.5 1.5)">
    <path
      d="M17.528,5.346l-.622-1.08a1.913,1.913,0,0,0-2.609-.7h0a1.9,1.9,0,0,1-2.609-.677,1.831,1.831,0,0,1-.256-.915h0A1.913,1.913,0,0,0,9.519,0H8.265a1.9,1.9,0,0,0-1.9,1.913h0A1.913,1.913,0,0,1,4.448,3.8a1.831,1.831,0,0,1-.915-.256h0a1.913,1.913,0,0,0-2.609.7l-.668,1.1a1.913,1.913,0,0,0,.7,2.609h0a1.913,1.913,0,0,1,.957,1.657,1.913,1.913,0,0,1-.957,1.657h0a1.9,1.9,0,0,0-.7,2.6h0l.632,1.089A1.913,1.913,0,0,0,3.5,15.7h0a1.895,1.895,0,0,1,2.6.7,1.831,1.831,0,0,1,.256.915h0a1.913,1.913,0,0,0,1.913,1.913H9.519a1.913,1.913,0,0,0,1.913-1.9h0a1.9,1.9,0,0,1,1.913-1.913,1.95,1.95,0,0,1,.915.256h0a1.913,1.913,0,0,0,2.609-.7h0l.659-1.1a1.9,1.9,0,0,0-.7-2.609h0a1.9,1.9,0,0,1-.7-2.609,1.876,1.876,0,0,1,.7-.7h0a1.913,1.913,0,0,0,.7-2.6h0Z"
      transform="translate(0.779 0.778)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <circle
      cx="2.636"
      cy="2.636"
      r="2.636"
      transform="translate(7.039 7.753)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

interface ISettingsProps {
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

const Settings = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: ISettingsProps) => {
  switch (filled) {
    case false:
      return (
        <svg
          className={className}
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
          className={className}
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

Settings.displayName = 'SettingsIcon';

export default Settings;
