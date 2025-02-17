import Duration from "../utils/duration";

export default function formatDuration(duration, format = 'hm') {
  const normalized = duration?.normalized() ?? new Duration();
  const { hours, minutes } = normalized;
  if (format === 'hm') {
    return `${hours}h ${minutes}m`;
  } else if (format === 'hmCompact') {
    return `${hours ? `${hours}h ` : ''}${minutes ? `${minutes}m` : ''}`.trim();
  } else if (format === 'compact') {
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  } else if (format === 'dh') {
    const days = Math.floor(hours / 8);
    const remainingHours = hours % 8;
    return `${days}d ${remainingHours}h`
  } else {
    console.warning(`Format must be one of "hm", "hmCompact", "compact"`);
    return '';
  }
}
