import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class SubProjectModel extends Model {
  @attr uri;
  @attr name;

  @belongsTo('project', { async: true, inverse: 'subProjects' }) parent;
  @hasMany('work-log', { async: true, inverse: 'subProject'}) workLogs;
}
