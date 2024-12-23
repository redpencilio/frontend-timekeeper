import Model, { attr, hasMany } from '@ember-data/model';

export default class UserGroupModel extends Model {
  @attr('string') uri;
  @attr('string') name;

  @hasMany('person', { inverse: 'user-groups', async: true }) members;
}
