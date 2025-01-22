export default function formatDuration(duration) {
  const hours = duration?.hours ?? 0;
  const minutes = duration?.minutes ?? 0;
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}
