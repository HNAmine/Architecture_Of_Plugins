import {Component, ViewChild, ViewContainerRef, Input, OnInit, ComponentResolver} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {PluginService} from '../../services/plugin.service';

@Component({
  selector: 'plugin-holder',
  templateUrl: 'plugin-holder.component.html'
})
export class PluginHolderComponent implements OnInit {

  @Input()
  plugin: string;

  @ViewChild('contentHolder', { read: ViewContainerRef }) element: ViewContainerRef;

  constructor(private route: ActivatedRoute, private componentResolver: ComponentResolver, private pluginService: PluginService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pluginService.loadConfig();
      const config = this.pluginService.getConfigByName(params['plugin']);
      console.log('===================== * ======================');
      console.log(config);
      console.log('===================== * ======================');
      this.element.clear();
      if (config) {
        this.componentResolver.resolveComponent(config.component).then(factory => {
          this.element.createComponent(factory);
        });
      }
    });
  }
}
