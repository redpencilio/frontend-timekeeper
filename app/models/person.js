import Model, { attr, hasMany } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @hasMany('account', { inverse: 'person', async: true }) accounts;
  @hasMany('timesheet', { inverse: 'person', async: true }) timesheets;
  @hasMany('work-log', { inverse: 'person', async: true }) workLogs;
  @hasMany('user-group', { inverse: 'members', async: true }) userGroups;
  @hasMany('quantity', { inverse: 'person', async: true })
  quantities;
}
