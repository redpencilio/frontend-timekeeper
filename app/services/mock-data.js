import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { v4 as createUuid } from 'uuid';
import { service } from '@ember/service';

function createMockData(store) {
  const loket = store.createRecord('project', {
    name: 'Loket',
    color: '#6366f1',
  });
  const kaleidos = store.createRecord('project', {
    name: 'Kaleidos',
    color: '#22C55E',
  });
  const gn = store.createRecord('project', {
    name: 'GN',
    color: '#EF4444',
  });
  const nove = store.createRecord('project', {
    name: 'Nove',
    color: '#EAB308',
  });
  const ooof = store.createRecord('project', {
    name: 'Out of Office',
    color: '#94a3b8',
  });
  const sayEditor = store.createRecord('project', {
    name: 'Say Editor',
    parent: gn,
  });
  const digitaalTekenenGn = store.createRecord('project', {
    name: 'Digitaal Tekenen',
    parent: gn,
  });
  const digitaalTekenenKaleidos = store.createRecord('project', {
    name: 'Digitaal Tekenen',
    parent: kaleidos,
  });
  const sickLeave = store.createRecord('project', {
    name: 'Sick Leave',
    parent: ooof,
  });
  const holiday = store.createRecord('project', {
    name: 'Holiday',
    parent: ooof,
  });
  const vlaamsParlement = store.createRecord('project', {
    name: 'Vlaams Parlement',
    parent: kaleidos,
  });

  const projects = [
    loket,
    kaleidos,
    gn,
    nove,
    ooof,
    sayEditor,
    digitaalTekenenGn,
    digitaalTekenenKaleidos,
    sickLeave,
    holiday,
    vlaamsParlement,
  ];

  projects.forEach((project) => (project.id = createUuid()));

  const timeLogs = [
    store.createRecord('time-log', {
      hours: 1,
      project: digitaalTekenenGn,
      date: new Date('2024-09-02'),
    }),
    store.createRecord('time-log', {
      hours: 7,
      project: kaleidos,
      date: new Date('2024-09-02'),
    }),
    store.createRecord('time-log', {
      hours: 8,
      project: kaleidos,
      date: new Date('2024-09-03'),
    }),
    store.createRecord('time-log', {
      hours: 4,
      project: nove,
      date: new Date('2024-09-04'),
    }),
    store.createRecord('time-log', {
      hours: 4,
      project: kaleidos,
      date: new Date('2024-09-04'),
    }),
    store.createRecord('time-log', {
      hours: 8,
      project: loket,
      date: new Date('2024-09-05'),
    }),
    store.createRecord('time-log', {
      hours: 2,
      project: loket,
      date: new Date('2024-09-06'),
    }),
    store.createRecord('time-log', {
      hours: 2,
      project: kaleidos,
      date: new Date('2024-09-05'),
    }),
    store.createRecord('time-log', {
      hours: 4,
      project: nove,
      date: new Date('2024-09-05'),
    }),
    store.createRecord('time-log', {
      hours: 1,
      project: sayEditor,
      date: new Date('2024-09-05'),
    }),
    store.createRecord('time-log', {
      hours: 1,
      project: loket,
      date: new Date('2024-09-13'),
    }),
    store.createRecord('time-log', {
      hours: 7,
      project: kaleidos,
      date: new Date('2024-09-13'),
    }),
    store.createRecord('time-log', {
      hours: 8,
      project: sickLeave,
      date: new Date('2024-09-12'),
    }),
    store.createRecord('time-log', {
      hours: 4,
      project: nove,
      date: new Date('2024-09-11'),
    }),
    store.createRecord('time-log', {
      hours: 4,
      project: kaleidos,
      date: new Date('2024-09-11'),
    }),
    store.createRecord('time-log', {
      hours: 8,
      project: loket,
      date: new Date('2024-09-10'),
    }),
    store.createRecord('time-log', {
      hours: 2,
      project: loket,
      date: new Date('2024-09-09'),
    }),
    store.createRecord('time-log', {
      hours: 2,
      project: vlaamsParlement,
      date: new Date('2024-09-09'),
    }),
    store.createRecord('time-log', {
      hours: 4,
      project: nove,
      date: new Date('2024-09-09'),
    }),
    store.createRecord('time-log', {
      hours: 1,
      project: sayEditor,
      date: new Date('2024-09-09'),
    }),
    store.createRecord('time-log', {
      hours: 8,
      project: holiday,
      date: new Date('2024-09-16'),
    }),
    store.createRecord('time-log', {
      hours: 8,
      project: holiday,
      date: new Date('2024-09-17'),
    }),
    store.createRecord('time-log', {
      hours: 8,
      project: holiday,
      date: new Date('2024-09-18'),
    }),
    store.createRecord('time-log', {
      hours: 8,
      project: holiday,
      date: new Date('2024-09-19'),
    }),
    store.createRecord('time-log', {
      hours: 8,
      project: holiday,
      date: new Date('2024-09-20'),
    }),
    store.createRecord('time-log', {
      hours: 1,
      project: digitaalTekenenGn,
      date: new Date('2024-09-23'),
    }),
    store.createRecord('time-log', {
      hours: 7,
      project: kaleidos,
      date: new Date('2024-09-23'),
    }),
    store.createRecord('time-log', {
      hours: 8,
      project: digitaalTekenenKaleidos,
      date: new Date('2024-09-24'),
    }),
    store.createRecord('time-log', {
      hours: 4,
      project: nove,
      date: new Date('2024-09-25'),
    }),
    store.createRecord('time-log', {
      hours: 4,
      project: kaleidos,
      date: new Date('2024-09-25'),
    }),
    store.createRecord('time-log', {
      hours: 8,
      project: loket,
      date: new Date('2024-09-26'),
    }),
    store.createRecord('time-log', {
      hours: 2,
      project: loket,
      date: new Date('2024-09-27'),
    }),
    store.createRecord('time-log', {
      hours: 2,
      project: kaleidos,
      date: new Date('2024-09-26'),
    }),
    store.createRecord('time-log', {
      hours: 4,
      project: nove,
      date: new Date('2024-09-26'),
    }),
    store.createRecord('time-log', {
      hours: 1,
      project: sayEditor,
      date: new Date('2024-09-26'),
    }),
    store.createRecord('time-log', {
      hours: 4,
      project: digitaalTekenenKaleidos,
      date: new Date('2024-09-30'),
    }),
    store.createRecord('time-log', {
      hours: 4,
      project: gn,
      date: new Date('2024-09-30'),
    }),
  ];

  timeLogs.forEach((timeLog) =>
    Object.assign(timeLog, {
      id: createUuid(),
      minutes: 0,
    }),
  );

  return timeLogs;
}

export default class MockDataService extends Service {
  @service store;

  @tracked timeLogs = createMockData(this.store);

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
    return this.timeLogs.map((hourLog) => {
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

    this.timeLogs = [...this.timeLogs, record];
  }

  @action
  updateHourLogById(id, newLog) {
    const index = this.timeLogs.findIndex((log) => log.id === id);
    if (index === -1) {
      return;
    }

    this.timeLogs = [
      ...this.timeLogs.slice(0, index),
      { ...newLog, id: createUuid() },
      ...this.timeLogs.slice(index + 1),
    ];
  }

  @action
  deleteHourLogById(id) {
    const index = this.timeLogs.findIndex((log) => log.id === id);
    if (index === -1) {
      return;
    }

    this.timeLogs = [
      ...this.timeLogs.slice(0, index),
      ...this.timeLogs.slice(index + 1),
    ];
  }
}
