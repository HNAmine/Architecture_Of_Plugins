import {defaultPluginMetadataRegistry, PluginMetadataRegistry, ProjectWatcher} from 'tower-base-server';
import {Inject} from 'magnus-back';
import {PluginsManager, RemoveLastDirectoryPartOf} from '../plugins_manager/plugins_manager';

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

export class EventManager {

  registry: PluginMetadataRegistry = defaultPluginMetadataRegistry;
  @Inject() manager: PluginsManager;
  @Inject() watcher: ProjectWatcher;
  currentEvents: Array<any> = new Array<any>();

  init() {
    this.watcher.watchStream.subscribe((events) => {
      console.log(events);
      this.executeEvents(events);
    });
  }

  executeEvents(events: Array<any>) {
    events.forEach(event => {
      console.log('-------------------------------------------------------------');
      console.log('for this type of event : ' + event.eventType + ' in project ' + event.project);
      this.registry.getPlugins().forEach(plugin => {
        plugin.eventListeners.forEach(eventListener => {
          var actions: Array<string> = this.manager.getActionOfEventListener(event.project, plugin.name, eventListener.name);
          if (event.eventType === eventListener.eventType && actions) {
            console.log('we execute this array of actions of plugin ' + plugin.name + ' listner : ' + eventListener.name);
            console.log(actions);
            actions.forEach(action => {
              this.manager.execute(event.project, plugin.name, action, null);
            });
          }
        });
      });
    });
  }

}
