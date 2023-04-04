const getDateTime = (): string => {
  const date = new Date();

  const refactorDate = (input: number): string => {
    if (input < 10) {
      return `0${input}`;
    }

    return `${input}`;
  };

  const day = (): string => refactorDate(date.getDate());
  const month = (): string => refactorDate(date.getMonth() + 1);
  const year = (): string => refactorDate(date.getFullYear());

  const hours = (): string => refactorDate(date.getHours());
  const minutes = (): string => refactorDate(date.getMinutes());
  const seconds = (): string => refactorDate(date.getSeconds());

  return `${day()}.${month()}.${year()}, ${hours()}:${minutes()}:${seconds()}`;
};

export default getDateTime;
