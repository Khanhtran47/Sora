/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

import Svg from '../../components/styles/Svg.styles';

const Bold = ({ color }) => (
  <g data-name="Layer 2">
    <g data-name="brush">
      <rect width="24" height="24" opacity="0" />
      <path
        d="M7.12 12.55a4 4 0 0 0-3.07 3.86v3.11a.47.47 0 0 0 .48.48l3.24-.06a3.78 3.78 0 0 0 3.44-2.2 3.65 3.65 0 0 0-4.09-5.19z"
        fill={color}
      />
      <path
        d="M19.26 4.46a2.14 2.14 0 0 0-2.88.21L10 11.08a.47.47 0 0 0 0 .66L12.25 14a.47.47 0 0 0 .66 0l6.49-6.47a2.06 2.06 0 0 0 .6-1.47 2 2 0 0 0-.74-1.6z"
        fill={color}
      />
    </g>
  </g>
);

const Light = ({ color, strokeWidth }) => (
  <g data-name="Layer 2">
    <g data-name="brush">
      <rect width="24" height="24" opacity="0" />
      <path
        d="M20 6.83a2.76 2.76 0 0 0-.82-2 2.89 2.89 0 0 0-4 0l-6.6 6.6h-.22a4.42 4.42 0 0 0-4.3 4.31L4 19a1 1 0 0 0 .29.73A1.05 1.05 0 0 0 5 20l3.26-.06a4.42 4.42 0 0 0 4.31-4.3v-.23l6.61-6.6A2.74 2.74 0 0 0 20 6.83zM8.25 17.94L6 18v-2.23a2.4 2.4 0 0 1 2.4-2.36 2.15 2.15 0 0 1 2.15 2.19 2.4 2.4 0 0 1-2.3 2.34zm9.52-10.55l-5.87 5.87a4.55 4.55 0 0 0-.52-.64 3.94 3.94 0 0 0-.64-.52l5.87-5.86a.84.84 0 0 1 1.16 0 .81.81 0 0 1 .23.59.79.79 0 0 1-.23.56z"
        fill={color}
        strokeWidth={strokeWidth}
      />
    </g>
  </g>
);

const Brush = ({
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
          viewBox="0 0 22 22"
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
          viewBox="0 0 22 22"
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

Brush.displayName = 'BrushIcon';

Bold.propTypes = {
  color: PropTypes.string,
};

Light.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Brush.propTypes = {
  fill: PropTypes.string,
  filled: PropTypes.bool,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Brush;
