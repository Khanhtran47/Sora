/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

import Svg from '../../components/styles/Svg.styles';

const Bold = ({ color }) => (
  <g transform="translate(2 4)">
    <path
      d="M16.219,16H13.066a.583.583,0,0,1-.59-.573V13.4a.708.708,0,0,0-.725-.7.716.716,0,0,0-.725.7v2.03a.582.582,0,0,1-.589.573H3.782A3.733,3.733,0,0,1,0,12.326V9.916a.693.693,0,0,1,.739-.661A1.283,1.283,0,0,0,2.021,8a1.212,1.212,0,0,0-1.3-1.174.734.734,0,0,1-.513-.207A.69.69,0,0,1,0,6.116V3.683A3.742,3.742,0,0,1,3.791,0h6.646a.582.582,0,0,1,.589.573v2.4a.725.725,0,0,0,.725.7.716.716,0,0,0,.725-.7V.573A.583.583,0,0,1,13.066,0h3.153A3.733,3.733,0,0,1,20,3.674V6.041a.694.694,0,0,1-.212.5.734.734,0,0,1-.513.206,1.255,1.255,0,1,0-.014,2.509A.693.693,0,0,1,20,9.916v2.41A3.733,3.733,0,0,1,16.219,16ZM11.75,5.7a.724.724,0,0,0-.725.7v3.758a.725.725,0,0,0,.725.7.716.716,0,0,0,.725-.7V6.407A.716.716,0,0,0,11.75,5.7Z"
      fill={color}
    />
  </g>
);

const Light = ({ color, strokeWidth }) => (
  <g transform="translate(2 4)">
    <path
      d="M16.7,16A3.277,3.277,0,0,0,20,12.743V10.151a2.15,2.15,0,1,1,0-4.3V3.257A3.277,3.277,0,0,0,16.7,0H3.3A3.277,3.277,0,0,0,0,3.257V5.935A2.09,2.09,0,0,1,2.177,8,2.159,2.159,0,0,1,0,10.151v2.593A3.277,3.277,0,0,0,3.3,16Z"
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
