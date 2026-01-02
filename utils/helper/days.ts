function getDaysInMonth(year: any, month: any) {
  return new Date(year, month, 0).getDate();
}

export default getDaysInMonth;