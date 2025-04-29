/**
 * Class representing a time duration
 */
export default class Duration {
  constructor({ hours = 0, minutes = 0 } = { hours: 0, minutes: 0 }) {
    const totalMinutes = hours * 60 + minutes;
    const rounding = totalMinutes < 0 ? Math.ceil : Math.floor;
    this.hours = rounding(totalMinutes / 60);
    this.minutes = totalMinutes % 60;
  }

  get asMinutes() {
    return this.hours * 60 + this.minutes;
  }

  get isEmpty() {
    return this.asMinutes === 0;
  }

  add(other) {
    return new Duration({
      hours: this.hours + other.hours,
      minutes: this.minutes + other.minutes,
    });
  }

  subtract(other) {
    return new Duration({
      hours: this.hours - other.hours,
      minutes: this.minutes - other.minutes,
    });
  }

  cmp(other) {
    const thisMin = this.asMinutes;
    const otherMin = other.asMinutes;
    return thisMin < otherMin ? -1 : thisMin === otherMin ? 0 : 1;
  }

  eq(other) {
    return this.cmp(other) === 0;
  }

  normalized() {
    return new Duration({ ...this });
  }
}

export function sumDurations(durations) {
  return durations.reduce((acc, duration) => acc.add(duration), new Duration());
}

export function sumDurationAttributes(intervals) {
  return intervals.reduce(
    (acc, interval) => acc.add(interval.duration),
    new Duration(),
  );
}
