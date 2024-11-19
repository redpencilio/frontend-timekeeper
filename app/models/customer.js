import Model, { attr, hasMany } from '@ember-data/model';

export default class CustomerModel extends Model {
  @attr name;
  @attr color;

  @hasMany('project', { async: true, inverse: 'customer' }) projects;
}
