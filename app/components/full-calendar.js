import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  startOfMonth,
  endOfMonth,
  addDays,
  isSameDay,
  isAfter,
  isBefore,
} from 'date-fns';
import { task as ecTask } from 'ember-concurrency';
import { formatDate } from 'frontend-timekeeper/utils/format-date';
import { differenceInDays, subDays, eachDayOfInterval } from 'date-fns';
import { normalizeDuration } from 'frontend-timekeeper/utils/normalize-duration';
import taskName from 'frontend-timekeeper/helpers/task-name';

const sortEvents = (event1, event2) => {
  const task1 = event1.extendedProps.task;
  const task2 = event2.extendedProps.task;

  if (task1 && task2) {
    const name1 = taskName(task1);
    const name2 = taskName(task2);
    return name1.localeCompare(name2);
  } else {
    return event1.title.localeCompare(event2.title);
  }
};

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
      selectable: !this.args.isDisabled,
      unselectCancel: '.work-log-popover',
      select: this.args.isDisabled ? () => false : this.onSelect.bind(this),
      unselect: this.args.isDisabled ? () => false : this.onUnselect.bind(this),
      dayCellContent: this.renderDayCellContent.bind(this),
      eventDidMount: this.args.isDisabled
        ? undefined
        : this.attachEventRemoveButton.bind(this),
      eventClick: this.args.isDisabled
        ? () => false
        : this.onEventClick.bind(this),
      eventDisplay: 'list-item',
      eventOrder: sortEvents,
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
      // editable: !this.args.isDisabled, // Allows for drag and drop of internal events
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

  renderDayCellContent(info) {
    const events = this.calendar
      .getEvents()
      .filter((event) => isSameDay(event.start, info.date));
    if (events.length === 0) {
      return info.dayNumberText;
    }

    const totalDuration = events
      .map((event) => event.extendedProps.workLog.duration)
      .reduce(
        (acc, duration) => ({
          hours: acc.hours + duration.hours,
          minutes: acc.minutes + duration.minutes,
        }),
        { hours: 0, minutes: 0 },
      );

    const { hours, minutes } = normalizeDuration(totalDuration);

    return {
      html: `
        <div class="flex justify-between w-full">
          <div class="grow">${info.dayNumberText}</div>
          <div class="flex items-center text-gray-400 text-sm">
            ${hours}h ${minutes > 0 ? `${minutes}m` : ''}
          </div>
        </div>
      `,
    };
  }

  attachEventRemoveButton({ el, event }) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <path
          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
        />
      </svg>
    `;
    deleteButton.classList = 'fill-gray-500 rounded hover:fill-red-500';
    deleteButton.onclick = (clickEvent) => {
      clickEvent.stopPropagation();
      this.deleteWorkLog(event.extendedProps.workLog);
    };
    deleteButton.style.visibility = 'collapse';
    el.appendChild(deleteButton);
    el.onmouseenter = () => {
      deleteButton.style.visibility = 'visible';
    };
    el.onmouseleave = () => {
      deleteButton.style.visibility = 'collapse';
    };
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

  get workLogsForSelection() {
    if (!this.selectionInfo) {
      return [];
    } else {
      const { start, end } = this.selectionInfo;
      return this.args.events
        .filter(
          (event) => isAfter(event.start, start) && isBefore(event.start, end),
        )
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
    this.calendar.setOption('selectable', !this.args.isDisabled);
    this.calendar.setOption(
      'eventDidMount',
      this.args.isDisabled ? undefined : this.attachEventRemoveButton.bind(this),
    );
  }

  save = ecTask(async (hourTaskPairs) => {
    const { start, end } = this.selectionInfo;
    await this.args.onSave(
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
    const firstDayOfMonth = startOfMonth(this.args.focusDate);
    const firstDayOfNextMonth = addDays(endOfMonth(this.args.focusDate), 1);
    this.calendar.setOption('selectConstraint', {
      start: firstDayOfMonth,
      end: firstDayOfNextMonth,
    });
    this.calendar.setOption('selectConstraint', {
      start: firstDayOfMonth,
      end: firstDayOfNextMonth,
    });
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
