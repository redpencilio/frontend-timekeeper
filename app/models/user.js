import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @belongsTo('account', { inverse: 'user', async: true }) account;
  @belongsTo('organization', { inverse: 'users', async: true }) organization;
}
