const Bold = ({ color }: { color: string }) => (
  <g>
    <path
      d="M20.9808 3.02084C20.1108 2.15084 18.8808 1.81084 17.6908 2.11084L7.89084 4.56084C6.24084 4.97084 4.97084 6.25084 4.56084 7.89084L2.11084 17.7008C1.81084 18.8908 2.15084 20.1208 3.02084 20.9908C3.68084 21.6408 4.55084 22.0008 5.45084 22.0008C5.73084 22.0008 6.02084 21.9708 6.30084 21.8908L16.1108 19.4408C17.7508 19.0308 19.0308 17.7608 19.4408 16.1108L21.8908 6.30084C22.1908 5.11084 21.8508 3.88084 20.9808 3.02084ZM12.0008 15.8808C9.86084 15.8808 8.12084 14.1408 8.12084 12.0008C8.12084 9.86084 9.86084 8.12084 12.0008 8.12084C14.1408 8.12084 15.8808 9.86084 15.8808 12.0008C15.8808 14.1408 14.1408 15.8808 12.0008 15.8808Z"
      fill={color}
    />
  </g>
);

const Light = ({ color }: { color: string }) => (
  <g>
    <path
      d="M4.90926 22.8207C3.81926 22.8207 2.88926 22.4707 2.20926 21.7907C1.23926 20.8207 0.939261 19.3407 1.36926 17.6207L3.84926 7.69075C4.27926 5.97075 5.95926 4.30075 7.66926 3.87075L17.5993 1.39075C19.3193 0.960746 20.7993 1.26075 21.7693 2.23075C22.7393 3.20075 23.0393 4.68075 22.6093 6.40075L20.1293 16.3307C19.6993 18.0507 18.0193 19.7207 16.3093 20.1507L6.37926 22.6307C5.86926 22.7507 5.37926 22.8207 4.90926 22.8207ZM17.9793 2.83075L8.04926 5.32075C6.87926 5.61075 5.60926 6.88075 5.30926 8.05075L2.82926 17.9807C2.52926 19.1707 2.68926 20.1407 3.26926 20.7307C3.84926 21.3107 4.82926 21.4707 6.01926 21.1707L15.9493 18.6907C17.1193 18.4007 18.3893 17.1207 18.6793 15.9607L21.1593 6.03075C21.4593 4.84075 21.2993 3.87075 20.7193 3.28075C20.1393 2.69075 19.1693 2.54075 17.9793 2.83075Z"
      fill={color}
    />
    <path
      d="M12 16.25C9.66 16.25 7.75 14.34 7.75 12C7.75 9.66 9.66 7.75 12 7.75C14.34 7.75 16.25 9.66 16.25 12C16.25 14.34 14.34 16.25 12 16.25ZM12 9.25C10.48 9.25 9.25 10.48 9.25 12C9.25 13.52 10.48 14.75 12 14.75C13.52 14.75 14.75 13.52 14.75 12C14.75 10.48 13.52 9.25 12 9.25Z"
      fill={color}
    />
  </g>
);

interface IDiscoverProps {
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

const Discover = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: IDiscoverProps) => {
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
          <Light color={fill} />
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

Discover.displayName = 'DiscoverIcon';

export default Discover;
