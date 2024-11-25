import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class FullCalendarComponent extends Component {
  @service dateNavigation;
  @service store;

  @tracked calendar = null;
  calendarEl = null;

  @tracked clickedEventInfo = null;
  @tracked clickedDateInfo = null;

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
      initialView: 'dayGridMonth',
      events: this.args.events || [],
      droppable: false, // Allows for drag and drop of external elements
      dateClick: this.onDateClick.bind(this),
      eventClick: this.onEventClick.bind(this),
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

      // Drag and Drop
      editable: true, // Allows for drag and drop of internal events
      eventConstraint: {
        // Where events can be dragged to
        start: firstDayOfMonth,
        end: lastDayOfMonth,
      },
      eventDrop: this.onEventDrop.bind(this),
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
    this.calendar.render();
    // TODO improve by putting addEventListener and removeEventListener
    // together
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  onSaveSimple = task(async ({ duration, project }) => {
    const workLog = this.store.createRecord('work-log', {
      duration,
      date: this.clickedDateInfo.date,
      task: project,
    });
    await workLog.save();
    this.clearPopovers();
  });

  onSaveMulti = task(async (hourProjectPairs) => {
    await Promise.all(
      hourProjectPairs.map(async ({ duration, subProject }) => {
        const workLog = this.store.createRecord('work-log', {
          duration,
          date: this.clickedDateInfo.date,
          task: subProject,
        });
        await workLog.save();
      }),
    );
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

  @action
  onDateClick(info) {
    this.clickedEventInfo = null;
    if (info.date.getMonth() === this.args.focusDate.getMonth()) {
      this.clickedDateInfo = info;
    }
  }

  @action
  onEventsAdded({ hours, project }) {
    const event = {
      hours,
      project,
      date: this.clickedDate,
    };

    this.args.onEventsAdded?.(event);
  }

  @action
  onCancel() {
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
  editWorkLog(workLog, { hours, project }) {
    workLog.duration = { hours };
    workLog.task = project;
    workLog.save();
    this.clearPopovers();
  }

  @action
  deleteWorkLog(workLog) {
    workLog.destroyRecord();
    this.clearPopovers();
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
