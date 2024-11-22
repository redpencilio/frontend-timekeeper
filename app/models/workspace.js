import Model, { attr, hasMany } from '@ember-data/model';

export default class WorkspaceModel extends Model {
  @attr('string') uri;
  @attr('string') name;

  @hasMany('task', { async: true, inverse: 'conceptScheme' }) tasks;
  @hasMany('task', { async: true, inverse: 'projects' }) projects;
}
