import Model, { attr, belongsTo } from '@ember-data/model';

export default class CustomerModel extends Model {
  @attr uri;

  @attr name;
  @attr color;

  @hasMany('project', { async: true, inverse: 'customer'}) projects;
}
