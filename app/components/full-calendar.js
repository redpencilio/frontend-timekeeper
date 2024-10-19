import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { service } from '@ember/service';

export default class FullCalendarComponent extends Component {
  @service dateNavigation;

  @tracked calendar = null;
  @tracked selectedRange = null;

  @action
  setupCalendar(element) {
    const focusDate = this.args.focusDate;
    const firstDayOfMonth = new Date(
      focusDate.getFullYear(),
      focusDate.getMonth(),
      1,
    ); // First day of the current month
    const lastDayOfMonth = new Date(
      focusDate.getFullYear(),
      focusDate.getMonth() + 1,
      1,
    ); // Last day of the current month

    this.calendar = new Calendar(element, {
      plugins: [interactionPlugin, dayGridPlugin],
      initialView: 'dayGridMonth', // Sets the default view to month grid
      events: this.args.events || [], // Pass the events from parent as an argument
      editable: false,
      droppable: false, // Allows for drag and drop of external elements
      dateClick: this.onDateClick.bind(this), // Example of handling date clicks
      select: this.onDateSelect.bind(this),
      selectable: true,
      dayMaxEvents: 6,
      firstDay: 1,
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday
      },
      selectConstraint: {
        start: firstDayOfMonth,
        end: lastDayOfMonth,
      },
      customButtons: {
        prev: {
          text: 'Previous',
          click: this.dateNavigation.previousMonth,
        },
        next: {
          text: 'Next',
          click: this.dateNavigation.nextMonth,
        },
        today: {
          text: 'Today',
          click: this.dateNavigation.today,
        },
      },
    });

    this.calendar.gotoDate(focusDate);
    this.calendar.render(); // Renders the calendar
  }

  @action
  onDateClick(info) {
    // Handle the date click event here
    console.log('Date clicked: ', info.dateStr);
  }

  @action
  onDateSelect({ start, end }) {
    this.selectedRange = [start, end];
  }

  @action
  clearSelectedRange() {
    this.selectedRange = null;
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.calendar?.destroy();
  }
}
