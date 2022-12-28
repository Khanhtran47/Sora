/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

import Svg from '../../components/styles/Svg.styles';

const Bold = ({ color }) => (
  <g transform="translate(2 2.5)">
    <path
      d="M15.919,11.82a1.1,1.1,0,0,0-.319.97l.889,4.92a1.08,1.08,0,0,1-.45,1.08,1.1,1.1,0,0,1-1.17.08L10.44,16.56a1.131,1.131,0,0,0-.5-.131H9.669a.812.812,0,0,0-.27.09L4.969,18.84a1.168,1.168,0,0,1-.71.11,1.112,1.112,0,0,1-.89-1.271l.89-4.92a1.119,1.119,0,0,0-.319-.979L.329,8.28A1.08,1.08,0,0,1,.06,7.15,1.123,1.123,0,0,1,.949,6.4l4.97-.721A1.112,1.112,0,0,0,6.8,5.07L8.989.58a1.041,1.041,0,0,1,.2-.27l.09-.07A.671.671,0,0,1,9.44.11L9.549.07,9.719,0h.421a1.119,1.119,0,0,1,.88.6l2.219,4.47a1.111,1.111,0,0,0,.83.609l4.97.721a1.134,1.134,0,0,1,.91.75,1.086,1.086,0,0,1-.29,1.13Z"
      transform="translate(0 0)"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }) => (
  <g transform="translate(2.5 3)">
    <path
      d="M10.214.441,12.53,5.1a.8.8,0,0,0,.6.437l5.185.749a.8.8,0,0,1,.528.306.77.77,0,0,1-.085,1.032L15,11.258a.762.762,0,0,0-.226.7l.9,5.128a.787.787,0,0,1-.652.892.868.868,0,0,1-.516-.08L9.888,15.478a.776.776,0,0,0-.742,0L4.494,17.912a.812.812,0,0,1-1.077-.33.8.8,0,0,1-.081-.5l.9-5.128a.788.788,0,0,0-.226-.7L.232,7.621a.786.786,0,0,1,0-1.112l0,0a.909.909,0,0,1,.452-.222L5.87,5.534a.812.812,0,0,0,.6-.438L8.784.441a.787.787,0,0,1,.458-.4.8.8,0,0,1,.61.044A.82.82,0,0,1,10.214.441Z"
      transform="translate(0 0)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

const Star = ({
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

Star.displayName = 'StarIcon';

Bold.propTypes = {
  color: PropTypes.string,
};

Light.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Star.propTypes = {
  fill: PropTypes.string,
  filled: PropTypes.bool,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Star;
