import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
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
  @service toaster;

  @tracked calendar = null;
  calendarEl = null;

  @tracked clickedEventInfo = null;
  @tracked clickedDateInfo = null;
  @tracked selectionInfo = null;
  @tracked showNotesFor = null;

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
      eventContent: this.renderEvent.bind(this),
      eventClick: this.args.isDisabled
        ? () => false
        : this.onEventClick.bind(this),
      eventDisplay: 'list-item',
      eventOrder: sortEvents,
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
      html: /*html*/ `
        <div class="flex justify-between w-full">
          <div class="grow">${info.dayNumberText}</div>
          <div class="flex items-center text-gray-400 text-sm">
            ${hours}h ${minutes > 0 ? `${minutes}m` : ''}
          </div>
        </div>
      `,
    };
  }

  renderEvent(info) {
    const { event } = info;
    const note = info.event.extendedProps.workLog.note;

    const stickyIcon = /*html*/ `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        class="size-full"
        viewBox="0 0 16 16"
      >
        <path
          d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zm6 8.5a1 1 0 0 1 1-1h4.396a.25.25 0 0 1 .177.427l-5.146 5.146a.25.25 0 0 1-.427-.177z"
        />
      </svg>
    `;

    const container = document.createElement('div');
    container.className =
      'w-full truncate flex items-center pl-[0.188rem] pt-[0.188rem] pb-0.5 pr-0.5';

    const eventTitleContainer = document.createElement('div');
    eventTitleContainer.classList = 'flex items-center grow truncate';

    const statusIndicatorContainer = document.createElement('div');
    statusIndicatorContainer.classList = 'size-2.5 shrink-0 mr-[0.188rem] flex items-center justify-center';

    if (note) {
      const colorNote = document.createElement('div');
      colorNote.className = 'size-full';
      colorNote.style.fill = info.backgroundColor;
      colorNote.innerHTML = stickyIcon;
      statusIndicatorContainer.appendChild(colorNote);
    } else {
      const colorDot = document.createElement('div');
      colorDot.className = 'size-2 rounded-full';
      colorDot.style.backgroundColor = info.backgroundColor;
      statusIndicatorContainer.appendChild(colorDot);
    }
    
    eventTitleContainer.appendChild(statusIndicatorContainer);

    const eventTitle = document.createElement('div');
    eventTitle.className = 'truncate shrink';
    eventTitle.textContent = `${info.event.title}`;

    eventTitleContainer.appendChild(eventTitle);
    container.appendChild(eventTitleContainer);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList = 'ml-1 h-5 flex items-center';

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = /*html*/ `
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
    deleteButton.classList = 'fill-gray-400 hover:fill-red-500';
    deleteButton.onclick = (clickEvent) => {
      clickEvent.stopPropagation();
      this.deleteWorkLog(event.extendedProps.workLog);
    };

    const stickyButton = document.createElement('button');
    stickyButton.innerHTML = stickyIcon;
    stickyButton.classList = 'size-4 fill-gray-400 hover:fill-gray-500';
    stickyButton.onclick = (clickEvent) => {
      clickEvent.stopPropagation();
      this.showNotesFor = {
        event,
        el: container,
      };
    };

    buttonsDiv.appendChild(stickyButton);
    buttonsDiv.appendChild(deleteButton);
    buttonsDiv.style.visibility = 'collapse';
    container.appendChild(buttonsDiv);
    container.onmouseenter = () => {
      buttonsDiv.style.visibility = 'visible';
    };
    container.onmouseleave = () => {
      buttonsDiv.style.visibility = 'collapse';
    };
    return {
      domNodes: [container],
    };
  }

  onEventClick(info) {
    this.clearPopovers();
    this.calendar.select(info.event.startStr);
    this.clickedEventInfo = info;
  }

  onSelect(info) {
    this.showNotesFor = null;
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
    this.showNotesFor = null;
    this.calendar.unselect();
  }

  @action
  updateAndRerenderCalendar() {
    this.clearPopovers();
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
  async deleteWorkLog(workLog) {
    this.clearPopovers();

    const workLogCopy = {
      date: workLog.date,
      duration: { ...workLog.duration },
      task: await workLog.task,
      person: await workLog.person,
      timesheet: await workLog.timesheet,
    };

    this.toaster.actionWithUndo({
      actionText: 'Deleting work log…',
      actionDoneText: 'Work log deleted.',
      actionUndoneText: 'Work log restored.',
      action: async () => await this.args.onDeleteWorkLog?.(workLog),
      undoAction: async () =>
        await this.args.onUndoDeleteWorkLog?.(workLogCopy),
      undoTime: 4000,
      contextKey: 'event-edit-actions',
    });
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

  @action
  saveNote(workLog, noteContent) {
    const previousContent = workLog.note;
    workLog.note = noteContent.trim();
    this.toaster.actionWithUndo({
      actionText: 'Updating notes…',
      actionDoneText: 'Notes updated.',
      actionUndoneText: 'Notes reverted.',
      action: async () => await workLog.save(),
      undoAction: async () => {
        workLog.note = previousContent;
        await workLog.save();
        this.calendar.render();
      },
      undoTime: 4000,
      contextKey: 'event-edit-actions',
    });
    this.showNotesFor = null;
    this.calendar.render();
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
