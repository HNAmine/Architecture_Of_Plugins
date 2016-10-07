import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class PluginService {

  listConfigPlugins: Array<any> = [];

  constructor( @Inject('LIST_PLUGINS') private listPlugin) {
    this.loadConfig();
  }

  getConfigByName(projectName: string) {
    return this.listConfigPlugins.filter(config => (config.projectName === projectName))[0];
  }

  loadConfig() {
    this.listPlugin.forEach(plugin => {
      System.import(plugin).then(m => {
        const conf = m.PLUGIN_CONF;
        if (this.listConfigPlugins.indexOf(m.PLUGIN_CONF) === -1) {
          this.listConfigPlugins.push(m.PLUGIN_CONF);
        }
        console.log(`imported ${plugin}`);
        console.log(`========================`);
        return m[conf.component.name];
      });
    });
  }

}
