import {PluginMetadata, ActionMetadata, PluginPropertyMetadata, EventListenerMetadata} from './metadata_model';
import {OrderedMap} from 'immutable';

export function isValidateEvents(event: Array<string>, actions: Array<string>): boolean {
  var ok: boolean = true;
  event.forEach(actionOfEvent => {
    if (actions.indexOf(actionOfEvent) < 0) {
      ok = false;
    }
  });
  return ok;
}

export class PluginMetadataRegistry {

  protected plugins: OrderedMap<string, PluginMetadata> = OrderedMap<string, PluginMetadata>({});
  protected actions: OrderedMap<string, ActionMetadata> = OrderedMap<string, ActionMetadata>({});
  protected eventListeners: OrderedMap<string, EventListenerMetadata> = OrderedMap<string, EventListenerMetadata>({});
  protected pluginProperties: OrderedMap<string, PluginPropertyMetadata> = OrderedMap<string, PluginPropertyMetadata>({});

  getPlugins(): OrderedMap<string, PluginMetadata> {
    return this.plugins;
  }
  getActions(): OrderedMap<string, ActionMetadata> {
    return this.actions;
  }
  getPluginProperties(): OrderedMap<string, PluginPropertyMetadata> {
    return this.pluginProperties;
  }
  getEventListeners(): OrderedMap<string, EventListenerMetadata> {
    return this.eventListeners;
  }

  getPluginByName(pluginName: string) {
    return this.plugins.find(plugin => plugin.name === pluginName);
  }

  addPlugin(plugin: PluginMetadata) {
    this.plugins = this.plugins.set(plugin.name, plugin);
  }
  addAction(action: ActionMetadata) {
    this.actions = this.actions.set(action.id, action);
  }
  addPluginProperty(pluginProperty: PluginPropertyMetadata) {
    this.pluginProperties = this.pluginProperties.set(pluginProperty.name, pluginProperty);
  }
  addEventListener(eventListener: EventListenerMetadata) {
    this.eventListeners = this.eventListeners.set(eventListener.id, eventListener);
  }

  removePlugin(pluginName: string) {
    this.plugins = this.plugins.remove(pluginName);
  }
  removeAction(actionName: string) {
    this.actions = this.actions.remove(actionName);
  }
  removePluginPropertie(pluginPropertyName: string) {
    this.pluginProperties = this.pluginProperties.remove(pluginPropertyName);
  }
  removeEventListener(eventListenerName: string) {
    this.eventListeners = this.eventListeners.remove(eventListenerName);
  }

  merge(registry: PluginMetadataRegistry) {
    this.plugins = this.plugins.merge(registry.getPlugins());
    this.actions = this.actions.merge(registry.getActions());
    this.pluginProperties = this.pluginProperties.merge(registry.getPluginProperties());
    this.eventListeners = this.eventListeners.merge(registry.getEventListeners());
  }

  public init() {
    console.log('init');
    this.reorganize();
  }

  public reorganize() {

    this.plugins.forEach(plugin => {

      plugin.actions = this.actions.filter(action => action.target.constructor === plugin.target).toOrderedMap();
      plugin.pluginProperties = this.pluginProperties.filter(propertie => propertie.target.constructor === plugin.target).toOrderedMap();
      plugin.eventListeners = this.eventListeners.filter(eventListener => eventListener.target.constructor === plugin.target).toOrderedMap();

      var acts = [];
      plugin.actions.forEach(action => {
        acts.push(action.name);
      });

      if (plugin.events) {
        Object.keys(plugin.events).forEach(key => {

          if (!isValidateEvents(plugin.events[key], acts)) {
            console.log('========================================================');
            console.log('=== Action specifie doesnt exist in ACTION METADATA ===');
            console.log('========================================================');
            delete plugin.events[key];
          }

        });
      }

    });
  }

}

export let defaultPluginMetadataRegistry = new PluginMetadataRegistry();
