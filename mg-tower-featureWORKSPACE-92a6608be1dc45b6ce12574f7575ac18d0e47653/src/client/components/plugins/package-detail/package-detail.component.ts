import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';

// you can DO better ;)
@Component({
  selector: 'mg-package-detail',
  templateUrl: './package-detail.component.html',
  directives: [CORE_DIRECTIVES],
  encapsulation: ViewEncapsulation.None
})
export class PackageDetail{

  title: string = 'Project Details !';

  @Input()
  project: any;

}
