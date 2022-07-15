/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable react/self-closing-comp */
const MenuIcon = ({ fill = 'currentColor', filled, size, height, width, label, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width || 24}
    height={size || height || 24}
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill={fill} d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"></path>
  </svg>
);

export default MenuIcon;
