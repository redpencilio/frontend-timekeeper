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
  @tracked selectionInfo = null;

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
    }

    const events = await Promise.all(this.args.workLogs.map(workLogToCalendarEvent));
    successCallback(events);
  };

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
    this.calendar.setOption(
      'eventClick',
      this.args.isDisabled ? () => false : this.onEventClick.bind(this),
    );
    this.calendar.setOption(
      'eventDidMount',
      this.args.isDisabled ? undefined : this.attachEventRemoveButton.bind(this),
    );
    this.calendar.setOption('selectable', !this.args.isDisabled);
    this.calendar.setOption(
      'select',
      this.args.isDisabled ? () => false : this.onSelect.bind(this),
    );
    this.calendar.setOption(
      'unselect',
      this.args.isDisabled ? () => false : this.onUnselect.bind(this),
    );
  }

  @action
  goToMonth() {
    const firstDayOfNextMonth = addDays(endOfMonth(this.args.firstDayOfMonth), 1);
    this.calendar.setOption('selectConstraint', {
      start: this.args.firstDayOfMonth,
      end: firstDayOfNextMonth,
    });
    this.calendar.gotoDate(this.args.firstDayOfMonth);
  }

  renderDayCellContent(info) {
    const workLogs = this.args.workLogs.filter((workLog) => isSameDay(workLog.date, info.date));
    if (workLogs.length) {
      const totalDuration = workLogs
      .map((workLog) => workLog.duration)
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
        <div class="flex justify-between items-center w-full pr-1">
          <div class="fc-daygrid-day-number">${info.dayNumberText}</div>
          <div class="text-gray-400 text-sm shrink-0">
            ${hours}h ${minutes > 0 ? `${minutes}m` : ''}
          </div>
        </div>
      `,
      };
    } else {
      return { html: `<div class="fc-daygrid-day-number">${info.dayNumberText}</div>` };
    }
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
    if (this.selectionInfo) {
      const { start, end } = this.selectionInfo;
      return this.args.workLogs.filter((workLog) => {
        return isAfter(workLog.date, start) && isBefore(workLog.date, end)
      });
    } else {
      return [];
    }
  }

  @action
  cancel() {
    this.clearPopovers();
  }

  clearPopovers() {
    this.clickedEventInfo = null;
    this.selectionInfo = null;
    this.calendar.unselect();
  }

  @action
  reloadCalendarEvents() {
    this.calendar.refetchEvents();
  }

  @action
  updateDisabled() {
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
      contextKey: 'delete-work-log',
    });
  }

  get clickedWorkLog() {
    return this.clickedEventInfo?.event.extendedProps.workLog;
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
