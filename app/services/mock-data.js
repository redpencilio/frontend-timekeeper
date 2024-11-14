import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { v4 as createUuid } from 'uuid';
import { service } from '@ember/service';

export default class MockDataService extends Service {
  @service store;

  @tracked workLogs = createMockData(this.store);

  colorMap = {
    Loket: '#6366f1',
    Kaleidos: '#22C55E',
    Nove: '#EAB308',
    GN: '#EF4444',
    'Out of Office': '#94a3b8',
  };

  colorMapTailwind = {
    Loket: 'bg-indigo-500',
    Kaleidos: 'bg-green-500',
    Nove: 'bg-yellow-500',
    GN: 'bg-red-500',
    'Out of Office': 'bg-slate-400',
  };

  colorMapTailwindRaw = {
    Loket: 'indigo-500',
    Kaleidos: 'green-500',
    Nove: 'yellow-500',
    GN: 'red-500',
    'Out of Office': 'slate-400',
  };

  get events() {
    return this.workLogs.map((hourLog) => {
      const { hours, project, date, subproject, id } = hourLog;
      return {
        id,
        title: `${hours}h: ${subproject ?? project}`,
        start: date,
        allDay: true,
        backgroundColor: this.colorMap[project],
        borderColor: this.colorMap[project],
        extendedProps: {
          hourLog,
        },
      };
    });
  }

  projects = ['Loket', 'Kaleidos', 'Nove', 'GN', 'Out of Office'];

  addHourLog({ date, hours, minutes = 0, project }) {
    const record = this.store.createRecord('time-log', {
      date,
      hours,
      minutes,
      project,
    });
    record.id = createUuid();

    this.workLogs = [...this.workLogs, record];
  }

  @action
  updateHourLogById(id, newLog) {
    const index = this.workLogs.findIndex((log) => log.id === id);
    if (index === -1) {
      return;
    }

    this.workLogs = [
      ...this.workLogs.slice(0, index),
      { ...newLog, id: createUuid() },
      ...this.workLogs.slice(index + 1),
    ];
  }

  @action
  deleteHourLogById(id) {
    const index = this.workLogs.findIndex((log) => log.id === id);
    if (index === -1) {
      return;
    }

    this.workLogs = [
      ...this.workLogs.slice(0, index),
      ...this.workLogs.slice(index + 1),
    ];
  }
}
