/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable react/self-closing-comp */
const ArrowLeftIcon = ({ fill = 'currentColor', filled, size, height, width, label, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width || 24}
    height={size || height || 24}
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill={fill} d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"></path>
  </svg>
);

export default ArrowLeftIcon;
