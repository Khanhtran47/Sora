const encode = (str: string) =>
  `aaa${str
    .match(/.{1,5}/g)
    ?.map((s, i) => btoa(unescape(encodeURIComponent(s))).replace(/=/g, i % 2 ? '!' : ''))
    .reverse()
    .join('')
    .padEnd(40, '!')
    .replace(/!/g, 'a')
    .slice(3)}`;

export default encode;
