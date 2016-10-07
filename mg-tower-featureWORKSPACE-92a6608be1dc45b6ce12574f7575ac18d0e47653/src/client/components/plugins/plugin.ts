import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Project} from 'magnuscli-shared/shared';
import {CORE_DIRECTIVES} from '@angular/common';
import {PluginHolderComponent} from '../plugin-holder/plugin-holder.component';
import {ROUTER_DIRECTIVES } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {WorkspaceService} from 'tower-base-client';

import {PackageDetail} from './package-detail/package-detail.component';
import {PluginService} from '../../services/plugin.service';

@Component({
  selector: 'mg-plugin',
  templateUrl: './plugin.html',
  directives: [CORE_DIRECTIVES, PluginHolderComponent, ROUTER_DIRECTIVES, PackageDetail],
  encapsulation: ViewEncapsulation.None
})
export class MgPlugin implements OnInit {

  title: string = 'Plugins Manager';
  project: Project;
  projectName: string;
  listConfigPlugins: Array<any> = [];

  constructor(private route: ActivatedRoute, private workspaceService: WorkspaceService, private pluginService: PluginService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectName = params['project'];
      this.workspaceService.getProjectByName(this.projectName).subscribe(project => {
        this.project = project;
      });
    });
    this.listConfigPlugins = this.pluginService.listConfigPlugins;
  }

}
