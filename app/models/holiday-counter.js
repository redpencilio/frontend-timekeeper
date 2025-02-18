import Model, { attr, belongsTo } from '@ember-data/model';

export default class HolidayCounterModel extends Model {
  @attr('duration') value;
  @attr('date') validFrom;
  @attr('date') validTill;

  @belongsTo('person', { async: true, inverse: 'holidayCounters' }) person;
  @belongsTo('concept', { async: true }) holidayType;
}
