const Right = ({ color }: { color: string }) => (
  <path
    d="M8.91156 20.6695C8.72156 20.6695 8.53156 20.5995 8.38156 20.4495C8.09156 20.1595 8.09156 19.6795 8.38156 19.3895L14.9016 12.8695C15.3816 12.3895 15.3816 11.6095 14.9016 11.1295L8.38156 4.60953C8.09156 4.31953 8.09156 3.83953 8.38156 3.54953C8.67156 3.25953 9.15156 3.25953 9.44156 3.54953L15.9616 10.0695C16.4716 10.5795 16.7616 11.2695 16.7616 11.9995C16.7616 12.7295 16.4816 13.4195 15.9616 13.9295L9.44156 20.4495C9.29156 20.5895 9.10156 20.6695 8.91156 20.6695Z"
    fill={color}
  />
);

const Left = ({ color }: { color: string }) => (
  <path
    d="M15.0013 20.6695C14.8113 20.6695 14.6213 20.5995 14.4713 20.4495L7.95125 13.9295C6.89125 12.8695 6.89125 11.1295 7.95125 10.0695L14.4713 3.54953C14.7613 3.25953 15.2413 3.25953 15.5312 3.54953C15.8212 3.83953 15.8212 4.31953 15.5312 4.60953L9.01125 11.1295C8.53125 11.6095 8.53125 12.3895 9.01125 12.8695L15.5312 19.3895C15.8212 19.6795 15.8212 20.1595 15.5312 20.4495C15.3813 20.5895 15.1912 20.6695 15.0013 20.6695Z"
    fill={color}
  />
);

const Up = ({ color }: { color: string }) => (
  <path
    d="M19.9195 15.7981C19.7295 15.7981 19.5395 15.7281 19.3895 15.5781L12.8695 9.05813C12.3895 8.57813 11.6095 8.57813 11.1295 9.05813L4.60953 15.5781C4.31953 15.8681 3.83953 15.8681 3.54953 15.5781C3.25953 15.2881 3.25953 14.8081 3.54953 14.5181L10.0695 7.99812C11.1295 6.93813 12.8595 6.93813 13.9295 7.99812L20.4495 14.5181C20.7395 14.8081 20.7395 15.2881 20.4495 15.5781C20.2995 15.7181 20.1095 15.7981 19.9195 15.7981Z"
    fill={color}
  />
);

const Down = ({ color }: { color: string }) => (
  <path
    d="M11.9995 16.8006C11.2995 16.8006 10.5995 16.5306 10.0695 16.0006L3.54953 9.48062C3.25953 9.19062 3.25953 8.71062 3.54953 8.42063C3.83953 8.13063 4.31953 8.13063 4.60953 8.42063L11.1295 14.9406C11.6095 15.4206 12.3895 15.4206 12.8695 14.9406L19.3895 8.42063C19.6795 8.13063 20.1595 8.13063 20.4495 8.42063C20.7395 8.71062 20.7395 9.19062 20.4495 9.48062L13.9295 16.0006C13.3995 16.5306 12.6995 16.8006 11.9995 16.8006Z"
    fill={color}
  />
);

interface IArrowProps {
  /**
   * The color of the icon
   * @default 'currentColor'
   */
  fill?: string;
  /**
   * The direction of the icon
   * @default 'right'
   * @type 'right' | 'left' | 'up' | 'down'
   */
  direction?: 'right' | 'left' | 'up' | 'down';
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

const Arrow = ({
  fill = 'currentColor',
  direction = 'right',
  size = 24,
  height = 24,
  width = 24,
  ...props
}: IArrowProps) => {
  switch (direction) {
    case 'right':
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
          <Right color={fill} />
        </svg>
      );
    case 'left':
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
          <Left color={fill} />
        </svg>
      );
    case 'up':
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
          <Up color={fill} />
        </svg>
      );
    case 'down':
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
          <Down color={fill} />
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
          <Right color={fill} />
        </svg>
      );
  }
};

Arrow.displayName = 'ArrowIcon';

export default Arrow;
