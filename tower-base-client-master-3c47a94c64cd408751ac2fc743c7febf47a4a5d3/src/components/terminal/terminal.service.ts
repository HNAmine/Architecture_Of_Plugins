import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class TerminalService {

  addLog: EventEmitter<any> = new EventEmitter<any>();
  clearLog: EventEmitter<any> = new EventEmitter<any>();

}
