import Model, { attr, belongsTo } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @belongsTo('account', { inverse: 'person', async: true }) account;
}
