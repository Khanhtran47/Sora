/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

const Bold = ({ color }) => (
  <g transform="translate(2 2)">
    <path
      d="M10,20a10,10,0,1,1,10-9.994A10.008,10.008,0,0,1,10,20ZM8.861,6.03a1.338,1.338,0,0,0-.608.145,1.252,1.252,0,0,0-.541.6,6.314,6.314,0,0,0-.174.7A15.391,15.391,0,0,0,7.375,10a17.717,17.717,0,0,0,.145,2.441,1.1,1.1,0,0,1,.024.11,3.911,3.911,0,0,0,.207.768,1.21,1.21,0,0,0,1.072.656h.039a3.188,3.188,0,0,0,.9-.27,14.727,14.727,0,0,0,3.851-2.624l.058-.058a3.94,3.94,0,0,0,.27-.309,1.161,1.161,0,0,0,.231-.7,1.217,1.217,0,0,0-.251-.754l-.063-.068c-.064-.07-.162-.176-.254-.269A14.777,14.777,0,0,0,9.662,6.251,3.356,3.356,0,0,0,8.861,6.03Z"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }) => (
  <g transform="translate(2 2)">
    <path
      d="M10,0A10,10,0,1,1,0,10,10,10,0,0,1,10,0Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
    <path
      d="M5.16,3.969A14.915,14.915,0,0,1,1.432,6.512a3.983,3.983,0,0,1-.664.214.5.5,0,0,1-.459-.27,5.24,5.24,0,0,1-.166-.689A16.6,16.6,0,0,1,0,3.364,15.624,15.624,0,0,1,.158.879C.186.723.268.364.292.306A.5.5,0,0,1,.518.06.494.494,0,0,1,.768,0a3.49,3.49,0,0,1,.575.178A14.782,14.782,0,0,1,5.15,2.746c.068.073.255.269.286.309a.5.5,0,0,1,.011.6C5.414,3.7,5.223,3.9,5.16,3.969Z"
      transform="translate(7.89 6.498)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    />
  </g>
);

const Play = ({
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

Play.displayName = 'IconlyPlay';

Bold.propTypes = {
  color: PropTypes.string,
};

Light.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Play.propTypes = {
  fill: PropTypes.string,
  filled: PropTypes.bool,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Play;
