export function getFormattedDayToday(dateNow = new Date()) {
  return `${dateNow.getDate()}-${dateNow.getMonth() + 1}-${dateNow.getFullYear()}`
}