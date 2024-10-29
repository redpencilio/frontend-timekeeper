import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ProjectModel extends Model {
  @attr uri;
  @attr name;
  @attr displayColor;

  @belongsTo('project', { async: true, inverse: 'subprojects' }) parent;
  @hasMany('project', { async: true, inverse: 'parent' }) subprojects;
}
