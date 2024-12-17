import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { startOfMonth, endOfMonth, addDays } from 'date-fns';
import { task } from 'ember-concurrency';
import { formatDate } from 'frontend-timekeeper/utils/format-date';
import { differenceInDays, subDays, eachDayOfInterval } from 'date-fns';

export default class FullCalendarComponent extends Component {
  @tracked calendar = null;
  calendarEl = null;

  @tracked clickedEventInfo = null;
  @tracked clickedDateInfo = null;
  @tracked selectionInfo = null;

  @action
  setupCalendar(element) {
    this.calendarEl = element;

    const focusDate = this.args.focusDate;
    const firstDayOfMonth = startOfMonth(this.args.focusDate);
    const firstDayOfNextMonth = addDays(endOfMonth(this.args.focusDate), 1);

    this.calendar = new Calendar(element, {
      plugins: [interactionPlugin, dayGridPlugin],
      initialView: 'dayGridMonth',
      events: this.args.events || [],
      droppable: false, // Allows for drag and drop of external elements
      selectable: true,
      unselectCancel: '.work-log-popover',
      select: this.onSelect.bind(this),
      unselect: this.onUnselect.bind(this),
      eventClick: this.args.isDisabled
        ? () => false
        : this.onEventClick.bind(this),
      eventDisplay: 'list-item',
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
        end: firstDayOfNextMonth,
      },
      // Drag and Drop
      editable: !this.args.isDisabled, // Allows for drag and drop of internal events
      eventConstraint: {
        // Where events can be dragged to
        start: formatDate(firstDayOfMonth),
        end: formatDate(firstDayOfNextMonth),
      },
      eventDrop: this.onEventDrop.bind(this),
    });

    this.calendar.gotoDate(focusDate);
    this.calendar.render();
    // TODO improve by putting addEventListener and removeEventListener
    // together
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  onEventClick(info) {
    this.calendar.select(info.event.startStr);
    this.clickedEventInfo = info;
  }

  onSelect(info) {
    this.selectionInfo = info;
  }

  onUnselect() {
    this.clearPopovers();
  }

  async onEventDrop(info) {
    const { workLog } = info.oldEvent.extendedProps;
    workLog.date = info.event.start;
    await workLog.save();
  }

  // Returns the last date cell element of the selection
  get clickedDateElement() {
    if (!this.selectionInfo) {
      return null;
    }

    const dateStr = formatDate(subDays(this.selectionInfo.end, 1));
    return this.calendarEl.querySelector(`[data-date="${dateStr}"]`);
  }

  get hasSelectedMultipleDates() {
    return (
      this.selectionInfo &&
      differenceInDays(this.selectionInfo.end, this.selectionInfo.start) > 1
    );
  }

  get workLogsForClickedDate() {
    if (!this.selectionInfo || this.hasSelectedMultipleDates) {
      return [];
    } else {
      const dateStr = this.selectionInfo.startStr;
      return this.args.events
        .filter((event) => formatDate(event.start) === dateStr)
        .map((event) => event.extendedProps.workLog);
    }
  }

  @action
  cancel() {
    this.clearPopovers();
  }

  clearPopovers() {
    this.clickedDateInfo = null;
    this.clickedEventInfo = null;
    this.selectionInfo = null;
    this.calendar.unselect();
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
      'eventClick',
      this.args.isDisabled ? () => false : this.onEventClick.bind(this),
    );
    this.calendar.setOption(
      'select',
      this.args.isDisabled ? () => false : this.onSelect.bind(this),
    );
    this.calendar.setOption(
      'unselect',
      this.args.isDisabled ? () => false : this.onUnselect.bind(this),
    );
    this.calendar.setOption('editable', !this.args.isDisabled);
  }

  save = task(async (hourTaskPairs) => {
    const { start, end } = this.selectionInfo;
    await this.args.onSave?.perform(
      hourTaskPairs,
      eachDayOfInterval({ start, end: subDays(end, 1) }),
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
