const Bold = ({ color }: { color: string }) => (
  <g>
    <path
      d="M3.76172 7.21957V16.7896C3.76172 18.7496 5.89172 19.9796 7.59172 18.9996L11.7417 16.6096L15.8917 14.2096C17.5917 13.2296 17.5917 10.7796 15.8917 9.79957L11.7417 7.39957L7.59172 5.00957C5.89172 4.02957 3.76172 5.24957 3.76172 7.21957Z"
      fill={color}
    />
    <path
      d="M20.2383 18.9303C19.8283 18.9303 19.4883 18.5903 19.4883 18.1803V5.82031C19.4883 5.41031 19.8283 5.07031 20.2383 5.07031C20.6483 5.07031 20.9883 5.41031 20.9883 5.82031V18.1803C20.9883 18.5903 20.6583 18.9303 20.2383 18.9303Z"
      fill={color}
    />
  </g>
);

const Light = ({ color }: { color: string }) => (
  <g>
    <path
      d="M6.3078 20.0884C5.7378 20.0884 5.17781 19.9384 4.65781 19.6384C3.61781 19.0384 3.00781 17.9784 3.00781 16.7784V7.20842C3.00781 6.01842 3.62781 4.94844 4.65781 4.34844C5.69781 3.74844 6.92779 3.74844 7.95779 4.34844L16.2478 9.12844C17.2778 9.72844 17.8978 10.7984 17.8978 11.9884C17.8978 13.1784 17.2778 14.2484 16.2478 14.8484L7.95779 19.6284C7.43779 19.9384 6.8778 20.0884 6.3078 20.0884ZM6.3078 5.40844C5.9978 5.40844 5.68781 5.48843 5.40781 5.64843C4.84781 5.97843 4.50781 6.55842 4.50781 7.20842V16.7784C4.50781 17.4284 4.84781 18.0084 5.40781 18.3384C5.96781 18.6584 6.64779 18.6684 7.20779 18.3384L15.4978 13.5584C16.0578 13.2284 16.3978 12.6484 16.3978 11.9984C16.3978 11.3484 16.0578 10.7684 15.4978 10.4384L7.20779 5.65844C6.92779 5.49844 6.6178 5.40844 6.3078 5.40844Z"
      fill={color}
    />
    <path
      d="M20.2422 18.9303C19.8322 18.9303 19.4922 18.5903 19.4922 18.1803V5.82031C19.4922 5.41031 19.8322 5.07031 20.2422 5.07031C20.6522 5.07031 20.9922 5.41031 20.9922 5.82031V18.1803C20.9922 18.5903 20.6622 18.9303 20.2422 18.9303Z"
      fill={color}
    />
  </g>
);

interface INextProps {
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

const Next = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: INextProps) => {
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

Next.displayName = 'NextIcon';

export default Next;
