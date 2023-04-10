const parseSearchParams = (url?: string) => {
  const statements = /(?<=\?).+/gi.exec(url).toString().split('&');

  let values = {};

  statements.map((state) => {
    const key = state.split('=')[0];
    const value = state.split('=')[1];

    values = { ...values, [key]: value };
  });

  return values;
};

export default parseSearchParams;
