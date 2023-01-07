/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

const Bold = ({ color }) => (
  <g transform="translate(2 2)">
    <path
      d="M17.741,19.608l-2.12-2.43a1.083,1.083,0,0,1,0-1.524.986.986,0,0,1,1.393,0l2.554,2.062h.045a1.348,1.348,0,0,1,0,1.892,1.315,1.315,0,0,1-1.872,0ZM0,8.67A8.624,8.624,0,0,1,8.578,0a8.531,8.531,0,0,1,6.065,2.54,8.716,8.716,0,0,1,2.512,6.13A8.624,8.624,0,0,1,8.578,17.34,8.624,8.624,0,0,1,0,8.67Z"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }) => (
  <g
    transform="translate(2 2)"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeMiterlimit={10}
    strokeWidth={strokeWidth}
  >
    <circle cx={8.989} cy={8.989} r={8.989} transform="translate(.778 .778)" />
    <path d="M16.018 16.485L19.542 20" />
  </g>
);

const Search = ({
  fill = 'currentColor',
  filled = false,
  size = 0,
  height = 0,
  width = 0,
  ...props
}) => {
  switch (filled) {
    case false:
      return (
        <svg
          width={size || width || 24}
          height={size || height || 24}
          viewBox="0 0 24 24"
          {...props}
        >
          <Light color={fill} strokeWidth={1.5} />
        </svg>
      );
    default:
      return (
        <svg
          width={size || width || 24}
          height={size || height || 24}
          viewBox="0 0 24 24"
          {...props}
        >
          <Bold color={fill} />;
        </svg>
      );
  }
};

Search.displayName = 'PauseIcon';

Bold.propTypes = {
  color: PropTypes.string,
};

Light.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Search.propTypes = {
  fill: PropTypes.string,
  filled: PropTypes.bool,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Search;
