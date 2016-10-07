import { Component, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'mg-list-item',
  templateUrl: './list_item.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'list-todo-item dark'
  }
})
export class MgListItem {

  isOpen: boolean;

  @Input()
  data: any;

  @Output()
  selected = new EventEmitter<any>();

  toggle() {
    this.isOpen = !this.isOpen;
    // this.isOpen = false;
    this.selected.emit(this.data);
  }
}
