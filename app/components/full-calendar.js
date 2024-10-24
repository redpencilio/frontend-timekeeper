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
  calendarEl = null;
  @tracked clickedDate = null;
  @tracked clickedDateElement = null;

  @action
  setupCalendar(element) {
    this.calendarEl = element;

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
      unselect: this.onDateUnselect.bind(this),
      eventDisplay: 'list-item',
      // selectable: true,
      dayMaxEvents: 6,
      height: 'parent',
      firstDay: 1,
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday
      },
      headerToolbar: {
        start: null,
        center: 'title',
        end: null,
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
    if (info.date.getMonth() === this.args.focusDate.getMonth()) {
      this.clickedDate = info.date;
      this.clickedDateElement = this.calendarEl.querySelector(
        `[data-date="${info.dateStr}"]`,
      );
    }
  }

  @action
  onDateSelect({ start, end }) {
    this.selectedRange = [start, end];
  }

  @action
  onDateUnselect() {
    // this.clearSelectedRange();
  }

  @action
  onEventsAdded({ hours, project }) {
    // let current = this.selectedRange[0];
    // const days = [];
    // while (current < this.selectedRange[1]) {
    //   days.push(current);
    //   current.setDate(current.getDate() + 1);
    // }
    const event = {
      hours,
      project,
      date: this.clickedDate,
    };

    this.args.onEventsAdded?.(event);
  }

  @action
  clearSelectedRange() {
    this.selectedRange = null;
    this.clickedDate = null;
  }

  @action
  updateAndRerenderCalendar() {
    const sources = this.calendar.getEventSources();
    sources.forEach((source) => source.remove());
    this.calendar.addEventSource(this.args.events);
    this.calendar.render();
  }

  @action
  gotoFocusDate() {
    this.calendar.gotoDate(this.args.focusDate);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.calendar?.destroy();
  }
}
