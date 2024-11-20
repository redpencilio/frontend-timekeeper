import Model, { attr, hasMany } from '@ember-data/model';

export default class CustomerModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @attr('string') color;

  @hasMany('task', { async: true, inverse: 'customer' }) projects;
}
