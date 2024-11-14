import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ProjectModel extends Model {
  @attr uri;
  @attr name;
  @attr displayColor;

  @hasMany('sub-project', { async: true, inverse: 'parent' }) subProjects;
  @belongsTo('customer', { async: true, inverse: 'projects' }) customer;
}
