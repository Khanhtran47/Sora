/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

import Svg from '../../components/styles/Svg.styles';

const Bold = ({ color }) => (
  <g>
    <rect
      x="6"
      y="6"
      width="36"
      height="36"
      rx="3"
      fill={color}
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 22.5C25.3807 22.5 26.5 21.3807 26.5 20C26.5 18.6193 25.3807 17.5 24 17.5C22.6193 17.5 21.5 18.6193 21.5 20C21.5 21.3807 22.6193 22.5 24 22.5Z"
      fill="#FFF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 30.5C25.3807 30.5 26.5 29.3807 26.5 28C26.5 26.6193 25.3807 25.5 24 25.5C22.6193 25.5 21.5 26.6193 21.5 28C21.5 29.3807 22.6193 30.5 24 30.5Z"
      fill="#FFF"
    />
    <path
      d="M15.5 17V31"
      stroke="#FFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32.5 17V31"
      stroke="#FFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

const Light = ({ color, strokeWidth }) => (
  <g>
    <rect
      x="6"
      y="6"
      width="36"
      height="36"
      rx="3"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 22.5C25.3807 22.5 26.5 21.3807 26.5 20C26.5 18.6193 25.3807 17.5 24 17.5C22.6193 17.5 21.5 18.6193 21.5 20C21.5 21.3807 22.6193 22.5 24 22.5Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 30.5C25.3807 30.5 26.5 29.3807 26.5 28C26.5 26.6193 25.3807 25.5 24 25.5C22.6193 25.5 21.5 26.6193 21.5 28C21.5 29.3807 22.6193 30.5 24 30.5Z"
      fill={color}
    />
    <path
      d="M15.5 17V31"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32.5 17V31"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

const Ratio = ({
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
        <Svg
          className=""
          width={size || width || 24}
          height={size || height || 24}
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          css={{
            display: 'inline',
          }}
          {...props}
        >
          <Light color={fill} strokeWidth={2} />
        </Svg>
      );
    default:
      return (
        <Svg
          className=""
          width={size || width || 24}
          height={size || height || 24}
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          css={{
            display: 'inline',
          }}
          {...props}
        >
          <Bold color={fill} />;
        </Svg>
      );
  }
};

Ratio.displayName = 'RatioIcon';

Bold.propTypes = {
  color: PropTypes.string,
};

Light.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Ratio.propTypes = {
  fill: PropTypes.string,
  filled: PropTypes.bool,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Ratio;
