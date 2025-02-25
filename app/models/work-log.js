import Model, { attr, belongsTo } from '@ember-data/model';

export default class TimeLogModel extends Model {
  @attr('string') uri;
  @attr('duration') duration;
  @attr('date') date;
  @attr note;

  @belongsTo('task', { async: true, inverse: 'workLogs' }) task;
  @belongsTo('person', { async: true, inverse: 'workLogs' }) person;
  @belongsTo('timesheet', { async: true, inverse: 'workLogs' }) timesheet;
}
