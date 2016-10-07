import {defaultPluginMetadataRegistry, WorkspaceService, Task, PluginMetadataRegistry, isValidateEvents, TaskManager} from 'tower-base-server';
import {OrderedMap} from 'immutable';
import {Inject, Container} from 'magnus-back';
import {Observable} from 'rxjs/Observable';
var async = require('async');

var dir = RemoveLastDirectoryPartOf(__dirname);

require('require-all')({
  dirname: dir + '/node_modules/mg-git-plugin',
  filter: 'index.js',
  recursive: true
});

require('require-all')({
  dirname: dir + '/node_modules/mg-npm-plugin',
  filter: 'index.js',
  recursive: true
});

require('require-all')({
  dirname: dir + '/node_modules/mg-exe-plugin',
  filter: 'index.js',
  recursive: true
});

require('require-all')({
  dirname: dir + '/node_modules/mg-msii-plugin',
  filter: 'index.js',
  recursive: true
});

export function RemoveLastDirectoryPartOf(the_url) {
  var the_arr = the_url.split('/');
  for (var i = 0; i < 4; i++) {
    the_arr.pop();
    the_arr.join('/');
  }
  return the_arr.join('/');
}

export class PluginsManager {

  registry: PluginMetadataRegistry = defaultPluginMetadataRegistry;
  plugins: OrderedMap<any, any> = OrderedMap<string, any>({});

  @Inject() workspaceService: WorkspaceService;
  @Inject() taskManager: TaskManager;

  constructor() {
    this.registry.init();
  }

  execute(projectName: string, pluginName: string, actionName: string, argum: any): any {

    var project = this.workspaceService.getProjectByName(projectName);
    var plugin = this.registry.getPluginByName(pluginName);
    var action = plugin.actions.find(action => action.name === actionName);

    var target: Object = action.target;
    var key: string = action.key;
    var method: any = action.value;

    var ar: any = {};
    ar.project = project;
    ar.methArgs = argum;

    var args: any[] = Object.keys(ar).map(function(_) { return ar[_]; });
    var a = args.map(a => JSON.stringify(a)).join();
    if (!plugin.instance) {
      plugin.instance = Container.get(plugin.target);
      plugin.instance.workspaceService = this.workspaceService;
      console.log('create instance !');
    } else {
      console.log('use instance !');
    }
    var result = method.value.apply(plugin.instance, args);
    var outcome = result;
    if (result instanceof Promise) {
      outcome = result;
    } else if (result instanceof Task) {
      outcome = Promise.resolve({ id: result.id });
      var sub = this.taskManager.startTask(result, plugin.name).subscribe(val => {
        console.log(val);
      }, error => {
          console.error(error);
        }, () => {
          sub.unsubscribe();
        });
    } else if (result instanceof Observable) {
      console.log('===============> is Observable !');
      outcome = result.toPromise();
    } else { outcome = Promise.resolve(result); }
    return outcome;
  }

  getActionOfEventListeners(projectName: string, pluginName: string, eventListnerName: string, argum: any): any {
    var project = this.workspaceService.getProjectByName(projectName);
    var plugin = this.registry.getPluginByName(pluginName);
    let eventListeners = plugin.eventListeners.find(eventListner => eventListner.name === eventListnerName);

    var target: Object = eventListeners.target;
    var key: string = eventListeners.key;
    var method: any = eventListeners.value;

    var ar: any = {};
    ar.project = project;
    ar.methArgs = argum;

    var args: any[] = Object.keys(ar).map(function(_) { return ar[_]; });
    var a = args.map(a => JSON.stringify(a)).join();

    if (!plugin.instance) {
      plugin.instance = Container.get(plugin.target);
    }

    var result = method.value.apply(plugin.instance, args);
    var outcome = result;

    var acts = [];
    plugin.actions.forEach(action => {
      acts.push(action.name);
    });

    if (!isValidateEvents(outcome, acts)) {
      console.log('========================================================');
      console.log('=== Action specifie doesnt exist in ACTION METADATA ===');
      console.log('========================================================');
      return 'Action specifie doesnt exist in ACTION METADATA !';
    }
    else {
      //specifie the orther of executions
      async.parallel([
        function() {
          console.log('Function 1');
        },
        function() {
          console.log('Function 2');
        }
      ]);
      outcome.forEach(action => {
        this.execute(projectName, pluginName, action, argum);
      });
      return 'end of execution (run in sequence) !';
    };
  }

  getActionOfEventListener(projectName: string, pluginName: string, eventListnerName: string): any {
    var project = this.workspaceService.getProjectByName(projectName);
    var plugin = this.registry.getPluginByName(pluginName);
    let eventListeners = plugin.eventListeners.find(eventListner => eventListner.name === eventListnerName);

    var target: Object = eventListeners.target;
    var key: string = eventListeners.key;
    var method: any = eventListeners.value;

    var ar: any = {};
    ar.project = project;
    ar.methArgs = null;

    var args: any[] = Object.keys(ar).map(function(_) { return ar[_]; });
    var a = args.map(a => JSON.stringify(a)).join();

    if (!plugin.instance) {
      plugin.instance = Container.get(plugin.target);
    }

    var result = method.value.apply(plugin.instance, args);
    var outcome = result;

    var acts = [];
    plugin.actions.forEach(action => {
      acts.push(action.name);
    });
    if (!isValidateEvents(outcome, acts)) {
      return null;
    }
    return outcome;
  }
}
