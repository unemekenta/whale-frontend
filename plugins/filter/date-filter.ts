export const dateFilter = (value: string): string => {
  return formatDate(value);
};

export const dateWithoutTimeFilter = (value: string): string => {
  return formatDateWithoutTime(value);
};

function formatDate(inputDate: string) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`;
  return formattedDate;
}

function formatDateWithoutTime(inputDate: string) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedDate = `${year}/${month}/${day}`;
  return formattedDate;
}
