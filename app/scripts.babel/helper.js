export function getFormattedDayToday() {
  const dateNow = new Date();
  return `${dateNow.getDate()}-${dateNow.getMonth() + 1}-${dateNow.getFullYear()}`
}