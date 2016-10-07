import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {TerminalService} from './terminal.service';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'mg-terminal',
  templateUrl: './terminal.html',
  directives: [CORE_DIRECTIVES],
  styleUrls: ['./terminal.css']
})
export class MgTerminalComponent {

  logs: Array<any> = new Array<any>();

  @Input()
  scrolled: boolean;

  @Input()
  separated: boolean;

  @Input()
  keepHistories: boolean;

  load: boolean = false;

  constructor(private terminalService: TerminalService) {

    terminalService.addLog.subscribe(log => {
      this.load = true;
      setTimeout(() => {
        if (!this.keepHistories) {
          this.logs.length = 0;
        }
        this.logs.push(log);
        this.load = false;
      }, 2000);
    });

    terminalService.clearLog.subscribe(clear => {
      if (clear) {
        this.logs.length = 0;
      }
    });
  }

}
