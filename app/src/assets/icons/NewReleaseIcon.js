/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable react/self-closing-comp */
const NewReleaseIcon = ({
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
        <path
          d="M16.218 2.5l5.683 5.682v8.036l-5.683 5.683H8.182l-5.683-5.683V8.182l5.683-5.683h8.036zM11 15v2h2v-2h-2zm0-8v6h2V7h-2z"
          fill={fill}
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
      {' '}
      <path
        fill={fill}
        d="M15.936 2.5L21.5 8.067v7.87L15.936 21.5h-7.87L2.5 15.936v-7.87L8.066 2.5h7.87zm-.829 2H8.894L4.501 8.895v6.213l4.393 4.394h6.213l4.394-4.394V8.894l-4.394-4.393zM11 15h2v2h-2v-2zm0-8h2v6h-2V7z"
      ></path>
    </svg>
  );
};

export default NewReleaseIcon;
