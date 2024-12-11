import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @belongsTo('account', { inverse: 'person', async: true }) account;
  @hasMany('timesheet', { inverse: 'person', async: true }) timesheets;
  @hasMany('work-log', { inverse: 'person', async: true }) workLogs;
}
