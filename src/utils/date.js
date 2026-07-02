export function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toDisplayDate(dateText) {
  if (!dateText) return '';
  const [year, month, day] = dateText.split('-');
  return `${day}/${month}/${year}`;
}
