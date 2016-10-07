import {AppComponent} from './components/app';
import {TestComponent} from './components/test';
import {MgPlugin} from './components/plugins/plugin';
import {PluginHolderComponent} from './components/plugin-holder/plugin-holder.component';

export const TOWER_ROUTES = [
  {
    path: 'workspace',
    component: AppComponent,
    children: [
      {
        path: ':project',
        component: MgPlugin,
        children: [
          {
            path: ':plugin',
            component: PluginHolderComponent
          },
          { path: '', component: TestComponent }
        ]
      },
      { path: '', component: TestComponent }
    ]
  },
  { path: '', component: TestComponent },
];
