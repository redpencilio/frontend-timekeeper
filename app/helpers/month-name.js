export default function monthName(index) {
  if (index < 0 || index > 12) {
    throw Error('Invalid month index');
  }
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[index];
}
