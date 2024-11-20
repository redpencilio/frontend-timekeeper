import { parse, serialize } from 'tinyduration';

export default class DurationTransform {
  deserialize(serialized) {
    if (typeof serialized !== 'string') {
      return null;
    }

    return { minutes: 0, hours: 0, ...parse(serialized) };
  }

  serialize(deserialized) {
    if (!deserialized || typeof deserialized !== 'object') {
      return null;
    }
    return serialize(deserialized);
  }

  static create() {
    return new this();
  }
}
