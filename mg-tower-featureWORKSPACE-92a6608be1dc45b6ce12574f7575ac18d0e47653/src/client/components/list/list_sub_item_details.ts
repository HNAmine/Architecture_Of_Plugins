import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';

@Component({
  selector: 'mg-list-sub-item-details',
  directives: [CORE_DIRECTIVES],
  template: `
  <li class="task-list-item">
    <div class="task-icon">
      <a>
        <i class="fa fa-pencil"></i>
      </a>
    </div>
    <div class="task-status">
      <a class="done">
        <i class="fa fa-check"></i>
      </a>
      <a class="pending">
        <i class="fa fa-close"></i>
      </a>
    </div>
    <div class="task-content">
    <h4 class="uppercase bold">
      <a>Project name : {{project?.name}}</a>
    </h4>
    <h4 class="uppercase bold">
      <a>Project version : {{project?.version}}</a>
    </h4>
    <h4 class="uppercase bold">
      <a>Project floder : {{project?.project_folder}}</a>
    </h4>
    <h4 class="uppercase bold">
      <a>Project type : {{project?.type}}</a>
    </h4>
    <h4 *ngIf="project.scripts">
      <a class="uppercase bold">Project scripts :</a>
<p *ngFor="let script of project.scripts">* {{script.name}} : {{script.command}}</p>
    </h4>
    </div>
  </li>
              `,
  encapsulation: ViewEncapsulation.None
})
export class MgListSubItemDetails {

  @Input()
  project: any;

}
