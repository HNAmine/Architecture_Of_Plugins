import {ITask, TaskPayload, TaskArgs, TaskStatus, TaskLogs} from 'magnuscli-shared/shared';
import * as Rx from 'rxjs/Rx';

var uuid = require('node-uuid');
export interface TaskSocket {
  namespace?: string;
}

export class Task<T extends TaskPayload, U extends TaskArgs> implements ITask<T, U> {

  public id: string;
  taskStream: Rx.Subject<TaskLogs> = new Rx.Subject<TaskLogs>();

  constructor(public args: U, public socketOptions?: TaskSocket) {
    this.id = uuid.v1();
  }

  execute(args: U) {
    throw new Error('NOT IMPLEMENTED');
  };

  start() {
    this.taskStream.next({ status: TaskStatus.STARTED, message: 'task started', id: this.id });
    this.execute(this.args);
  }

  sendMessage(message: string) {
    var t = new TaskLogs();
    t.id = this.id;
    t.status = TaskStatus.PENDING;
    t.message = message;
    this.taskStream.next(t);
  }

  onError(err) {
    this.taskStream.next({ status: TaskStatus.ERROR, message: 'task failed ' + err, id: this.id });
  }

  end() {
    this.taskStream.next({ status: TaskStatus.SUCCESS, message: 'task ended', id: this.id });
    this.taskStream.complete();
  }

}
