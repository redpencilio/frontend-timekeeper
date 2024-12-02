function normalizeDuration(duration) {
  const result = { ...duration };
  if (duration.minutes >= 60) {
    result.hours = duration.hours + Math.floor(duration.minutes / 60);
    result.minutes = duration.minutes % 60;
  }

  return result;
}

export { normalizeDuration };
