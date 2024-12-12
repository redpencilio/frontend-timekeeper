import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class FullCalendarComponent extends Component {
  @service store;

  @tracked calendar = null;
  calendarEl = null;

  @tracked clickedEventInfo = null;
  @tracked clickedDateInfo = null;

  @action
  setupCalendar(element) {
    this.calendarEl = element;

    const focusDate = this.args.focusDate;
    // TODO use date-fns lib to avoid edge cases / timezone issue
    // E.g. https://date-fns.org/v4.1.0/docs/startOfMonth
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
      initialView: 'dayGridMonth',
      events: this.args.events || [],
      droppable: false, // Allows for drag and drop of external elements
      dateClick: this.args.isDisabled
        ? () => false
        : this.onDateClick.bind(this),
      eventClick: this.args.isDisabled
        ? () => false
        : this.onEventClick.bind(this),
      eventDisplay: 'list-item',
      // selectable: true,
      dayMaxEvents: 6,
      height: 'parent',
      firstDay: 1,
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
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
      // Drag and Drop
      editable: !this.args.isDisabled, // Allows for drag and drop of internal events
      eventConstraint: {
        // Where events can be dragged to
        start: firstDayOfMonth,
        end: lastDayOfMonth,
      },
      eventDrop: this.onEventDrop.bind(this),
    });

    this.calendar.gotoDate(focusDate);
    this.calendar.render();
    // TODO improve by putting addEventListener and removeEventListener
    // together
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  editWorkLog = task(async ({ duration, task }) => {
    const workLog = this.clickedWorkLog;
    workLog.duration = duration;
    workLog.task = task;
    await workLog.save();
    this.clearPopovers();
  });

  onEventClick(info) {
    this.clickedDateInfo = false;
    this.clickedEventInfo = info;
  }

  onEventDrop(info) {
    const newLog = {
      ...info.oldEvent.extendedProps.hourLog,
      date: info.event.startStr,
    };
    this.mockData.updateHourLogById(
      info.oldEvent.extendedProps.hourLog.id,
      newLog,
    );
  }

  get clickedDateElement() {
    const dateStr = this.clickedEventInfo
      ? this.clickedEventInfo.event.startStr
      : this.clickedDateInfo.dateStr;
    return this.calendarEl.querySelector(`[data-date="${dateStr}"]`);
  }

  get workLogsForClickedDate() {
    const dateStr = this.clickedDateInfo.dateStr;
    return this.args.events
      .filter((event) => formatDate(event.start) === dateStr)
      .map((event) => event.extendedProps.workLog);
  }

  @action
  onDateClick(info) {
    this.clickedEventInfo = null;
    if (info.date.getMonth() === this.args.focusDate.getMonth()) {
      this.clickedDateInfo = info;
    }
  }

  @action
  cancel() {
    this.clearPopovers();
  }

  clearPopovers() {
    this.clickedDateInfo = null;
    this.clickedEventInfo = null;
  }

  @action
  updateAndRerenderCalendar() {
    const sources = this.calendar.getEventSources();
    sources.forEach((source) => source.remove());
    this.calendar.addEventSource(this.args.events);
    this.calendar.render();
  }

  @action
  updateDisabled() {
    this.calendar.setOption(
      'dateClick',
      this.args.isDisabled ? () => false : this.onDateClick.bind(this),
    );
    this.calendar.setOption(
      'eventClick',
      this.args.isDisabled ? () => false : this.onEventClick.bind(this),
    );
    this.calendar.setOption('editable', !this.args.isDisabled);
  }

  save = task(async (hourTaskPairs) => {
    await this.args.onSave?.perform(
      hourTaskPairs,
      this.clickedDateInfo.date,
    );
    this.clearPopovers();
  });

  @action
  deleteWorkLog() {
    this.clearPopovers();
    this.args.onDeleteWorkLog?.(...arguments);
  }

  get clickedWorkLog() {
    return this.clickedEventInfo?.event.extendedProps.workLog;
  }

  @action
  gotoFocusDate() {
    this.calendar.gotoDate(this.args.focusDate);
  }

  handleKeydown(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.clearPopovers();
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
    this.calendar?.destroy();
  }
}
