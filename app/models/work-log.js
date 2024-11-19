import Model, { attr, belongsTo } from '@ember-data/model';

export default class TimeLogModel extends Model {
  @attr('duration') duration;
  @attr('date') date;

  @belongsTo('sub-project', { async: true, inverse: 'workLogs' }) subProject;
}
