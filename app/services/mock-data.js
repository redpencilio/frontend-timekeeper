import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MockDataService extends Service {
  @tracked hourLogs = [
    {
      hours: 1,
      project: 'Loket',
      date: '2024-09-02',
      subproject: 'Digitaal Tekenen',
    },
    {
      hours: 7,
      project: 'Kaleidos',
      date: '2024-09-02',
    },
    {
      hours: 8,
      project: 'Kaleidos',
      date: '2024-09-03',
    },
    {
      hours: 4,
      project: 'Nove',
      date: '2024-09-04',
    },
    {
      hours: 4,
      project: 'Kaleidos',
      date: '2024-09-04',
    },
    {
      hours: 8,
      project: 'Loket',
      date: '2024-09-05',
    },
    {
      hours: 2,
      project: 'Loket',
      date: '2024-09-06',
    },
    {
      hours: 2,
      project: 'Kaleidos',
      date: '2024-09-05',
    },
    {
      hours: 4,
      project: 'Nove',
      date: '2024-09-05',
    },
    {
      hours: 1,
      project: 'GN',
      date: '2024-09-05',
      subproject: 'Say Editor',
    },
    {
      hours: 1,
      project: 'Loket',
      date: '2024-09-13',
    },
    {
      hours: 7,
      project: 'Kaleidos',
      date: '2024-09-13',
    },
    {
      hours: 8,
      project: 'Out of Office',
      date: '2024-09-12',
      subproject: 'Sick Leave',
    },
    {
      hours: 4,
      project: 'Nove',
      date: '2024-09-11',
    },
    {
      hours: 4,
      project: 'Kaleidos',
      date: '2024-09-11',
    },
    {
      hours: 8,
      project: 'Loket',
      date: '2024-09-10',
    },
    {
      hours: 2,
      project: 'Loket',
      date: '2024-09-09',
    },
    {
      hours: 2,
      project: 'Kaleidos',
      date: '2024-09-09',
      subproject: 'Vlaams Parlement',
    },
    {
      hours: 4,
      project: 'Nove',
      date: '2024-09-09',
    },
    {
      hours: 1,
      project: 'GN',
      date: '2024-09-09',
      subproject: 'Say Editor',
    },
    {
      hours: 8,
      project: 'Out of Office',
      date: '2024-09-16',
      subproject: 'Holiday',
    },
    {
      hours: 8,
      project: 'Out of Office',
      date: '2024-09-17',
      subproject: 'Holiday',
    },
    {
      hours: 8,
      project: 'Out of Office',
      date: '2024-09-18',
      subproject: 'Holiday',
    },
    {
      hours: 8,
      project: 'Out of Office',
      date: '2024-09-19',
      subproject: 'Holiday',
    },
    {
      hours: 8,
      project: 'Out of Office',
      date: '2024-09-20',
      subproject: 'Holiday',
    },
    {
      hours: 1,
      project: 'Loket',
      date: '2024-09-23',
      subproject: 'Digitaal Tekenen',
    },
    {
      hours: 7,
      project: 'Kaleidos',
      date: '2024-09-23',
    },
    {
      hours: 8,
      project: 'Kaleidos',
      date: '2024-09-24',
      subproject: 'Digitaal Tekenen',
    },
    {
      hours: 4,
      project: 'Nove',
      date: '2024-09-25',
    },
    {
      hours: 4,
      project: 'Kaleidos',
      date: '2024-09-25',
    },
    {
      hours: 8,
      project: 'Loket',
      date: '2024-09-26',
    },
    {
      hours: 2,
      project: 'Loket',
      date: '2024-09-27',
    },
    {
      hours: 2,
      project: 'Kaleidos',
      date: '2024-09-26',
    },
    {
      hours: 4,
      project: 'Nove',
      date: '2024-09-26',
    },
    {
      hours: 1,
      project: 'GN',
      date: '2024-09-26',
      subproject: 'Say Editor',
    },
    {
      hours: 4,
      project: 'Kaleidos',
      date: '2024-09-30',
      subproject: 'Digitaal Tekenen',
    },
    {
      hours: 4,
      project: 'GN',
      date: '2024-09-30',
    },
  ].map((hourLog, index) => {
    hourLog.id = index;
    return hourLog;
  });

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
    return this.hourLogs.map((hourLog) => {
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

  addHourLog(hourLog) {
    hourLog.id = this.hourLogs.length;
    this.hourLogs = [...this.hourLogs, hourLog];
  }

  @action
  updateHourLogById(id, newLog) {
    const index = this.hourLogs.findIndex((log) => log.id === id);
    if (index === -1) {
      return;
    }

    this.hourLogs = [
      ...this.hourLogs.slice(0, index),
      { ...newLog, id: index },
      ...this.hourLogs.slice(index + 1),
    ];
  }

  @action
  deleteHourLogById(id) {
    const index = this.hourLogs.findIndex((log) => log.id === id);
    if (index === -1) {
      return;
    }

    this.hourLogs = [
      ...this.hourLogs.slice(0, index),
      ...this.hourLogs.slice(index + 1),
    ];
  }
}
