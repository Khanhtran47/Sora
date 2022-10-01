/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

const Bold = ({ color }) => (
  <path
    d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5Z"
    fill={color}
  />
);

const Light = ({ color }) => (
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM4.5 5C4.5 4.72386 4.72386 4.5 5 4.5H19C19.2761 4.5 19.5 4.72386 19.5 5V19C19.5 19.2761 19.2761 19.5 19 19.5H5C4.72386 19.5 4.5 19.2761 4.5 19V5Z"
    fill={color}
  />
);

const Stop = ({
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
          <Light color={fill} />
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

Stop.displayName = 'StopIcon';

Bold.propTypes = {
  color: PropTypes.string,
};

Light.propTypes = {
  color: PropTypes.string,
};

Stop.propTypes = {
  fill: PropTypes.string,
  filled: PropTypes.bool,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Stop;
