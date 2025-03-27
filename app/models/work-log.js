import Model, { attr, belongsTo } from '@ember-data/model';

export default class TimeLogModel extends Model {
  // !! Don't forget to update `clone` when adding new attributes or relations
  @attr('string') uri;
  @attr('duration') duration;
  @attr('date') date;
  @attr note;

  @belongsTo('task', { async: true, inverse: 'workLogs' }) task;
  @belongsTo('person', { async: true, inverse: 'workLogs' }) person;
  @belongsTo('timesheet', { async: true, inverse: 'workLogs' }) timesheet;

  async clone() {
    const [task, person, timesheet] = await Promise.all([
      this.task,
      this.person,
      this.timesheet,
    ]);

    return {
      uri: this.uri,
      date: this.date,
      duration: this.duration,
      note: this.note,
      task,
      person,
      timesheet,
    };
  }
}
