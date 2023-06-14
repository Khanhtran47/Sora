const Bold = ({ color }: { color: string }) => (
  <g>
    <path
      d="M21.5287 15.9294C21.3687 15.6594 20.9187 15.2394 19.7987 15.4394C19.1787 15.5494 18.5487 15.5994 17.9187 15.5694C15.5887 15.4694 13.4787 14.3994 12.0087 12.7494C10.7087 11.2994 9.90873 9.40938 9.89873 7.36938C9.89873 6.22938 10.1187 5.12938 10.5687 4.08938C11.0087 3.07938 10.6987 2.54938 10.4787 2.32938C10.2487 2.09938 9.70873 1.77938 8.64873 2.21938C4.55873 3.93938 2.02873 8.03938 2.32873 12.4294C2.62873 16.5594 5.52873 20.0894 9.36873 21.4194C10.2887 21.7394 11.2587 21.9294 12.2587 21.9694C12.4187 21.9794 12.5787 21.9894 12.7387 21.9894C16.0887 21.9894 19.2287 20.4094 21.2087 17.7194C21.8787 16.7894 21.6987 16.1994 21.5287 15.9294Z"
      fill={color}
    />
  </g>
);

const Light = ({ color }: { color: string }) => (
  <g>
    <path
      d="M12.4585 22.7482C12.2885 22.7482 12.1185 22.7482 11.9485 22.7382C6.34848 22.4882 1.66848 17.9782 1.27848 12.4782C0.938483 7.75816 3.66848 3.34816 8.06848 1.49816C9.31848 0.978161 9.97848 1.37816 10.2585 1.66816C10.5385 1.94816 10.9285 2.59816 10.4085 3.78816C9.94848 4.84816 9.71848 5.97816 9.72848 7.13816C9.74848 11.5682 13.4285 15.3282 17.9185 15.5082C18.5685 15.5382 19.2085 15.4882 19.8285 15.3782C21.1485 15.1382 21.6985 15.6682 21.9085 16.0082C22.1185 16.3482 22.3585 17.0782 21.5585 18.1582C19.4385 21.0582 16.0685 22.7482 12.4585 22.7482ZM2.76848 12.3682C3.10848 17.1282 7.16848 21.0282 12.0085 21.2382C15.2985 21.3982 18.4185 19.8982 20.3385 17.2782C20.4885 17.0682 20.5585 16.9182 20.5885 16.8382C20.4985 16.8282 20.3385 16.8182 20.0885 16.8682C19.3585 16.9982 18.5985 17.0482 17.8485 17.0182C12.5685 16.8082 8.24848 12.3782 8.21848 7.15816C8.21848 5.77816 8.48848 4.44816 9.03848 3.19816C9.13848 2.97816 9.15848 2.82816 9.16848 2.74816C9.07848 2.74816 8.91848 2.76816 8.65848 2.87816C4.84848 4.47816 2.48848 8.29816 2.76848 12.3682Z"
      fill={color}
    />
  </g>
);

interface IMoonProps {
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

const Moon = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  className = '',
  ...props
}: IMoonProps) => {
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

Moon.displayName = 'MoonIcon';

export default Moon;
