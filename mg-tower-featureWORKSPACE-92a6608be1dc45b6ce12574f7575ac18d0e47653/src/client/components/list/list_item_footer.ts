import { Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'mg-list-item-footer',
  template: `
  <div class="task-footer bg-grey">
    <div class="row">
      <div class="col-xs-6">
        <a class="task-trash">
          <i class="fa fa-trash"></i>
        </a>
      </div>
      <div class="col-xs-6">
        <a class="task-add">
          <i class="fa fa-plus"></i>
        </a>
      </div>
      </div>
      </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class MgListItemFooter {

}
