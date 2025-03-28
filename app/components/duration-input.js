import Component from '@glimmer/component';
import { localCopy } from 'tracked-toolbox';
import { modifier } from 'ember-modifier';
import Duration from 'frontend-timekeeper/utils/duration';

const getDurationFromString = (input) => {
  const result = new Duration({ hours: 0, minutes: 0 });

  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  if (!input) {
    return result;
  }

  // Check for fractional hours (e.g., "1.5")
  const fractionalMatch = input.match(/^(\d+)(?:\.(\d+))?$/);
  if (fractionalMatch) {
    const hours = parseInt(fractionalMatch[1], 10);
    const fraction = fractionalMatch[2]
      ? parseFloat(`0.${fractionalMatch[2]}`)
      : 0;
    result.hours = hours;
    result.minutes = Math.round(fraction * 60);
  } else {
    // Match formats like "1h", "1h30m", "30m", "1h70", "1:30", "1u30"
    const timeMatch = input.match(/^(?:(\d+)(h|:|u))?(?:(\d+)m?)?$/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1] || 0, 10);
      const minutes = parseInt(timeMatch[3] || 0, 10);
      result.hours = hours;
      result.minutes = minutes;
    } else {
      throw new Error('Invalid time format');
    }
  }

  return result.normalized();
};

const blurListener = (event) => {
  const element = event.target;
  try {
    const { hours, minutes } = getDurationFromString(element.value);
    element.value = `${hours}h${minutes}m`;
    element.setCustomValidity('');
  } catch (e) {
    element.setCustomValidity(e.message);
    element.reportValidity(false);
  }
};

export default class DurationInput extends Component {
  @localCopy('args.value') value = { hours: 0, minutes: 0 };

  durationInputModifier = modifier((element) => {
    element.addEventListener('blur', blurListener);
    return () => {
      element.removeEventListener('blur', blurListener);
    };
  });

  get textValue() {
    const { hours, minutes } = this.value;
    return `${hours}h${minutes}m`;
  }

  get isRequired() {
    return this.args.isRequired ?? true;
  }

  onChange = ({ target: { value } }) => {
    try {
      const newValue = getDurationFromString(value);
      this.args.onChange?.(newValue);
    } catch (e) {}
  };
}
