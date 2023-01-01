/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

import Svg from '../../components/styles/Svg.styles';

const Bold = ({ color }) => (
  <g>
    <path
      d="M24 6V42"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 34L16 12V34H4Z"
      fill={color}
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
    <path
      d="M44 34H32V12L44 34Z"
      fill={color}
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </g>
);

const Light = ({ color, strokeWidth }) => (
  <g>
    <path
      d="M24 6V42"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 34L16 12V34H4Z"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path
      d="M44 34H32V12L44 34Z"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </g>
);

const Flip = ({
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

Flip.displayName = 'FlipIcon';

Bold.propTypes = {
  color: PropTypes.string,
};

Light.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Flip.propTypes = {
  fill: PropTypes.string,
  filled: PropTypes.bool,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Flip;
