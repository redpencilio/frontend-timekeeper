import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class DateTransform {
  deserialize(serialized) {
    // TODO make more robust
    const regex = new RegExp('(\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d)');
    const result = regex.exec(serialized);
    if (!result) {
      throw new Error('Invalid date');
    }
    return new Date(Date.UTC(+result[1], result[2] - 1, +result[3]));
  }

  serialize(deserialized) {
    return formatDate(deserialized);
  }

  static create() {
    return new this();
  }
}
