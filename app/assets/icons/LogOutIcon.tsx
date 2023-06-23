const Bold = ({ color }: { color: string }) => (
  <g>
    <path
      d="M16.8 2H14.2C11 2 9 4 9 7.2V11.25H15.25C15.66 11.25 16 11.59 16 12C16 12.41 15.66 12.75 15.25 12.75H9V16.8C9 20 11 22 14.2 22H16.79C19.99 22 21.99 20 21.99 16.8V7.2C22 4 20 2 16.8 2Z"
      fill={color}
    />
    <path
      d="M4.56141 11.2498L6.63141 9.17984C6.78141 9.02984 6.85141 8.83984 6.85141 8.64984C6.85141 8.45984 6.78141 8.25984 6.63141 8.11984C6.34141 7.82984 5.86141 7.82984 5.57141 8.11984L2.22141 11.4698C1.93141 11.7598 1.93141 12.2398 2.22141 12.5298L5.57141 15.8798C5.86141 16.1698 6.34141 16.1698 6.63141 15.8798C6.92141 15.5898 6.92141 15.1098 6.63141 14.8198L4.56141 12.7498H9.00141V11.2498H4.56141Z"
      fill={color}
    />
  </g>
);

const Light = ({ color }: { color: string }) => (
  <g>
    <path
      d="M15.2405 22.2705H15.1105C10.6705 22.2705 8.5305 20.5205 8.1605 16.6005C8.1205 16.1905 8.4205 15.8205 8.8405 15.7805C9.2405 15.7405 9.6205 16.0505 9.6605 16.4605C9.9505 19.6005 11.4305 20.7705 15.1205 20.7705H15.2505C19.3205 20.7705 20.7605 19.3305 20.7605 15.2605V8.74047C20.7605 4.67047 19.3205 3.23047 15.2505 3.23047H15.1205C11.4105 3.23047 9.9305 4.42047 9.6605 7.62047C9.6105 8.03047 9.2605 8.34047 8.8405 8.30047C8.4205 8.27047 8.1205 7.90047 8.1505 7.49047C8.4905 3.51047 10.6405 1.73047 15.1105 1.73047H15.2405C20.1505 1.73047 22.2505 3.83047 22.2505 8.74047V15.2605C22.2505 20.1705 20.1505 22.2705 15.2405 22.2705Z"
      fill={color}
    />
    <path
      d="M15.0011 12.75H3.62109C3.21109 12.75 2.87109 12.41 2.87109 12C2.87109 11.59 3.21109 11.25 3.62109 11.25H15.0011C15.4111 11.25 15.7511 11.59 15.7511 12C15.7511 12.41 15.4111 12.75 15.0011 12.75Z"
      fill={color}
    />
    <path
      d="M5.85141 16.0998C5.66141 16.0998 5.47141 16.0298 5.32141 15.8798L1.97141 12.5298C1.68141 12.2398 1.68141 11.7598 1.97141 11.4698L5.32141 8.11984C5.61141 7.82984 6.09141 7.82984 6.38141 8.11984C6.67141 8.40984 6.67141 8.88984 6.38141 9.17984L3.56141 11.9998L6.38141 14.8198C6.67141 15.1098 6.67141 15.5898 6.38141 15.8798C6.24141 16.0298 6.04141 16.0998 5.85141 16.0998Z"
      fill={color}
    />
  </g>
);

interface ILogOutProps {
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

const LogOut = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: ILogOutProps) => {
  switch (filled) {
    case false:
      return (
        <svg
          className=""
          width={width || size}
          height={height || size}
          viewBox="0 0 22 22"
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

LogOut.displayName = 'LogOutIcon';

export default LogOut;
