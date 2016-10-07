import {provide} from '@angular/core';
import {provideRouter, Route, RouterConfig} from '@angular/router';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {bootstrap} from '@angular/platform-browser-dynamic';
import { LocationStrategy, HashLocationStrategy} from '@angular/common';
import { provideForms, disableDeprecatedForms} from '@angular/forms';
import {HTTP_PROVIDERS, Http} from '@angular/http';

import {MgAppComponent, MAGNUS_APP_INJECTABLES, MAGNUS_APP_ROUTES} from 'magnus-app';
import {magnetInjectables, provideNotification, provideMgStore, provideSocket , NGRX_CONFIG} from 'magnus-front/services';
import {PLUGINS_ARCHITECTUR_INJECTABLES} from 'tower-base-client';
import {FEATURES} from './app.features';
import {TOWER_ROUTES} from './app.routes';
import {PluginService} from './services/plugin.service';

function findHome(appRoutes: RouterConfig): any {
  return appRoutes.find(route => route.path === 'home');
}

let contentConfig = window['content-config'];
let homeRoute: Route = findHome(MAGNUS_APP_ROUTES);
homeRoute.children = homeRoute.children.concat(TOWER_ROUTES);
let listPlugin = ['mg-git-plugin', 'mg-npm-plugin', 'mg-exe-plugin', 'mg-msii-plugin'];

bootstrap(
  MgAppComponent,
  [
    provide('login.api', { useValue: '' }),
    provide('users.api', { useValue: '' }),
    provide('endpoints', { useValue: contentConfig.endPoints }),
    provide('end.point.url', { useValue: '/endpoints' }),
    provide('menu.url', { useValue: '/menu' }),
    provide('app.config', { useValue: contentConfig }),
    provide('ENV', { useValue: 'DEV' }),
    provide('app.id', { useValue: '5663494513ab58d7391941fc' }),
    provideMgStore([NGRX_CONFIG]),
    provideSocket({
      channel: [{ endPoint: 'config.api', name: 'tasks' }]
    }),
    provide(AuthHttp, {
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig({
          tokenName: 'token',
          globalHeaders: [{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }],
        }), http);
      },
      deps: [Http]
    }),
    provideNotification(<any>{
      feeds: [{
        url: 'tasks',
        title: 'Feed1',
        icon: 'icon-bell'
      },
        {
          url: 'notifications',
          title: 'Notifications',
          icon: 'icon-bell'
        }]
    }),
    provideRouter(MAGNUS_APP_ROUTES),
    MAGNUS_APP_INJECTABLES,
    HTTP_PROVIDERS,
    provide('features', { useValue: FEATURES }),
    provide('MAGNUS_APP_ROUTES', { useValue: MAGNUS_APP_ROUTES }),
    provide('LIST_PLUGINS', { useValue: listPlugin }),
    magnetInjectables,
    PLUGINS_ARCHITECTUR_INJECTABLES,
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    provideForms(),
    disableDeprecatedForms(),
    PluginService
  ]
  ).then(
  success => console.log('Bootstrap successful'),
  error => console.error(error)
  );;
