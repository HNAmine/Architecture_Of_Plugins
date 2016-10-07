import {OrderedMap} from 'immutable';
import {MgPlugin} from '../contract/plugin_contract';

export interface Element {
  id?: string;
  name: string;
  description?: string;
}

export interface PluginMetadata extends Element {
  displayName?: string;
  avatar?: string;
  emplacement?: string;
  active: boolean;
  status?: PLUGIN_STATUS;
  version: string;
  authors?: [Author];
  url?: string;
  created?: Date;
  providers?: [any];
  events?: { [key: string]: string[] };
  //traitement data..
  target?: any;
  // instance?: Object;
  instance?: MgPlugin | Object;
  //childrens
  actions?: OrderedMap<string, ActionMetadata>;
  pluginProperties?: OrderedMap<string, PluginPropertyMetadata>;
  eventListeners?: OrderedMap<string, EventListenerMetadata>;
}

export interface ActionMetadata extends Element {
  displayName?: string;
  active: boolean;
  //traitement data..
  target?: any;
  key?: string;
  value?: any;
}

export interface PluginPropertyMetadata extends Element {
  displayName?: string;
  active: boolean;
  defaultValue?: any;
  required?: boolean;
  //traitement data..
  target?: Object;
  key?: string;
}

export interface EventListenerMetadata extends Element {
  eventType: EVENT_TYPE;
  // eventStatus: EVENT_STATUS;
  //traitement data..
  target?: any;
  key?: string;
  value?: any;
  //owner plugin
  // plugin: PluginMetadata;
}

export class Author {
  name: string;
  //... and more
  constructor(name: string) {
    this.name = name;
  }
}

export enum PLUGIN_STATUS {
  UP, DOWN, NONE
}

export class Event {
  eventType: EVENT_TYPE;
  eventStatus: EVENT_STATUS;
  eventPriority: EVENT_PRIORITY;
  dateCreationEvent: Date;
  tasks: Array<any>;
  project: string;
}

export enum EVENT_TYPE {
  FILE_CHANGES, PACKAGE_CHANGES, TS_FILES_CHANGES, SRC_FILES_CHANGES
}

export enum EVENT_STATUS {
  TRIGGERED, IN_EXECUTION, EXECUTED
}

export enum EVENT_PRIORITY {
  LOWEST, NORMAL, HIGHEST
}
