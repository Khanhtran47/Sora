const Bold = ({ color }: { color: string }) => (
  <path
    fill={color}
    d="M3 6.25A3.25 3.25 0 0 1 6.25 3h9a3.25 3.25 0 0 1 3.25 3.25v9c0 .646-.189 1.248-.514 1.755l-5.692-5.376a2.25 2.25 0 0 0-3.09 0l-5.69 5.375A3.235 3.235 0 0 1 3 15.25v-9Zm10.747 2.746a1.248 1.248 0 1 0 0-2.496a1.248 1.248 0 0 0 0 2.496Zm-2.483 3.724l5.642 5.327a3.235 3.235 0 0 1-1.656.453h-9a3.235 3.235 0 0 1-1.656-.453l5.64-5.327a.75.75 0 0 1 1.03 0ZM8.75 21a3.247 3.247 0 0 1-2.74-1.5h9.74a3.75 3.75 0 0 0 3.75-3.75V6.011a3.247 3.247 0 0 1 1.5 2.74v7a5.25 5.25 0 0 1-5.25 5.25h-7Z"
  />
);

const Light = ({ color }: { color: string }) => (
  <path
    fill={color}
    d="M13.748 8.996a1.248 1.248 0 1 0 0-2.496a1.248 1.248 0 0 0 0 2.496ZM6.25 3A3.25 3.25 0 0 0 3 6.25v9a3.25 3.25 0 0 0 3.25 3.25h9a3.25 3.25 0 0 0 3.25-3.25v-9A3.25 3.25 0 0 0 15.25 3h-9ZM4.5 6.25c0-.966.784-1.75 1.75-1.75h9c.966 0 1.75.784 1.75 1.75v9c0 .231-.045.452-.126.654l-4.587-4.291a2.25 2.25 0 0 0-3.074 0l-4.587 4.29a1.745 1.745 0 0 1-.126-.653v-9Zm6.762 6.458l4.505 4.214c-.163.05-.337.078-.517.078h-9a1.73 1.73 0 0 1-.517-.078l4.504-4.214a.75.75 0 0 1 1.025 0ZM8.75 21a3.247 3.247 0 0 1-2.74-1.5h9.74a3.75 3.75 0 0 0 3.75-3.75V6.011a3.248 3.248 0 0 1 1.5 2.74v7A5.25 5.25 0 0 1 15.75 21h-7Z"
  />
);

interface ILibraryProps {
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

const Library = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: ILibraryProps) => {
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
          <Light color={fill} />
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

Library.displayName = 'LibraryIcon';

export default Library;
