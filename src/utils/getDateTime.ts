const getDateTime = (config?: { sqlLike?: boolean }): string => {
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

  if (config?.sqlLike) {
    return `${year()}${month()}${day()} ${
      date.getHours() < 12 ? hours() : date.getHours() - 12
    }:${minutes()}:${seconds()} ${date.getHours() < 12 ? 'AM' : 'PM'}`;
  }

  return `${day()}.${month()}.${year()}, ${hours()}:${minutes()}:${seconds()}`;
};

export default getDateTime;
