const Bold = ({ color }: { color: string }) => (
  <g>
    <path
      d="M16.8 2H14.2C11 2 9 4 9 7.2V11.25H13.44L11.37 9.18C11.22 9.03 11.15 8.84 11.15 8.65C11.15 8.46 11.22 8.27 11.37 8.12C11.66 7.83 12.14 7.83 12.43 8.12L15.78 11.47C16.07 11.76 16.07 12.24 15.78 12.53L12.43 15.88C12.14 16.17 11.66 16.17 11.37 15.88C11.08 15.59 11.08 15.11 11.37 14.82L13.44 12.75H9V16.8C9 20 11 22 14.2 22H16.79C19.99 22 21.99 20 21.99 16.8V7.2C22 4 20 2 16.8 2Z"
      fill={color}
    />
    <path
      d="M2.75 11.25C2.34 11.25 2 11.59 2 12C2 12.41 2.34 12.75 2.75 12.75H9V11.25H2.75Z"
      fill={color}
    />
  </g>
);

const Light = ({ color }: { color: string }) => (
  <g>
    <path
      d="M15.2405 22.2705H15.1105C10.6705 22.2705 8.5305 20.5205 8.1605 16.6005C8.1205 16.1905 8.4205 15.8205 8.8405 15.7805C9.2505 15.7405 9.6205 16.0505 9.6605 16.4605C9.9505 19.6005 11.4305 20.7705 15.1205 20.7705H15.2505C19.3205 20.7705 20.7605 19.3305 20.7605 15.2605V8.74047C20.7605 4.67047 19.3205 3.23047 15.2505 3.23047H15.1205C11.4105 3.23047 9.9305 4.42047 9.6605 7.62047C9.6105 8.03047 9.2705 8.34047 8.8405 8.30047C8.4205 8.27047 8.1205 7.90047 8.1505 7.49047C8.4905 3.51047 10.6405 1.73047 15.1105 1.73047H15.2405C20.1505 1.73047 22.2505 3.83047 22.2505 8.74047V15.2605C22.2505 20.1705 20.1505 22.2705 15.2405 22.2705Z"
      fill={color}
    />
    <path
      d="M14.88 12.75H2C1.59 12.75 1.25 12.41 1.25 12C1.25 11.59 1.59 11.25 2 11.25H14.88C15.29 11.25 15.63 11.59 15.63 12C15.63 12.41 15.3 12.75 14.88 12.75Z"
      fill={color}
    />
    <path
      d="M12.6498 16.0998C12.4598 16.0998 12.2698 16.0298 12.1198 15.8798C11.8298 15.5898 11.8298 15.1098 12.1198 14.8198L14.9398 11.9998L12.1198 9.17984C11.8298 8.88984 11.8298 8.40984 12.1198 8.11984C12.4098 7.82984 12.8898 7.82984 13.1798 8.11984L16.5298 11.4698C16.8198 11.7598 16.8198 12.2398 16.5298 12.5298L13.1798 15.8798C13.0298 16.0298 12.8398 16.0998 12.6498 16.0998Z"
      fill={color}
    />
  </g>
);

interface ILogInProps {
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

const LogIn = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}: ILogInProps) => {
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

LogIn.displayName = 'LogInIcon';

export default LogIn;
