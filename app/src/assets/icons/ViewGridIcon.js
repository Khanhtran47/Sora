/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

import Svg from '../../components/styles/Svg.styles';

const Bold = ({ color, strokeWidth }) => (
  <>
    <rect
      x="6"
      y="6"
      width="36"
      height="36"
      rx="3"
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <rect
      x="13"
      y="13"
      width="8"
      height="8"
      fill="#FFF"
      stroke="#FFF"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <rect
      x="27"
      y="13"
      width="8"
      height="8"
      fill="#FFF"
      stroke="#FFF"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <rect
      x="13"
      y="27"
      width="8"
      height="8"
      fill="#FFF"
      stroke="#FFF"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <rect
      x="27"
      y="27"
      width="8"
      height="8"
      fill="#FFF"
      stroke="#FFF"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </>
);

const Light = ({ color, strokeWidth }) => (
  <>
    <rect
      x="13"
      y="13"
      width="8"
      height="8"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <rect
      x="27"
      y="13"
      width="8"
      height="8"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <rect
      x="13"
      y="27"
      width="8"
      height="8"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <rect
      x="27"
      y="27"
      width="8"
      height="8"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </>
);

const ViewGrid = ({
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
          <Light color={fill} strokeWidth={1.5} />
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
          <Bold color={fill} strokeWidth={1.5} />;
        </Svg>
      );
  }
};

ViewGrid.displayName = 'ViewGrid';

Bold.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Light.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ViewGrid.propTypes = {
  fill: PropTypes.string,
  filled: PropTypes.bool,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ViewGrid;
