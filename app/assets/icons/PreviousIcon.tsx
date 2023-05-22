const Bold = ({ color }: { color: string }) => (
  <g>
    <path
      d="M20.2409 7.21957V16.7896C20.2409 18.7496 18.1109 19.9796 16.4109 18.9996L12.2609 16.6096L8.11094 14.2096C6.41094 13.2296 6.41094 10.7796 8.11094 9.79957L12.2609 7.39957L16.4109 5.00957C18.1109 4.02957 20.2409 5.24957 20.2409 7.21957Z"
      fill={color}
    />
    <path
      d="M3.76172 18.9303C3.35172 18.9303 3.01172 18.5903 3.01172 18.1803V5.82031C3.01172 5.41031 3.35172 5.07031 3.76172 5.07031C4.17172 5.07031 4.51172 5.41031 4.51172 5.82031V18.1803C4.51172 18.5903 4.17172 18.9303 3.76172 18.9303Z"
      fill={color}
    />
  </g>
);

const Light = ({ color }: { color: string }) => (
  <g>
    <path
      d="M17.6916 20.0902C17.1216 20.0902 16.5616 19.9402 16.0416 19.6402L7.75156 14.8602C6.72156 14.2602 6.10156 13.1902 6.10156 12.0002C6.10156 10.8102 6.72156 9.74019 7.75156 9.14019L16.0416 4.36016C17.0716 3.76016 18.3016 3.76016 19.3416 4.36016C20.3816 4.96016 20.9915 6.02017 20.9915 7.22017V16.7902C20.9915 17.9802 20.3716 19.0502 19.3416 19.6502C18.8216 19.9402 18.2616 20.0902 17.6916 20.0902ZM17.6916 5.41017C17.3816 5.41017 17.0716 5.49016 16.7916 5.65016L8.50156 10.4302C7.94156 10.7602 7.60156 11.3402 7.60156 11.9902C7.60156 12.6402 7.94156 13.2202 8.50156 13.5502L16.7916 18.3302C17.3516 18.6602 18.0316 18.6602 18.5916 18.3302C19.1516 18.0002 19.4915 17.4202 19.4915 16.7702V7.20018C19.4915 6.55018 19.1516 5.97019 18.5916 5.64019C18.3116 5.50019 18.0016 5.41017 17.6916 5.41017Z"
      fill={color}
    />
    <path
      d="M3.75781 18.9303C3.34781 18.9303 3.00781 18.5903 3.00781 18.1803V5.82031C3.00781 5.41031 3.34781 5.07031 3.75781 5.07031C4.16781 5.07031 4.50781 5.41031 4.50781 5.82031V18.1803C4.50781 18.5903 4.16781 18.9303 3.75781 18.9303Z"
      fill={color}
    />
  </g>
);

interface IPreviousProps {
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

const Previous = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: IPreviousProps) => {
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
          <Light color={fill} />
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

Previous.displayName = 'PreviousIcon';

export default Previous;
