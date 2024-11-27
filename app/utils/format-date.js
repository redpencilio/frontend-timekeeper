import { formatISO } from 'date-fns';

function formatDate(date) {
  return formatISO(date, { representation: 'date' });
}

export { formatDate };
