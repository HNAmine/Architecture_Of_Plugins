import {Directive} from '@angular/core';

@Directive({
  selector: '[mt-list-item]',
  host: {
    'class': 'mt-list-item'
  }
})
export class MtListItem {

}
