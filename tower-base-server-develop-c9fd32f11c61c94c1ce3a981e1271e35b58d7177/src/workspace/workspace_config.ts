import {TYPE_PROJECT} from 'magnuscli-shared/shared';

export const MAGNUS_FRONT = 'magnus-front';
export const MAGNUS_METADATA = 'magnus-metadata';
export const MAGNUS_APP = 'magnus-app';
export const MAGNUS_BACK = 'magnus-back';
export const MAGNUS_METRTONIC = 'magnus-metronic';

export const MG_TASKS = 'mg-tasks';
export const NG2 = 'angular2';

export var projectdependencyGraph = {
  ui: [MAGNUS_FRONT, MAGNUS_METADATA, MG_TASKS],
  shared: [MAGNUS_METADATA, MG_TASKS],
  back: [MAGNUS_BACK, MAGNUS_METADATA, MG_TASKS],
  'base-app': [MAGNUS_FRONT, MAGNUS_METADATA, MAGNUS_METRTONIC, MAGNUS_APP],
};

export var libDependencyGraph = {
  'magnus-front': [MAGNUS_METADATA, MG_TASKS],
  'magnus-app': [MAGNUS_FRONT, MAGNUS_METADATA, MG_TASKS],
  'magnus-metadata': [MG_TASKS],
  'magnus-back': [MAGNUS_METADATA, MG_TASKS],
  'magnus-metronic': [],
  'mg-tasks': []
};

export const GIT_PROVIDER = 'gitlab.com';

export var libConfig = [
  {
    name: 'magnus-app',
    type: TYPE_PROJECT.UI,
    repository: 'magnus-tooling/magnus-app.git',
    connectype: 'git',
    systemModule: 'magnus-app',
    bundles: [],
    present: false
  },
  {
    name: 'magnus-front',
    type: TYPE_PROJECT.UI,
    repository: 'magnus-tooling/magnus-front.git',
    connectype: 'git',
    systemModule: 'magnus-front',
    bundles: ['magnus-front/inputs.js',
      'magnus-front/new-inputs.js',
      'magnus-front/shared.js',
      'magnus-front/directives.js',
      'magnus-front/components.js',
      'magnus-front/services.js'],
    present: false
  },
  {
    name: 'magnus-metronic',
    type: TYPE_PROJECT.ASSETS,
    repository: 'magnus-tooling/magnus-metronic.git',
    connectype: 'git',
    systemModule: '',
    bundles: [],
    present: false
  },
  {
    name: 'mg-tasks',
    type: TYPE_PROJECT.ASSETS,
    repository: 'magnus-tooling/mg-tasks.git',
    connectype: 'git',
    systemModule: '',
    bundles: [],
    present: false
  },
  {
    name: 'magnus-metadata',
    type: TYPE_PROJECT.SHARED,
    repository: 'magnus-tooling/magnus-metamodel.git',
    connectype: 'git',
    systemModule: 'magnus-metadata',
    bundles: [],
    present: false
  },
  {
    name: 'magnus-back',
    type: TYPE_PROJECT.API,
    repository: 'magnus-tooling/magnus-back.git',
    connectype: 'git',
    systemModule: '',
    bundles: [],
    present: false
  }
];
