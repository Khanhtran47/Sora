/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable react/self-closing-comp */
const SearchIcon = ({
  fill = 'currentColor',
  filled = false,
  size = 0,
  height = 0,
  width = 0,
  label = '',
  ...props
}) => {
  if (filled) {
    return (
      <svg width={size || width || 24} height={size || height || 24} viewBox="0 0 24 24" {...props}>
        <ellipse cx="10.5992" cy="10.6532" rx="8.59922" ry="8.65324" fill={fill} />
        <path
          fill={fill}
          opacity="0.4"
          d="M20.6746 21.9553C20.3406 21.9444 20.0229 21.807 19.7854 21.5705L17.7489 19.1902C17.3123 18.7909 17.2766 18.1123 17.6689 17.6689C17.8525 17.4831 18.1021 17.3786 18.3625 17.3786C18.6229 17.3786 18.8726 17.4831 19.0562 17.6689L21.6172 19.7181C21.9862 20.0957 22.1 20.6563 21.9079 21.1492C21.7158 21.6422 21.2536 21.9754 20.728 22L20.6746 21.9553Z"
        />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        fill={fill}
        cx="11.7666"
        cy="11.7666"
        r="8.98856"
        stroke="#200E32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        opacity="0.4"
        d="M18.0183 18.4852L21.5423 22.0001"
        stroke="#200E32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default SearchIcon;
