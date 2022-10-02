/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

import Svg from '../../components/styles/svg';

const Bold = ({ color }) => (
  <g transform="translate(7 6)">
    <path
      d="M.369,4.869c.057-.058.27-.306.469-.51A21.69,21.69,0,0,1,6.633.335,4.617,4.617,0,0,1,7.812,0a1.933,1.933,0,0,1,.9.218,1.874,1.874,0,0,1,.795.9,9.84,9.84,0,0,1,.256,1.064A23.979,23.979,0,0,1,10,5.992a27.724,27.724,0,0,1-.213,3.689,8.495,8.495,0,0,1-.341,1.327A1.785,1.785,0,0,1,7.868,12H7.812a4.879,4.879,0,0,1-1.321-.409A21.69,21.69,0,0,1,.823,7.625a5.66,5.66,0,0,1-.482-.554A1.783,1.783,0,0,1,0,6.007,1.875,1.875,0,0,1,.369,4.869"
      transform="translate(0)"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }) => (
  <g transform="translate(15.5 5) rotate(90)">
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

const ChevronLeft = ({
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

ChevronLeft.displayName = 'IconlyPlay';

Bold.propTypes = {
  color: PropTypes.string,
};

Light.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ChevronLeft.propTypes = {
  fill: PropTypes.string,
  filled: PropTypes.bool,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ChevronLeft;
