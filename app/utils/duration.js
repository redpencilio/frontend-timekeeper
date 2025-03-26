/**
 * Class representing a time duration
 */
export default class Duration {
  constructor({ hours = 0, minutes = 0 } = { hours: 0, minutes: 0 }) {
    this.hours = hours;
    this.minutes = minutes;
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

  normalized() {
    const result = { ...this };
    if (this.minutes >= 60) {
      result.hours = this.hours + Math.floor(this.minutes / 60);
      result.minutes = this.minutes % 60;
    }

    return new Duration(result);
  }
}
