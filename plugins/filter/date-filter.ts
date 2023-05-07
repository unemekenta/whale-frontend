import dayjs from "dayjs"

export const dateFilter = (value: string): string => {
  return formatDate(value)
}

export const dateWithoutTimeFilter = (value: string): string => {
  return formatDateWithoutTime(value)
}

function formatDate(inputDate: string) {
  const formattedDate = dayjs(inputDate).format("YYYY/MM/DD hh:mm")
  return formattedDate
}

function formatDateWithoutTime(inputDate: string) {
  const formattedDate = dayjs(inputDate).format("YYYY/MM/DD")
  return formattedDate
}
