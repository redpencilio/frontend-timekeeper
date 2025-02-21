import Controller from '@ember/controller';

export default class AdminTimesheetsYearMonthController extends Controller {
  get sortedUsersWithTimesheet() {
    return this.model.usersWithTimesheet.sort(
      ({ timesheet: timesheetA }, { timesheet: timesheetB }) => {
        if (timesheetA && timesheetB) {
          return timesheetA.statusRank - timesheetB.statusRank;
        } else if (timesheetA) {
          return 1;
        } else if (timesheetB) {
          return -1;
        } else {
          return 0;
        }
      },
    );
  }
}
