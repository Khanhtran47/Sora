/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

import Svg from '../../components/styles/Svg.styles';

const Bold = ({ color }) => (
  <g transform="translate(6 7)">
    <path
      d="M4.869,9.631c-.058-.057-.306-.27-.51-.469a21.69,21.69,0,0,1-4.024-5.8A4.617,4.617,0,0,1,0,2.188a1.933,1.933,0,0,1,.218-.9A1.874,1.874,0,0,1,1.122.5,9.84,9.84,0,0,1,2.186.242,23.979,23.979,0,0,1,5.992,0,27.724,27.724,0,0,1,9.681.213a8.495,8.495,0,0,1,1.327.341A1.785,1.785,0,0,1,12,2.132v.057a4.879,4.879,0,0,1-.409,1.321A21.69,21.69,0,0,1,7.625,9.177a5.66,5.66,0,0,1-.554.482A1.783,1.783,0,0,1,6.007,10a1.875,1.875,0,0,1-1.138-.369"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }) => (
  <g transform="translate(5 8.5)">
    <path
      d="M14,0,7,7,0,0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

const ChevronDown = ({
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

ChevronDown.displayName = 'IconlyPlay';

Bold.propTypes = {
  color: PropTypes.string,
};

Light.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ChevronDown.propTypes = {
  fill: PropTypes.string,
  filled: PropTypes.bool,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ChevronDown;
