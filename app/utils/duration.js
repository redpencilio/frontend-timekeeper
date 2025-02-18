/**
 * Class representing a time duration
 */
export default class Duration {
  constructor({ hours = 0, minutes = 0 } = { hours: 0, minutes: 0 }) {
    this.hours = hours + Math.floor(minutes / 60);
    this.minutes = minutes % 60;
  }

  get asMinutes() {
    return this.hours * 60 + this.minutes;
  }

  add(other) {
    return new Duration({
      hours: this.hours + other.hours,
      minutes: this.minutes + other.minutes,
    }).normalized();
  }

  subtract(other) {
    return new Duration({
      hours: this.hours - other.hours,
      minutes: this.minutes - other.minutes,
    }).normalized();
  }

  cmp(other) {
    const thisMin = this.hours * 60 + this.minutes;
    const otherMin = other.hours * 60 + other.minutes;
    return thisMin < otherMin ? -1 : thisMin === otherMin ? 0 : 1;
  }

  eq(other) {
    return this.cmp(other) === 0;
  }

  normalized() {
    return new Duration({ ...this });
  }
}
