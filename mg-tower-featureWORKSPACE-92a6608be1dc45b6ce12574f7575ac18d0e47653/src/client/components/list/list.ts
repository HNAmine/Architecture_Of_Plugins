import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';

@Component({
  selector: 'mg-list',
  templateUrl: './list.html',
  directives: [CORE_DIRECTIVES],
  encapsulation: ViewEncapsulation.None
})
export class MgList {

  @Input()
  title: string;

}
