import { Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'mg-list-item-title',
  template: '{{title}}',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'list-toggle-title bold'
  }
})
export class MgListItemTitle {

  @Input()
  title: string;

}
