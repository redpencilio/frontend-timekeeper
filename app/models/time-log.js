import Model, { attr, belongsTo } from '@ember-data/model';

export default class TimeLogModel extends Model {
  @attr uri;

  @attr('number') hours;
  @attr('number') minutes;
  @attr('date') date;

  @belongsTo('project', { async: true, inverse: null }) project;
}
