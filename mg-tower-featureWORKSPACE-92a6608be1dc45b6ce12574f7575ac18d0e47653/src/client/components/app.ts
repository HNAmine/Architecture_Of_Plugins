import {Component, ComponentResolver, ViewChild, ViewContainerRef, ElementRef, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES } from '@angular/router';

import {WorkspaceService} from 'tower-base-client';
import {Project} from 'magnuscli-shared/shared';
import {MgListItem} from './list/list_item';
import {MgList} from './list/list';
import {MtListItem} from './list/mt_list_item';
import {MgListItemTitle} from './list/list_item_title';
import {MgListSubItemDetails} from './list/list_sub_item_details';
import {MgListItemFooter} from './list/list_item_footer';
import { Router } from '@angular/router';
import {PluginService} from '../services/plugin.service';
import {SocketService} from 'magnus-front/services';

@Component({
  selector: 'app',
  templateUrl: './app.html',
  directives: [MgList, MgListItem, MtListItem, MgListItemTitle, MgListSubItemDetails, MgListItemFooter, ROUTER_DIRECTIVES],
})
export class AppComponent implements OnInit {

  filter_projects: Array<Project>;
  executedProject: Project;
  project_types: any = [
    { label: 'ALL', type: -1, choosed: true },
    { label: 'UI', type: 0, choosed: false },
    { label: 'SHARED', type: 1, choosed: false },
    { label: 'API', type: 2, choosed: false },
    { label: 'ASSETS', type: 3, choosed: false },
    { label: 'BASE APP', type: 4, choosed: false }
  ];

  @ViewChild('vertex') element: ElementRef;

  constructor(private socketService: SocketService,
    private workspaceService: WorkspaceService,
    private componentResolver: ComponentResolver,
    private vc: ViewContainerRef,
    private router: Router,
    private pluginService: PluginService) {
    this.filter_projects = this.projects;
  }

  get projects(): Array<Project> {
    return this.workspaceService.projects;
  }

  ngOnInit() {
    this.workspaceService.getProjects().subscribe((projects) => {
      this.filter_projects = projects;
      console.log('workspace retrieved');
      projects.forEach(project => {
        this.socketService.addNamespace(project.name, 'config.api');
        this.socketService.subscribeToNamespace(project.name).subscribe(data => {
          console.log('-------------------------------------------------------------');
          console.log(data);
        });
      });
    });
    this.workspaceService.selectProject.next(this.executedProject);
  }

  selectProject(pr: Project) {
    this.executedProject = pr;
    this.workspaceService.selectProject.next(pr);
    this.workspaceService.currentProject = pr;
    this.router.navigate(['home/workspace/', pr.name]);
  }

  filterWorkSpace(type: any) {
    this.project_types.forEach((t) => { t.choosed = false; });
    type.choosed = true;
    if (type.type < 0) {
      this.filter_projects = this.projects;
    } else this.filter_projects = this.projects.filter(project => project.type === type.type);
  }

}
