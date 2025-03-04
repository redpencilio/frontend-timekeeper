import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  endOfMonth,
  addDays,
  differenceInDays,
  subDays,
  eachDayOfInterval,
  isSameDay,
  isAfter,
  isBefore,
} from 'date-fns';
import { task as ecTask } from 'ember-concurrency';
import { formatDate } from 'frontend-timekeeper/utils/format-date';
import taskName from 'frontend-timekeeper/helpers/task-name';
import Duration from '../utils/duration';
import svgJar from 'ember-svg-jar/helpers/svg-jar';

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

  @tracked selectedWorkLog = null;
  @tracked selectedDateRange = null;
  @tracked showNotesFor = null;

  get hasSelection() {
    return this.selectedDateRange?.start && this.selectedDateRange?.end;
  }

  get isMultiDaySelection() {
    return (
      this.hasSelection &&
      differenceInDays(
        this.selectedDateRange.end,
        this.selectedDateRange.start,
      ) > 1
    );
  }

  get workLogsForSelection() {
    if (this.hasSelection) {
      const { start, end } = this.selectedDateRange;
      return this.args.workLogs.filter(
        (workLog) =>
          isAfter(workLog.date, start) && isBefore(workLog.date, end),
      );
    } else {
      return [];
    }
  }

  get selectionAnchorElement() {
    if (this.hasSelection) {
      // Get the cell for the last day of the selection
      const dateStr = formatDate(subDays(this.selectedDateRange.end, 1));
      return this.calendarEl.querySelector(`[data-date="${dateStr}"]`);
    } else {
      return null;
    }
  }

  async eventSource(_info, successCallback) {
    const workLogToCalendarEvent = async (workLog) => {
      const task = await workLog.task;
      if (task) {
        const name = taskName(task);
        const { hours, minutes } = workLog.duration;
        return {
          id: workLog.id,
          title: `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? `${minutes}m` : ''}: ${name}`,
          start: workLog.date,
          allDay: true,
          backgroundColor: task.color,
          borderColor: task.color,
          extendedProps: {
            workLog,
            task,
          },
        };
      }
    };

    const events = await Promise.all(
      this.args.workLogs.map(workLogToCalendarEvent),
    );
    successCallback(events);
  }

  @action
  async setupCalendar(element) {
    this.calendarEl = element;

    this.calendar = new Calendar(element, {
      // General calendar settings
      plugins: [interactionPlugin, dayGridPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: null,
        center: 'title',
        end: null,
      },
      firstDay: 1,
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday (0=Sunday)
      },
      height: '100%',

      // Properties and handlers related to calendar-events
      eventSources: [this.eventSource.bind(this)],
      eventDisplay: 'list-item',
      eventOrder: sortEvents,
      dayMaxEvents: 6,
      dayCellContent: this.renderDayCellContent.bind(this),
      eventContent: this.renderEvent.bind(this),
      editable: false, // Allows for drag and drop/resize of internal events
      droppable: false, // Allows for drag and drop of external elements

      // Properties and handlers related to day selections in the calendar
      unselectCancel: '.work-log-popover',
    });
    this.setCalendarHandlers();
    this.goToMonth();
    this.calendar.render();
    // TODO improve by putting addEventListener and removeEventListener
    // together
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  @action
  setCalendarHandlers() {
    const handler = (fn) => {
      if (this.args.isDisabled) {
        return () => false;
      } else {
        return fn.bind(this);
      }
    };
    this.calendar.setOption(
      'eventClick',
      handler((info) => {
        this.clearPopovers();
        this.selectedWorkLog = info.event.extendedProps.workLog;
        this.calendar.select(info.event.start);
      }),
    );
    this.calendar.setOption('selectable', !this.args.isDisabled);
    this.calendar.setOption(
      'select',
      handler((info) => {
        this.showNotesFor = null;
        this.selectedDateRange = { start: info.start, end: info.end };
        this.clearEventHightlights();
      }),
    );
    this.calendar.setOption(
      'unselect',
      handler(() => {
        this.clearPopovers();
      }),
    );
  }

  @action
  goToMonth() {
    const firstDayOfNextMonth = addDays(
      endOfMonth(this.args.firstDayOfMonth),
      1,
    );
    this.calendar.setOption('selectConstraint', {
      start: this.args.firstDayOfMonth,
      end: firstDayOfNextMonth,
    });
    this.calendar.gotoDate(this.args.firstDayOfMonth);
  }

  renderDayCellContent(info) {
    const workLogs = this.args.workLogs.filter((workLog) =>
      isSameDay(workLog.date, info.date),
    );
    if (workLogs.length) {
      const totalDuration = workLogs
      .map((workLog) => workLog.duration)
      .reduce(
        (acc, duration) => acc.add(duration),
        new Duration(),
      );
      const { hours, minutes } = totalDuration.normalized();

      return {
        html: /*html*/ `
        <div class="flex justify-between items-center w-full pr-1">
          <div class="fc-daygrid-day-number">${info.dayNumberText}</div>
          <div class="text-gray-400 text-sm shrink-0">
            ${hours}h ${minutes > 0 ? `${minutes}m` : ''}
          </div>
        </div>
      `,
      };
    } else {
      return {
        html: `<div class="fc-daygrid-day-number">${info.dayNumberText}</div>`,
      };
    }
  }

  renderEvent(info) {
    const { event } = info;
    const note = info.event.extendedProps.workLog.note;

    const stickyIcon = svgJar.compute(['sticky-fill'], { class: 'size-full' });

    const container = document.createElement('div');
    container.className =
      'w-full truncate flex items-center pl-[0.188rem] pt-[0.188rem] pb-0.5 pr-0.5';

    const eventTitleContainer = document.createElement('div');
    eventTitleContainer.classList = 'flex items-center grow truncate';

    const statusIndicatorContainer = document.createElement('div');
    statusIndicatorContainer.classList =
      'size-2.5 shrink-0 mr-[0.188rem] flex items-center justify-center';

    if (note) {
      const colorNote = document.createElement('div');
      colorNote.className = 'size-full';
      colorNote.style.color = info.backgroundColor;
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
    stickyButton.classList = 'size-4 text-gray-400 hover:text-gray-500';
    stickyButton.onclick = (clickEvent) => {
      this.clearEventHightlights();
      clickEvent.stopPropagation();
      container.classList.add('highlight-event');
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

  @action
  cancel() {
    this.clearPopovers();
  }

  cancelNotesPopover = () => {
    this.showNotesFor = null;
    this.clearEventHightlights();
  };

  clearPopovers() {
    this.selectedWorkLog = null;
    this.selectedDateRange = null;
    this.showNotesFor = null;
    this.clearEventHightlights();
    this.calendar.unselect();
  }

  clearEventHightlights() {
    document.querySelectorAll('.highlight-event').forEach((eventEl) => {
      eventEl.classList.remove('highlight-event');
    });
  }

  @action
  reloadCalendarEvents() {
    this.clearPopovers();
    this.calendar.refetchEvents();
  }

  save = ecTask(async (workLogEntries) => {
    const { start, end } = this.selectedDateRange;
    await this.args.onSave(
      workLogEntries,
      eachDayOfInterval({ start, end: subDays(end, 1) }),
    );
    this.clearPopovers();
  });

  @action
  async deleteWorkLog(workLog) {
    this.clearPopovers();

    // Remove the event visually
    this.calendar
      .getEvents()
      .find(event => event.extendedProps.workLog === workLog)
      ?.remove();

    this.toaster.actionWithUndo({
      actionText: 'Deleting work log…',
      actionDoneText: 'Work log deleted.',
      actionUndoneText: 'Work log restored.',
      action: async () => {
        const workLogCopy = {
          date: workLog.date,
          duration: { ...workLog.duration },
          task: await workLog.task,
          person: await workLog.person,
          timesheet: await workLog.timesheet,
        };

        await this.args.onDeleteWorkLog?.(workLog)
        return workLogCopy;
      },
      undoAction: async (workLogCopy) =>
        await this.args.onUndoDeleteWorkLog?.(workLogCopy),
      undoTime: 4000,
      contextKey: 'event-edit-actions',
    });
  }

  saveNote = (workLog, noteContent) => {
    const previousContent = workLog.note;
    const trimmedContent = noteContent?.trim();
    const isDelete = !trimmedContent;
    workLog.note = trimmedContent;
    this.toaster.actionWithUndo({
      actionText: isDelete ? 'Deleting note…' : 'Updating note…',
      actionDoneText: isDelete ? 'Note deleted.' : 'Note saved.',
      actionUndoneText: isDelete ? 'Note restored.' : 'Note reverted.',
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
  };

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
