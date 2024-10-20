import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

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
  ];

  colorMap = {
    Loket: '#3B82F6',
    Kaleidos: '#22C55E',
    Nove: '#EAB308',
    GN: '#EF4444',
    'Out of Office': '#94a3b8',
  };

  get events() {
    let id = 0;
    return this.hourLogs.map(({ hours, project, date, subproject }) => ({
      id: id++,
      title: `${hours}h: ${subproject ?? project}`,
      start: date,
      allDay: true,
      backgroundColor: this.colorMap[project],
      borderColor: this.colorMap[project],
    }));
  }

  projects = ['Loket', 'Kaleidos', 'Nove', 'GN', 'Out of Office'];

  addHourLog(hourLog) {
    this.hourLogs = [
      ...this.hourLogs,
      hourLog
    ];
  }
}
