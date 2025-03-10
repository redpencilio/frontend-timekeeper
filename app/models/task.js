import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class TaskModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @attr('string') color;

  @hasMany('task', { async: true, inverse: 'parent' }) children;
  @belongsTo('task', { async: true, inverse: 'children' }) parent;
  @belongsTo('workspace', { async: true, inverse: 'tasks' }) conceptScheme;
  @belongsTo('workspace', { async: true, inverse: 'projects' }) workspace;
  @hasMany('work-log', { async: true, inverse: 'task' }) workLogs;
  @belongsTo('customer', { async: true, inverse: 'projects' }) customer;
  @hasMany('person', { async: true, inverse: 'tasks' }) visibleTo;
}
