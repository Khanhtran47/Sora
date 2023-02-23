/* eslint-disable import/prefer-default-export */

export const generateSvg = async ({ title = '', subtitle = '' }) => {
  const res = await fetch(
    'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.woff',
  );
  const font = await res.arrayBuffer();

  const { default: satori } = await import('satori');
  return satori(
    <div
      style={{
        fontSize: 128,
        fontFamily: 'Inter, sans-serif',
        background: 'white',
        width: '100%',
        height: '100%',
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {title}
    </div>,
    {
      width: 1200,
      height: 600,
      embedFont: false,
      fonts: [
        {
          name: 'Inter',
          data: font,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  );
};
