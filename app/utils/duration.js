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
    });
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
