require('require-all')({
  dirname: '/home/magnusdev2/testworkspace/tower-api/node_modules/tower-base-server',
  filter: 'index.js',
  recursive: true
});

import {TestApp} from './app';

new TestApp().start();
