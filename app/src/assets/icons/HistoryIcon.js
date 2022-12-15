/* eslint-disable react/jsx-filename-extension */
import PropTypes from 'prop-types';

import Svg from '../../components/styles/Svg.styles';

const Bold = ({ color }) => (
  <path
    fill={color}
    d="M19.25 12A7.25 7.25 0 0 0 7.584 6.25h.666a1 1 0 0 1 0 2h-3a1 1 0 0 1-1-1V7h-.034l.034-.052V4.25a1 1 0 0 1 2 0v.504A9.21 9.21 0 0 1 12 2.75a9.25 9.25 0 1 1-9.182 8.12c.063-.512.516-.87 1.032-.87c.59 0 1.017.569.949 1.156A7.25 7.25 0 1 0 19.25 12ZM13 8a1 1 0 1 0-2 0v5a1 1 0 0 0 1 1h3a1 1 0 1 0 0-2h-2V8Z"
  />
);

const Light = ({ color }) => (
  <path
    fill={color}
    d="M19.5 12A7.5 7.5 0 0 0 6.9 6.5h1.35a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 1.5 0v1.042a9 9 0 1 1-2.895 5.331a.749.749 0 0 1 .752-.623c.46 0 .791.438.724.892A7.5 7.5 0 1 0 19.5 12Zm-7-4.25a.75.75 0 0 0-1.5 0v4.5c0 .414.336.75.75.75h2.5a.75.75 0 0 0 0-1.5H12.5V7.75Z"
  />
);

    const History = ({
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
      className = ""
      width = {size || width || 24} height = {size || height || 24} viewBox =
          "0 0 22 22"
      xmlns = "http://www.w3.org/2000/svg"
          css={{
      display: 'inline',
          }}
          {...props}
        >
          <Light color={
      fill} />
        </Svg>
      );
      default:
      return (
        <Svg
      className = ""
      width = {size || width || 24} height = {size || height || 24} viewBox =
          "0 0 22 22"
      xmlns = "http://www.w3.org/2000/svg"
          css={{
      display: 'inline',
          }}
          {...props}
        >
          <Bold color={
      fill} />;
        </Svg>
      );
      }
    };

    History.displayName = 'HistoryIcon';

    Bold.propTypes = {
      color : PropTypes.string,
    };

    Light.propTypes = {
      color : PropTypes.string,
    };

    History.propTypes = {
      fill : PropTypes.string,
      filled : PropTypes.bool,
      size : PropTypes.number,
      width : PropTypes.number,
      height : PropTypes.number,
      strokeWidth : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    };

    export default History;
