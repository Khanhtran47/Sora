/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

import Svg from '../../components/styles/Svg.styles';

const Bold = ({ color }) => (
  <g transform="translate(2 2)">
    <path
      d="M14.34,20H5.67C2.279,20,0,17.625,0,14.091V5.92C0,2.379,2.279,0,5.67,0h8.67C17.725,0,20,2.379,20,5.92v8.171C20,17.625,17.725,20,14.34,20ZM6.44,9.125a.875.875,0,0,0-.62,1.5L8.2,12.99a.881.881,0,0,0,1.23,0L14.18,8.24A.877.877,0,0,0,12.94,7L8.81,11.13,7.06,9.38A.868.868,0,0,0,6.44,9.125Z"
      transform="translate(0 0)"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }) => (
  <g transform="translate(2 2)">
    <path
      d="M0,2.373,2.374,4.746,7.12,0"
      transform="translate(6.44 7.627)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

const Tick = ({
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
          viewBox="0 0 24 24"
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
          viewBox="0 0 24 24"
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

Tick.displayName = 'IconlyPlay';

Bold.propTypes = {
  color: PropTypes.string,
};

Light.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Tick.propTypes = {
  fill: PropTypes.string,
  filled: PropTypes.bool,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Tick;
