const Bold = ({ color }: { color: string }) => (
  <g transform="translate(1.999 2)">
    <path
      d="M5.638,20a6.641,6.641,0,0,1-1.082-.094L4.524,19.9a5.232,5.232,0,0,1-3.268-1.872c-.005,0-.007,0-.011-.009a.053.053,0,0,0-.007-.01A6.2,6.2,0,0,1,0,14.1V5.888C0,2.366,2.265,0,5.638,0h8.717C17.731,0,20,2.366,20,5.888V14.1a2.3,2.3,0,0,1-.019.256c-.006.058-.013.116-.016.176,0,.034,0,.068,0,.1,0,.05,0,.1-.007.153a.537.537,0,0,1-.009.055.393.393,0,0,0-.01.057,6.709,6.709,0,0,1-.155.9c-.014.059-.03.119-.045.175l-.015.054a6.059,6.059,0,0,1-.287.807c-.021.047-.043.092-.066.138-.014.026-.025.05-.037.075a5.376,5.376,0,0,1-.407.7c-.031.043-.062.084-.094.122l-.055.07a4.914,4.914,0,0,1-.513.581c-.037.035-.076.067-.115.1s-.053.042-.078.065a5.246,5.246,0,0,1-.608.461c-.047.029-.1.054-.146.078-.033.016-.066.032-.1.05a5.223,5.223,0,0,1-.687.333,1.848,1.848,0,0,1-.186.055c-.042.012-.086.023-.129.036l-.076.023a5.194,5.194,0,0,1-.657.172,3.755,3.755,0,0,1-.42.041l-.188.014c-.068,0-.135.014-.2.021a2.608,2.608,0,0,1-.32.026ZM1.4,5.888V14.1a5.328,5.328,0,0,0,.385,2.038l.358-.436c.563-.687,1.611-1.963,1.619-1.971A3.616,3.616,0,0,1,6.4,12.259a2.71,2.71,0,0,1,1.05.22,6.455,6.455,0,0,1,1.01.561l.09.058a2.329,2.329,0,0,0,1.186.537c.024,0,.049,0,.074,0a1.04,1.04,0,0,0,.41-.143,13.5,13.5,0,0,0,2.123-2.619c.057-.081.094-.134.107-.15a3.345,3.345,0,0,1,2.619-1.4,2.983,2.983,0,0,1,1.551.441c.194.116,1.535,1.052,1.981,1.431v-5.3c0-2.73-1.669-4.493-4.251-4.493H5.638C3.061,1.395,1.4,3.158,1.4,5.888ZM4.06,6.993A2.4,2.4,0,0,1,4,6.468a2.5,2.5,0,0,1,5,.046,2.495,2.495,0,0,1-4.941.479Z"
      fill={color}
    />
  </g>
);
const Light = ({ color, strokeWidth }: { color: string; strokeWidth: number }) => (
  <g transform="translate(2 2)">
    <path
      d="M13.553,0H4.9C1.889,0,0,2.134,0,5.154V13.3c0,3.02,1.881,5.154,4.9,5.154h8.648c3.024,0,4.905-2.134,4.905-5.154V5.154C18.457,2.134,16.576,0,13.553,0Z"
      transform="translate(0.75 0.75)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M3.691,1.846A1.846,1.846,0,1,1,1.845,0,1.847,1.847,0,0,1,3.691,1.846Z"
      transform="translate(5.012 4.939)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M17.457,2.929a22.809,22.809,0,0,0-3-2.593A2.345,2.345,0,0,0,11.3,1.1c-.765.991-1.243,2.324-2.4,2.949-1.423.771-2.259-.472-3.446-.97-1.325-.555-2.331.443-3.105,1.4S.788,6.389,0,7.339"
      transform="translate(1.75 10.022)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

interface IPhotoProps {
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

const Photo = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: IPhotoProps) => {
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

Photo.displayName = 'PhotoIcon';

export default Photo;
