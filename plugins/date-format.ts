export const stringToISOString = (date: string): string => {
  return new Date(date).toISOString().slice(0, -1);
};
