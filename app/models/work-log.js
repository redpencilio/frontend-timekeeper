import Model, { attr, belongsTo } from '@ember-data/model';

export default class TimeLogModel extends Model {
  @attr('string') uri;
  @attr('duration') duration;
  @attr('date') date;

  @belongsTo('task', { async: true, inverse: 'workLogs' }) task;
  @belongsTo('timesheet', { async: true, inverse: 'workLogs' }) timesheet;
}
